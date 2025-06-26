<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function cancelSubscription(Request $request): RedirectResponse
    {
        try {
            $subscription = $request->user()->currentTeamLatestSubscription();

            if ($subscription && $subscription->cancel()) {
                return back()->with('success', 'Subscription cancelled successfully.');
            }

            return back()->withErrors(['error' => 'Something went wrong while cancelling the subscription.']);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'An error occurred: '.$e->getMessage()]);
        }
    }

    public function switchToFreePlan(Request $request): RedirectResponse
    {
        try {
            $subscription = $request->user()->currentTeamLatestSubscription();

            if ($subscription && $subscription->cancelNow()) {
                return back()->with('success', 'Subscription cancelled successfully.');
            }

            return back()->withErrors(['error' => 'Something went wrong while cancelling the subscription.']);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'An error occurred: '.$e->getMessage()]);
        }
    }

    public function resumeSubscription(Request $request): RedirectResponse
    {
        try {
            $subscription = $request->user()->currentTeamLatestSubscription();
            if ($subscription && $subscription->resumeCancelScheduled()) {
                return back()->with('success', 'Subscription resumed successfully.');
            }

            return back()->withErrors(['error' => 'Something went wrong while resuming the subscription.']);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'An error occurred: '.$e->getMessage()]);
        }
    }

    public function downloadInvoices(Request $request, string $invoiceId)
    {
        return $request->user()->currentTeam->downloadInvoice($invoiceId);
    }
}
