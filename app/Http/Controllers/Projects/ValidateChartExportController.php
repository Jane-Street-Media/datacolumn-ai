<?php

namespace App\Http\Controllers\Projects;

use App\Actions\PlanLimitations\EnsurePlanLimitNotExceeded;
use App\Enums\PlanFeatureEnum;
use App\Exceptions\PackageLimitExceededException;
use App\Http\Controllers\Controller;
use App\Models\Chart;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class ValidateChartExportController extends Controller
{
    public function __invoke(Project $project, Chart $chart): RedirectResponse
    {
        try {
            EnsurePlanLimitNotExceeded::handle(Auth::user()->currentTeam, PlanFeatureEnum::NO_OF_EXPORTS);
            $chart->update([
                'total_exports' => ++$chart->total_exports
            ]);
            return back()->with('success', 'Plan export limit not exceeded.');
        } catch (PackageLimitExceededException $e) {
            return back()->withErrors(['package_restriction' => $e->getMessage()]);
        }
    }
}
