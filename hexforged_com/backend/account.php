<?php

/**
 * $KYAULabs: account.php,v 1.0.3 2024/07/31 00:52:57 -0700 kyau Exp $
 * ▄▄▄▄ ▄▄▄▄▄▄ ▄▄▄▄▄▄▄▄ ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
 * █ ▄▄ ▄ ▄▄▄▄ ▄▄ ▄ ▄▄▄▄ ▄▄▄▄ ▄▄▄▄ ▄▄▄▄▄ ▄▄▄▄ ▄▄▄  ▀
 * █ ██ █ ██ ▀ ██ █ ██ ▀ ██ █ ██ █ ██    ██ ▀ ██ █ █
 * ▪ ██▄█ ██▀  ▀█▄▀ ██▀  ██ █ ██▄▀ ██ ▄▄ ██▀  ██ █ ▪
 * █ ██ █ ██ █ ██ █ ██   ██ █ ██ █ ██ ▀█ ██ █ ██ █ █
 * ▄ ▀▀ ▀ ▀▀▀▀ ▀▀ ▀ ▀▀   ▀▀▀▀ ▀▀ ▀ ▀▀▀▀▀ ▀▀▀▀ ▀▀▀▀ █
 * ▀▀▀▀▀▀▀▀▀▀▀▀▀▀ ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀ ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
 *
 * Hexforged
 * Copyright (C) 2024 KYAU Labs (https://kyaulabs.com)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

namespace Hexforged;

require_once(__DIR__ . '/../../.env');
require_once(__DIR__ . '/../../aurora/sql.inc.php');
require_once(__DIR__ . '/email.php');
require_once(__DIR__ . '/sessions.php');

$session ??= new Session(true);
$sql ??= new \KYAULabs\SQLHandler('hexforged');

use \KYAULabs\SQLHandler as SQLHandler;

class Account
{
    /**
     * Generate success/fail return string.
     * 
     * @param bool $fail Was the form validation a failure or success.
     * @param array $list A semi-colon separated list of validation failures.
     * 
     * @return string The generated success/fail string.
     */
    private static function GenerateString(bool $fail, array $list): string
    {
        $str = $fail ? 'fail' : 'success';
        if (!empty($list)) {
            $str .= '=' . implode(':', $list);
        }
        return $str;
    }

    /**
     * Generate a UUID (v4).
     *
     * @return string The generated UUID.
     */
    private static function uuidv4(): string
    {
        $data = random_bytes(16);

        $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // set version to 0100
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // set bits 6-7 to 10

        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }

    /**
     * Validate/Create logic for the account register form.
     * 
     * @param SQLHandler $sql The SQL handler passed from AJAX the called script.
     * @param array $data Form POST data from the AJAX submission ($_POST).
     * 
     * @return string A generated success/fail string.
     */
    public static function Create(SQLHandler $sql, array $data): string
    {
        $fail = false;
        $list = [];

        // check if email address is already registered
        if ($sql->query('SELECT Count(*) AS `total` FROM `users` WHERE `email` = :email', [':email' => $data['email']])->fetchObject()->total > 0) {
            $fail = true;
            $list[] = 'email-check';
        }

        // check if username is already registered
        if ($sql->query('SELECT Count(*) AS `total` FROM `users` WHERE `username` = :username', [':username' => $data['username']])->fetchObject()->total > 0) {
            $fail = true;
            $list[] = 'username-check';
        }

        // check for empty fields
        if (!empty($data['username']) && !empty($data['email']) && !empty($data['passwd']) && !empty($data['passwdConfirm'])) {
            // validate the form data
            if (!preg_match("/^[a-zA-Z ]*$/", $data['username'])) {
                $fail = true;
                $list[] = 'username-validate';
            }
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                $fail = true;
                $list[] = 'email-validate';
            }
            if (!preg_match("/^(?=.*\d)(?=.*[@#\-_$%^&+=§!\?])(?=.*[a-z])(?=.*[A-Z])[0-9A-Za-z@#\-_$%^&+=§!\?]{8,32}$/", $data['passwd'])) {
                $fail = true;
                $list[] = 'passwd-validate';
            }
            if (!array_key_exists('acceptTerms', $data) || $data['acceptTerms'] !== '1') {
                $fail = true;
                $list[] = 'accept-terms';
            }
            $verifyRecaptcha = file_get_contents('https://www.google.com/recaptcha/api/siteverify?secret=' . GOOGLE_SECRET . '&response=' . $data['g-recaptcha-response']);
            $response = json_decode($verifyRecaptcha);
            if (!$response->success) {
                $fail = true;
                $list[] = 'recaptcha-invalid';
            }

            // if all validation passes
            if (!in_array('username-validate', $list) && !in_array('email-validate', $list) && !in_array('passwd-validate', $list) && !in_array('username-passwdConfirm', $list)) {
                // check that passwords match
                if ($data['passwd'] !== $data['passwdConfirm']) {
                    $fail = true;
                    $list[] = 'passwd-match';
                }

                // if failures detect, exit now
                if ($fail) {
                    return self::GenerateString($fail, $list);
                }

                // generate an activation token
                $token = self::uuidv4();

                // hash the password
                $peppered = hash_hmac('sha512', $data['passwd'], PASSWD_PEPPER);
                $hash = password_hash($peppered, PASSWORD_BCRYPT);

                // insert user into database
                $submit = [
                    ':username' => strtolower($data['username']),
                    ':passwd' => $hash,
                    ':email' => $data['email'],
                    ':lastip' => $_SERVER['REMOTE_ADDR']
                ];
                $sql->query("INSERT INTO `users` (`username`, `passwd`, `email`, `lastip`) VALUES (:username, :passwd, :email, INET_ATON(:lastip))", $submit);
                unset($submit);

                if ($sql->query('SELECT Count(*) AS `total` FROM `users` WHERE `username` = :username', [':username' => $data['username']])->fetchObject()->total === 0) {
                    $fail = true;
                    $list[] = 'account-add';
                    return self::GenerateString($fail, $list);
                }

                // get user id
                $uid = $sql->query("SELECT `id` FROM `users` WHERE `username` = :username", [':username' => $data['username']])->fetchObject()->id;

                // insert activation token into database
                $submit = [
                    ':uid' => $uid,
                    ':token' => $token
                ];
                $sql->query("INSERT INTO `activation` (`uid`, `token`) VALUES (:uid, UUID_TO_BIN(:token))", $submit);
                unset($submit);

                $subject = 'Hexforged Account Activation';
                $img = __DIR__ . '/../cdn/images/logo@256x.png';
                $image = '';

                if (file_exists($img) && is_readable($img)) {
                    $image = base64_encode(file_get_contents($img));
                }
                $msg = <<<EOF
<!DOCTYPE html>
<html dir=ltr xmlns=http://www.w3.org/1999/xhtml translate=no>
<head>
    <meta charset=utf-8>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=3Ddevice-width, initial-scale=1">

    <title>{$subject}</title>
    <style type="text/css">
        body {
            background-color: rgb(19, 20, 23);
            color: rgb(150, 150, 150);
            width: 100%;
        }
        a ,a:link, a:active, a:visited {
            color: rgb(195, 225, 248);
            text-decoration: none;
        }
        a:hover {
            color: rgb(255, 255, 255);
        }
        td { border-radius: 8px; }
        td a {
            background: linear-gradient(to right, rgb(102, 178, 178) 5%, rgb(0, 102, 101) 60%);
            background-position: 50%;
            background-size: 330% 100%;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            display: inline-block;
            font-size: 12pt;
            line-height: 2.0;
            padding: 4px 16px;
            text-decoration: none;
            text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.3);
        }
        td a:hover {
            background-position: 25%;
            background-size: 330% 100%;
        }
        td.button {
            box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);    
        }
        td.button:hover {
            box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.5);
        }
    </style>
