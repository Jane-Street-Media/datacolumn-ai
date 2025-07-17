<?php

namespace Database\Seeders;

use App\Actions\Auth\RegisterUserAndCreateTeam;
use App\Data\Auth\RegisterUserData;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TeamsSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('team_user')->truncate();
        DB::table('teams')->truncate();
        DB::table('users')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $usersPerMonth = 10;
        $totalMonths = 6;

        for ($monthOffset = 0; $monthOffset < $totalMonths; $monthOffset++) {
            for ($i = 0; $i < $usersPerMonth; $i++) {
                $createdAt = now()->subMonths($monthOffset)->startOfMonth()->addDays($i);

                $user = RegisterUserAndCreateTeam::handle(
                    RegisterUserData::from([
                        'name' => "User_{$monthOffset}_{$i}",
                        'email' => "user_{$monthOffset}_{$i}@test.com",
                        'password' => 'password',
                        'password_confirmation' => 'password',
                    ]),
                    provider: 'seed'
                );

                // Update timestamps
                $user->update([
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ]);

                foreach ($user->teams as $team) {
                    $team->update([
                        'created_at' => $createdAt,
                        'updated_at' => $createdAt,
                    ]);
                }

                DB::table('team_user')
                    ->where('user_id', $user->id)
                    ->update([
                        'created_at' => $createdAt,
                        'updated_at' => $createdAt,
                    ]);
            }
        }
    }
}
