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
        if ($request->route()->getName() === 'chart.embed') {
            $response->headers->remove('X-Frame-Options');

            $old = $response->headers->get('Content-Security-Policy', '');
            // remove any existing frame-ancestors directive
            $merged = preg_replace(
                '/\s*frame-ancestors[^;]+;?/',
                '',
                $old
            );

            // build our new frame-ancestors
            $origin = $request->headers->get('Origin');
            $allowed = "'self'";
            if ($origin && preg_match('#^https://[A-Za-z0-9.\-]+$#', $origin)) {
                $allowed .= " {$origin}";
            }

            // re-set the full CSP
            $response->headers->set(
                'Content-Security-Policy',
                trim($merged) . "; frame-ancestors {$allowed};"
            );
        }

        return $response;
    }
}
