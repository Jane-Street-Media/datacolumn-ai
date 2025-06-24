<?php

namespace App\Actions\Teams\TeamInvitation;

use App\Actions\GetSubscribedPlanFeatures;
use App\Enums\ActivityEvents;
use App\Mail\InvitationSent;
use App\Models\Team;
use App\Models\TeamInvitation;
use Exception;
use Illuminate\Support\Facades\Mail;

class SendTeamInvitation
{
    /**
     * @throws Exception
     */
    public static function handle(array $data, Team $team): TeamInvitation
    {
        $subscribedPlanFeatures = GetSubscribedPlanFeatures::handle($team);
        if ($team->users()->count() + $team->invitations()->count() >= $subscribedPlanFeatures['no_of_invitation']) {
            throw new Exception('You have reached the maximum number of invitations allowed by your plan');
        }
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
