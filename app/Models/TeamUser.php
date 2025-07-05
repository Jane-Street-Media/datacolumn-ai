<?php

namespace App\Models;

use App\Enums\TeamUserStatus;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TeamUser extends TeamBootModel
{
    protected $table = 'team_user';

    public $incrementing = true;

    protected $fillable = [
        'team_id',
        'user_id',
    ];

    protected $casts = [
        'status' => TeamUserStatus::class,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
