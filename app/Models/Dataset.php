<?php

namespace App\Models;

use App\DatasetSource;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Dataset extends Model
{
    protected $fillable = [
        'user_id',
        'team_id',
        'project_id',
        'name',
        'file_path',
        'file_type',
        'file_size',
        'columns',
        'data',
        'source',
    ];

    protected $casts = [
        'columns' => 'jsonb',
        'data' => 'json',
        'source' => DataSetSource::class,
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function charts(): HasMany
    {
        return $this->hasMany(Chart::class);
    }
}
