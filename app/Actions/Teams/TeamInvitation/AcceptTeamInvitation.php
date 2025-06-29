<?php

namespace App\Actions\Teams\TeamInvitation;

use App\Actions\Teams\SwitchUserTeam;
use App\Enums\ActivityEvents;
use App\Models\TeamInvitation;
use App\Models\User;
use function Illuminate\Support\defer;

class AcceptTeamInvitation
{
    public static function handle(User $user, TeamInvitation $teamInvitation): TeamInvitation
    {
        $teamInvitation->team->users()->attach($user->id);
        setPermissionsTeamId($teamInvitation->team->id);
        $user->assignRole($teamInvitation->role);
        $teamInvitation->delete();
        SwitchUserTeam::handle($user, $teamInvitation->team->id);
        defer(fn () => activity()
            ->performedOn($teamInvitation)
            ->event(ActivityEvents::TEAM_INVITATION_SENT->value)
            ->log(":causer.name accepted the invitation to join the team {$teamInvitation->team->name}.")
        );

        return $teamInvitation;

    }
}
