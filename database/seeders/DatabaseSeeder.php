<?php

namespace Database\Seeders;

use App\Actions\Common\CreateTeam;
use App\Data\Team\CreateTeamData;
use App\Models\User;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            NotificationTemplateSeeder::class
        ]);

        // User::factory(10)->create();

        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        CreateTeam::handle(CreateTeamData::from(['name' => $user->name]), $user);
    }
}
