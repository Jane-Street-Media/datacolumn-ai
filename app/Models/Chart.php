<?php

namespace App\Models;

use App\Enums\ChartStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Chart extends TeamBootModel
{
    use HasFactory;
    use HasUuids;

    protected $fillable = [
        'user_id',
        'team_id',
        'project_id',
        'dataset_id',
        'title',
        'description',
        'type',
        'config',
        'data',
        'embed_settings',
    ];

    protected $casts = [
        'config' => 'json',
        'data' => 'json',
        'embed_settings' => 'json',
        'status' => ChartStatus::class,
    ];

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function dataset(): BelongsTo
    {
        return $this->belongsTo(Dataset::class);
    }
}
