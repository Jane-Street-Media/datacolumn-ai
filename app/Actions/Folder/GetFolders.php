<?php

namespace App\Actions\Folder;

use App\Models\Folder;
use Illuminate\Database\Eloquent\Collection;

class GetFolders
{
    public static function handle(): Collection
    {
        return Folder::all();
    }
}
