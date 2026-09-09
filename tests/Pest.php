<?php

# $KYAULabs: Pest.php kyau@helios 2026/09/08 -0700 Exp $


declare(strict_types=1);

uses(Tests\TestCase::class)->in('Unit', 'Feature');

/*
|--------------------------------------------------------------------------
| Arch Tests
|--------------------------------------------------------------------------
|
| Architecture tests enforce invariants across the entire codebase without
| requiring per-class test files.
|
*/

arch('no debug functions in production code')
    ->expect(['dd', 'dump', 'var_dump', 'print_r'])
    ->not->toBeUsedIn('Hexforged\Web');

arch('site classes use strict types')
    ->expect('Hexforged\Web')
    ->toUseStrictTypes();

// vim: ft=php sts=4 sw=4 ts=4 et :
