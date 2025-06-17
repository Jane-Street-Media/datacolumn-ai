<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect(['owner', 'admin', 'member'])->each(fn($role) => Role::firstOrCreate([
            'name' => $role,
            'guard_name' => 'web',
        ]));
    }
}
