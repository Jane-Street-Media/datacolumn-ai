<?php

namespace App;

enum TeamInvitationStatusEnum: string
{
    case PENDING = 'pending';
    case ACCEPTED = 'accepted';
    case REJECTED = 'rejected';

}
