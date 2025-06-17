<?php

namespace App\Http\Requests;

use App\Models\Team;
use Illuminate\Container\Attributes\RouteParameter;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class TeamMemberDeleteRequest extends FormRequest
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
    public function rules(#[RouteParameter('team')] Team $team): array
    {
        return [
            'user_id' => ['required', 'integer', 'exists:users,id' , function($attribute, $value, $fail) use ($team) {
                    if (!$team->users()->where('user_id', $value)->exists()) {
                        $fail('The selected user is not a member of this team.');
                    }
            }],
        ];
    }
}
