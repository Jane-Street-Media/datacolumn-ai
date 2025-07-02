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
                    $validator->errors()->add('cannot_update', 'You cannot update the chart.');
                }
            }
        ];
    }
}
