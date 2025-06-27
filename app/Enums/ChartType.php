<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum ChartType: string
{
    use EnumToArray;
    case AREA = 'area';
    case LINE = 'line';
    case BAR = 'bar';
}
