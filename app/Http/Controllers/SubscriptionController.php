<?php

namespace App\Http\Controllers;

use App\Actions\SyncSubscriptionPlanChanges;
use App\Enums\SubscriptionStatus;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class SubscriptionController extends Controller
{
    public function cancelSubscription(Request $request): RedirectResponse
    {
        try {
            $subscription = $request->user()->currentTeam->subscriptionWithProductDetails();

            if ($subscription && $subscription->chargebee_status !== SubscriptionStatus::NON_RENEWING->value && $subscription->cancel()) {
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
            $subscription = $request->user()->currentTeam->subscriptionWithProductDetails();
            if ($subscription && $subscription->chargebee_status !== SubscriptionStatus::CANCELLED->value && $subscription->cancelNow()) {
                $team = Team::query()->find($request->user()->current_team_id);
                SyncSubscriptionPlanChanges::handle($team);
                return back()->with('success', 'Switched to free plan successfully.');
            }

            return back()->withErrors(['error' => 'Something went wrong while switching the plan.']);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'An error occurred: '.$e->getMessage()]);
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
            return back()->withErrors(['error' => 'An error occurred: '.$e->getMessage()]);
        }
    }

    public function downloadInvoices(Request $request, string $invoiceId)
    {
        return $request->user()->currentTeam->downloadInvoice($invoiceId);
    }
}
