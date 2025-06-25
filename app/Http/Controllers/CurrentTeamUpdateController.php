<?php

namespace App\Http\Controllers;

use App\Actions\UpdateUserCurrentTeam;
use App\Http\Requests\CurrentTeamUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class CurrentTeamUpdateController extends Controller
{
    public function update(CurrentTeamUpdateRequest $currentTeamUpdateRequest): RedirectResponse
    {
        UpdateUserCurrentTeam::handle(Auth::user(), $currentTeamUpdateRequest->validated());

        return redirect()->back()->with('success', 'Team switched successfully!');
    }
}
