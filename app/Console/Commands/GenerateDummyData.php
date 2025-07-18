<?php

namespace App\Console\Commands;

use App\Models\Chart;
use App\Models\Dataset;
use App\Models\Folder;
use App\Models\Project;
use App\Models\Team;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Symfony\Component\Console\Command\Command as CommandAlias;

class GenerateDummyData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dummy:generate {user_id : ID of the user to generate data for}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Populate dummy Teams, Folders, Projects, Datasets, and Charts for a given user';

    public function handle(): ?int
    {
        $user = User::find($this->argument('user_id'));
        if (! $user) {
            $this->error('User not found.');

            return 0;
        }

        DB::transaction(function () use ($user) {
            // 1. Teams & team_user memberships
            $this->info('Creating teams...');
            $teams = Team::factory()
                ->count(2)
                ->create(['user_id' => $user->id]);

            $user->current_team_id = $teams->first()->id;
            $user->save();
            foreach ($teams as $team) {
                setPermissionsTeamId($team->id);
                // Attach auth user + 3 dummy users
                $team->users()->attach($user->id);
                $user->assignRole('owner');
                $dummyUsers = User::factory()->count(7)->create([
                    'current_team_id' => $team->id,
                ]);
                foreach ($dummyUsers as $du) {
                    $team->users()->attach($du->id);
                    $user->assignRole('member');
                }

                // 2. Folders
                $this->info('Creating folders...');
                $folders = collect();
                for ($i = 0; $i < 3; $i++) {
                    $folders->push(
                        Folder::factory()->create([
                            'user_id' => $user->id,
                            'team_id' => $team->id,
                        ])
                    );
                }

                // 3. Projects, Datasets & Charts
                $this->info('Creating projects, datasets, and charts...');
                foreach ($folders as $folder) {
                    $projects = Project::factory()
                        ->count(7)
                        ->create([
                            'user_id' => $user->id,
                            'team_id' => $team->id,
                            'folder_id' => $folder->id,
                        ]);

                    foreach ($projects as $project) {
                        // Datasets (2 per project)
                        Dataset::factory()
                            ->count(7)
                            ->create([
                                'user_id' => $user->id,
                                'team_id' => $team->id,
                                'project_id' => $project->id,
                            ]);

                        // Charts (2 per project)
                        Chart::factory()
                            ->count(7)
                            ->create([
                                'user_id' => $user->id,
                                'team_id' => $team->id,
                                'project_id' => $project->id,
                            ]);
                    }
                }
            }
        });

        $this->info('Dummy data generation complete!');

        return CommandAlias::SUCCESS;
    }
}
