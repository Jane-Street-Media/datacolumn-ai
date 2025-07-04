<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum ProjectStatus: string
{
    use EnumToArray;
    case DRAFT = 'draft';
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';             // Manually disabled by user or system
}
