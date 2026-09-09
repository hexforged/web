<?php

# $KYAULabs: Site.php kyau@aura 2026/09/08 -0700 Exp $


declare(strict_types=1);

namespace Hexforged\Web;

use KYAULabs\Aurora;

/**
 * Class Site
 *
 * Factory that wires the Aurora template engine for the Hexforged site:
 * template overlay, metadata, stylesheets and ES modules with SRI hashing.
 */
final class Site
{
    /** @var string TITLE The default page title */
    public const TITLE = 'Hexforged — Coming Soon';

    /** @var string DESCRIPTION The default meta description */
    public const DESCRIPTION = 'Hexforged is a gritty isometric online action RPG. '
        . 'Develop masteries, reshape battlefields, raise strongholds and restore a '
        . 'universe consumed by corruption. Coming soon.';

    /**
     * Create the configured Aurora instance.
     *
     * @param string $root The repository root (parent of public/, src/, templates/).
     * @return Aurora The configured engine, ready for htmlHeader()/htmlFooter().
     */
    public static function create(string $root): Aurora
    {
        require_once $root . '/aurora/aurora.inc.php';

        $debug = getenv('HEXFORGED_DEBUG') === '1';
        $site = new Aurora('index.html', '/public/cdn', $debug, true, $root . '/templates');
        $site->title = self::TITLE;
        $site->description = self::DESCRIPTION;
        $site->css = [
            $root . '/public/cdn/css/hexforged.css' => '/cdn/css/hexforged.css',
        ];
        $site->mjs = [
            $root . '/public/cdn/js/hexglobe.js' => '/cdn/js/hexglobe.js',
        ];
        return $site;
    }
}

// vim: ft=php sts=4 sw=4 ts=4 et :
