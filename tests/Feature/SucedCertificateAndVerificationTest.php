<?php

namespace Tests\Feature;

use App\Models\Certificate;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\Lecture;
use App\Models\LectureProgress;
use App\Models\User;
use App\Services\CourseCompletionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class SucedCertificateAndVerificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_certificate_verification_valid_status(): void
    {
        $user = User::factory()->create(['name' => 'Sara Ali']);
        $course = Course::create([
            'slug' => 'pmp-course',
            'code' => 'PMP-101',
            'title_en' => 'Project Management Professional',
            'title_ar' => 'إدارة المشاريع الاحترافية',
            'duration_hours' => 35,
            'is_published' => true,
        ]);

        $cert = Certificate::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'certificate_number' => 'SUCED-2025-PMP-9999',
            'public_code' => (string) Str::uuid(),
            'student_name' => 'Sara Ali',
            'course_title_en' => 'Project Management Professional',
            'course_title_ar' => 'إدارة المشاريع الاحترافية',
            'issue_date' => now()->toDateString(),
            'score_percentage' => 92.5,
            'is_revoked' => false,
        ]);

        $response = $this->get(route('verify.show', $cert->public_code));
        $response->assertOk();

        // Also query by certificate_number
        $responseByNumber = $this->get(route('verify.show', ['query' => 'SUCED-2025-PMP-9999']));
        $responseByNumber->assertOk();
    }

    public function test_public_certificate_verification_revoked_status(): void
    {
        $user = User::factory()->create(['name' => 'Audit Candidate']);
        $course = Course::create([
            'slug' => 'revoked-course',
            'code' => 'REV-101',
            'title_en' => 'Course Title',
            'title_ar' => 'عنوان الدورة',
            'duration_hours' => 10,
            'is_published' => true,
        ]);

        $cert = Certificate::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'certificate_number' => 'SUCED-2025-REV-0001',
            'public_code' => (string) Str::uuid(),
            'student_name' => 'Audit Candidate',
            'course_title_en' => 'Course Title',
            'course_title_ar' => 'عنوان الدورة',
            'issue_date' => now()->toDateString(),
            'score_percentage' => 80.0,
            'is_revoked' => true,
            'revocation_reason' => 'Administrative discrepancy in submitted credentials.',
        ]);

        $response = $this->get(route('verify.show', $cert->public_code));
        $response->assertOk();
    }

    public function test_course_completion_service_evaluates_and_awards_certificate_safely(): void
    {
        $student = User::factory()->create(['name' => 'Mohamed Tarek', 'role' => 'student']);
        $course = Course::create([
            'slug' => 'web-dev-course',
            'code' => 'WEB-201',
            'title_en' => 'Web Development Diploma',
            'title_ar' => 'دبلومة تطوير الويب',
            'duration_hours' => 40,
            'is_published' => true,
        ]);

        // 1. Enroll
        Enrollment::create([
            'user_id' => $student->id,
            'course_id' => $course->id,
            'status' => 'enrolled',
            'enrolled_at' => now(),
        ]);

        // 2. Create 2 lectures
        $lec1 = Lecture::create([
            'course_id' => $course->id,
            'title_en' => 'Lec 1',
            'title_ar' => 'محاضرة 1',
            'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'position' => 1,
            'is_published' => true,
        ]);

        $lec2 = Lecture::create([
            'course_id' => $course->id,
            'title_en' => 'Lec 2',
            'title_ar' => 'محاضرة 2',
            'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'position' => 2,
            'is_published' => true,
        ]);

        // 3. Create Final Exam
        $exam = Exam::create([
            'course_id' => $course->id,
            'title_en' => 'Final Exam',
            'title_ar' => 'الامتحان النهائي',
            'duration_minutes' => 60,
            'passing_score' => 70,
            'max_attempts' => 3,
            'is_final' => true,
            'is_published' => true,
        ]);

        $completionService = app(CourseCompletionService::class);

        // First check: Incomplete lectures, exam not taken
        $eval1 = $completionService->evaluate($student, $course);
        $this->assertFalse($eval1['eligible']);

        // Complete both lectures
        LectureProgress::create([
            'user_id' => $student->id,
            'lecture_id' => $lec1->id,
            'completed' => true,
            'completed_at' => now(),
        ]);
        LectureProgress::create([
            'user_id' => $student->id,
            'lecture_id' => $lec2->id,
            'completed' => true,
            'completed_at' => now(),
        ]);

        // Second check: Lectures complete, but final exam not passed
        $eval2 = $completionService->evaluate($student, $course);
        $this->assertFalse($eval2['eligible']);

        // Pass final exam with 85%
        ExamAttempt::create([
            'user_id' => $student->id,
            'exam_id' => $exam->id,
            'attempt_number' => 1,
            'status' => 'completed',
            'started_at' => now()->subMinutes(20),
            'expires_at' => now()->addMinutes(40),
            'submitted_at' => now(),
            'score' => 85,
            'max_score' => 100,
            'percentage' => 85.0,
            'passed' => true,
        ]);

        // Third check: Eligible!
        $eval3 = $completionService->evaluate($student, $course);
        $this->assertTrue($eval3['eligible']);

        // Issue Certificate
        $cert = $completionService->awardCertificateIfEligible($student, $course);
        $this->assertNotNull($cert);
        $this->assertEquals('Mohamed Tarek', $cert->student_name);
        $this->assertEquals(85.0, (float) $cert->score_percentage);

        // Re-running issuance must be idempotent (duplicate prevention)
        $certAgain = $completionService->awardCertificateIfEligible($student, $course);
        $this->assertEquals($cert->id, $certAgain->id);
        $this->assertEquals(1, Certificate::where('user_id', $student->id)->where('course_id', $course->id)->count());
    }

    public function test_authorized_student_can_download_certificate_pdf(): void
    {
        $student = User::factory()->create(['name' => 'Adel Imam', 'role' => 'student']);
        $otherStudent = User::factory()->create(['name' => 'Stranger', 'role' => 'student']);
        $admin = User::factory()->create(['role' => 'admin']);

        $course = Course::create([
            'slug' => 'pdf-course',
            'code' => 'PDF-101',
            'title_en' => 'PDF Course EN',
            'title_ar' => 'دورة ملفات PDF',
            'duration_hours' => 20,
            'is_published' => true,
        ]);

        $cert = Certificate::create([
            'user_id' => $student->id,
            'course_id' => $course->id,
            'certificate_number' => 'SUCED-2025-PDF-1111',
            'public_code' => (string) Str::uuid(),
            'student_name' => 'Adel Imam',
            'course_title_en' => 'PDF Course EN',
            'course_title_ar' => 'دورة ملفات PDF',
            'issue_date' => now()->toDateString(),
            'score_percentage' => 95.0,
            'is_revoked' => false,
        ]);

        // Student downloads own certificate PDF
        $response = $this->actingAs($student)->get(route('certificates.download', $cert->id));
        $response->assertOk();
        $this->assertEquals('application/pdf', $response->headers->get('content-type'));

        // Admin can download it
        $responseAdmin = $this->actingAs($admin)->get(route('certificates.download', $cert->id));
        $responseAdmin->assertOk();

        // Stranger student cannot download it (forbidden)
        $responseOther = $this->actingAs($otherStudent)->get(route('certificates.download', $cert->id));
        $responseOther->assertForbidden();
    }

    public function test_student_can_download_certificate_pdf_in_pure_arabic_or_english(): void
    {
        $student = User::factory()->create(['name' => 'Sara Ali', 'role' => 'student']);
        $course = Course::create([
            'slug' => 'bilingual-course',
            'code' => 'BIL-101',
            'title_en' => 'Bilingual Course EN',
            'title_ar' => 'دورة اللغات العربية',
            'duration_hours' => 15,
            'is_published' => true,
        ]);

        $cert = Certificate::create([
            'user_id' => $student->id,
            'course_id' => $course->id,
            'certificate_number' => 'SUCED-2025-BIL-2222',
            'public_code' => (string) Str::uuid(),
            'student_name' => 'Sara Ali',
            'course_title_en' => 'Bilingual Course EN',
            'course_title_ar' => 'دورة اللغات العربية',
            'issue_date' => now()->toDateString(),
            'score_percentage' => 98.0,
            'is_revoked' => false,
        ]);

        // Download Arabic-only PDF
        $responseAr = $this->actingAs($student)->get(route('certificates.download', ['certificate' => $cert->id, 'lang' => 'ar']));
        $responseAr->assertOk();
        $this->assertEquals('application/pdf', $responseAr->headers->get('content-type'));
        $this->assertStringContainsString('SUCED_Certificate_SUCED-2025-BIL-2222_AR.pdf', $responseAr->headers->get('content-disposition'));

        // Download English-only PDF
        $responseEn = $this->actingAs($student)->get(route('certificates.download', ['certificate' => $cert->id, 'lang' => 'en']));
        $responseEn->assertOk();
        $this->assertEquals('application/pdf', $responseEn->headers->get('content-type'));
        $this->assertStringContainsString('SUCED_Certificate_SUCED-2025-BIL-2222_EN.pdf', $responseEn->headers->get('content-disposition'));
    }

    public function test_admin_can_preview_course_certificate_pdf_in_arabic_and_english(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $course = Course::create([
            'slug' => 'preview-course',
            'code' => 'PRV-101',
            'title_en' => 'Preview Design Course',
            'title_ar' => 'دورة تصميم الشهادة',
            'duration_hours' => 20,
            'is_published' => true,
        ]);

        // Admin previews Arabic PDF
        $responseAr = $this->actingAs($admin)->get(route('admin.courses.certificate-preview', [
            'course' => $course->id,
            'lang' => 'ar',
            'theme' => 'emerald_heritage',
        ]));
        $responseAr->assertOk();
        $this->assertEquals('application/pdf', $responseAr->headers->get('content-type'));

        // Admin previews English PDF
        $responseEn = $this->actingAs($admin)->get(route('admin.courses.certificate-preview', [
            'course' => $course->id,
            'lang' => 'en',
            'theme' => 'royal_gold',
        ]));
        $responseEn->assertOk();
        $this->assertEquals('application/pdf', $responseEn->headers->get('content-type'));
    }
}
