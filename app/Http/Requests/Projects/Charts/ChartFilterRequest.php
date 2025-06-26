<?php

namespace App\Http\Requests\Projects\Charts;

use App\Http\Requests\BaseTeamRequest;
use Illuminate\Foundation\Http\FormRequest;

class ChartFilterRequest extends BaseTeamRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string'],
        ];
    }
}
