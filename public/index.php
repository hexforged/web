<?php

# $KYAULabs: index.php,v 1.0.0 2026/09/08 00:00:00 -0700 kyau Exp $


declare(strict_types=1);

require_once __DIR__ . '/../vendor/autoload.php';

Hexforged\Web\HomePage::render(dirname(__DIR__));

// vim: ft=php sts=4 sw=4 ts=4 et :
