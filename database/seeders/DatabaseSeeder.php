<?php

namespace Database\Seeders;

use App\Actions\Common\CreateTeam;
use App\Data\Team\CreateTeamData;
use App\Enums\RoleEnum;
use App\Models\Team;
use App\Models\User;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

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

        $user = User::query()->updateOrcreate([
            'name' => 'Curtis',
            'email' => 'curtis@datacolumn.ai',
        ], [
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ]);

        $team = Team::query()->updateOrcreate([
            'user_id' => $user->id,
            'name' => "Curtis",
        ], [
            'personal_team' => true,
        ]);

        $user->update([
            'current_team_id' => $team->id,
        ]);

        $user = User::query()->updateOrcreate([
            'name' => 'Donot Delete',
            'email' => 'donot-delete@datacolumn.ai',
        ], [
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ]);

        $team = Team::query()->updateOrcreate([
            'user_id' => $user->id,
            'name' => "Donot Delete",
        ], [
            'personal_team' => true,
            'password' => Hash::make('password'),
        ]);

        $user->update([
            'current_team_id' => $team->id,
        ]);
    }
}
