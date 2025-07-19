<?php

namespace App\Http\Controllers\Auth\Socialite;

use App\Actions\Auth\RegisterUserAndCreateTeam;
use App\Actions\Notifications\SendNotification;
use App\Data\Auth\RegisterUserData;
use App\Enums\NotificationType;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserSession;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class SocialiteController extends Controller
{
    public function store(string $provider): RedirectResponse
    {
        $socialUser = Socialite::driver($provider)->stateless()->user();
        $user = User::firstWhere('email', $socialUser->getEmail());
        if (! $user) {
            $user = RegisterUserAndCreateTeam::handle(RegisterUserData::from([
                'email' => $socialUser->getEmail(),
                'name' => $socialUser->getName(),
                'provider_name' => $provider,
                'provider_id' => $socialUser->getId(),

            ]), $provider);
            SendNotification::handle($user, NotificationType::WELCOME);
        }
        Auth::login($user);
        UserSession::createUserSession($user);

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