</head>

<body style="font-size:12pt;">

<div>&nbsp;</div>
<div style="margin:16px 16px;text-align:center"><img src="data:image/png;base64,{$image}" /></div>
<h3 style="margin:8px 16px;">Hello, <span style="color:rgb(37,143,143)">{$data['username']}</span>!</h3>
<div style="margin:8px 16px;">Welcome to Hexforged!<br/>One last step before you can login, please verify your email address.</div>
<table width="200px" cellspacing="0" cellpadding="0" style="margin:32px 16px;">
  <tr><td>
    <table cellspacing="0" cellpadding="0">
      <tr><td class="button" bgcolor="#4f8a8b">
        <a href="https://hexforged.com/verify/{$token}">Confirm your email</a>
      </td></tr>
    </table>
  </tr></td>
</table>
<div style="margin:8px 16px;font-size:10pt">If you have received this message by mistake, ignore this email. If you think someone else if using your account without your consent, please <a href="mailto:support@hexforged.com">contact us</a>.<br/>&nbsp;</div>

</body>
</html>
EOF;
                $mail = new Email($data['email'], $subject, $msg, true, ['From' => 'do-not-reply@hexforged.com']);
                $mail->send();

                // insert code to create user in database
                //return 'success=' . $token . '=' . $hash;
            }
        } else {
            $fail = true;
            if (empty($data['username'])) {
                $list[] = 'empty-username';
            }
            if (empty($data['email'])) {
                $list[] = 'empty-email';
            }
            if (empty($data['passwd'])) {
                $list[] = 'empty-passwd';
            }
            if (empty($data['passwdConfirm'])) {
                $list[] = 'empty-passwdConfirm';
            }
        }
        return self::GenerateString($fail, $list);
    }

    /**
     * Validate/Create logic for the login form.
     * 
     * @param SQLHandler $sql The SQL handler passed from AJAX the called script.
     * @param array $data Form POST data from the AJAX submission ($_POST).
     * 
     * @return string A generated success/fail string.
     */
    public static function Login(SQLHandler $sql, array $data): string
    {
        $fail = false;
        $list = [];

        $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
        $peppered = hash_hmac('sha512', $data['passwd'], PASSWD_PEPPER);

        // check if email address exists
        if ($sql->query('SELECT Count(*) AS `total` FROM `users` WHERE `email` = :email', [':email' => $email])->fetchObject()->total === 0) {
            $fail = true;
            $list[] = 'email-check';
        }

        if (!empty($data['email']) && !empty($data['passwd'])) {
            // pull user data
            $user = $sql->query('SELECT * FROM `users` WHERE `email` = :email', [':email' => $email])->fetchObject();

            // check that the passwords match
            if (!password_verify($peppered, $user->passwd)) {
                $fail = true;
                $list[] = 'passwd-check';
            }

            // check if the user if verified
            if (!$user->activated) {
                $fail = true;
                $list[] = 'verify-check';
            }

            // check if the user account is disabled
            if ($user->disabled) {
                $fail = true;
                $list[] = 'disabled-check';
            }

            // if failures detect, exit now
            if ($fail) {
                return self::GenerateString($fail, $list);
            }

            Session::sessionRegenerateID();
            $token = Account::uuidv4();

            // log user in
            $_SESSION['id'] = $user->id;
            $_SESSION['gid'] = $user->gid;
            $_SESSION['user'] = $user->username;
            $_SESSION['email'] = $user->email;
            $_SESSION['perms'] = $user->permissions;
            $_SESSION['lastlogin'] = $user->lastlogin;
            $_SESSION['lastip'] = long2ip(sprintf("%d", $user->lastip));
            $_SESSION['token'] = $token;

            // update user database (lastlogin / lastip)
            $submit = [
                ':lastip' => $_SERVER['REMOTE_ADDR'],
                ':token' => $token,
                ':email' => $email,
            ];
            $sql->query('UPDATE `users` SET `lastip` = INET_ATON(:lastip), `lastlogin` = NOW(), `token` = UUID_TO_BIN(:token) WHERE `email` = :email', $submit);
            unset($submit);
        } else {
            $fail = true;
            if (empty($data['email'])) {
                $list[] = 'empty-email';
            }
            if (empty($data['passwd'])) {
                $list[] = 'empty-passwd';
            }
        }
        return self::GenerateString($fail, $list);
    }

    /**
     * Verify a new account.
     * 
     * @param SQLHandler $sql The SQL handler passed from AJAX the called script.
     * 
     * @return string A generated success/fail string.
     */
    public static function Verify(SQLHandler $sql, string $token): string
    {
        $fail = false;
        $list = [];

        // check if activation token is valid
        if ($sql->query('SELECT Count(*) AS `total` FROM `activation` WHERE `token` = UUID_TO_BIN(:token)', [':token' => $token])->fetchObject()->total < 1) {
            $fail = true;
            $list[] = 'token-check';
        }

        // pull user data based on activation token
        $user = $sql->query('SELECT u.* FROM `users` u JOIN `activation` a ON u.id = a.uid WHERE a.token = UUID_TO_BIN(:token)', [':token' => $token])->fetchObject();

        // check if account is already activated
        if ($user->activated === 1) {
            $fail = true;
            $list[] = 'activated-check';
        }

        if (!in_array('token-check', $list) && !in_array('activated-check', $list)) {
            $sql->query("UPDATE `users` SET `activated` = b'1' WHERE `id` = :id", [':id' => $user->id]);
            $list[] = $user->username;
        }

        return self::GenerateString($fail, $list);
    }
}
