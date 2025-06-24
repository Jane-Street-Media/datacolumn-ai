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
    case TEAM_PROJECT_CREATED = 'team-project-created';
    case TEAM_PROJECT_UPDATED = 'team-project-updated';
    case TEAM_PROJECT_DELETED = 'team-project-deleted';
    case TEAM_FOLDER_CREATED = 'team-folder-created';

    public function getIcon(): string
    {
        return match ($this) {
            self::TEAM_CREATED => 'UserPlus',
            self::TEAM_UPDATED, self::TEAM_MEMBER_UPDATED => 'UserPen',
            self::TEAM_DELETED, self::TEAM_MEMBER_DELETED => 'UserMinus',
            self::TEAM_INVITATION_SENT => 'Send',
            self::TEAM_INVITATION_DELETED => 'Trash',
            self::TEAM_INVITATION_ACCEPTED => 'Check',
            self::TEAM_PROJECT_CREATED, self::TEAM_FOLDER_CREATED => 'FolderPlus',
            self::TEAM_PROJECT_UPDATED => 'Pencil',
            self::TEAM_PROJECT_DELETED => 'FolderMinus',
        };
    }

    public function getIconClasses(): string
    {
        return match ($this) {
            self::TEAM_CREATED => 'w-4 h-4 text-emerald-600 dark:text-emerald-400',
            self::TEAM_UPDATED, self::TEAM_MEMBER_UPDATED => 'w-4 h-4 text-indigo-600 dark:text-indigo-400',
            self::TEAM_DELETED, self::TEAM_MEMBER_DELETED => 'w-4 h-4 text-rose-600 dark:text-rose-400',
            self::TEAM_INVITATION_SENT => 'w-4 h-4 text-sky-600 dark:text-sky-400',
            self::TEAM_INVITATION_DELETED => 'w-4 h-4 text-orange-600 dark:text-orange-400',
            self::TEAM_INVITATION_ACCEPTED => 'w-4 h-4 text-lime-600 dark:text-lime-400',
            self::TEAM_PROJECT_CREATED, self::TEAM_FOLDER_CREATED => 'w-4 h-4 text-teal-600 dark:text-teal-400',
            self::TEAM_PROJECT_UPDATED => 'w-4 h-4 text-blue-600 dark:text-blue-400',
            self::TEAM_PROJECT_DELETED => 'w-4 h-4 text-pink-600 dark:text-pink-400',
        };
    }

    public function getIconBackgroundClasses(): string
    {
        return match ($this) {
            self::TEAM_CREATED => 'bg-emerald-100 dark:bg-emerald-900/20',
            self::TEAM_UPDATED, self::TEAM_MEMBER_UPDATED => 'bg-indigo-100 dark:bg-indigo-900/20',
            self::TEAM_DELETED, self::TEAM_MEMBER_DELETED => 'bg-rose-100 dark:bg-rose-900/20',
            self::TEAM_INVITATION_SENT => 'bg-sky-100 dark:bg-sky-900/20',
            self::TEAM_INVITATION_DELETED => 'bg-orange-100 dark:bg-orange-900/20',
            self::TEAM_INVITATION_ACCEPTED => 'bg-lime-100 dark:bg-lime-900/20',
            self::TEAM_PROJECT_CREATED, self::TEAM_FOLDER_CREATED => 'bg-teal-100 dark:bg-teal-900/20',
            self::TEAM_PROJECT_UPDATED => 'bg-blue-100 dark:bg-blue-900/20',
            self::TEAM_PROJECT_DELETED => 'bg-pink-100 dark:bg-pink-900/20',
        };
    }
}
