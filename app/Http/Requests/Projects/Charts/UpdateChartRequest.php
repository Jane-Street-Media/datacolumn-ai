<?php

namespace App\Http\Requests\Projects\Charts;

use App\Http\Requests\BaseTeamRequest;

class UpdateChartRequest extends BaseTeamRequest
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
