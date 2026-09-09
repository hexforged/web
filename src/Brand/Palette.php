<?php

# $KYAULabs: Palette.php kyau@aura 2026/09/08 -0700 Exp $


declare(strict_types=1);

namespace Hexforged\Web\Brand;

/**
 * Class Palette
 *
 * Loads the Hexforged brand pack palette (hexforged-palette.json) and
 * exposes the named color tokens to the site. The painted artwork and the
 * brand pack remain authoritative; this class only reads the published
 * token file.
 */
final class Palette
{
    /** @var array<string, array{group: string, hex: string}> $tokens */
    private array $tokens = [];

    private function __construct()
    {
    }

    /**
     * Load a palette from a brand pack JSON file.
     *
     * @param string $path Filesystem path to hexforged-palette.json.
     * @return self The loaded palette.
     * @throws \RuntimeException If the file is missing or malformed.
     */
    public static function load(string $path): self
    {
        if (!is_file($path)) {
            throw new \RuntimeException("Palette file not found: {$path}");
        }
        $data = json_decode((string) file_get_contents($path), true);
        if (!is_array($data) || !isset($data['tokens']) || !is_array($data['tokens'])) {
            throw new \RuntimeException("Malformed palette file: {$path}");
        }
        $palette = new self();
        foreach ($data['tokens'] as $token) {
            if (!is_array($token) || !isset($token['key'], $token['group'], $token['hex'])) {
                throw new \RuntimeException("Malformed palette token in: {$path}");
            }
            $palette->tokens[(string) $token['key']] = [
                'group' => (string) $token['group'],
                'hex' => (string) $token['hex'],
            ];
        }
        return $palette;
    }

    /**
     * Check whether a token exists.
     *
     * @param string $key The token key (e.g. "amber").
     * @return bool True when the token is present.
     */
    public function has(string $key): bool
    {
        return array_key_exists($key, $this->tokens);
    }

    /**
     * Get the sRGB hex value for a token.
     *
     * @param string $key The token key.
     * @return string The hex color (e.g. "#E7AE49").
     * @throws \InvalidArgumentException On unknown token.
     */
    public function get(string $key): string
    {
        if (!$this->has($key)) {
            throw new \InvalidArgumentException("Unknown palette token: {$key}");
        }
        return $this->tokens[$key]['hex'];
    }

    /**
     * Get every token in a group.
     *
     * @param string $group The group name (identity, interface, semantic, mastery, ruins, jungle, corruption).
     * @return array<string, string> Map of token key to hex color.
     */
    public function group(string $group): array
    {
        $out = [];
        foreach ($this->tokens as $key => $token) {
            if ($token['group'] === $group) {
                $out[$key] = $token['hex'];
            }
        }
        return $out;
    }
}

// vim: ft=php sts=4 sw=4 ts=4 et :
