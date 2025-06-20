<?php

namespace App\Actions\Folder;

use App\Enums\ActivityEvents;
use App\Models\User;

class CreateFolder
{
    public static function handle(User $user, array $data): void
    {
        $user->folders()->create($data);
        activity()
            ->causedBy($user)
            ->event(ActivityEvents::TEAM_FOLDER_CREATED->value)
            ->log(':causer.name created a folder.');
    }
}
