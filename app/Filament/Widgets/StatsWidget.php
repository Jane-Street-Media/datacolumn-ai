<?php

namespace App\Filament\Widgets;

use App\Actions\Queries\Admin\Dashboard\GetChartQuery;
use App\Actions\Queries\Admin\Dashboard\GetTeamsQuery;
use App\Actions\Queries\Admin\Dashboard\GetUsersQuery;
use App\Actions\Queries\Admin\Dashboard\GetRecentProjectQuery;
use App\Enums\Period;
use App\Helpers\ValueMetric;
use Filament\Widgets\Concerns\InteractsWithPageFilters;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsWidget extends BaseWidget
{
    use InteractsWithPageFilters;

    protected function getStats(): array
    {
        return [
            $this->createStat('Total Charts', GetChartQuery::handle()),
            $this->createStat('Total Teams', GetTeamsQuery::handle()),
            $this->createStat('Total Projects', GetRecentProjectQuery::handle()),
            $this->createStat('Total Users', GetUsersQuery::handle()),
        ];
    }

    protected function createStat(string $label, $query): Stat
    {
        $period = Period::tryFrom($this->filters['period']) ?? Period::LAST_30_DAYS;
        $stats = ValueMetric::query($query)
            ->for($period, true)
            ->count();

        $percentage = ValueMetric::calculatePercentageChange(
            $stats['value'],
            $stats['compare_value'] ?? 0
        );

        return Stat::make($label, $stats['value'])
            ->description("{$percentage}% from {$period->getLabel()}")
            ->descriptionIcon(
                $percentage >= 0
                    ? 'heroicon-o-arrow-trending-up'
                    : 'heroicon-o-arrow-trending-down'
            )
            ->color(
                $percentage >= 0
                    ? 'success'
                    : 'danger'
            );
    }
}
