<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait EnumToArray
{
    public static function names(): array
    {
        return array_column(self::cases(), 'name');
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function array($switchKeyValues = false): array
    {
        if ($switchKeyValues) {
            return array_flip(self::array());
        }

        return array_combine(self::names(), self::values());
    }

    public static function getFormattedValues(): array
    {
        return array_map(function ($item) use (&$useCase) {
            return [
                'label' => Str::of($item)->replace('-', ' ')->title(),
                'value' => $item,
            ];
        }, self::values());
    }
}
