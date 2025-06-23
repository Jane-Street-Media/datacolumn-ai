<?php

namespace App\Http\Requests\Teams;

use App\Models\Team;
use Illuminate\Container\Attributes\RouteParameter;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class TeamMemberRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::user()->hasRole('owner');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(#[RouteParameter('team')] Team $team): array
    {
        return [
            'email' => ['required', 'email',
                function ($attribute, $value, $fail) use ($team) {
                    if ($team->invitations()->where('email', $value)->exists()) {
                        $fail('Invitation already sent to this user.');
                    }
                },
            ],
            'role' => ['required', 'exists:roles,name'],
        ];
    }
}
