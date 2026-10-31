<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Exam;
use App\Models\Question;
use App\Models\QuestionOption;
use App\Models\User;
use App\Services\ExamService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SucedCourseAndExamTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_can_view_course_catalog_and_details(): void
    {
        $course = Course::create([
            'slug' => 'public-course',
            'code' => 'PUB-101',
            'title_en' => 'Public Course EN',
            'title_ar' => 'دورة عامة',
            'description_en' => 'Description in English',
            'description_ar' => 'وصف بالعربية',
            'duration_hours' => 25,
            'is_published' => true,
        ]);

        $response = $this->get(route('courses.index'));
        $response->assertOk();

        $responseDetails = $this->get(route('courses.show', $course->slug));
        $responseDetails->assertOk();
    }

    public function test_student_can_enroll_and_duplicate_enrollment_is_prevented(): void
    {
        $student = User::factory()->create(['role' => 'student']);

        $course = Course::create([
            'slug' => 'enrollable-course',
            'code' => 'ENR-101',
            'title_en' => 'Enrollable Course',
            'title_ar' => 'دورة قابلة للتسجيل',
            'duration_hours' => 15,
            'is_published' => true,
        ]);

        // First enrollment
        $response = $this->actingAs($student)->post(route('courses.enroll', $course->id));
        $response->assertRedirect(route('student.learn', $course->slug));

        $this->assertDatabaseHas('enrollments', [
            'user_id' => $student->id,
            'course_id' => $course->id,
            'status' => 'enrolled',
        ]);

        // Second enrollment attempt - should redirect back with flash message without creating duplicate
        $responseSecond = $this->actingAs($student)->post(route('courses.enroll', $course->id));
        $responseSecond->assertRedirect();

        $this->assertEquals(1, Enrollment::where('user_id', $student->id)->where('course_id', $course->id)->count());
    }

    public function test_exam_service_calculates_server_side_scores_correctly(): void
    {
        $student = User::factory()->create(['role' => 'student']);

        $course = Course::create([
            'slug' => 'exam-course',
            'code' => 'EXAM-101',
            'title_en' => 'Exam Course',
            'title_ar' => 'دورة اختبارية',
            'duration_hours' => 10,
            'is_published' => true,
        ]);

        // Enroll student
        Enrollment::create([
            'user_id' => $student->id,
            'course_id' => $course->id,
            'status' => 'enrolled',
            'enrolled_at' => now(),
        ]);

        $exam = Exam::create([
            'course_id' => $course->id,
            'title_en' => 'AI Test Exam',
            'title_ar' => 'اختبار الذكاء الاصطناعي',
            'duration_minutes' => 30,
            'passing_score' => 70,
            'max_attempts' => 3,
            'is_published' => true,
        ]);

        // Question 1: MCQ with 4 options (correct is opt1)
        $q1 = Question::create([
            'exam_id' => $exam->id,
            'question_text_en' => 'What is 2 + 2?',
            'question_text_ar' => 'ما هو ناتج 2 + 2؟',
            'question_type' => 'multiple_choice',
            'points' => 10,
            'position' => 1,
        ]);

        $opt1 = QuestionOption::create([
            'question_id' => $q1->id,
            'option_text_en' => '4',
            'option_text_ar' => '4',
            'is_correct' => true,
            'position' => 1,
        ]);

        $opt2 = QuestionOption::create([
            'question_id' => $q1->id,
            'option_text_en' => '5',
            'option_text_ar' => '5',
            'is_correct' => false,
            'position' => 2,
        ]);

        // Question 2: True/False (correct is optTrue)
        $q2 = Question::create([
            'exam_id' => $exam->id,
            'question_text_en' => 'Is Earth round?',
            'question_text_ar' => 'هل الأرض كروية؟',
            'question_type' => 'true_false',
            'points' => 10,
            'position' => 2,
        ]);

        $optTrue = QuestionOption::create([
            'question_id' => $q2->id,
            'option_text_en' => 'True',
            'option_text_ar' => 'صواب',
            'is_correct' => true,
            'position' => 1,
        ]);

        $optFalse = QuestionOption::create([
            'question_id' => $q2->id,
            'option_text_en' => 'False',
            'option_text_ar' => 'خطأ',
            'is_correct' => false,
            'position' => 2,
        ]);

        $examService = app(ExamService::class);

        // Start attempt
        $attempt = $examService->startAttempt($student, $exam);
        $this->assertEquals(1, $attempt->attempt_number);

        // Submit both correct answers (100%)
        $attempt = $examService->submitAttempt($attempt, [
            $q1->id => $opt1->id,
            $q2->id => $optTrue->id,
        ]);

        $this->assertEquals(20, $attempt->score);
        $this->assertEquals(20, $attempt->max_score);
        $this->assertEquals(100.0, (float) $attempt->percentage);
        $this->assertTrue((bool) $attempt->passed);
    }
}
