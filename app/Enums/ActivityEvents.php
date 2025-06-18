<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum ActivityEvents: string
{
    use EnumToArray;

    case TEAM_CREATED = 'team-created';
    case TEAM_UPDATED = 'team-updated';
    case TEAM_DELETED = 'team-deleted';
    case TEAM_MEMBER_DELETED = 'team-member-deleted';
    case TEAM_MEMBER_UPDATED = 'team-member-updated';
    case TEAM_INVITATION_SENT = 'team-invitation-sent';
    case TEAM_INVITATION_ACCEPTED = 'team-invitation-accepted';
    case TEAM_INVITATION_DELETED = 'team-invitation-deleted';
}
