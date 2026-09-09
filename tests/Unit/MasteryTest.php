<?php

# $KYAULabs: MasteryTest.php kyau@aura 2026/09/08 -0700 Exp $


declare(strict_types=1);

use Hexforged\Web\Brand\Palette;
use Hexforged\Web\Content\Masteries;
use Hexforged\Web\Content\Mastery;

function masteries(): array
{
    $palette = Palette::load(dirname(__DIR__, 2) . '/public/cdn/brand/palette/hexforged-palette.json');
    return Masteries::all($palette);
}

test('the site presents exactly five masteries', function () {
    expect(masteries())->toHaveCount(5);
});

test('masteries match the GDD design set', function () {
    $keys = array_map(fn (Mastery $m) => $m->key, masteries());

    expect($keys)->toBe(['warrior', 'ranger', 'elemental', 'blood', 'manipulation']);
});

test('every mastery has a name, tagline, and description', function () {
    foreach (masteries() as $mastery) {
        expect($mastery)->toBeInstanceOf(Mastery::class);
        expect($mastery->name)->not->toBeEmpty();
        expect($mastery->tagline)->not->toBeEmpty();
        expect($mastery->description)->not->toBeEmpty();
    }
});

test('every mastery color resolves to a palette token', function () {
    $palette = Palette::load(dirname(__DIR__, 2) . '/public/cdn/brand/palette/hexforged-palette.json');

    foreach (masteries() as $mastery) {
        expect($mastery->color)->toBe($palette->get($mastery->key));
    }
});

test('every mastery has a duotone font awesome icon', function () {
    foreach (masteries() as $mastery) {
        expect($mastery->icon)->toMatch('/^fa-duotone fa-[a-z-]+$/');
    }
});

test('masteries use the expected thematic icons', function () {
    $icons = [];
    foreach (masteries() as $mastery) {
        $icons[$mastery->key] = $mastery->icon;
    }
    expect($icons)->toBe([
        'warrior' => 'fa-duotone fa-shield-halved',
        'ranger' => 'fa-duotone fa-bow-arrow',
        'elemental' => 'fa-duotone fa-fire',
        'blood' => 'fa-duotone fa-vial',
        'manipulation' => 'fa-duotone fa-brain',
    ]);
});

// vim: ft=php sts=4 sw=4 ts=4 et :
