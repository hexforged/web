<?php

# $KYAULabs: SectionTest.php kyau@aura 2026/09/08 -0700 Exp $


declare(strict_types=1);

use Hexforged\Web\Content\Sections;

test('the page has grimoire, worlds, and strongholds sections in order', function () {
    $ids = array_map(fn ($s) => $s->id, Sections::all());

    expect($ids)->toBe(['grimoire', 'worlds', 'strongholds']);
});

test('every section has an eyebrow, title, and body', function () {
    foreach (Sections::all() as $section) {
        expect($section->eyebrow)->not->toBeEmpty();
        expect($section->title)->not->toBeEmpty();
        expect($section->body)->not->toBeEmpty();
    }
});

test('every section has a duotone font awesome icon', function () {
    $icons = [];
    foreach (Sections::all() as $section) {
        expect($section->icon)->toMatch('/^fa-duotone fa-[a-z-]+$/');
        $icons[$section->id] = $section->icon;
    }
    expect($icons)->toBe([
        'grimoire' => 'fa-duotone fa-book-spells',
        'worlds' => 'fa-duotone fa-globe',
        'strongholds' => 'fa-duotone fa-dungeon',
    ]);
});

// vim: ft=php sts=4 sw=4 ts=4 et :
