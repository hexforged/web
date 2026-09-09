<?php

# $KYAULabs: Mastery.php kyau@aura 2026/09/08 -0700 Exp $


declare(strict_types=1);

namespace Hexforged\Web\Content;

/**
 * Class Mastery
 *
 * A single hero mastery as presented on the site. Content follows the
 * Hexforged GDD; magical mastery names remain working descriptors.
 */
final readonly class Mastery
{
    /**
     * @param string $key Palette token / slug (e.g. "warrior").
     * @param string $name Display name.
     * @param string $tagline Short identity line.
     * @param string $description Longer description from the GDD.
     * @param string $color Resolved sRGB hex color from the brand palette.
     */
    public function __construct(
        public string $key,
        public string $name,
        public string $tagline,
        public string $description,
        public string $color,
    ) {
    }
}

// vim: ft=php sts=4 sw=4 ts=4 et :
