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
            // 1) Strip legacy headers
            $response->headers->remove('X-Frame-Options');
            $response->headers->remove('Content-Security-Policy');

            // 2) Determine the embedding origin
            $origin = $request->headers->get('Origin');

            if (! $origin && $referer = $request->headers->get('Referer')) {
                // Parse scheme+host+port from referer
                $parts = parse_url($referer);
                if (! empty($parts['scheme']) && ! empty($parts['host'])) {
                    $origin = $parts['scheme'] . '://' . $parts['host']
                        . (! empty($parts['port']) ? ':' . $parts['port'] : '');
                }
            }

            // 3) Validate it (http/https, host, optional port)
            $allowed = ["'self'"];
            if ($origin
                && preg_match('#^https?://[A-Za-z0-9\.\-]+(?::\d+)?$#', $origin)
            ) {
                $allowed[] = $origin;
            }

            // 4) Build a minimal CSP
            $csp = 'frame-ancestors ' . implode(' ', $allowed) . ';';
            $response->headers->set('Content-Security-Policy', $csp);
        }

        return $response;
    }
}
