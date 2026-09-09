<?php

# $KYAULabs: HomePage.php kyau@aura 2026/09/08 -0700 Exp $


declare(strict_types=1);

namespace Hexforged\Web;

use Hexforged\Web\Brand\Palette;
use Hexforged\Web\Content\Masteries;
use Hexforged\Web\Content\Mastery;
use Hexforged\Web\Content\Section;
use Hexforged\Web\Content\Sections;

/**
 * Class HomePage
 *
 * Renders the single-page Hexforged landing site through Aurora.
 */
final class HomePage
{
    /** @var string DISCORD Community invite URL */
    private const DISCORD = 'https://discord.gg/DSvUNYm';

    /** @var string GAME_REPO The game source repository */
    private const GAME_REPO = 'https://github.com/hexforged/game';

    /**
     * Render the complete landing page.
     *
     * @param string $root The repository root.
     */
    public static function render(string $root): void
    {
        $rus = getrusage();
        $site = Site::create($root);
        $palette = Palette::load($root . '/public/cdn/brand/palette/hexforged-palette.json');

        $site->htmlHeader();
        echo self::nav();
        echo self::hero();
        echo "\t<main>\n";
        $sections = Sections::all();
        echo self::section($sections[0]); // grimoire
        echo self::masteries(Masteries::all($palette));
        foreach (array_slice($sections, 1) as $section) { // worlds, strongholds
            echo self::section($section);
        }
        echo self::cta();
        echo "\t</main>\n";
        echo self::footer();
        $site->htmlFooter();
        echo $site->comment($rus, __FILE__, true);
    }

    /**
     * Render the sticky site navigation.
     *
     * @return string HTML
     */
    private static function nav(): string
    {
        $links = '';
        foreach (['grimoire' => 'Grimoire', 'masteries' => 'Masteries', 'worlds' => 'Worlds', 'strongholds' => 'Strongholds'] as $id => $label) {
            $links .= "\t\t\t<li><a href=\"#{$id}\">{$label}</a></li>\n";
        }
        $discord = self::DISCORD;
        return <<<HTML
            <nav class="site-nav" aria-label="Primary">
            \t<a class="site-nav__brand" href="#top"><img src="/cdn/brand/logo/hexforged-emblem.svg" alt="" width="40" height="40" /> <span>Hexforged</span></a>
            \t<ul class="site-nav__links">
        {$links}\t\t</ul>
            \t<a class="btn btn--primary site-nav__cta" href="{$discord}" rel="noopener" target="_blank">Join the Discord</a>
            </nav>

        HTML;
    }

    /**
     * Render the hero with the Three.js hex globe.
     *
     * @return string HTML
     */
    private static function hero(): string
    {
        $discord = self::DISCORD;
        $repo = self::GAME_REPO;
        return <<<HTML
            <header class="hero" id="top">
            \t<canvas id="hexglobe" aria-hidden="true"></canvas>
            \t<div class="hero__content">
            \t\t<img class="hero__wordmark" src="/cdn/brand/logo/hexforged-wordmark.svg" alt="Hexforged" width="640" height="217" />
            \t\t<p class="hero__tagline">A gritty isometric online <abbr title="action role-playing game">ARPG</abbr>. Five masteries. One grimoire. A universe to take back.</p>
            \t\t<p class="hero__badge"><span class="hero__badge-dot" aria-hidden="true"></span> Coming Soon</p>
            \t\t<div class="hero__actions">
            \t\t\t<a class="btn btn--primary" href="{$discord}" rel="noopener" target="_blank">Join the Discord</a>
            \t\t\t<a class="btn btn--ghost" href="{$repo}" rel="noopener" target="_blank">Follow Development</a>
            \t\t</div>
            \t</div>
            \t<p class="hero__scroll" aria-hidden="true">Scroll to begin the journey</p>
            </header>

        HTML;
    }

    /**
     * Render one narrative content section.
     *
     * @param Section $section The section to render.
     * @return string HTML
     */
    private static function section(Section $section): string
    {
        return <<<HTML
            \t<section class="section" id="{$section->id}">
            \t\t<p class="section__eyebrow">{$section->eyebrow}</p>
            \t\t<h2 class="section__title">{$section->title}</h2>
            \t\t<div class="section__body">{$section->body}</div>
            \t</section>

        HTML;
    }

    /**
     * Render the mastery roster section.
     *
     * @param array<int, Mastery> $masteries The five masteries.
     * @return string HTML
     */
    private static function masteries(array $masteries): string
    {
        $cards = '';
        foreach ($masteries as $mastery) {
            $cards .= <<<HTML
                \t\t\t<article class="mastery" style="--mastery: {$mastery->color}">
                \t\t\t\t<h3 class="mastery__name">{$mastery->name}</h3>
                \t\t\t\t<p class="mastery__tagline">{$mastery->tagline}</p>
                \t\t\t\t<p class="mastery__description">{$mastery->description}</p>
                \t\t\t</article>

            HTML;
        }
        return <<<HTML
            \t<section class="section section--wide" id="masteries">
            \t\t<p class="section__eyebrow">Five Paths, One Hero</p>
            \t\t<h2 class="section__title">The Masteries</h2>
            \t\t<div class="section__body">
            \t\t\t<p>Each mastery keeps its own hard-earned level. Switch your main, take a second as a
            \t\t\tsub-mastery, and build the hybrid only you would dare to play — every piece of content
            \t\t\tremains solo-completable, with no mandatory healer and no power for sale. Ever.</p>
            \t\t</div>
            \t\t<div class="masteries">
        {$cards}\t\t</div>
            \t</section>

        HTML;
    }

    /**
     * Render the closing call to action.
     *
     * @return string HTML
     */
    private static function cta(): string
    {
        $discord = self::DISCORD;
        $repo = self::GAME_REPO;
        return <<<HTML
            \t<section class="cta">
            \t\t<img class="cta__emblem" src="/cdn/brand/logo/hexforged-emblem.svg" alt="" width="220" height="220" />
            \t\t<h2 class="cta__title">Coming Soon</h2>
            \t\t<p class="cta__body">The forge is lit and the first world is taking shape. Follow the work as it happens.</p>
            \t\t<div class="hero__actions">
            \t\t\t<a class="btn btn--primary" href="{$discord}" rel="noopener" target="_blank">Join the Discord</a>
            \t\t\t<a class="btn btn--ghost" href="{$repo}" rel="noopener" target="_blank">hexforged/game</a>
            \t\t</div>
            \t</section>

        HTML;
    }

    /**
     * Render the footer.
     *
     * @return string HTML
     */
    private static function footer(): string
    {
        $year = gmdate('Y');
        $discord = self::DISCORD;
        $repo = self::GAME_REPO;
        return <<<HTML
            \t<footer class="site-footer">
            \t\t<p class="site-footer__legal">&copy; {$year} Hexforged. Never pay-to-win — free-to-play, cosmetics only, forever.</p>
            \t\t<ul class="site-footer__links">
            \t\t\t<li><a href="{$discord}" rel="noopener" target="_blank">Discord</a></li>
            \t\t\t<li><a href="{$repo}" rel="noopener" target="_blank">Game Repository</a></li>
            \t\t\t<li><a href="https://github.com/hexforged/web" rel="noopener" target="_blank">Site Source</a></li>
            \t\t</ul>
            \t</footer>

        HTML;
    }
}

// vim: ft=php sts=4 sw=4 ts=4 et :
