<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Collection;
use Exception;

class CloudflareDnsService
{
    protected string $baseUrl = 'https://api.cloudflare.com/client/v4/';
    protected string $token;
    protected string $accountId;
    protected string $zoneName;      // e.g. 'datacolumn.ai'
    protected int    $defaultTtl     = 3600;
    protected bool   $defaultProxied = true;

    public function __construct()
    {
        $this->token     = config('services.cloudflare.api_token');
        $this->accountId = config('services.cloudflare.account_id');
        $this->zoneName  = config('services.cloudflare.zone');

        if (! $this->token || ! $this->accountId || ! $this->zoneName) {
            throw new Exception('Cloudflare credentials or zone not configured.');
        }
    }

    /**
     * HTTP client with auth + JSON headers.
     */
    protected function client()
    {
        return Http::withToken($this->token)
            ->baseUrl($this->baseUrl)
            ->acceptJson()
            ->contentType('application/json');
    }

    /**
     * Ensure the zone exists and return its ID.
     */
    public function ensureZone(): string
    {
        // try fetch
        $zone = $this->getZoneByName($this->zoneName);
        if ($zone) {
            return $zone['id'];
        }

        // create if missing
        $resp = $this->client()->post('zones', [
            'name'       => $this->zoneName,
            'account'    => ['id' => $this->accountId],
            'jump_start' => false,
        ]);
        $body = $resp->json();

        if (! ($resp->successful() && data_get($body, 'success', false))) {
            throw new Exception('Failed to create zone: '.json_encode(data_get($body, 'errors')));
        }

        return $body['result']['id'];
    }

    /**
     * Lookup zone by exact name.
     */
    public function getZoneByName(string $name): ?array
    {
        $resp = $this->client()->get('zones', ['query' => ['name' => $name]]);
        $body = $resp->json();

        if (! ($resp->successful() && data_get($body, 'success', false))) {
            throw new Exception('Zone lookup failed: '.json_encode(data_get($body, 'errors')));
        }

        return collect(data_get($body, 'result'))->first() ?: null;
    }

    /**
     * Ensure the "app" subdomain record exists (A → droplet IP).
     */
    public function ensureAppRecord(): array
    {
        $zoneId = $this->ensureZone();
        // check existing
        $records = $this->listRecords($zoneId)
            ->where('type', 'A')
            ->where('name', 'custom-domain.'.$this->zoneName);

        if ($records->isNotEmpty()) {
            return $records->first()->toArray();
        }

        // create new A record for app subdomain
        return $this->createRecord(
            $zoneId,
            'A',
            'custom-domain.'.$this->zoneName,
            config('services.digitalocean.droplet_ip'),
            $this->defaultTtl,
            $this->defaultProxied
        );
    }

    /**
     * List DNS records for a zone ID.
     */
    public function listRecords(string $zoneId): Collection
    {
        $resp = $this->client()->get("zones/{$zoneId}/dns_records");
        $body = $resp->json();

        if (! ($resp->successful() && data_get($body, 'success', false))) {
            throw new Exception('Failed to list records: '.json_encode(data_get($body, 'errors')));
        }

        return collect(data_get($body, 'result', []));
    }

    /**
     * Create a DNS record.
     */
    public function createRecord(
        string $zoneId,
        string $type,
        string $name,
        string $content,
        int    $ttl     = null,
        bool   $proxied = null
    ): array {
        $resp = $this->client()->post("zones/{$zoneId}/dns_records", [
            'type'    => strtoupper($type),
            'name'    => $name,
            'content' => $content,
            'ttl'     => $ttl     ?? $this->defaultTtl,
            'proxied' => $proxied ?? $this->defaultProxied,
        ]);

        $body = $resp->json();
        if (! ($resp->successful() && data_get($body, 'success', false))) {
            throw new Exception('Failed to create record: '.json_encode(data_get($body, 'errors')));
        }

        return $body['result'];
    }
}
