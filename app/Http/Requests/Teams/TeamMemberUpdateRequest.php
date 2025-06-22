<?php

namespace App\Http\Requests\Teams;

use App\Http\Requests\BaseTeamRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class TeamMemberUpdateRequest extends BaseTeamRequest
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
            'role' => ['required', 'integer', 'exists:roles,id'],
        ];
    }
}
