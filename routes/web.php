<?php

use App\Http\Controllers\BillingController;
use App\Http\Controllers\ChartAIController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProjectChartsController;
use App\Http\Controllers\ProjectsController;
use App\Http\Controllers\Team\Invitation\TeamInvitationController;
use App\Http\Controllers\Team\TeamController;
use App\Http\Controllers\Team\TeamMemberController;
use Chargebee\Cashier\Http\Controllers\WebhookController;
use Chargebee\Cashier\Http\Middleware\AuthenticateWebhook;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
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



Route::prefix('projects')->group(function () {
    Route::get('/', [ProjectsController::class, 'index'])->name('projects.index');

    Route::prefix('{project}/charts')->group(function () {
        Route::get('/{chart}', [ProjectChartsController::class, 'edit'])->name('projects.charts.edit');
    });
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
    Route::post('/{teamInvitation}/accept', [TeamInvitationController::class, 'store'])->name('team-invitations.accept');
    Route::delete('/{teamInvitation}', [TeamInvitationController::class, 'destroy'])->name('team-invitations.destroy');
});

Route::post('/chargebee/webhook', [WebhookController::class, 'handleWebhook'])->middleware(AuthenticateWebhook::class);

Route::prefix('chart-ai')->group(function () {
    Route::get('/', ChartAIController::class)->name('chart-ai');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/checkout.php';
require __DIR__.'/subscription.php';
