<?php

namespace Database\Factories;

use App\Enums\ChartStatus;
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
        $type = $this->faker->randomElement(['line', 'bar', 'area']);
        $colors = ['#8884d8', '#82ca9d', '#ffc658'];

        return [
            'uuid' => $this->faker->uuid(),
            'title' => $this->faker->sentence(3),
            'type' => $type,
            'config' => [
                'type' => $type,
                'width' => $this->faker->numberBetween(400, 800),
                'height' => $this->faker->numberBetween(300, 600),
                'xAxis' => 'month',
                'yAxis' => '',
                'series' => [
                    ['chartType' => $type, 'type' => 'monotone', 'dataKey' => 'Apples', 'fill' => '#fc59a3', 'stroke' => '#fc59a3'],
                    ['chartType' => $type, 'type' => 'monotone', 'dataKey' => 'Oranges', 'fill' => '#87c830', 'stroke' => '#87c830'],
                    ['chartType' => $type, 'type' => 'monotone', 'dataKey' => 'Bananas', 'fill' => '#ffd400', 'stroke' => '#ffd400'],
                ],
                'grid' => [
                    // draw vertical grid lines
                    'vertical' => true,
                    // draw horizontal grid lines
                    'horizontal' => true,
                    // line color
                    'stroke' => '#e0e0e0',
                    // dash 'pattern' => "length spacing"
                    'strokeDasharray' => '3 3',
                    // fill background banding (requires `horizontal` or `vertical` false to see through)
                    'fill' => '#fafafa',
                    // grid line thickness
                    'strokeWidth' => 1,
                ],
                'showGrid' => true,
                'tooltip' => [],
                'legend' => ['verticalAlign' => 'top'],
                'colors' => $colors,
            ],
            'data' => [
                ['month' => 'Jan', 'Apples' => 400, 'Oranges' => 240, 'Bananas' => 240],
                ['month' => 'Feb', 'Apples' => 300, 'Oranges' => 139, 'Bananas' => 221],
                ['month' => 'Mar', 'Apples' => 200, 'Oranges' => 980, 'Bananas' => 229],
                ['month' => 'Apr', 'Apples' => 278, 'Oranges' => 390, 'Bananas' => 200],
            ],
            'embed_settings' => ['responsive' => true],
            'status' => ChartStatus::ACTIVE,
        ];
    }
}
