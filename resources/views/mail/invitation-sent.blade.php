<x-mail::message>
# You have been invited to join the {{ $invitation->team->name }} team!

If you do not have an account, register your account [here]({{ route('register') }}).
Then click below to accept the invitation:

<x-mail::button :url="$acceptUrl">
Accept Invite
</x-mail::button>

Thanks,
{{ config('app.name') }}
</x-mail::message>
