<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class BillingController extends Controller
{
    private function getAllPlans(): Collection
    {
        $plans = Plan::all()->groupBy('chargebee_product')->map(function ($group) {
            $monthly = $group->where('frequency', 'month')->first();
            $yearly = $group->where('frequency', 'year')->first();
            $monthlyPrice = $monthly ? number_format($monthly->price / 100, 2) : 0;
            $yearlyPrice = $yearly ? number_format($yearly->price / 100, 2) : 0;

            return array_filter([
                'name' => $group->first()->display_name,
                'description' => $group->first()->description,
                'monthly_price' => max($monthlyPrice, 0),
                'yearly_price' => max($yearlyPrice, 0),
                'monthly_chargebee_id' => optional($monthly)->chargebee_id,
                'yearly_chargebee_id' => optional($yearly)->chargebee_id,
                'details' => $group->first()->details,
                'limitations' => $group->first()->limitations,
                'cta' => $group->first()->cta,
                'popular' => $group->first()->popular,
                'default' => false,
                'currency' => $monthly?->currency ?? $yearly?->currency,
            ], fn ($value) => ! is_null($value));

        })->values();

        return $plans;
    }

    public function pricing(): Response
    {
        return Inertia::render('pricing/pricing', [
            'plans' => $this->getAllPlans(),
        ]);
    }

    public function billing(Request $request): Response|RedirectResponse
    {
        if ($request->user()?->currentTeam->subscribed('default')) {
            return redirect()->route('subscription-settings');
        }

        return Inertia::render('pricing/billingPage', [
            'plans' => $this->getAllPlans(),
        ]);
    }

    public function invoices(Request $request): Response
    {
        return Inertia::render('settings/invoices', [
            'invoices' => $request->user()->currentTeam->invoices(),
        ]);
    }

    public function subscriptions(Request $request): Response
    {
        return Inertia::render('settings/subscription', [
            'subscription' => $request->user()->currentTeam->subscriptionWithProductDetails() ?? null,
            'plans' => $this->getAllPlans(),
        ]);
    }
}
