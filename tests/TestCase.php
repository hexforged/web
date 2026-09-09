<?php

# $KYAULabs: TestCase.php kyau@aura 2026/09/08 -0700 Exp $


declare(strict_types=1);

namespace Tests;

use PHPUnit\Framework\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    private $previousExceptionHandler;

    protected function setUp(): void
    {
        // Aurora's constructor registers a global exception handler; neutralize
        // it so Pest can surface thrown exceptions normally during tests.
        $this->previousExceptionHandler = set_exception_handler(null);
    }

    protected function tearDown(): void
    {
        if ($this->previousExceptionHandler !== null) {
            set_exception_handler($this->previousExceptionHandler);
        } else {
            restore_exception_handler();
        }
    }
}

// vim: ft=php sts=4 sw=4 ts=4 et :
