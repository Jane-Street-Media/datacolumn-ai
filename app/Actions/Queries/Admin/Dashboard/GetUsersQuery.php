<?php

namespace App\Actions\Queries\Admin\Dashboard;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

class GetUsersQuery
{
    public static function handle(): Builder
    {
        return User::query()->where('name', '!=', 'admin');
    }
}
