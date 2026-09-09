<?php

# $KYAULabs: HomePageTest.php kyau@aura 2026/09/08 -0700 Exp $


declare(strict_types=1);

use Hexforged\Web\HomePage;

function renderHomePage(): string
{
    ob_start();
    HomePage::render(dirname(__DIR__, 2));
    return (string) ob_get_clean();
}

function sri(string $path): string
{
    return 'sha512-' . base64_encode(hex2bin(hash_file('sha512', $path)));
}

test('renders a complete html5 document', function () {
    $html = renderHomePage();

    expect($html)->toStartWith('<!DOCTYPE html>');
    expect($html)->toContain('<html lang="en">');
    // Aurora emits a render-stats comment after the closing tag.
    expect($html)->toContain("\n</body>\n</html>");
    expect(rtrim($html))->toEndWith('-->');
});

test('renders head metadata for hexforged', function () {
    $html = renderHomePage();

    expect($html)->toContain('<title>Hexforged');
    expect($html)->toContain('<meta name="description"');
    expect($html)->toContain('og:title');
    expect($html)->toContain('og:image');
    expect($html)->toContain('<meta name="theme-color" content="#111317"');
});

test('links the brand favicons and manifest', function () {
    $html = renderHomePage();

    expect($html)->toContain('https://cdn.hexforged.com/brand/icons/favicon.svg');
    expect($html)->toContain('https://cdn.hexforged.com/brand/icons/favicon.ico');
    expect($html)->toContain('https://cdn.hexforged.com/brand/icons/site.webmanifest');
});

test('injects the stylesheet from the cdn with a valid sha512 sri hash', function () {
    $root = dirname(__DIR__, 2);
    $html = renderHomePage();

    expect($html)->toContain('https://cdn.hexforged.com/css/hexforged.css');
    expect($html)->toContain('integrity="' . sri($root . '/public/cdn/css/hexforged.css') . '"');
});

test('preloads key assets with dns prefetch and preconnect for the cdn', function () {
    $html = renderHomePage();

    expect($html)->toContain('<link rel="dns-prefetch" href="//cdn.hexforged.com"');
    expect($html)->toContain('<link rel="preconnect" href="//cdn.hexforged.com"');
    expect($html)->toContain('<link rel="preload" href="//cdn.hexforged.com/css/hexforged.css');
    expect($html)->toContain('<link rel="preload" href="//cdn.hexforged.com/js/hexglobe.js');
});

test('serves assets from the same origin when HEXFORGED_CDN_HOST=off', function () {
    putenv('HEXFORGED_CDN_HOST=off');
    $html = renderHomePage();
    putenv('HEXFORGED_CDN_HOST');

    expect($html)->toContain('href="/cdn/css/hexforged.css');
    expect($html)->toContain('src="/cdn/js/hexglobe.js');
    expect($html)->toContain('src="/cdn/brand/logo/hexforged-wordmark.svg');
    expect($html)->not->toContain('cdn.hexforged.com/css');
});

test('injects the three.js hex globe module with a valid sri hash', function () {
    $root = dirname(__DIR__, 2);
    $html = renderHomePage();

    expect($html)->toContain('https://cdn.hexforged.com/js/hexglobe.js');
    expect($html)->toContain('type="module"');
    expect($html)->toContain('integrity="' . sri($root . '/public/cdn/js/hexglobe.js') . '"');
});

test('vendored three.js runtime is present for the module import', function () {
    $root = dirname(__DIR__, 2);

    expect(file_exists($root . '/public/cdn/js/vendor/three.module.js'))->toBeTrue();
    expect(file_exists($root . '/public/cdn/js/vendor/three.core.js'))->toBeTrue();
});

test('renders the hero with wordmark and coming soon call to action', function () {
    $html = renderHomePage();

    expect($html)->toContain('https://cdn.hexforged.com/brand/logo/hexforged-wordmark.svg');
    expect($html)->toContain('Coming Soon');
    expect($html)->toContain('<canvas') || expect($html)->toContain('id="hexglobe"');
});

test('renders all five masteries', function () {
    $html = renderHomePage();

    foreach (['Warrior', 'Ranger', 'Elemental', 'Blood', 'Manipulation'] as $name) {
        expect($html)->toContain($name);
    }
});

test('renders content sections with matching nav anchors', function () {
    $html = renderHomePage();

    foreach (['grimoire', 'masteries', 'worlds', 'strongholds'] as $id) {
        expect($html)->toContain('id="' . $id . '"');
        expect($html)->toContain('href="#' . $id . '"');
    }
});

test('links to the community discord and the game repository', function () {
    $html = renderHomePage();

    expect($html)->toContain('https://discord.gg/3NCUxW3wE4');
    expect($html)->toContain('https://github.com/hexforged/game');
});

test('loads font awesome pro stylesheets from the cdn', function () {
    $html = renderHomePage();

    foreach (['all', 'brands', 'duotone'] as $sheet) {
        expect($html)->toContain(
            'https://cdn.hexforged.com/vendor/fontawesome/css/fontawesome/' . $sheet . '.min.css'
        );
    }
});

test('fontawesome pro assets are kept out of git', function () {
    $gitignore = file_get_contents(dirname(__DIR__, 2) . '/.gitignore');

    expect($gitignore)->toContain('public/cdn/vendor/fontawesome/');
});

test('renders brand icons for discord and github links', function () {
    $html = renderHomePage();

    expect($html)->toContain('fa-brands fa-discord');
    expect($html)->toContain('fa-brands fa-github');
});

test('renders duotone icons for sections and masteries', function () {
    $html = renderHomePage();

    foreach (['fa-book-spells', 'fa-globe', 'fa-dungeon', 'fa-shield-halved', 'fa-bow-arrow', 'fa-fire', 'fa-vial', 'fa-brain'] as $icon) {
        expect($html)->toContain($icon);
    }
});

// vim: ft=php sts=4 sw=4 ts=4 et :
