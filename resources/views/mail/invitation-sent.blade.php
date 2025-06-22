<x-mail::message>
    {{ __('You have been invited to join the :team team!', ['team' => $invitation->team->name]) }}

    {{ __('If you do not have an account, you may create one by clicking the button below. After creating an account, you may click the invitation acceptance button in this email to accept the team invitation:') }}

    <x-mail::button :url="route('register')">
        {{ __('Register Account') }}
    </x-mail::button>



    <x-mail::button :url="$acceptUrl">
        {{ __('Accept Invite') }}
    </x-mail::button>

    Thanks,<br>
    {{ config('app.name') }}
</x-mail::message>
