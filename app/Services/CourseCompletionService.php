<?php

namespace App\Services;

use App\Models\Certificate;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\ExamAttempt;
use App\Models\LectureProgress;
use App\Models\PlatformNotification;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CourseCompletionService
{
    /**
     * Check if a student meets all completion criteria for a course.
     *
     * @return array{completed: bool, reason: string, final_score: float|null, progress_percentage: int}
     */
    public function evaluate(User $student, Course $course): array
    {
        $enrollment = Enrollment::where('user_id', $student->id)
            ->where('course_id', $course->id)
            ->first();

        if (!$enrollment) {
            return [
                'completed' => false,
                'eligible' => false,
                'reason' => 'Student is not enrolled in this course.',
                'final_score' => null,
                'progress_percentage' => 0,
            ];
        }

        // 1. Check all published lectures
        $totalLectures = $course->lectures()->where('is_published', true)->count();
        $completedLectures = 0;

        if ($totalLectures > 0) {
            $completedLectures = LectureProgress::where('user_id', $student->id)
                ->whereIn('lecture_id', $course->lectures()->where('is_published', true)->pluck('id'))
                ->where('completed', true)
                ->count();
        }

        $lectureProgressPercent = $totalLectures > 0 ? (int) round(($completedLectures / $totalLectures) * 100) : 100;

        if ($completedLectures < $totalLectures) {
            return [
                'completed' => false,
                'eligible' => false,
                'reason' => "You have completed {$completedLectures} of {$totalLectures} lectures.",
                'final_score' => null,
                'progress_percentage' => $lectureProgressPercent,
            ];
        }

        // 2. Check final examination
        $finalExam = $course->exams()->where('is_final', true)->where('is_published', true)->first();

        if ($finalExam) {
            $bestAttempt = ExamAttempt::where('exam_id', $finalExam->id)
                ->where('user_id', $student->id)
                ->where('passed', true)
                ->orderBy('percentage', 'desc')
                ->first();

            if (!$bestAttempt) {
                return [
                    'completed' => false,
                    'eligible' => false,
                    'reason' => 'You must take and pass the final examination with at least ' . $finalExam->passing_score . '%.',
                    'final_score' => null,
                    'progress_percentage' => 90, // finished lectures, pending exam
                ];
            }

            $finalScore = (float) $bestAttempt->percentage;
        } else {
            $finalScore = 100.0;
        }

        return [
            'completed' => true,
            'eligible' => true,
            'reason' => 'All lectures completed and final exam passed successfully.',
            'final_score' => $finalScore,
            'progress_percentage' => 100,
        ];
    }

    /**
     * Alias for checkAndComplete
     */
    public function awardCertificateIfEligible(User $student, Course $course): ?Certificate
    {
        return $this->checkAndComplete($student, $course);
    }

    /**
     * Process completion and issue certificate if eligible.
     */
    public function checkAndComplete(User $student, Course $course): ?Certificate
    {
        return DB::transaction(function () use ($student, $course) {
            $evaluation = $this->evaluate($student, $course);

            if (!$evaluation['completed']) {
                return null;
            }

            // Update enrollment status
            $enrollment = Enrollment::where('user_id', $student->id)
                ->where('course_id', $course->id)
                ->first();

            if ($enrollment && $enrollment->status !== 'completed') {
                $enrollment->update([
                    'status' => 'completed',
                    'completed_at' => now(),
                ]);
            }

            // Check if certificate already exists
            $existingCertificate = Certificate::where('user_id', $student->id)
                ->where('course_id', $course->id)
                ->first();

            if ($existingCertificate) {
                return $existingCertificate;
            }

            // Issue new certificate
            $certificate = Certificate::create([
                'public_code' => (string) Str::uuid(),
                'certificate_number' => sprintf('SUCED-%s-%s-%s', date('Y'), $course->code ?: 'CERT', strtoupper(Str::random(6))),
                'user_id' => $student->id,
                'course_id' => $course->id,
                'student_name' => $student->name,
                'course_title_en' => $course->title_en,
                'course_title_ar' => $course->title_ar,
                'score_percentage' => $evaluation['final_score'] ?? 100.0,
                'issue_date' => now()->toDateString(),
                'template_version' => 'v1',
            ]);

            // Create notification for student
            PlatformNotification::create([
                'user_id' => $student->id,
                'type' => 'certificate',
                'title_en' => 'Certificate Awarded!',
                'title_ar' => 'تهانينا! تم إصدار شهادة إتمام المقرر',
                'message_en' => "Congratulations! You have completed '{$course->title_en}' and earned your verified completion certificate.",
                'message_ar' => "تهانينا! لقد أتممت بنجاح مقرر '{$course->title_ar}' واستحققت شهادة الإتمام المعتمدة.",
                'action_url' => route('student.certificates'),
            ]);

            return $certificate;
        });
    }
}
