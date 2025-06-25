<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class CurrentTeamUpdateRequest extends FormRequest
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
            'team_id' => [
                'required',
                Rule::exists('teams', 'id'),
                function ($attribute, $value, $fail) {
                    if (! Auth::user()->teams()->where('teams.id', $value)->exists()) {
                        $fail('The selected team is invalid or does not belong to you.');
                    }
                },
            ],
        ];
    }
}
