<?php

namespace App\Actions\Teams;

use App\Http\Requests\TeamUserFilterRequest;
use App\Models\User;

class GetTeamUsers
{
    public static function handle(User $user, array $data)
    {
        return $user->currentTeam->users()->with('roles')
            ->when(isset($data['search']), fn($query) => $query->where('name', 'like', '%' . $data['search'] . '%'))
            ->get();
    }
}
