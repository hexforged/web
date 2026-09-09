<?php

# $KYAULabs: Masteries.php kyau@aura 2026/09/08 -0700 Exp $


declare(strict_types=1);

namespace Hexforged\Web\Content;

use Hexforged\Web\Brand\Palette;

/**
 * Class Masteries
 *
 * The five masteries of the current GDD design set, in canonical order.
 * Colors are resolved from the brand palette so the site can never drift
 * from the published identity tokens.
 */
final class Masteries
{
    /**
     * Build the full mastery roster.
     *
     * @param Palette $palette The brand palette used to resolve colors.
     * @return array<int, Mastery> The five masteries in GDD order.
     */
    public static function all(Palette $palette): array
    {
        $definitions = [
            [
                'key' => 'warrior',
                'name' => 'Warrior',
                'tagline' => 'Martial, Berserker & Defender',
                'description' => 'Master of steel and timing. Freely blend martial, berserker and '
                    . 'defender paths across a broad arsenal. Perfectly timed strikes unleash '
                    . 'stronger effects — and an optional tank stands between the party and ruin.',
                'icon' => 'fa-duotone fa-shield-halved',
            ],
            [
                'key' => 'ranger',
                'name' => 'Ranger',
                'tagline' => 'Precision, Skirmisher & Companion',
                'description' => 'Bows and crossbows ruled by position, distance and moving targets. '
                    . 'Stalk the wilds with camouflage, tracking, traps and poison — or bond a single '
                    . 'companion that fights at your side.',
                'icon' => 'fa-duotone fa-bow-arrow',
            ],
            [
                'key' => 'elemental',
                'name' => 'Elemental',
                'tagline' => 'Fire, Ice, Lightning & Earth',
                'description' => 'Four elements in one mastery, fed by shared regenerating mana. Water '
                    . 'conducts lightning, wet terrain freezes and vegetation ignites — the battlefield '
                    . 'itself becomes your weapon.',
                'icon' => 'fa-duotone fa-fire',
            ],
            [
                'key' => 'blood',
                'name' => 'Blood',
                'tagline' => 'Sacrifice & Borrowed Power',
                'description' => 'Pay in blood — never your life. Health sacrifice, wound setup and '
                    . 'life steal fuel a dangerous setup-and-burst style that draws power from the '
                    . 'fallen. A working name for a working darkness.',
                'icon' => 'fa-duotone fa-vial',
            ],
            [
                'key' => 'manipulation',
                'name' => 'Manipulation',
                'tagline' => 'Hexes & Interrupts',
                'description' => 'Punish every enemy action with dependable, cruel efficiency. Inspired '
                    . 'by the classic Mesmer: hexes, interrupts and visible action cues, with a reprieve '
                    . 'that turns counters into your own survival.',
                'icon' => 'fa-duotone fa-brain',
            ],
        ];

        $masteries = [];
        foreach ($definitions as $def) {
            $masteries[] = new Mastery(
                $def['key'],
                $def['name'],
                $def['tagline'],
                $def['description'],
                $palette->get($def['key']),
                $def['icon'],
            );
        }
        return $masteries;
    }
}

// vim: ft=php sts=4 sw=4 ts=4 et :
