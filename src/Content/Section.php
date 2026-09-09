<?php

# $KYAULabs: Section.php kyau@aura 2026/09/08 -0700 Exp $


declare(strict_types=1);

namespace Hexforged\Web\Content;

/**
 * Class Section
 *
 * A narrative content section of the landing page.
 */
final readonly class Section
{
    /**
     * @param string $id Anchor id used by the navigation.
     * @param string $eyebrow Small amber kicker line above the title.
     * @param string $title Display heading.
     * @param string $body Trusted HTML body copy.
     * @param string $icon Font Awesome duotone class for the eyebrow.
     */
    public function __construct(
        public string $id,
        public string $eyebrow,
        public string $title,
        public string $body,
        public string $icon,
    ) {
    }
}

// vim: ft=php sts=4 sw=4 ts=4 et :
