<?php

/**
 * $KYAULabs: email.php,v 1.0.2 2024/09/09 00:29:41 -0700 kyau Exp $
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

require_once(__DIR__ . '/utils.php');

use \InvalidArgumentException as InvalidArgumentException;

class Email
{
    private const DEFAULT_EMAIL = 'app@hexforged.com';
    private const DEFAULT_REPLYTO = 'support@hexforged.com';
    private string $to;
    private string $from;
    private string $subject;
    private string $msg;
    private array $headers;
    private bool $isHTML;

    /**
     * Constructor to initialize the Email class.
     */
    public function __construct(string $to = '', string $subject = '', string $msg = '', bool $isHtml = false, array $headers = [])
    {
        $this->to = $to;
        $this->subject = $subject;
        $this->msg = $msg;
        $this->isHTML = $isHtml;
        $this->staticHeaders();
        foreach ($headers as $key => $val) {
            $this->headers[$key] = $val;
        }
    }

    /**
     * @param string $name Variable to look for.
     *
     * @return string Return null or the string value of the variable.
     */
    public function __get(string $name)
    {
        if (in_array($name, array('to', 'from', 'subject', 'msg', 'headers', 'isHTML'))) {
            if (!empty($this->$name)) {
                return $this->$name;
            }
        }
        echo "Error: unable to find variable '{$name}'\n";
        return null;
    }

    /**
     * @param string $name Variable to set.
     */
    public function __set(string $name, $value): void
    {
        if (in_array($name, array('to', 'from', 'subject', 'msg', 'headers', 'isHTML'))) {
            if (!is_array($name) || !count($this->$name)) {
                $this->$name = $value;
            } else {
                $this->$name = array_merge($this->$name, $value);
            }
            return;
        }
        echo "Error: unable to set '{$name}' variable to '{$value}'.\n";
        return;
    }

    /**
     * Send the email message.
     *
     * @return bool True if the email was sent successfully, false otherwise.
     */
    public function send(): bool
    {
        if (empty($this->to) || empty($this->subject) || empty($this->msg)) {
            throw new InvalidArgumentException("To, Subject, and Message fields are required.");
        }

        $success = mail($this->to, $this->subject, $this->msg, $this->headers);

        if (!$success) {
            Utils::log("Email <ERROR> Failed to send email to {$this->to}");
        }

        return $success;
    }

    private function staticHeaders()
    {
        $this->headers = [
            'From' => !empty($this->from) ? $this->from : self::DEFAULT_EMAIL,
            'Reply-To' => !empty($this->from) ? $this->from : self::DEFAULT_REPLYTO,
            'Content-Type' => ($this->isHTML ? 'text/html' : 'text/plain') . '; charset=utf-8',
            'MIME-Version' => '1.0',
            'X-Mailer' => 'Hexforged/' . phpversion()
        ];
    }
}
