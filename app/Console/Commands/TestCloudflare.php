<?php

namespace App\Console\Commands;

use App\Services\CloudflareDnsService;
use Illuminate\Console\Command;

class TestCloudflare extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:test-cloudflare';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        dd(dns_get_record('charts.devparagon.com'));

        $cf = app(CloudflareDnsService::class);
        $zoneId = $cf->ensureZone();
        dd($cf->listRecords($zoneId));

        // 2. Poll until user has pointed NS there
        if (! $cf->isDelegated('theirdomain.com')) {
            // show “still waiting for nameservers to update”
        }
    }
}
