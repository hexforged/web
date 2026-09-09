<?php

# $KYAULabs: Sections.php kyau@aura 2026/09/08 -0700 Exp $


declare(strict_types=1);

namespace Hexforged\Web\Content;

/**
 * Class Sections
 *
 * The narrative sections of the landing page, distilled from the Hexforged
 * GDD (core loops, grimoire, worlds and base defense).
 */
final class Sections
{
    /**
     * Build the landing page sections in display order.
     *
     * @return array<int, Section> The grimoire, worlds and strongholds sections.
     */
    public static function all(): array
    {
        return [
            new Section(
                'grimoire',
                'One Book, Bound Forever',
                'The Grimoire',
                '<p>Every Hexforged carries a single permanent grimoire — part journal, part '
                . 'arsenal, part map of the worlds. It governs your inventory, your masteries, '
                . 'your quests and your reach across the universe, and it grows with every '
                . 'milestone of the campaign.</p>'
                . '<p>Fuel it, and the pages carry you between worlds. Lose everything else, and '
                . 'the book remains. It is the heart of what you are.</p>',
                'fa-duotone fa-book-spells',
            ),
            new Section(
                'worlds',
                'Restore a Consumed Universe',
                'The Worlds',
                '<p>A universal catastrophe is infecting and consuming life across once densely '
                . 'inhabited worlds. Travel branching hex-frontiers of procedural wilderness — from '
                . 'dark forbidden ruins to Amazon-inspired jungle to the deeply alien — and drive '
                . 'the corruption back, world by world.</p>'
                . '<p>Break a world&rsquo;s boss in its own lair and the land is restored: corruption '
                . 'lifts, resources shift, and something unique is left behind for those who did '
                . 'the work.</p>',
                'fa-duotone fa-globe',
            ),
            new Section(
                'strongholds',
                'Build. Defend. Endure.',
                'The Strongholds',
                '<p>Claim a hex and raise a permanent home: foundations, walls, traps and magical '
                . 'defenses, stocked and automated by your own hand. No summoned guardians — your '
                . 'stronghold stands on engineering and preparation alone.</p>'
                . '<p>But what is built can be lost. When the assault comes, defeat means losing the '
                . 'structure itself — though never what you have learned, and never what you have '
                . 'truly earned. Rebuild, and hold the line next time.</p>',
                'fa-duotone fa-dungeon',
            ),
        ];
    }
}

// vim: ft=php sts=4 sw=4 ts=4 et :
