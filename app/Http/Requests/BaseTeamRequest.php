<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BaseTeamRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function prepareForValidation(): array
    {
        return $this->validate([
            'team_id' => ['required',
                Rule::exists('teams', 'id')->where(function (Builder $query) {
                    return $query->where('id', $this->team_id);
                })],
        ]);
    }

    public function validated($key = null, $default = null)
    {
        return array_merge(
            parent::validated($key, $default),
            ['team_id' => $this->team_id]
        );
    }
}
