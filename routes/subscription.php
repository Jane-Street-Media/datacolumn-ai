<?php

use App\Http\Controllers\SubscriptionController;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => ['auth', 'verified']], function () {

    Route::patch('/subscription/pause-subscription', [SubscriptionController::class, 'pauseSubscription'])
        ->name('subscription.pause');

    Route::patch('/subscription/resume-subscription', [SubscriptionController::class, 'resumeSubscription'])
        ->name('subscription.resume');

    Route::get('/user/invoice/{invoice}', [SubscriptionController::class, 'downloadInvoices'])
        ->name('download-invoice');
});


require __DIR__.'/auth.php';
