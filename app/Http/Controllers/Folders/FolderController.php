<?php

namespace App\Http\Controllers\Folders;

use App\Actions\Folder\CreateFolder;
use App\Http\Controllers\Controller;
use App\Http\Requests\Folders\FolderRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class FolderController extends Controller
{
    public function store(FolderRequest $request): RedirectResponse
    {
        CreateFolder::handle(Auth::user(), $request->validated());

        return back()->with('success', 'Folder Created Successfully');
    }
}
