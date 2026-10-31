<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lecture;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SucedAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_students_cannot_access_admin_dashboard(): void
    {
        $student = User::factory()->create(['role' => 'student']);

        $response = $this->actingAs($student)->get(route('admin.dashboard'));

        $response->assertForbidden();
    }

    public function test_students_cannot_access_teacher_dashboard(): void
    {
        $student = User::factory()->create(['role' => 'student']);

        $response = $this->actingAs($student)->get(route('teacher.dashboard'));

        $response->assertForbidden();
    }

    public function test_teachers_cannot_access_admin_dashboard(): void
    {
        $teacher = User::factory()->create(['role' => 'teacher']);

        $response = $this->actingAs($teacher)->get(route('admin.dashboard'));

        $response->assertForbidden();
    }

    public function test_teachers_cannot_manage_unassigned_courses(): void
    {
        $teacher1 = User::factory()->create(['role' => 'teacher']);
        $teacher2 = User::factory()->create(['role' => 'teacher']);

        $course = Course::create([
            'slug' => 'test-course',
            'code' => 'TEST-101',
            'title_en' => 'Test Course EN',
            'title_ar' => 'دورة تجريبية',
            'duration_hours' => 20,
            'is_published' => true,
        ]);

        // Assign only teacher2
        $course->teachers()->attach($teacher2->id, ['role_title_en' => 'Lead Instructor']);

        // Teacher1 tries to manage lectures of course
        $response = $this->actingAs($teacher1)->get(route('teacher.courses.lectures', $course->id));

        $response->assertForbidden();
    }

    public function test_students_cannot_enter_classroom_without_enrollment(): void
    {
        $student = User::factory()->create(['role' => 'student']);

        $course = Course::create([
            'slug' => 'restricted-course',
            'code' => 'REST-101',
            'title_en' => 'Restricted Course EN',
            'title_ar' => 'دورة مقيدة',
            'duration_hours' => 20,
            'is_published' => true,
        ]);

        $lecture = Lecture::create([
            'course_id' => $course->id,
            'title_en' => 'Intro Lecture',
            'title_ar' => 'المحاضرة الأولى',
            'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'position' => 1,
            'is_published' => true,
        ]);

        $response = $this->actingAs($student)->get(route('student.learn', $course->slug));

        $response->assertForbidden();
    }
}
