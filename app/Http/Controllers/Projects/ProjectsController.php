<?php

namespace App\Http\Controllers\Projects;

use App\Actions\Project\CreateProject;
use App\Actions\Project\DeleteProject;
use App\Actions\Project\GetProjects;
use App\Actions\Project\UpdateProject;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
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
            fn () => GetProjects::handle(),
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

    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
    {
        UpdateProject::handle($project, $request->validated());

        return back()->with('success', 'Project Updated Successfully');
    }

    public function destroy(Project $project): RedirectResponse
    {
        DeleteProject::handle($project);

        return back()->with('success', 'Project Deleted Successfully');
    }
}
