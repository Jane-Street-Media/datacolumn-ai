<?php

namespace App\Http\Requests\Projects\Charts;

use Illuminate\Foundation\Http\FormRequest;

class UpdateChartRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'data' => ['required', 'array'],
            'config' => ['required', 'array'],
        ];
    }
}
