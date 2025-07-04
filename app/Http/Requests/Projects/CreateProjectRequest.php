<?php

namespace App\Http\Requests\Projects;

use App\Enums\ProjectStatus;
use App\Http\Requests\BaseTeamRequest;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

class CreateProjectRequest extends BaseTeamRequest
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
            'status' => ['sometimes', 'string', Rule::enum(ProjectStatus::class)],
            'folder_id' => [
                'nullable',
                Rule::exists('folders', 'id')->where(function ($query) {
                    $query->where('team_id', $this->team_id);
                }),
            ],
            'chart' => ['nullable', 'array'],
            'chart.title' => ['required_with:chart', 'string'],
            'chart.type' => ['required_with:chart', 'string'],
            'chart.description' => ['required_with:chart', 'string'],
            'chart.config' => ['required_with:chart', 'array'],
            'chart.data' => ['required_with:chart', 'array'],

            'dataset' => ['nullable', 'array'],
            'dataset.name' => ['required_with:dataset', 'string'],
            'dataset.data' => ['required_with:dataset', 'array'],
            'dataset.columns' => ['required_with:dataset', 'array'],
        ];
    }
}
