<?php

namespace App\Console\Commands;

use App\Models\Team;
use Carbon\CarbonImmutable;
use Illuminate\Console\Command;

class ResetTeamFeatureLimits extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:reset-team-feature-limits';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reset team limits based on their subscribed plan period';

    /**
     * Execute the console command.
     */

    public function handle()
    {
        $now = CarbonImmutable::now();

        Team::query()
            ->where(function ($query) use ($now) {
                $query->whereNull('limit_reset_at')
                    ->orWhere('limit_reset_at', '<=', $now->subMonth());
            })
            ->where('created_at', '<=', $now->subMonth())
            ->chunk(100, function ($teams) use ($now) {
                foreach ($teams as $team) {
                    $team->total_exports = 0;
                    $team->total_ai_chart_generations = 0;
                    $team->limit_reset_at = $now;
                    $team->save();
                }
            });
        $this->info('Team limits reset where applicable.');
    }
}
