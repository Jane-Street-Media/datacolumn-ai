<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

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
