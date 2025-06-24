<?php

use App\Http\Controllers\CheckoutController;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => ['auth', 'verified']], function () {
    Route::post('/checkout/{plan?}', [CheckoutController::class, 'productCheckout'])
        ->name('checkout');

    Route::patch('/checkout/{plan}/swap', [CheckoutController::class, 'swapProduct'])
        ->name('checkout.swap');

    Route::get('/update-payment-method', [CheckoutController::class, 'updatePaymentMethod'])
        ->name('updatePaymentMethod');
});

require __DIR__.'/auth.php';
