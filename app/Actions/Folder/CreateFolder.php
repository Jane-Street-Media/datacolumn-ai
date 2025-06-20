<?php

namespace App\Actions\Folder;

use App\Enums\ActivityEvents;
use App\Models\User;

class CreateFolder
{
    public static function handle(User $user, array $data): void
    {
        $folder = $user->folders()->create($data);
        activity()
            ->performedOn($folder)
            ->event(ActivityEvents::TEAM_FOLDER_CREATED->value)
            ->log(":causer.name created a folder named : {$folder->name}. under team {$folder->team->name} ");

    }
}
