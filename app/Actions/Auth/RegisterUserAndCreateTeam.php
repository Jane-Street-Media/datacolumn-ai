<?php

namespace App\Actions\Auth;

use App\Data\RegisterUserData;
use App\Models\User;
use Illuminate\Auth\Events\Registered;

class RegisterUserAndCreateTeam
{
    public static function handle(RegisterUserData $data, ?string $provider = null): User
    {
        $user = User::create($data->toArray());
        if ($provider) {
            $user->markEmailAsVerified();
        }
        CreateTeam::handle($user);
        event(new Registered($user));
        return $user;
    }
}
