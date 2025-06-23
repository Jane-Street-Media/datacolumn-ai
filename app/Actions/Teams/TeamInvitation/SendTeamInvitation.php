<?php

namespace App\Actions\Teams\TeamInvitation;

use App\Enums\ActivityEvents;
use App\Mail\InvitationSent;
use App\Models\Team;
use App\Models\TeamInvitation;
use Illuminate\Support\Facades\Mail;

class SendTeamInvitation
{
    public static function handle(array $data, Team $team): TeamInvitation
    {
        $teamInvitation = $team->invitations()->create($data);
        Mail::to($teamInvitation->email)->send(new InvitationSent($teamInvitation));

        defer(fn () => activity()
            ->performedOn($teamInvitation)
            ->event(ActivityEvents::TEAM_INVITATION_SENT->value)
            ->log(":causer.name invited :subject.email to join {$team->name} team.")
        );

        return $teamInvitation;
    }
}
