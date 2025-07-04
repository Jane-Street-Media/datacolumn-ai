<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class PagesController extends Controller
{
    public function home()
    {
        return Inertia::render('LandingPage');
    }
}
