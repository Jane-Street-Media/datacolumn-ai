<?php

namespace Database\Seeders;

use App\Actions\Common\CreateTeam;
use App\Data\Team\CreateTeamData;
use App\Enums\RoleEnum;
use App\Models\Team;
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

        $user = User::factory()->create([
            'name' => 'Curtis',
            'email' => 'curtis@datacolumn.ai',
        ]);

        $team = Team::query()->create([
            'user_id' => $user->id,
            'name' => "Curtis",
            'personal_team' => true,
        ]);

        $user->update([
            'current_team_id' => $team->id,
        ]);
    }
}
