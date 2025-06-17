<?php

namespace App\Data\Auth;

use Spatie\LaravelData\Data;

class RegisterUserData extends Data
{
    public function __construct(
        public string $name,
        public string $email,
        public ?string $password = null,
        public ?string $provider_name = null,
        public ?string $provider_id = null,
    ) {}
}
