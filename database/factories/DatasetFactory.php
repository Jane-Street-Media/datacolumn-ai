<?php

namespace Database\Factories;

use App\DatasetSource;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Dataset>
 */
class DatasetFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Simple dummy columns and data
        $fields = [$this->faker->word(), $this->faker->word()];

        return [
            'name' => $this->faker->word(),
            'columns' => collect($fields)->map(fn ($f) => ['field' => $f])->toArray(),
            'data' => [array_combine($fields, array_map(fn () => $this->faker->word(), $fields))],
            'source' => DatasetSource::MANUAL_ENTRY,
        ];
    }
}
