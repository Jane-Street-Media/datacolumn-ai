<?php

namespace App\Actions\Auth;

use App\Actions\Common\CreateTeam;
use App\Data\Auth\RegisterUserData;
use App\Data\Team\CreateTeamData;
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
        CreateTeam::handle(CreateTeamData::from([
            'name' => "{$user->name}'s team",
            'personal_team' => true,
        ]), $user);
        event(new Registered($user));

        return $user;
    }
}
