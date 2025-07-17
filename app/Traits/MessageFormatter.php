<?php

namespace App\Traits;

trait MessageFormatter
{
    public function refineMessage(string $message, array $attributes): string
    {
        foreach ($attributes as $key => $value) {
            $message = str_replace('['.$key.']', $value, $message);
        }

        return $message;
    }
}
