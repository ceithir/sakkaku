@component('mail::message')
Hello,<br/>

Player {{ $roll->user->name }} has just rolled heritage for their character {{ $roll->character }} in the context of campaign {{ $roll->campaign }}.

@component('mail::button', ['url' => $url])
View roll result
@endcomponent

If you have no idea what this is all about, just ignore this email.<br/>

Have a good day,<br>
{{ config('app.name') }}
@endcomponent
