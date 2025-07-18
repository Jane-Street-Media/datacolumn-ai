<?php

namespace App\Console\Commands;

use App\Models\UserSession;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CloseStaleUserSessions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:close-stale-user-sessions';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mark user sessions logged out after inactivity';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $lifetime = config('session.lifetime'); // minutes
        $cutoff   = now()->subMinutes($lifetime);

        UserSession::query()
            ->whereNull('logged_out_at')
            ->where('last_activity', '<', $cutoff)
            ->update(['logged_out_at' => DB::raw('last_activity')]);

        $this->info('Stale sessions closed.');
    }
}
