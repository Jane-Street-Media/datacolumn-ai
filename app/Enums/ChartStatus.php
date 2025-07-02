<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum ChartStatus: string
{
    use EnumToArray;
    case ACTIVE = 'active';                 // Default, usable project
    case INACTIVE = 'inactive';             // Manually disabled by user or system
}
