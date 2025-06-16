<?php

namespace App\Models;

use App\ProjectStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Project extends Model
{
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

    public function folder(): BelongsTo
    {
        return $this->belongsTo(Folder::class);
    }
}
