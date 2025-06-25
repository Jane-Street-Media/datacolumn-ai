<?php

namespace App\Http\Controllers;

use App\Helpers\SubscriptionLockHelper;
use Chargebee\Cashier\Session;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class CheckoutController extends Controller
{
    public function productCheckout(Request $request, string $plan): Response
    {
        if (SubscriptionLockHelper::isLocked($request->user()->id)) {
            return redirect()->back()->withErrors(['error' => 'You already have a subscription in progress. Please wait a few minutes or refresh the page.']);
        }
        if ($request->user()->currentTeam->subscribed()){
            return redirect()->back()->withErrors(['error' => 'You are already subscribed to a plan.']);
        }
        SubscriptionLockHelper::lock($request->user()->id, 2);
        $checkout = $request
            ->user()
            ->currentTeam
            ->newSubscription('default', $plan)
            ->checkout([
                'success_url' => route('successful-subscription'),
                'cancel_url' => route('failed-payment'),
            ]);

        return Inertia::location($checkout->url);
    }

    public function swapProduct(Request $request, string $plan): RedirectResponse
    {
        if ($request->user()->currentTeam->subscribedToPrice($plan) || ! is_null($request->user()->currentTeamLatestSubscription()->ends_at)) {
            return redirect()->back()->withErrors(['error' => 'Something went wrong while swapping your price. Please try again later.']);
        }
        $request->user()->currentTeamLatestSubscription()->swap($plan);

        return redirect()->back()->with('success', 'Swapped successfully');
    }

    public function updatePaymentMethod(Request $request)
    {
        return $request->user()->currentTeam->checkout([], [
            'mode' => Session::MODE_SETUP,
            'success_url' => route('billing'), // Ensure this route uses port 80 or 443
            'cancel_url' => route('billing'),  // Optional: allow cancel fallback
        ]);
    }
}
