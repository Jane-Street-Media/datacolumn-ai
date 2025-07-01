<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsTeamPlan
{
    public function handle(Request $request, Closure $next): Response
    {
        if(! $this->isTeamPlan($request)){
            abort(Response::HTTP_FORBIDDEN);
        }
        return $next($request);
    }

    private function isTeamPlan(Request $request): bool
    {
        return $request->user()?->currentTeam?->subscriptionWithProductDetails()->plan->display_name === 'Team';
    }
}
