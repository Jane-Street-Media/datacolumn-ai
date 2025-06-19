<?php

namespace App\Models;

class TeamUser extends TeamBootModel
{
    protected $table = 'team_user';

    public $incrementing = true;

    protected $fillable = [
        'team_id',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
