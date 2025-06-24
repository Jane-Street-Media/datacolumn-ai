<?php

namespace App\Http\Controllers;

use Chargebee\Cashier\Session;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    public function productCheckout(Request $request, string $plan): RedirectResponse
    {
        $checkout = $request
            ->user()
            ->currentTeam
            ->newSubscription('default', $plan)
            ->checkout([
                'success_url' => route('successful-subscription'),
                'cancel_url' => route('failed-payment'),
            ]);

        return redirect()->away($checkout->url);
    }

    public function swapProduct(Request $request, string $plan): RedirectResponse
    {
        $request->user()->currentTeam->subscription()->swap($plan);

        return redirect()->back()->with('success', 'Swapped successfully');
    }

    public function updatePaymentMethod(Request $request)
    {
        return $request->user()->currentTeam->checkout([], [
            'mode' => Session::MODE_SETUP,
            'success_url' => route('billing'),
        ]);
    }
}
