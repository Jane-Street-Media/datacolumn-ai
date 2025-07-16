<?php

namespace App\Enums;

use App\Traits\EnumToArray;
use Carbon\CarbonImmutable;
use Filament\Support\Contracts\HasLabel;

enum Period: string implements HasLabel
{
    use EnumToArray;
    case TODAY = 'TODAY';
    case YESTERDAY = 'YESTERDAY';
    case WTD = 'WTD';
    case MTD = 'MTD';
    case QTD = 'QTD';
    case YTD = 'YTD';
    case LAST_WEEK = 'LAST_WEEK';
    case LAST_14_DAYS = 'LAST_14_DAYS';
    case LAST_MONTH = 'LAST_MONTH';
    case LAST_30_DAYS = 'LAST_30_DAYS';
    case LAST_YEAR = 'LAST_YEAR';

    public function toRange(): array
    {
        return match ($this) {
            self::TODAY => [
                CarbonImmutable::now()->startOfDay(),
                CarbonImmutable::now()->endOfDay(),
            ],
            self::YESTERDAY => [
                CarbonImmutable::now()->subDay()->startOfDay(),
                CarbonImmutable::now()->subDay()->endOfDay(),
            ],
            self::MTD => [
                CarbonImmutable::now()->startOfMonth(),
                CarbonImmutable::now(),
            ],
            self::QTD => [
                CarbonImmutable::now()->startOfQuarter(),
                CarbonImmutable::now(),
            ],
            self::YTD => [
                CarbonImmutable::now()->startOfYear(),
                CarbonImmutable::now(),
            ],
            self::WTD => [
                CarbonImmutable::now()->startOfWeek(),
                CarbonImmutable::now(),
            ],
            self::LAST_WEEK => [
                CarbonImmutable::now()->subWeek()->startOfWeek(),
                CarbonImmutable::now()->subWeek()->endOfWeek(),
            ],
            /*
             * Reasoning for sub 13 days:
             * If you take last 1days and subtract 0 then startofDay you get today.
             * Last 2 days you subtract 1 then start of day you get yesterday.
             * So last 14 days you subtract 13 then start of day you get 13 days ago.
             * Hence last X days = subDays(X-1) then startOfDay
             */
            self::LAST_14_DAYS => [
                CarbonImmutable::now()->subDays(13)->startOfDay(),
                CarbonImmutable::now(),
            ],
            self::LAST_MONTH => [
                CarbonImmutable::now()->subMonthWithoutOverflow()->startOfMonth(),
                CarbonImmutable::now()->subMonthWithoutOverflow()->endOfMonth(),
            ],
            self::LAST_30_DAYS => [
                CarbonImmutable::now()->subDays(29)->startOfDay(),
                CarbonImmutable::now(),
            ],
            self::LAST_YEAR => [
                CarbonImmutable::now()->subYear()->startOfYear(),
                CarbonImmutable::now()->subYear()->endOfYear(),
            ],
        };
    }

    public function toPreviousRange(): array
    {
        return match ($this) {
            self::TODAY => [
                CarbonImmutable::now()->subDay()->startOfDay(),
                CarbonImmutable::now()->subDay()->endOfDay(),
            ],
            self::YESTERDAY => [
                CarbonImmutable::now()->subDays(2)->startOfDay(),
                CarbonImmutable::now()->subDays(2)->endOfDay(),
            ],
            self::MTD => [
                CarbonImmutable::now()->subMonthWithoutOverflow()->startOfMonth(),
                CarbonImmutable::now()->subMonthWithoutOverflow(),
            ],
            self::QTD => [
                CarbonImmutable::now()->subQuarterWithOverflow()->startOfQuarter(),
                CarbonImmutable::now()->subQuarterWithOverflow()->subSecond(),
            ],
            self::YTD => [
                CarbonImmutable::now()->subYear()->startOfYear(),
                CarbonImmutable::now()->subYear(),
            ],
            self::WTD => [
                CarbonImmutable::now()->subWeek()->startOfWeek(),
                CarbonImmutable::now()->subWeek(),
            ],
            self::LAST_WEEK => [
                CarbonImmutable::now()->subWeeks(2)->startOfWeek(),
                CarbonImmutable::now()->subWeeks(2)->endOfWeek(),
            ],
            self::LAST_14_DAYS => [
                CarbonImmutable::now()->subDays((14 * 2) - 1)->startOfDay(),
                CarbonImmutable::now()->subDays(14),
            ],
            self::LAST_MONTH => [
                CarbonImmutable::now()->subMonthsNoOverflow(2)->startOfMonth(),
                CarbonImmutable::now()->subMonthsNoOverflow(2)->endOfMonth(),
            ],
            self::LAST_30_DAYS => [
                CarbonImmutable::now()->subDays((30 * 2) - 1)->startOfDay(),
                CarbonImmutable::now()->subDays(30),
            ],
            self::LAST_YEAR => [
                CarbonImmutable::now()->subYears(2)->startOfYear(),
                CarbonImmutable::now()->subYears(2)->endOfYear(),
            ],
        };
    }

    public function getLabel(): ?string
    {
        return match ($this) {
            self::TODAY => __('Today'),
            self::YESTERDAY => __('Yesterday'),
            self::WTD => __('Week to date'),
            self::MTD => __('Month to date'),
            self::QTD => __('Quarter to date'),
            self::YTD => __('Year to date'),
            self::LAST_WEEK => __('Last week'),
            self::LAST_14_DAYS => __('Last 14 days'),
            self::LAST_MONTH => __('Last month'),
            self::LAST_30_DAYS => __('Last 30 days'),
            self::LAST_YEAR => __('Last year'),
        };
    }
}
