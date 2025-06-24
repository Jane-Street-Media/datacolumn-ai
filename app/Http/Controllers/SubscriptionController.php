<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function pauseSubscription(Request $request): RedirectResponse
    {
        try {
            $subscription = $request->user()->currentTeam->subscription('default');

            if ($subscription && $subscription->pause()) {
                return back()->with('success', 'Subscription paused successfully.');
            }

            return back()->with('error', 'Something went wrong while pausing the subscription.');
        } catch (\Exception $e) {
            return back()->with('error', 'An error occurred: '.$e->getMessage());
        }
    }

    public function resumeSubscription(Request $request): RedirectResponse
    {
        try {
            $subscription = $request->user()->currentTeam->subscription('default');
            if ($subscription && $subscription->resumePauseScheduled()) {
                return back()->with('success', 'Subscription resumed successfully.');
            }

            return back()->with('error', 'Something went wrong while resuming the subscription.');
        } catch (\Exception $e) {
            return back()->with('error', 'An error occurred: '.$e->getMessage());
        }
    }

    public function downloadInvoices(Request $request, string $invoiceId)
    {
        return $request->user()->currentTeam->downloadInvoice($invoiceId);
    }
}
