<?php

namespace App\Http\Controllers\Projects;

use App\Actions\Project\CreateProject;
use App\Actions\Project\DeleteProject;
use App\Actions\Project\GetProjects;
use App\Actions\Project\UpdateProject;
use App\Http\Controllers\Controller;
use App\Http\Requests\Projects\CreateProjectRequest;
use App\Http\Requests\Projects\ProjectFilterRequest;
use App\Http\Requests\Projects\UpdateProjectRequest;
use App\Models\Folder;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProjectsController extends Controller
{
    public function index(ProjectFilterRequest $request): Response
    {
        $projects = GetProjects::handle($request->validated());

        return Inertia::render('projects', [
            'projects' => Inertia::defer(fn () => $projects),
            'folders' => Folder::all(),
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
