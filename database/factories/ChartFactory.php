<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Chart>
 */
class ChartFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = $this->faker->randomElement(['LineChart', 'BarChart', 'AreaChart']);
        $colors = ['#8884d8', '#82ca9d', '#ffc658'];
        return [
            'uuid' => $this->faker->uuid(),
            'title' => $this->faker->sentence(3),
            'type' => $type,
            'config' => [
                'type' => $type,
                'width' => $this->faker->numberBetween(400, 800),
                'height' => $this->faker->numberBetween(300, 600),
                'margin' => [
                    'top' => 5,
                    'right' => 30,
                    'left' => 20,
                    'bottom' => 5,
                ],
                'xAxis' => ['dataKey' => 'x'],
                'yAxis' => [],
                'tooltip' => true,
                'legend' => true,
                'dataKey' => 'y',
                'lineProps' => [
                    'type' => 'monotone',
                    'dataKey' => 'y',
                    'stroke' => $this->faker->randomElement($colors),
                    'activeDot' => ['r' => 8],
                ],
            ],
            'data' => [[
                'x' => $this->faker->numberBetween(1, 10),
                'y' => $this->faker->numberBetween(1, 100)
            ]],
            'embed_settings' => ['responsive' => true],
        ];
    }
}
