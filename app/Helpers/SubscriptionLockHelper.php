<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class SubscriptionLockHelper
{
    public static function getLockKey(int|string $userId): string
    {
        return "subscription_lock_user_{$userId}";
    }

    public static function isLocked(int|string $userId): bool
    {
        return Cache::has(self::getLockKey($userId));
    }

    public static function lock(int|string $userId, int $minutes = 10): string
    {
        $sessionId = (string) Str::uuid();
        Cache::put(self::getLockKey($userId), $sessionId, now()->addMinutes($minutes));

        return $sessionId;
    }

    public static function unlock(int|string $userId): void
    {
        Cache::forget(self::getLockKey($userId));
    }

    public static function getSessionId(int|string $userId): ?string
    {
        return Cache::get(self::getLockKey($userId));
    }
}
