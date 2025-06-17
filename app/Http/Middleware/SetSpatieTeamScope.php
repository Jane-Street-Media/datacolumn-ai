<?php

namespace App\Http\Middleware;

use App\Models\Team;
use Closure;
use Illuminate\Http\Request;
use Spatie\Permission\PermissionRegistrar;
use Symfony\Component\HttpFoundation\Response;

class SetSpatieTeamScope
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        $teamId = auth()->check() && auth()->user()->current_team_id
            ? auth()->user()->current_team_id
            : Team::query()->value('id');
        if ($teamId) {
            setPermissionsTeamId($teamId);
        }

        return $next($request);
    }
}
