<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SubscriptionPlanDowngradeMail extends Mailable
{
    use Queueable, SerializesModels;

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.subscription-downgrade-plan',
        );
    }
}
