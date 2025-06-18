<?php

namespace App\Models;

use App\Models\Scopes\TeamScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TeamBootModel extends Model
{
    public static function booted(): void
    {
        static::addGlobalScope(new TeamScope);
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }
}
