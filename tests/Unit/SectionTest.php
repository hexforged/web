<?php

# $KYAULabs: SectionTest.php kyau@helios 2026/09/08 -0700 Exp $


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

// vim: ft=php sts=4 sw=4 ts=4 et :
