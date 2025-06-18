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

    public function getIcon(): string
    {
        return match($this) {
            self::TEAM_CREATED => 'UserPlus',
            self::TEAM_UPDATED, self::TEAM_MEMBER_UPDATED => 'UserPen',
            self::TEAM_DELETED, self::TEAM_MEMBER_DELETED => 'UserMinus',
            self::TEAM_INVITATION_SENT => 'Send',
            self::TEAM_INVITATION_DELETED => 'Trash',
            self::TEAM_INVITATION_ACCEPTED => 'Check',
        };
    }

    public function getIconClasses(): string
    {
        return match($this) {
            self::TEAM_CREATED => 'w-4 h-4 text-green-600 dark:text-green-400',
            self::TEAM_UPDATED, self::TEAM_MEMBER_UPDATED => 'w-4 h-4 text-green-600 dark:text-green-400',
            self::TEAM_DELETED, self::TEAM_MEMBER_DELETED => 'w-4 h-4 text-green-600 dark:text-green-400',
            self::TEAM_INVITATION_SENT => 'w-4 h-4 text-green-600 dark:text-green-400',
            self::TEAM_INVITATION_DELETED => 'w-4 h-4 text-green-600 dark:text-green-400',
            self::TEAM_INVITATION_ACCEPTED => 'w-4 h-4 text-green-600 dark:text-green-400',
        };
    }
}
