<?php

namespace App\Http\Controllers;

use App\Actions\Notifications\SendNotification;
use App\Enums\NotificationType;
use App\Actions\SyncSubscriptionPlanChanges;
use App\Helpers\SubscriptionLockHelper;
use App\Models\Team;
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
            return redirect()->back()->withErrors(
                ['error' => 'You already have a subscription in progress. Please wait a few minutes or refresh the page.']
            );
        }
        if ($request->user()->currentTeam->subscribed()) {
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
        $team = $request->user()->currentTeam;

        $subscription = $team->subscriptionWithProductDetails();
        if ($team->subscribedToPrice($plan) || !is_null($subscription->ends_at)) {
            return redirect()->back()->withErrors([
                'error' => 'Something went wrong while swapping your price. Please try again later.',
            ]);
        }

        $oldPlan = $subscription->plan;
        $subscription->swap($plan);

        $newSubscription = $team->subscriptionWithProductDetails();
        $newPlan = $newSubscription->plan;

        if ($oldPlan->display_name === $newPlan->display_name) {
            $oldPlanName = $oldPlan->display_name . '(' . ucfirst($oldPlan->frequency) .')';
            $newPlanName = $newPlan->display_name . '(' . ucfirst($newPlan->frequency) .')';
        } else {
            $oldPlanName = $oldPlan->display_name;
            $newPlanName = $newPlan->display_name;
        }

        $notificationType = $oldPlan->price > $newPlan->price
            ? NotificationType::DOWNGRADE
            : NotificationType::UPGRADE;

        SendNotification::handle(
            auth()->user(),
            $notificationType,
            $oldPlanName,
            $newPlanName
        );

        $team = Team::query()->find($request->user()->current_team_id);
        SyncSubscriptionPlanChanges::handle($team);

        $team = Team::query()->find($request->user()->current_team_id);
        SyncSubscriptionPlanChanges::handle($team);

        return redirect()->back()->with('success', 'Swapped successfully');
    }


    public function updatePaymentMethod(Request $request)
    {
        return $request->user()->currentTeam->checkout([], [
            'mode' => Session::MODE_SETUP,
            'success_url' => route('subscription-settings'), // Ensure this route uses port 80 or 443
            'cancel_url' => route('subscription-settings'),  // Optional: allow cancel fallback
        ]);
    }
}
