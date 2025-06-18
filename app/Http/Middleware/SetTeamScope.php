<?php

namespace App\Http\Middleware;

use App\Models\Team;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetTeamScope
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
            : Team::where('id' , 2)->first()->id;

        if ($teamId) {
            setPermissionsTeamId($teamId);
        }

        return $next($request);
    }
//    public function handle(Request $request, Closure $next)
//    {
//        if ($teamId = auth()->user()?->current_team_id) {
//            setPermissionsTeamId($teamId);
//        }
//
//        return $next($request);
//    }
}
