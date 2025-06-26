<?php

namespace App\Actions\Teams\TeamInvitation;

use App\Actions\UpdateUserCurrentTeam;
use App\Data\CurrentTeamUpdateData;
use App\Enums\ActivityEvents;
use App\Models\TeamInvitation;
use App\Models\User;

class AcceptTeamInvitation
{
    public static function handle(User $user, TeamInvitation $teamInvitation): TeamInvitation
    {
        $teamInvitation->team->users()->attach($user->id);
        setPermissionsTeamId($teamInvitation->team->id);
        $user->assignRole($teamInvitation->role);
        $teamInvitation->delete();
        UpdateUserCurrentTeam::handle($user, CurrentTeamUpdateData::from([
            'team_id' => $teamInvitation->team->id,
        ]));
        defer(fn () => activity()
            ->performedOn($teamInvitation)
            ->event(ActivityEvents::TEAM_INVITATION_SENT->value)
            ->log(":causer.name accepted the invitation to join the team {$teamInvitation->team->name}.")
        );

        return $teamInvitation;

    }
}
