<?php

use App\Http\Controllers\BillingController;
use App\Http\Controllers\ChartAIController;
use App\Http\Controllers\ChartAIConversationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Folders\FolderController;
use App\Http\Controllers\ProjectChartsController;
use App\Http\Controllers\Projects\ProjectsController;
use App\Http\Controllers\Team\Invitation\TeamInvitationController;
use App\Http\Controllers\Team\SwitchUserTeamController;
use App\Http\Controllers\Team\TeamController;
use App\Http\Controllers\Team\TeamMemberController;
use Chargebee\Cashier\Http\Controllers\WebhookController;
use Chargebee\Cashier\Http\Middleware\AuthenticateWebhook;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/forget-cache', function () {
    \App\Helpers\SubscriptionLockHelper::unlock(\Illuminate\Support\Facades\Auth::user()->id);
    dd('cache forgot');
});

Route::get('/', function () {
    return redirect()->route('dashboard');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::get('test', function () {
        return Inertia::render('dashboard');
    })->name('test');

});

Route::get('billing', [BillingController::class, 'billing'])->name('billing');
Route::get('pricing', [BillingController::class, 'pricing'])->name('pricing');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('failed-payment', function () {
        return Inertia::render('banners/failedPayment');
    })->name('failed-payment');
});
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('subscription/success', function () {
        return Inertia::render('banners/successfulSubscription');
    })->name('successful-subscription');
});
Route::middleware([])->group(function () {
    Route::get('something-went-wrong', function () {
        return Inertia::render('banners/errorPage', [
            'flash' => session()->only(['error', 'success']),
        ]);
    })->name('something-went-wrong');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('projects')->group(function () {
        Route::get('/', [ProjectsController::class, 'index'])->name('projects.index');
        Route::post('/', [ProjectsController::class, 'store'])->name('project.store');
        Route::patch('/{project}', [ProjectsController::class, 'update'])->name('project.update');
        Route::delete('/{project}', [ProjectsController::class, 'destroy'])->name('project.delete');

        Route::prefix('{project}/charts')->group(function () {
            Route::get('/{chart}', [ProjectChartsController::class, 'edit'])->name('projects.charts.edit');
        });
    });

    Route::prefix('folder')->group(function () {
        Route::post('/', [FolderController::class, 'store'])->name('folder.store');
    });

    Route::prefix('team')->group(function () {
        Route::get('/', [TeamController::class, 'index'])->name('teams.store');
        Route::post('/', [TeamController::class, 'store'])->name('teams.store');
        Route::put('/{team}', [TeamController::class, 'update'])->name('teams.update');
        Route::delete('/{team}', [TeamController::class, 'destroy'])->name('teams.destroy');

        // Team Member Management
        Route::post('/{user}/update-role', [TeamMemberController::class, 'update'])->name('team.member.update');
        Route::post('/{team}/remove-member', [TeamMemberController::class, 'destroy'])->name('team.member.destroy');
        Route::post('/{team}/invitation', [TeamMemberController::class, 'store'])->name('team.member.store');
    });

    // Team Invitations
    Route::prefix('team-invitation')->group(function () {
        Route::get('/{teamInvitation}/accept', [TeamInvitationController::class, 'store'])->name('team-invitations.accept')->middleware('signed');
        Route::delete('/{teamInvitation}', [TeamInvitationController::class, 'destroy'])->name('team-invitations.destroy');
    });

    Route::post('/chargebee/webhook', [WebhookController::class, 'handleWebhook'])->middleware(AuthenticateWebhook::class);

    Route::prefix('chart-ai')->group(function () {
        Route::get('/', ChartAIController::class)->name('chart-ai');
    });

    Route::prefix('chart-ai')->group(function () {
        Route::get('/', ChartAIController::class)->name('chart-ai');
        Route::post('/conversation', ChartAIConversationController::class)->name('chart-ai.conversation');
    });
});

Route::get('chart/embed/{uuid}', function ($uuid) {
    $chart = \App\Models\Chart::where('uuid', $uuid)->firstOrFail();
    return Inertia::render('charts/chart-embed', [
        'config' => $chart->config,
        'data' => $chart->data,
    ]);
})->name('chart.1');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/checkout.php';
require __DIR__.'/subscription.php';
