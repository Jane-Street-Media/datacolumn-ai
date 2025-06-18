<?php

    namespace App\Actions\Queries\Team;

    use App\Models\TeamUser;
    use Illuminate\Database\Eloquent\Builder;

    class GetAdminQuery
    {
        public static function handle(): Builder
        {
            return TeamUser::whereRelation('user.roles', 'name', 'admin');
        }
    }
