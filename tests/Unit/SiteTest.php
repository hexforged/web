<?php

# $KYAULabs: SiteTest.php kyau@aura 2026/09/09 -0700 Exp $


declare(strict_types=1);

use Hexforged\Web\Site;

afterEach(function () {
    putenv('HEXFORGED_CDN_HOST');
});

test('cdnBase defaults to the production CDN outside the built-in server', function () {
    // Pest runs under the 'cli' SAPI; php -S ('cli-server') is the only
    // SAPI that resolves to local paths and is verified manually via curl.
    expect(PHP_SAPI)->toBe('cli');
    expect(Site::cdnBase())->toBe('https://cdn.hexforged.com');
});

test('cdnBase honors the off override for same-origin assets', function () {
    putenv('HEXFORGED_CDN_HOST=off');

    expect(Site::cdnBase())->toBe('/cdn');
});

test('cdnBase honors a custom host override', function () {
    putenv('HEXFORGED_CDN_HOST=cdn-staging.hexforged.com');

    expect(Site::cdnBase())->toBe('https://cdn-staging.hexforged.com');
});

test('cdnBase treats an empty override as unset', function () {
    putenv('HEXFORGED_CDN_HOST=');

    expect(Site::cdnBase())->toBe('https://cdn.hexforged.com');
});

// vim: ft=php sts=4 sw=4 ts=4 et :
