<?php

namespace App\Actions\Queries\Admin\Dashboard;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

class GetUsersQuery
{
    public static function handle(): Builder
    {
        return User::query()->whereNot('email','curtis@datacolumn.ai')->whereNot('email','donot-delete@datacolumn.ai');
    }
}
