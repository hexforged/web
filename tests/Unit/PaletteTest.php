<?php

# $KYAULabs: PaletteTest.php kyau@helios 2026/09/08 -0700 Exp $


declare(strict_types=1);

use Hexforged\Web\Brand\Palette;

function palettePath(): string
{
    return dirname(__DIR__, 2) . '/public/cdn/brand/palette/hexforged-palette.json';
}

test('loads the brand pack palette file', function () {
    $palette = Palette::load(palettePath());

    expect($palette)->toBeInstanceOf(Palette::class);
});

test('exposes the eight identity colors', function () {
    $palette = Palette::load(palettePath());

    foreach (['amber', 'amber-light', 'teal', 'teal-dark', 'violet', 'leather', 'ink', 'parchment'] as $key) {
        expect($palette->has($key))->toBeTrue("missing identity token {$key}");
    }
    expect($palette->get('amber'))->toBe('#E7AE49');
});

test('exposes interface, semantic, and world token groups', function () {
    $palette = Palette::load(palettePath());

    foreach (['canvas', 'surface', 'text', 'muted', 'focus'] as $key) {
        expect($palette->get($key))->toMatch('/^#[0-9A-Fa-f]{6}$/');
    }
    foreach (['health', 'mana', 'stamina', 'danger', 'warning', 'success', 'recovery', 'interrupt'] as $key) {
        expect($palette->get($key))->toMatch('/^#[0-9A-Fa-f]{6}$/');
    }
    expect($palette->group('ruins'))->toHaveCount(5);
    expect($palette->group('jungle'))->toHaveCount(5);
    expect($palette->group('corruption'))->toHaveCount(4);
});

test('exposes a color for each of the five masteries', function () {
    $palette = Palette::load(palettePath());

    foreach (['warrior', 'ranger', 'elemental', 'blood', 'manipulation'] as $key) {
        expect($palette->get($key))->toMatch('/^#[0-9A-Fa-f]{6}$/');
    }
});

test('throws on unknown token', function () {
    $palette = Palette::load(palettePath());

    expect(fn () => $palette->get('does-not-exist'))->toThrow(InvalidArgumentException::class);
});

test('throws on missing palette file', function () {
    expect(fn () => Palette::load('/nonexistent/palette.json'))->toThrow(RuntimeException::class);
});

// vim: ft=php sts=4 sw=4 ts=4 et :
