<?php

use App\Http\Controllers\SubscriptionController;
use Illuminate\Support\Facades\Route;

Route::get('/subscription/cancel-subscription', [SubscriptionController::class, 'cancelSubscription'])
    ->middleware(['auth', 'verified'])
    ->name('cancel-subscription');

Route::get('/user/invoice/{invoice}', [SubscriptionController::class, 'downloadInvoices'])
    ->middleware(['auth', 'verified'])
    ->name('download-invoice');

require __DIR__.'/auth.php';
