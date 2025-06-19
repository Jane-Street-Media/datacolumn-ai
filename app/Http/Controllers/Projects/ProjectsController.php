<?php

namespace App\Http\Controllers\Projects;

use App\Actions\Project\CreateProject;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateProjectRequest;
use App\Models\Folder;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Concurrency;
use Inertia\Inertia;
use Inertia\Response;

class ProjectsController extends Controller
{
    public function index(): Response
    {
        [$projects, $folders] = Concurrency::run([
            fn () => Project::withCount('charts')->get(),
            fn () => Folder::all(),
        ]);

        return Inertia::render('projects', [
            'projects' => $projects,
            'folders' => $folders,
        ]);
    }

    public function store(CreateProjectRequest $request): RedirectResponse
    {
        CreateProject::handle(Auth::user(), $request->validated());

        return back()->with('success', 'Project Created Successfully');
    }
}
