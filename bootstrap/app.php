<?php

use App\Console\Commands\ResetTeamFeatureLimits;
use App\Http\Middleware\DynamicFrameGuard;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\IsTeamPlan;
use App\Http\Middleware\RefreshUserSession;
use App\Http\Middleware\SetTeam;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->validateCsrfTokens(except: [
            'chargebee/*',
        ]);
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            SetTeam::class,
        ]);
        $middleware->alias([
            'teams' => SetTeam::class,
            'isTeamPlan' => IsTeamPlan::class,
            'iframe.dynamic' => DynamicFrameGuard::class,
            'refreshUserSession' => RefreshUserSession::class,
        ]);
    })
    ->withSchedule(function (Schedule $schedule) {
        $schedule->command(ResetTeamFeatureLimits::class)->dailyAt('00:00');
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
