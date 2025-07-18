<x-mail::message>
# You have been invited to join the {{ $invitation->team->name ?? 'Test' }} team!

{{ $text }}

<x-mail::button :url="$acceptUrl">
Accept Invite
</x-mail::button>

Thanks,
{{ config('app.name') }}
</x-mail::message>
