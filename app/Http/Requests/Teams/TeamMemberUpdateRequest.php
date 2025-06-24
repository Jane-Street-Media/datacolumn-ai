<?php

namespace App\Http\Requests\Teams;

use App\Http\Requests\BaseTeamRequest;
use App\Models\Team;
use App\Models\User;
use Illuminate\Container\Attributes\RouteParameter;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Validator;

class TeamMemberUpdateRequest extends BaseTeamRequest
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
    public function rules(): array
    {
        return [
            'role' => ['required', 'integer', 'exists:roles,id'],
        ];
    }

    public function after(#[RouteParameter('user')] User $user): array
    {
        $team = Team::find($this->team_id);

        return [
            function (Validator $validator) use ($user, $team) {
                if (! $team?->users()->where('user_id', $user->id)->exists()) {
                    $validator->errors()->add(
                        'user',
                        'This user is not a member of the team.'
                    );
                }
            },
        ];
    }
}
