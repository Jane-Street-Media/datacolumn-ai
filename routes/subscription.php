<?php

use App\Http\Controllers\SubscriptionController;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => ['auth', 'verified']], function () {

    Route::patch('/subscription/cancel-subscription', [SubscriptionController::class, 'cancelSubscription'])
        ->name('subscription.cancel');

    Route::patch('/subscription/switch-to-free-plan', [SubscriptionController::class, 'switchToFreePlan'])
        ->name('subscription.switchToFreePlan');

    Route::patch('/subscription/resume-subscription', [SubscriptionController::class, 'resumeSubscription'])
        ->name('subscription.resume');

    Route::get('/user/invoice/{invoice}', [SubscriptionController::class, 'downloadInvoices'])
        ->name('download-invoice');
});

require __DIR__.'/auth.php';
