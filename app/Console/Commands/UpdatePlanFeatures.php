<?php

namespace App\Console\Commands;

use App\Models\Plan;
use Illuminate\Console\Command;

class UpdatePlanFeatures extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'plans:update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update all plans with default features';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $features = [
            'no_of_projects' => 10,
            'no_of_folders' => 10,
            'no_of_invitation' => 10,
        ];

        return Plan::query()->update([
            'features' => json_encode($features),
        ]);
    }
}
