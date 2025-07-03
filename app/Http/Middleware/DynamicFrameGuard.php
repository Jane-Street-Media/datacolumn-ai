<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class DynamicFrameGuard
{
    public function handle(Request $request, Closure $next)
    {
        /** @var \Illuminate\Http\Response $response */
        $response = $next($request);

        // Only on your “public/embed” (or whatever) routes:
        if ($request->route('chart.embed')) {
            // 1) strip the SAMEORIGIN header
            $response->headers->remove('X-Frame-Options');

            // 2) grab the Origin header the browser sent
            $origin = $request->headers->get('Origin');

            // 3) validate it’s a well-formed HTTPS origin:
            if ($origin && preg_match('#^https://[A-Za-z0-9.\-]+$#', $origin)) {
                // echo it back in CSP
                $response->headers->set(
                    'Content-Security-Policy',
                    "frame-ancestors 'self' {$origin}"
                );
            } else {
                // no Origin? or not valid? keep only same-origin
                $response->headers->set(
                    'Content-Security-Policy',
                    "frame-ancestors 'self'"
                );
            }
        }

        return $response;
    }
}
