<?php

namespace App\Http\Controllers\Projects;

use App\Actions\Folder\GetFolders;
use App\Actions\Project\CreateProject;
use App\Actions\Project\DeleteProject;
use App\Actions\Project\GetProjects;
use App\Actions\Project\UpdateProject;
use App\Data\CreateProjectData;
use App\Enums\ProjectStatus;
use App\Exceptions\PackageLimitExceededException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Projects\CreateProjectRequest;
use App\Http\Requests\Projects\ProjectFilterRequest;
use App\Http\Requests\Projects\UpdateProjectRequest;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProjectsController extends Controller
{
    public function index(ProjectFilterRequest $request): Response
    {
        $params = $request->validated();
        $analyticsEnabled = Auth::user()->currentTeam->isAnalyticsEnabled();
        $params['analyticsEnabled'] = $analyticsEnabled;

        return Inertia::render('projects', [
            'projects' => Inertia::defer(fn() => GetProjects::handle($params)->latest()->get()),
            'folders' => Inertia::defer(fn() => GetFolders::handle()),
            'statuses' => ProjectStatus::getFormattedValues()
        ]);
    }

    public function store(CreateProjectRequest $request): RedirectResponse
    {

        try {
            $data = $request->validated();
            $user = Auth::user();
            $project = CreateProject::handle(Auth::user(), CreateProjectData::from([
                ...$data,
                'user_id' => $user->id,
            ]));


            return back()->with('success', 'Project Created Successfully')->with('data', $project);
        } catch (PackageLimitExceededException $exception) {
            return redirect()->back()
                ->withErrors(['package_restriction' => $exception->getMessage()]);
        }
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
