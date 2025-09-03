<?php

namespace App\Http\Requests\Projects\Charts;

use App\Actions\PlanLimitations\EnsurePlanLimitNotExceeded;
use App\Enums\ChartStatus;
use App\Enums\PlanFeatureEnum;
use App\Enums\ProjectStatus;
use App\Exceptions\PackageLimitExceededException;
use App\Http\Requests\BaseTeamRequest;
use App\Models\Chart;
use App\Models\Project;
use Illuminate\Container\Attributes\RouteParameter;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Validator;

class UpdateChartRequest extends BaseTeamRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
{
    return [
        'data' => ['required', 'array'],
        'config' => ['required', 'array'],

        // Basic chart properties
        'config.type' => ['required', 'string', 'in:bar,line,area,pie,scatter,radar,radialBar,funnel,treemap,composed,stackedBar,stackedArea,waterfall'],
        'config.title' => ['nullable', 'string', 'max:255'],
        'config.subtitle' => ['nullable', 'string', 'max:255'],

        // Title styling
        'config.titleAlignment' => ['nullable', 'string', 'in:left,center,right'],
        'config.titleColor' => ['nullable', 'string'],
        'config.titleWeight' => ['nullable', 'string', 'in:normal,bold,light,semibold'],
        'config.subtitleColor' => ['nullable', 'string'],

        // Axes
        'config.xAxis' => ['nullable', 'string'],
        'config.yAxis' => ['nullable', 'string'],
        'config.xAxisLabel' => ['nullable', 'string'],
        'config.yAxisLabel' => ['nullable', 'string'],

        // Series
        'config.series' => ['nullable', 'array'],
        'config.series.*.dataKey' => ['required_with:config.series', 'string'],
        'config.series.*.chartType' => ['required_with:config.series', 'string'],
        'config.series.*.fill' => ['nullable', 'string'],
        'config.series.*.stroke' => ['nullable', 'string'],

        // Display options
        'config.showGrid' => ['nullable', 'boolean'],
        'config.showLegend' => ['nullable', 'boolean'],
        'config.showXAxis' => ['nullable', 'boolean'],
        'config.showYAxis' => ['nullable', 'boolean'],
        'config.showTooltip' => ['nullable', 'boolean'],
        'config.showCartesianGrid' => ['nullable', 'boolean'],

        // Legend
        'config.legendPosition' => ['nullable', 'string', 'in:top,bottom,left,right'],

        // Tooltip
        'config.tooltipFormat' => ['nullable', 'string', 'in:default,currency,percentage,decimal,thousands,millions,custom'],
        'config.tooltipCustomFormat' => ['nullable', 'string'],

        // Colors
        'config.colors' => ['nullable', 'array'],

        // Dimensions
        'config.width' => ['nullable', 'integer', 'min:300', 'max:1200'],
        'config.height' => ['nullable', 'integer', 'min:200', 'max:800'],

        // Theme
        'config.theme' => ['nullable', 'string', 'in:light,dark,system'],
        'config.backgroundColor' => ['nullable', 'string'],

        // Animation
        'config.enableAnimation' => ['nullable', 'boolean'],
        'config.animationDuration' => ['nullable', 'integer', 'min:100', 'max:5000'],
        'config.animationType' => ['nullable', 'string', 'in:ease,ease-in,ease-out,ease-in-out,linear'],

        // Padding
        'config.paddingOption' => ['nullable', 'string', 'in:none,default,custom,small'],
        'config.customPaddingValue' => ['nullable', 'integer', 'min:0', 'max:100'],
    ];
}

    public function after(#[RouteParameter('chart')] Chart $chart): array
    {
        try {
            $limitExceeded = false;
            EnsurePlanLimitNotExceeded::handle(Auth::user()->currentTeam, PlanFeatureEnum::NO_OF_CHARTS);
        }catch (PackageLimitExceededException $exception){
            $limitExceeded = true;
        }
        return [
            function (Validator $validator) use ($chart, $limitExceeded) {
                if($chart->status === ChartStatus::INACTIVE && $limitExceeded){
                    $validator->errors()->add('package_restriction', 'You have reached the maximum number of charts allowed by your plan.');
                }
            }
        ];
    }
}
