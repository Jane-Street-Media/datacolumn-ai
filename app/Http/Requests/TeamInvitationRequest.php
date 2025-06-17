<?php

namespace App\Http\Requests;

use App\Models\GroupCohortSession;
use App\Models\TeamInvitation;
use Illuminate\Container\Attributes\RouteParameter;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class TeamInvitationRequest extends FormRequest
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
    public function rules(#[RouteParameter('teamInvitation')] TeamInvitation $teamInvitation): array
    {
        return [
            'user_id' => [
                'required',
                'exists:users,id'
            ],
        ];
    }

}
