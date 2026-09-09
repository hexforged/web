# 🗺️ CONTEXT.md

Living domain context for `hexforged/web`. Update this file whenever domain
knowledge or architecture decisions change (required by AGENTS.md).

Last updated: 2026-09-08 (initial site build).

## The game (from Hexforged-GDD v1.1, 2026-09-07)

**Hexforged** is a gritty isometric 3D **online action RPG** (desktop-first,
Windows-first, online connection required even solo). Human world-travelers
("Hexforged") develop masteries, reshape battlefields, grow equipment and
build persistent bases across worlds being consumed by a universal
corruption. Game source: `hexforged/game`.

Pillars that shape site copy:

1. Independently leveled **masteries** + practice-based skills (main/sub
   system; sub capped at half the main's level).
2. **Deliberate combat**: timing, positioning, combinations, hazardous
   environments; major boss attacks are ALWAYS interruptible.
3. **Permanent bases** that can be lost through failed defense (hub
   destruction = structural loss; purchased tiers survive).
4. **Procedural wilderness** + authored campaign about restoring worlds.
5. Everything **solo-completable**; optional party roles; no mandatory
   healer; 4-player party working cap.
6. **Never pay-to-win**: free-to-play, optional cosmetics only.

Key nouns: the **grimoire** (permanent book: inventory, masteries, quests,
maps, travel), **hexes** (world map regions; world selection is a branching
hex map; each world presented as a hex-covered sphere), **corruption** (the
consuming antagonist force), **strongholds/bases** (build/defend/lose).

The five masteries of the current design set (magical names are working
descriptors): **Warrior** (martial/berserker/defender), **Ranger**
(precision/skirmisher/companion), **Elemental** (fire/water-ice/
air-lightning/earth + terrain interactions), **Blood** (health sacrifice,
life steal; nonlethal self-cost), **Manipulation** (GW1-Mesmer-inspired
hexes/interrupts; "Reprieve" self-heal).

Status: no release date; "Coming Soon". First public segment = opening +
jungle first world + second-world base introduction.

## The brand (Hexforged-Brand-Pack-v4)

Authoritative masters: the painted emblem (potion bottle in a hex) and the
bespoke outlined wordmark — never retype/recolor/distort. Palette file
`public/cdn/brand/palette/hexforged-palette.json` (v4, 45 tokens, sRGB) is
the single source of truth for color; PHP reads it at render time, CSS
mirrors the values as custom properties.

- Identity: amber `#E7AE49`, teal `#0AC9D0`, violet `#A571D7`, ink `#15111E`,
  parchment `#F5EDDF`, leather `#632908`.
- Interface: canvas `#111317` (page bg), surface `#1C2025`, text = parchment.
- Mastery colors: warrior `#D4A574`, ranger `#A3BE83`, elemental `#8BCBD9`,
  blood `#DF8D9D`, manipulation `#BCA7E0`.
- Typography: Georgia Bold (display), Segoe UI (body), Consolas (values) —
  system fonts for prototyping; licensed web fonts are a pre-launch TODO.

Assets live under `public/cdn/brand/` (favicons + PWA manifest, SVG/PNG logos,
og-image, palette). Full pack: `../Hexforged-Brand-Pack-v4.zip` (not in repo).

## Site architecture (decisions, 2026-09-08)

- **Single-page immersive landing** (chosen over multi-page): hero →
  Grimoire → Masteries → Worlds → Strongholds → Coming Soon CTA → footer.
- **Three.js hex globe** hero (chosen over particle-forge): Goldberg dual of
  an icosahedron rendered as hex cells with a violet "corruption" flood
  region, amber ember particles, starfield; respects
  `prefers-reduced-motion`, pauses off-screen/hidden, DPR clamped.
- **Static CTAs only** (chosen over newsletter/DB): Discord
  (`https://discord.gg/3NCUxW3wE4`) + `hexforged/game` repo links. No database,
  no personal data.
- **Deployment target: hexforged.com on the creator's VPS** — docroot is
  `public/`; Aurora CDN dir resolves as `public/../public/cdn`.
- **All static assets (css/js/images/fonts) are served from
  `cdn.hexforged.com`** (decision 2026-09-09). `Site::cdnBase()` switches
  between the CDN and same-origin `/cdn` (`HEXFORGED_CDN_HOST=off`, used for
  local dev). SRI hashes are computed from the local copies in
  `public/cdn/`, which ship in the release tarball and are synced to the CDN
  host at deploy time.
- **Font Awesome Pro 7.2.0** (purchased) provides all icons — duotone for
  sections/masteries, brands for Discord/GitHub. License forbids public
  redistribution, so `public/cdn/vendor/fontawesome/` is gitignored and
  synced to `cdn.hexforged.com` out of band; links are emitted without SRI.
- **Automation auth**: org policy blocks `GITHUB_TOKEN` from opening PRs, so
  the back-merge workflow uses the `KYAULABS_BOT_TOKEN` repo secret
  (kyaulabs-bot PAT, scope `repo`). The managed gitleaks-action needs a paid
  org license, so CI installs the pinned MIT gitleaks binary (v8.30.1 +
  sha256) instead.
- Aurora template engine (`aurora/` submodule) with overlay template
  `templates/index.html`; SRI sha512 + cache-busting `?v=` for css/js;
  page metadata/content in `src/` (`Site`, `HomePage`, `Brand\Palette`,
  `Content\{Mastery,Masteries,Section,Sections}`).
- Three.js r182 vendored to `public/cdn/js/vendor/` from npm
  (`three.module.js` + `three.core.js`; update via `npm update three` and
  re-copy).

## Open questions / TODO

- Final web fonts (brand pack requires licensed cross-platform fonts before
  shipping).
- Real screenshots/media section once `hexforged/game` produces them.
- Newsletter/wishlist capture would require a backend decision (currently
  deliberately out of scope).
- Deployment automation (release workflow publishes a tarball; server pull
  not yet wired).
