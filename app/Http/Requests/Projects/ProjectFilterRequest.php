<?php

namespace App\Http\Requests\Projects;

use App\Http\Requests\BaseTeamRequest;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

class ProjectFilterRequest extends BaseTeamRequest
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
            'search' => 'nullable|string',
            'folder_id' => [
                'nullable',
                Rule::exists('folders', 'id')->where(function ($query) {
                    $query->where('team_id', $this->team_id);
                }),
            ],
        ];
    }
}
