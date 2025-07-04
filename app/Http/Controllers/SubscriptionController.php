<?php

namespace App\Http\Controllers;

use App\Actions\Notifications\SendNotification;
use App\Enums\NotificationType;
use App\Enums\SubscriptionStatus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionController extends Controller
{

    public function success(): Response
    {
        App::make(SendNotification::class)->handle(NotificationType::WELCOME);
        return Inertia::render('banners/successfulSubscription');
    }

    public function cancelSubscription(Request $request): RedirectResponse
    {
        try {
            $subscription = $request->user()->currentTeam->subscriptionWithProductDetails();

            if ($subscription && $subscription->chargebee_status !== SubscriptionStatus::NON_RENEWING->value && $subscription->cancel(
                )) {
                return back()->with('success', 'Subscription cancelled successfully.');
            }

            return back()->withErrors(['error' => 'Something went wrong while cancelling the subscription.']);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'An error occurred: ' . $e->getMessage()]);
        }
    }

    public function switchToFreePlan(Request $request): RedirectResponse
    {
        try {
            $subscription = $request->user()->currentTeam->subscriptionWithProductDetails();

            if ($subscription && $subscription->chargebee_status !== SubscriptionStatus::CANCELLED->value && $subscription->cancelNow(
                )) {
                return back()->with('success', 'Switched to free plan successfully.');
            }

            return back()->withErrors(['error' => 'Something went wrong while switching the plan.']);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'An error occurred: ' . $e->getMessage()]);
        }
    }

    public function resumeSubscription(Request $request): RedirectResponse
    {
        try {
            $subscription = $request->user()->currentTeam->subscriptionWithProductDetails();
            if ($subscription && $subscription->resumeCancelScheduled()) {
                return back()->with('success', 'Subscription resumed successfully.');
            }

            return back()->withErrors(['error' => 'Something went wrong while resuming the subscription.']);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'An error occurred: ' . $e->getMessage()]);
        }
    }

    public function downloadInvoices(Request $request, string $invoiceId)
    {
        return $request->user()->currentTeam->downloadInvoice($invoiceId);
    }
}
