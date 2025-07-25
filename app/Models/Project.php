<?php

namespace App\Models;

use App\Enums\ProjectStatus;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends TeamBootModel
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'team_id',
        'folder_id',
        'name',
        'description',
        'status',
        'tags',
    ];

    protected $casts = [
        'status' => ProjectStatus::class,
        'tags' => 'array',
    ];

    #[Scope]
    public function active(Builder $query): Builder
    {
        return $query->where('status', ProjectStatus::ACTIVE);
    }

    #[Scope]
    public function notInActive(Builder $query): Builder
    {
        return $query->where('status', '!=', ProjectStatus::INACTIVE);
    }

    public function folder(): BelongsTo
    {
        return $this->belongsTo(Folder::class);
    }

    public function charts(): HasMany
    {
        return $this->hasMany(Chart::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function datasets(): HasMany
    {
        return $this->hasMany(Dataset::class);
    }
}
