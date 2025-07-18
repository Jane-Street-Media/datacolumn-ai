<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Session;

class UserSession extends Model
{
    protected $fillable = [
        'user_id',
        'session_id',
        'logged_in_at',
        'logged_out_at',
        'last_activity',
    ];

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function createUserSession(User $user): UserSession
    {
        return UserSession::query()->create([
            'user_id'     => $user->id,
            'session_id'  => Session::getId(),
            'logged_in_at' => now(),
            'last_activity'=> now(),
        ]);
    }

    public static function closeUserSession(array $data): int
    {
        return UserSession::query()
            ->where('session_id', $data['session_id'])
            ->update([
                'logged_out_at' => now()
            ]);
    }
}
