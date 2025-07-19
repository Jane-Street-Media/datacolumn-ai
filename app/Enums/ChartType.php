<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum ChartType: string
{
    use EnumToArray;
    
    case AREA = 'area';
    case LINE = 'line';
    case BAR = 'bar';
    case PIE = 'pie';
    case SCATTER = 'scatter';
    case RADAR = 'radar';
    case RADIAL_BAR = 'radialBar';
    case FUNNEL = 'funnel';
    case TREEMAP = 'treemap';
    case COMPOSED = 'composed';
    case STACKED_BAR = 'stackedBar';
    case STACKED_AREA = 'stackedArea';
    case WATERFALL = 'waterfall';
}
