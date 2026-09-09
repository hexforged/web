<?php

# $KYAULabs: Site.php kyau@aura 2026/09/08 -0700 Exp $


declare(strict_types=1);

namespace Hexforged\Web;

use KYAULabs\Aurora;

/**
 * Class Site
 *
 * Factory that wires the Aurora template engine for the Hexforged site:
 * template overlay, metadata, CDN-hosted stylesheets and ES modules with
 * SRI hashing (hashes are computed from the local copies of the files).
 *
 * All static assets (css, js, images, fonts) are served from
 * cdn.hexforged.com in production. Set HEXFORGED_CDN_HOST=off to serve
 * them same-origin from /cdn for local development.
 */
final class Site
{
    /** @var string TITLE The default page title */
    public const TITLE = 'Hexforged — Coming Soon';

    /** @var string DESCRIPTION The default meta description */
    public const DESCRIPTION = 'Hexforged is a gritty isometric online action RPG. '
        . 'Develop masteries, reshape battlefields, raise strongholds and restore a '
        . 'universe consumed by corruption. Coming soon.';

    /** @var string CDN_HOST The production static-asset host */
    public const CDN_HOST = 'cdn.hexforged.com';

    /**
     * Resolve the base URL for static assets.
     *
     * @return string "https://cdn.hexforged.com" in production, "/cdn"
     *                (same-origin) when HEXFORGED_CDN_HOST=off.
     */
    public static function cdnBase(): string
    {
        return getenv('HEXFORGED_CDN_HOST') === 'off' ? '/cdn' : 'https://' . self::CDN_HOST;
    }

    /**
     * Create the configured Aurora instance.
     *
     * @param string $root The repository root (parent of public/, src/, templates/).
     * @return Aurora The configured engine, ready for htmlHeader()/htmlFooter().
     */
    public static function create(string $root): Aurora
    {
        require_once $root . '/aurora/aurora.inc.php';

        $cdn = self::cdnBase();
        $local = $root . '/public/cdn';

        $debug = getenv('HEXFORGED_DEBUG') === '1';
        $site = new Aurora('index.html', '/public/cdn', $debug, true, $root . '/templates');
        $site->title = self::TITLE;
        $site->description = self::DESCRIPTION;
        $site->css = [
            $local . '/css/hexforged.css' => $cdn . '/css/hexforged.css',
        ];
        $site->mjs = [
            $local . '/js/hexglobe.js' => $cdn . '/js/hexglobe.js',
        ];

        // Brand/icon URLs used by the head template.
        $site->icon_svg = $cdn . '/brand/icons/favicon.svg';
        $site->icon_ico = $cdn . '/brand/icons/favicon.ico';
        $site->apple_touch = $cdn . '/brand/icons/app/hexforged-app-dark-180.png';
        $site->manifest = $cdn . '/brand/icons/site.webmanifest';

        // Preload key assets from the CDN (skipped in same-origin mode:
        // Aurora's preload requires a dns-prefetch host).
        if ($cdn !== '/cdn') {
            $site->dns = [self::CDN_HOST];
            $site->preload = [
                '/css/hexforged.css' => 'style',
                '/js/hexglobe.js' => 'script',
            ];
        }
        return $site;
    }
}

// vim: ft=php sts=4 sw=4 ts=4 et :
