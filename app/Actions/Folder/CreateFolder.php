<?php

namespace App\Actions\Folder;

use App\Enums\ActivityEvents;
use App\Models\Folder;
use App\Models\User;

class CreateFolder
{
    public static function handle(User $user, array $data): Folder
    {
        $folder = $user->folders()->create($data);
        defer(fn () => activity()
            ->performedOn($folder)
            ->event(ActivityEvents::TEAM_FOLDER_CREATED->value)
            ->log(":causer.name created a folder named {$folder->name} under team {$folder->team->name} ")
        );

        return $folder;
    }
}
