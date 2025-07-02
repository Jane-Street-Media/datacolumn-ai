<?php

namespace App\Http\Requests\Projects;

use App\Actions\PlanLimitations\EnsurePlanLimitNotExceeded;
use App\Actions\Project\GetProjects;
use App\Enums\PlanFeatureEnum;
use App\Enums\ProjectStatus;
use App\Exceptions\PackageLimitExceededException;
use App\Http\Requests\BaseTeamRequest;
use App\Models\Project;
use Illuminate\Container\Attributes\RouteParameter;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateProjectRequest extends BaseTeamRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'string', Rule::enum(ProjectStatus::class)],
            'folder_id' => [
                'nullable',
                Rule::exists('folders', 'id')->where(function ($query) {
                    $query->where('team_id', $this->team_id);
                }),
            ], ];
    }

    public function after(#[RouteParameter('project')] Project $project): array
    {
        try {
            $limitExceeded = false;
            EnsurePlanLimitNotExceeded::handle(Auth::user()->currentTeam, PlanFeatureEnum::NO_OF_PROJECTS);
        }catch (PackageLimitExceededException $exception){
            $limitExceeded = true;
        }
        return [
            function (Validator $validator) use ($project, $limitExceeded) {
                if($project->status === ProjectStatus::INACTIVE && $limitExceeded){
                    $validator->errors()->add('cannot_update', 'You cannot update the project.');
                }
            }
        ];
    }
}
