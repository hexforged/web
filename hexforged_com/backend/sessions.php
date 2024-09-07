<?php

/**
 * $KYAULabs: sessions.php,v 1.0.1 2024/09/07 11:42:30 -0700 kyau Exp $
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

/**
 * Class EncryptedSessionHandler
 *
 * Handles encrypted session storage using AES-256-CBC.
 */
class EncryptedSessionHandler extends \SessionHandler
{
    /** @var string $key Encryption key for session data. */
    private $key;

    /**
     * EncryptedSessionHandler constructor.
     *
     * @param string $key Encryption key for session data.
     */
    public function __construct($key)
    {
        $this->key = $key;
    }

    /**
     * Decrypts the given encrypted data using the provided password.
     *
     * @param string $edata Encrypted data.
     * @param string $password Password used for decryption.
     * @return string Decrypted data.
     */
    private static function decrypt(string $edata, string $password)
    {
        $data = base64_decode($edata);
        $salt = substr($data, 0, 16);
        $ct = substr($data, 16);

        $rounds = 3; // depends on key length
        $data00 = $password . $salt;
        $hash = array();
        $hash[0] = hash('sha256', $data00, true);
        $result = $hash[0];
        for ($i = 1; $i < $rounds; $i++) {
            $hash[$i] = hash('sha256', $hash[$i - 1] . $data00, true);
            $result .= $hash[$i];
        }
        $key = substr($result, 0, 32);
        $iv  = substr($result, 32, 16);

        return openssl_decrypt($ct, 'AES-256-CBC', $key, true, $iv);
    }

    /**
     * Encrypts the given data using the provided password.
     *
     * @param string $data Data to be encrypted.
     * @param string $password Password used for encryption.
     * @return string Encrypted data.
     */
    private static function encrypt(string $data, string $password)
    {
        // generate a cryptographically secure random salt using random_bytes()
        $salt = random_bytes(16);

        $salted = '';
        $dx = '';
        // salt the key(32) and iv(16) = 48
        while (strlen($salted) < 48) {
            $dx = hash('sha256', $dx . $password . $salt, true);
            $salted .= $dx;
        }

        $key = substr($salted, 0, 32);
        $iv  = substr($salted, 32, 16);

        $encrypted_data = openssl_encrypt($data, 'AES-256-CBC', $key, true, $iv);
        return base64_encode($salt . $encrypted_data);
    }

    /**
     * Reads session data and decrypts it.
     *
     * @param string $id Session ID.
     * @return string Decrypted session data.
     */
    public function read(string $id): string
    {
        $data = parent::read($id);

        if (!$data) {
            return "";
        } else {
            return self::decrypt($data, $this->key);
        }
    }

    /**
     * Writes encrypted session data.
     *
     * @param string $id Session ID.
     * @param string $data Session data to be encrypted and written.
     * @return bool True on success, false on failure.
     */
    public function write(string $id, string $data): bool
    {
        $data = self::encrypt($data, $this->key);

        return parent::write($id, $data);
    }
}


/**
 * Class Session
 *
 * Manages session handling with encryption and additional security features.
 */
class Session
{
    /** @var EncryptedSessionHandler|null $handler Session handler instance. */
    public static $handler = null;

    /** @var string $key Encryption key for session data. */
    private static $key = "";
    /** @var string $session_name Session name. */
    private static $session_name = "";
    /** @var bool $sessions Flag to enable or disable sessions. */
    private static $sessions = true;

    /**
     * Starts a new session with strict mode and encryption.
     *
     * @return void
     */
    private static function startSession()
    {
        ini_set('session.use_strict_mode', '1');
        // enable encrypted sessions
        ini_set('session.save_handler', 'files');
        self::$handler = new EncryptedSessionHandler(self::$key);
        session_set_save_handler(self::$handler, true);
        // start session
        @session_start([
            'cookie_domain' => $_SERVER['HTTP_HOST'],
            'cookie_httponly' => 1,
            'cookie_lifetime' => 86400 * 30,
            'cookie_samesite' => 'Strict',
            'cookie_secure' => 1,
            'session_name' => self::$session_name,
        ]);
        // check last activity
        self::lastActivity();
    }

    /**
     * Session constructor.
     *
     * @param bool $sessions Flag to enable or disable sessions.
     */
    public function __construct(bool $sessions = false)
    {
        // enable/disable sessions
        self::$sessions = $sessions;
        // set the session name
        self::$session_name = defined('SESSION_NAME') ? SESSION_NAME : "Hexforged";
        // set the session encryption key
        self::$key = defined('SESSION_KEY') ? SESSION_KEY : "changeme";
        // Enable secure sessions
        if (self::$sessions) {
            self::startSession();
        }
    }

    /**
     * Destroy the current session.
     * 
     * @return void
     */
    public static function destroySession()
    {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            // no session to destroy
            return;
        }
        session_unset();
        session_destroy();
        session_write_close();
        setcookie(session_name(), '', 0, '/');
        self::sessionRegenerateID();
    }

    /**
     * Checks the last activity time and resets the session if inactive for too long.
     *
     * @return void
     */
    public static function lastActivity(): void
    {
        // discard sessions that have been idle longer than 15 minutes
        if (isset($_SESSION['lastactivity']) && (time() - $_SESSION['lastactivity'] > 900)) {
            self::destroySession();
        } else if (isset($_SESSION['lastactivity']) && (time() - $_SESSION['lastactivity'] > 60)) {
            $_SESSION['lastactivity'] = time();
        }
    }

    public static function logUserIn(object $user, string $token): bool
    {
        if (!isset($user) || $token === '') return false;
        if (self::sessionRegenerateID()) {
            $_SESSION['id'] = $user->id;
            $_SESSION['gid'] = $user->gid;
            $_SESSION['user'] = $user->username;
            $_SESSION['email'] = $user->email;
            $_SESSION['perms'] = $user->permissions;
            $_SESSION['lastlogin'] = $user->lastlogin;
            $_SESSION['lastip'] = long2ip(sprintf("%d", $user->lastip));
            $_SESSION['token'] = $token;
            return true;
        } else {
            return false;
        }
    }

    /**
     * Regenerates the session ID to prevent session fixation.
     *
     * @return bool True on success.
     */
    public static function sessionRegenerateID(): bool
    {
        // ensure sessions are active
        if (session_status() !== PHP_SESSION_ACTIVE) {
            self::startSession();
        }

        $newid = session_create_id(strtolower(self::$session_name) . '-');
        session_write_close();

        ini_set('session.use_strict_mode', '0');
        session_id($newid);
        @session_start([
            'cookie_domain' => $_SERVER['HTTP_HOST'],
            'cookie_httponly' => 1,
            'cookie_lifetime' => 86400 * 30,
            'cookie_samesite' => 'Strict',
            'cookie_secure' => 1,
            'session_name' => self::$session_name,
        ]);
        $_SESSION['lastactivity'] = time();

        return true;
    }
}
