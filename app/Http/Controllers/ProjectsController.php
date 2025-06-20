<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Inertia\Inertia;
use Inertia\Response;

class ProjectsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('projects/index');
    }

    public function show($id): Response
    {
        $project = [
            'id' => $id,
            'name' => 'Project ' . $id,
            'description' => 'Description for project ' . $id,
        ];
        return Inertia::render('projects/show', [
            'project' => $project,
        ]);
    }
}
