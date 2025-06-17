<?php

use App\Http\Controllers\BillingController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\TeamInvitationController;
use App\Http\Controllers\TeamMemberController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
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

Route::middleware(['auth', 'verified', 'spatie-team'])->group(function () {
    Route::post('/team', [TeamController::class, 'store'])->name('teams.store');
    Route::put('/team/{team}', [TeamController::class, 'update'])->name('teams.update');
    Route::delete('/team/{team}', [TeamController::class, 'destroy'])->name('teams.destroy');

    Route::post('/team/{user}/update-role', [TeamMemberController::class, 'update'])->name('team.member.update');
    Route::post('/team/{team}/remove-member', [TeamMemberController::class, 'destroy'])->name('team.member.destroy');
    Route::post('/team/{team}/invitation', [TeamMemberController::class, 'store'])->name('team.member.store');

    Route::post('/team-invitation/{teamInvitation}/accept', [TeamInvitationController::class, 'store'])
        ->name('team-invitations.accept');
    Route::delete('/team-invitation/{teamInvitation}', [TeamInvitationController::class, 'destroy'])
        ->name('team-invitations.destroy');

});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/checkout.php';
require __DIR__ . '/subscription.php';
