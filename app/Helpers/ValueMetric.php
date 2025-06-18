<?php

namespace App\Helpers;

use App\Enums\Period;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;

/**
 * ValueMetric class to fetch different value metrics for a given Eloquent query.
 */
class ValueMetric
{
    /**
     * The Eloquent query builder instance.
     *
     * @var Builder
     */
    protected $query;

    /**
     * The period for which the metrics should be calculated.
     */
    protected array|Period|null $period = null;

    /**
     * Flag to indicate if a comparison with a previous period is needed.
     */
    protected bool $compare = false;

    /**
     * Create a new ValueMetric instance.
     *
     * @return void
     */
    public function __construct(Builder $query)
    {
        $this->query = $query;
    }

    /**
     * Set the period for the metrics.
     *
     * @return $this
     */
    public function for(Period|array $period, bool $withCompare = false): self
    {
        $this->period = $period;
        $this->compare = $withCompare;

        return $this;
    }

    protected function currentPeriod($period): array
    {
        if ($period instanceof Period) {
            return $period->toRange();
        } elseif (is_array($period) && isset($period[0]) && isset($period[1])) {
            return [
                new CarbonImmutable($period[0]),
                new CarbonImmutable($period[1]),
            ];
        }

        throw new \InvalidArgumentException("Unsupported period for comparison: {$period}");
    }

    /**
     * Get the previous period for comparison.
     *
     * @param  Period|array  $period
     */
    public function previousPeriod($period): array
    {
        if ($period instanceof Period) {
            return $period->toPreviousRange();
        } elseif (is_array($period) && isset($period[0]) && isset($period[1])) {
            // Calculate the previous period for custom range
            $startDate = new CarbonImmutable($period[0]);
            $endDate = new CarbonImmutable($period[1]);

            $duration = $startDate->diffInDays($endDate) + 1;

            return [
                $startDate->subDays($duration),
                $endDate->subDays($duration),
            ];

        }

        throw new \InvalidArgumentException("Unsupported period for comparison: {$period}");
    }

    /**
     * Static method to instantiate the class.
     */
    public static function query(Builder $query): self
    {
        return new static($query);
    }

    protected function aggregate($function, $column): array
    {
        $query = clone $this->query;
        $currentValue = null;
        $previousValue = null;

        if ($this->period) {
            $dateRange = $this->currentPeriod($this->period);
            $query->whereBetween($query->getModel()->getTable().'.created_at', $dateRange);
            $currentValue = $query->{$function}($column);

            if ($this->compare) {
                $previousQuery = clone $this->query;
                $previousPeriod = $this->previousPeriod($this->period);
                $previousQuery->whereBetween('created_at', $previousPeriod);
                $previousValue = $previousQuery->{$function}($column);
            }
        }

        $result = ['value' => (float) $currentValue];

        if ($this->compare) {
            $result['compare_value'] = (float) $previousValue;
            $result['difference'] = (float) $currentValue - (float) $previousValue;
        }

        return $result;
    }

    /**
     * Fetch the sum of a column.
     *
     * @param  string  $column
     */
    public function sum($column): array
    {
        return $this->aggregate(__FUNCTION__, $column);
    }

    /**
     * Fetch the average of a column.
     */
    public function avg(string $column): array
    {
        return $this->aggregate(__FUNCTION__, $column);
    }

    /**
     * Fetch the minimum of a column.
     */
    public function min(string $column): array
    {
        return $this->aggregate(__FUNCTION__, $column);
    }

    /**
     * Fetch the maximum of a column.
     */
    public function max(string $column): array
    {
        return $this->aggregate(__FUNCTION__, $column);
    }

    /**
     * Fetch the count of a column.
     */
    public function count(string $column = '*'): array
    {
        return $this->aggregate(__FUNCTION__, $column);
    }

    public static function calculatePercentageChange(float $newValue, float $oldValue): float|int
    {
        if ($oldValue == 0) {
            return 100;
        }

        return round((($newValue - $oldValue) / $oldValue) * 100, 2);
    }
}
