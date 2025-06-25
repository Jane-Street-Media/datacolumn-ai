<?php

namespace App\Exceptions;

use Exception;
use Throwable;

class PackageLimitExceededException extends Exception
{
    public function render($request, Throwable $e)
    {
        if ($e instanceof PackageLimitExceededException) {
            // Laravel will now treat it like a validation error
            return redirect()->back()
                ->withErrors([
                    'limit' => $e->getMessage() ?? 'You have hit your plan limit.',
                ])
                ->withInput();
        }

        //        return parent::render($request, $e);
    }
}
