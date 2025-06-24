<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class BaseTeamRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'team_id' => Auth::user()->current_team_id,
        ]);
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
                Rule::exists('teams', 'id')->where(function ($query) {
                    $query->where('id', Auth::user()->current_team_id);
                }),
            ],
        ];
    }

    public function validated($key = null, $default = null)
    {
        return array_merge(
            parent::validated($key, $default),
            ['team_id' => $this->team_id]
        );
    }
}
