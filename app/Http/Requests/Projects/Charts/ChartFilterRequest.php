<?php

namespace App\Http\Requests\Projects\Charts;

use App\Http\Requests\BaseTeamRequest;

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
