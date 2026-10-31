<?php

namespace Database\Factories;

use App\Models\Course;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Course>
 */
class CourseFactory extends Factory
{
    protected $model = Course::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->sentence(3);

        return [
            'slug' => Str::slug($title) . '-' . fake()->unique()->randomNumber(4),
            'code' => 'CRS-' . fake()->unique()->randomNumber(3),
            'title_en' => $title,
            'title_ar' => 'مقرر ' . fake()->word(),
            'description_en' => fake()->paragraph(),
            'description_ar' => fake()->paragraph(),
            'thumbnail' => '/images/stitch/campus_architecture_hero.png',
            'department' => fake()->randomElement(['technology', 'business', 'healthcare', 'management']),
            'duration_weeks' => fake()->numberBetween(4, 16),
            'duration_hours' => fake()->numberBetween(10, 60),
            'passing_score' => 70,
            'is_published' => true,
        ];
    }
}
