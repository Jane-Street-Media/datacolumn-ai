<?php

namespace App\Http\Controllers\Auth;

use App\Actions\Notifications\SendNotification;
use App\Enums\NotificationType;
use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
        }

        if ($request->user()->markEmailAsVerified()) {
            $user = $request->user();

            event(new Verified($user));
            SendNotification::handle($request->user(), NotificationType::WELCOME);
        }

        return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
    }
}
