<?php

namespace App\Enums;

use App\Enums\Traits\EnumToArray;

enum RoleEnum: string
{
    use EnumToArray;

    case OWNER = 'owner';
    case ADMIN = 'admin';
    case SUPER_ADMIN = 'super-admin';
    case MEMBER = 'member';
}
