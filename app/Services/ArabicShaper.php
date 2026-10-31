<?php

namespace App\Services;

use ArPHP\I18N\Arabic;

class ArabicShaper
{
    protected ?Arabic $arabic = null;

    public function __construct()
    {
        if (class_exists(Arabic::class)) {
            $this->arabic = new Arabic();
        }
    }

    /**
     * Check if a string contains Arabic Unicode characters.
     */
    public function isArabic(?string $text): bool
    {
        if (empty($text)) {
            return false;
        }

        return (bool) preg_match('/[\x{0600}-\x{06FF}\x{0750}-\x{077F}\x{08A0}-\x{08FF}\x{FB50}-\x{FDFF}\x{FE70}-\x{FEFF}]/u', $text);
    }

    /**
     * Shape Arabic text for PDF rendering in DomPDF.
     * Connects Arabic glyphs and handles BiDi reordering for LTR rendering engines.
     */
    public function shape(?string $text): string
    {
        if (empty($text)) {
            return '';
        }

        if (!$this->isArabic($text)) {
            return $text;
        }

        if ($this->arabic) {
            $maxChars = max(200, mb_strlen($text));
            // $hindo = false keeps Western digits 0-9 intact
            return $this->arabic->utf8Glyphs($text, $maxChars, false);
        }

        return $text;
    }
}
