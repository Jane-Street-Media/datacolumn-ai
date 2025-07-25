<?php

namespace App\Http\Requests\Folders;

use App\Http\Requests\BaseTeamRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class FolderRequest extends BaseTeamRequest
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
        ];
    }
}
