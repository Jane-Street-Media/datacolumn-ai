<?php

namespace App\Actions\Folder;

use App\Models\User;

class CreateFolder
{
    public static function handle(User $user, array $data): void
    {
        $user->folders()->create($data);
    }
}
