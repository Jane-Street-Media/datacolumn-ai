<?php

namespace App\Actions\Teams\TeamInvitation;

use App\Actions\PlanLimitations\EnsurePlanLimitNotExceeded;
use App\Enums\ActivityEvents;
use App\Enums\NotificationType;
use App\Enums\PlanFeatureEnum;
use App\Exceptions\PackageLimitExceededException;
use App\Mail\InvitationSent;
use App\Models\NotificationTemplate;
use App\Models\Team;
use App\Models\TeamInvitation;
use Illuminate\Support\Facades\Mail;
use function Illuminate\Support\defer;

class SendTeamInvitation
{
    /**
     * @throws PackageLimitExceededException
     */
    public static function handle(array $data, Team $team): TeamInvitation
    {
        EnsurePlanLimitNotExceeded::handle($team, PlanFeatureEnum::NO_OF_TEAM_MEMBERS);
        $teamInvitation = $team->invitations()->create($data);
        Mail::to($teamInvitation->email)->send(new InvitationSent($teamInvitation, NotificationType::INVITATION));

        defer(fn () => activity()
            ->performedOn($teamInvitation)
            ->event(ActivityEvents::TEAM_INVITATION_SENT->value)
            ->log(":causer.name invited :subject.email to join {$team->name} team.")
        );

        return $teamInvitation;
    }
}
