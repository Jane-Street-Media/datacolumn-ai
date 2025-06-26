<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum SubscriptionStatus: string
{
    use EnumToArray;

    case ACTIVE = 'active';
    case NON_RENEWING = 'non_renewing';
    case CANCELLED = 'cancelled';
}
