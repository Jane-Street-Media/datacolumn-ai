<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetTeam
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        if ($teamId = auth()->user()?->current_team_id) {
            setPermissionsTeamId($teamId);
        }

        return $next($request);
    }
}
