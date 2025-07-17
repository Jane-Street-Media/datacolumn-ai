<?php

namespace App\Mail;

use App\Enums\NotificationType;
use App\Models\NotificationTemplate;
use App\Models\TeamInvitation;
use App\Traits\MessageFormatter;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\URL;

class InvitationSent extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels, MessageFormatter;

    public $subject;
    public NotificationTemplate $template;
    public function __construct(public TeamInvitation $teamInvitation, public NotificationType $notificationType)
    {
        $this->template = $notificationType->getNotificationTemplate();
        $this->subject = $this->template->subject ?? 'Invitation Sent';
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $text = $this->refineMessage($this->template->message, [
            'team_name' => $this->teamInvitation->team->name,
            'user_name' => $this->teamInvitation->email,
            'app_name' => config('app.name'),
        ]);
        return new Content(
            markdown: 'mail.invitation-sent',
            with: [
                'acceptUrl' => URL::signedRoute('team-invitations.accept', $this->teamInvitation),
                'invitation' => $this->teamInvitation,
                'text' => $text
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
