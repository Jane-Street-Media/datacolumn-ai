<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Chart extends Model
{
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
        'config' => 'jsonb',
        'data' => 'jsonb',
        'embed_settings' => 'jsonb',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function dataset(): BelongsTo
    {
        return $this->belongsTo(Dataset::class);
    }


}
