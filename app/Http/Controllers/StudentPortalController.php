<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\Lecture;
use App\Models\LectureProgress;
use App\Models\PlatformNotification;
use App\Services\CourseCompletionService;
use App\Services\ExamService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentPortalController extends Controller
{
    public function __construct(
        protected ExamService $examService,
        protected CourseCompletionService $courseCompletionService
    ) {}

    /**
     * Display student portal dashboard.
     */
    public function dashboard(Request $request): Response
    {
        $user = $request->user();

        // 1. Metric Counts
        $enrolledCount = Enrollment::where('user_id', $user->id)->count();
        $completedCount = Enrollment::where('user_id', $user->id)->where('status', 'completed')->count();
        $passedExamsCount = ExamAttempt::where('user_id', $user->id)->where('passed', true)->distinct('exam_id')->count('exam_id');
        $certificatesCount = Certificate::where('user_id', $user->id)->where('is_revoked', false)->count();

        // 2. Continue Learning Courses with calculated progress
        $enrolledCourses = Enrollment::with(['course.lectures' => function ($q) {
            $q->where('is_published', true)->orderBy('position');
        }, 'course.teachers'])
            ->where('user_id', $user->id)
            ->where('status', 'enrolled')
            ->latest('enrolled_at')
            ->get()
            ->map(function ($enrollment) use ($user) {
                $course = $enrollment->course;
                $lectures = $course->lectures;
                $totalLectures = $lectures->count();

                $completedLectureIds = LectureProgress::where('user_id', $user->id)
                    ->whereIn('lecture_id', $lectures->pluck('id'))
                    ->where('completed', true)
                    ->pluck('lecture_id')
                    ->toArray();

                $completedCount = count($completedLectureIds);
                $progressPercent = $totalLectures > 0 ? (int) round(($completedCount / $totalLectures) * 100) : 0;

                // Find next lecture or last watched
                $nextLecture = $lectures->first(fn($l) => !in_array($l->id, $completedLectureIds)) ?: $lectures->first();

                return [
                    'id' => $course->id,
                    'slug' => $course->slug,
                    'code' => $course->code,
                    'title_en' => $course->title_en,
                    'title_ar' => $course->title_ar,
                    'thumbnail' => $course->thumbnail,
                    'total_lectures' => $totalLectures,
                    'completed_lectures' => $completedCount,
                    'progress_percentage' => $progressPercent,
                    'lead_teacher' => $course->teachers->first()?->name,
                    'next_lecture' => $nextLecture ? [
                        'id' => $nextLecture->id,
                        'position' => $nextLecture->position,
                        'title_en' => $nextLecture->title_en,
                        'title_ar' => $nextLecture->title_ar,
                    ] : null,
                ];
            });

        // 3. Upcoming & Available Assessments for Enrolled Courses
        $enrolledCourseIds = Enrollment::where('user_id', $user->id)->pluck('course_id');
        $exams = Exam::with(['course'])
            ->whereIn('course_id', $enrolledCourseIds)
            ->where('is_published', true)
            ->get()
            ->map(function ($exam) use ($user) {
                $attempts = $exam->attemptsForUser($user->id)->get();
                $bestAttempt = $attempts->firstWhere('passed', true) ?: $attempts->first();
                $remainingAttempts = max(0, $exam->max_attempts - $attempts->count());

                $status = 'available';
                if ($bestAttempt && $bestAttempt->passed) {
                    $status = 'passed';
                } elseif ($remainingAttempts <= 0) {
                    $status = 'no_attempts_left';
                }

                return [
                    'id' => $exam->id,
                    'title_en' => $exam->title_en,
                    'title_ar' => $exam->title_ar,
                    'course_title_en' => $exam->course->title_en,
                    'course_title_ar' => $exam->course->title_ar,
                    'course_slug' => $exam->course->slug,
                    'duration_minutes' => $exam->duration_minutes,
                    'passing_score' => $exam->passing_score,
                    'max_attempts' => $exam->max_attempts,
                    'remaining_attempts' => $remainingAttempts,
                    'best_score' => $bestAttempt ? (float) $bestAttempt->percentage : null,
                    'status' => $status,
                ];
            });

        // 4. Earned Certificates
        $certificates = Certificate::with('course')
            ->where('user_id', $user->id)
            ->latest('issue_date')
            ->get()
            ->map(function ($cert) {
                return [
                    'id' => $cert->id,
                    'public_code' => $cert->public_code,
                    'certificate_number' => $cert->certificate_number,
                    'course_title_en' => $cert->course_title_en,
                    'course_title_ar' => $cert->course_title_ar,
                    'score_percentage' => (float) $cert->score_percentage,
                    'issue_date' => $cert->issue_date->format('Y-m-d'),
                    'is_revoked' => $cert->is_revoked,
                ];
            });

        // 5. Recent Activity Feed
        $recentLectures = LectureProgress::with(['lecture.course'])
            ->where('user_id', $user->id)
            ->latest('completed_at')
            ->take(3)
            ->get()
            ->map(fn($p) => [
                'type' => 'lecture',
                'title_en' => "Completed Lecture {$p->lecture->position}: {$p->lecture->title_en}",
                'title_ar' => "تم إنهاء محاضرة {$p->lecture->position}: {$p->lecture->title_ar}",
                'course' => $p->lecture->course->title_en,
                'time' => $p->completed_at?->diffForHumans() ?? 'Recently',
            ]);

        $recentExams = ExamAttempt::with(['exam.course'])
            ->where('user_id', $user->id)
            ->where('status', 'completed')
            ->latest('submitted_at')
            ->take(3)
            ->get()
            ->map(fn($a) => [
                'type' => 'exam',
                'title_en' => ($a->passed ? 'Passed ' : 'Took ') . "{$a->exam->title_en} ({$a->percentage}%)",
                'title_ar' => ($a->passed ? 'اجتاز ' : 'أجرى ') . "{$a->exam->title_ar} ({$a->percentage}%)",
                'course' => $a->exam->course->title_en,
                'time' => $a->submitted_at?->diffForHumans() ?? 'Recently',
            ]);

        $recentActivity = $recentLectures->concat($recentExams)->take(5);

        return Inertia::render('student/dashboard', [
            'metrics' => [
                'enrolled_courses' => $enrolledCount,
                'completed_courses' => $completedCount,
                'exams_passed' => $passedExamsCount,
                'certificates_earned' => $certificatesCount,
            ],
            'enrolledCourses' => $enrolledCourses,
            'exams' => $exams,
            'certificates' => $certificates,
            'recentActivity' => $recentActivity,
        ]);
    }

    /**
     * Student's enrolled courses list.
     */
    public function courses(Request $request): Response
    {
        $user = $request->user();

        $enrollments = Enrollment::with(['course.lectures', 'course.teachers'])
            ->where('user_id', $user->id)
            ->latest('enrolled_at')
            ->paginate(9);

        return Inertia::render('student/courses', [
            'enrollments' => $enrollments,
        ]);
    }

    /**
     * Learning classroom / video viewing interface.
     */
    public function learn(Request $request, Course $course, ?Lecture $lecture = null): Response
    {
        $user = $request->user();

        // Check enrollment
        $isEnrolled = Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->exists();

        if (!$isEnrolled && !$user->isAdmin()) {
            abort(403, 'You are not enrolled in this course.');
        }

        $lectures = $course->lectures()->where('is_published', true)->orderBy('position')->get();

        if ($lectures->isEmpty()) {
            abort(404, 'No lectures available for this course yet.');
        }

        // Selected lecture or default to first
        $activeLecture = $lecture && $lecture->course_id === $course->id ? $lecture : $lectures->first();

        // Get completed lecture IDs for this student
        $completedLectureIds = LectureProgress::where('user_id', $user->id)
            ->whereIn('lecture_id', $lectures->pluck('id'))
            ->where('completed', true)
            ->pluck('lecture_id')
            ->toArray();

        // Previous and Next lecture navigation
        $currentIndex = $lectures->search(fn($l) => $l->id === $activeLecture->id);
        $prevLecture = $currentIndex > 0 ? $lectures[$currentIndex - 1] : null;
        $nextLecture = $currentIndex < ($lectures->count() - 1) ? $lectures[$currentIndex + 1] : null;

        // Check course final exam
        $finalExam = $course->exams()->where('is_final', true)->where('is_published', true)->first();
        $hasPassedFinalExam = $finalExam ? $finalExam->hasUserPassed($user->id) : false;

        // Completion evaluation
        $evaluation = $this->courseCompletionService->evaluate($user, $course);
        $certificate = Certificate::where('user_id', $user->id)->where('course_id', $course->id)->first();

        return Inertia::render('student/learn', [
            'course' => [
                'id' => $course->id,
                'slug' => $course->slug,
                'code' => $course->code,
                'title_en' => $course->title_en,
                'title_ar' => $course->title_ar,
                'description_en' => $course->description_en,
                'description_ar' => $course->description_ar,
            ],
            'lectures' => $lectures->map(fn($l) => [
                'id' => $l->id,
                'position' => $l->position,
                'title_en' => $l->title_en,
                'title_ar' => $l->title_ar,
                'duration_minutes' => $l->duration_minutes,
                'is_completed' => in_array($l->id, $completedLectureIds),
            ]),
            'activeLecture' => [
                'id' => $activeLecture->id,
                'position' => $activeLecture->position,
                'title_en' => $activeLecture->title_en,
                'title_ar' => $activeLecture->title_ar,
                'description_en' => $activeLecture->description_en,
                'description_ar' => $activeLecture->description_ar,
                'youtube_url' => $activeLecture->youtube_url,
                'embed_url' => $activeLecture->embed_url,
                'resource_path' => $activeLecture->resource_path,
                'duration_minutes' => $activeLecture->duration_minutes,
                'is_completed' => in_array($activeLecture->id, $completedLectureIds),
            ],
            'prevLectureSlug' => $prevLecture ? $prevLecture->id : null,
            'nextLectureSlug' => $nextLecture ? $nextLecture->id : null,
            'finalExam' => $finalExam ? [
                'id' => $finalExam->id,
                'title_en' => $finalExam->title_en,
                'title_ar' => $finalExam->title_ar,
                'duration_minutes' => $finalExam->duration_minutes,
                'passing_score' => $finalExam->passing_score,
                'has_passed' => $hasPassedFinalExam,
            ] : null,
            'evaluation' => $evaluation,
            'certificate' => $certificate ? [
                'certificate_number' => $certificate->certificate_number,
                'public_code' => $certificate->public_code,
            ] : null,
        ]);
    }

    /**
     * Toggle lecture completion status.
     */
    public function toggleLectureComplete(Request $request, Lecture $lecture): RedirectResponse
    {
        $user = $request->user();

        // Check enrollment
        $isEnrolled = Enrollment::where('user_id', $user->id)
            ->where('course_id', $lecture->course_id)
            ->exists();

        if (!$isEnrolled) {
            abort(403, 'You must be enrolled to mark lectures complete.');
        }

        $progress = LectureProgress::where('user_id', $user->id)
            ->where('lecture_id', $lecture->id)
            ->first();

        if ($progress) {
            $progress->update([
                'completed' => !$progress->completed,
                'completed_at' => !$progress->completed ? now() : null,
            ]);
        } else {
            LectureProgress::create([
                'user_id' => $user->id,
                'lecture_id' => $lecture->id,
                'completed' => true,
                'completed_at' => now(),
            ]);
        }

        // Check if course is now fully completed
        $this->courseCompletionService->checkAndComplete($user, $lecture->course);

        return back()->with('success', 'Progress updated.');
    }

    /**
     * Student exams list.
     */
    public function exams(Request $request): Response
    {
        $user = $request->user();
        $enrolledCourseIds = Enrollment::where('user_id', $user->id)->pluck('course_id');

        $exams = Exam::with(['course'])
            ->whereIn('course_id', $enrolledCourseIds)
            ->where('is_published', true)
            ->get()
            ->map(function ($exam) use ($user) {
                $attempts = $exam->attemptsForUser($user->id)->get();
                $bestAttempt = $attempts->firstWhere('passed', true) ?: $attempts->first();
                $remaining = max(0, $exam->max_attempts - $attempts->count());

                return [
                    'id' => $exam->id,
                    'title_en' => $exam->title_en,
                    'title_ar' => $exam->title_ar,
                    'course_title_en' => $exam->course->title_en,
                    'course_title_ar' => $exam->course->title_ar,
                    'duration_minutes' => $exam->duration_minutes,
                    'passing_score' => $exam->passing_score,
                    'max_attempts' => $exam->max_attempts,
                    'remaining_attempts' => $remaining,
                    'best_score' => $bestAttempt ? (float) $bestAttempt->percentage : null,
                    'passed' => $bestAttempt ? (bool) $bestAttempt->passed : false,
                    'attempts' => $attempts->map(fn($a) => [
                        'id' => $a->id,
                        'attempt_number' => $a->attempt_number,
                        'score' => (float) $a->score,
                        'max_score' => (float) $a->max_score,
                        'percentage' => (float) $a->percentage,
                        'passed' => $a->passed,
                        'status' => $a->status,
                        'submitted_at' => $a->submitted_at?->format('Y-m-d H:i'),
                    ]),
                ];
            });

        return Inertia::render('student/exams', [
            'exams' => $exams,
        ]);
    }

    /**
     * Start or resume exam attempt.
     */
    public function takeExam(Request $request, Exam $exam): Response|RedirectResponse
    {
        $user = $request->user();

        try {
            $attempt = $this->examService->startAttempt($user, $exam);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->route('student.exams')->with('error', $e->getMessage());
        }

        // Load questions with options (HIDDEN is_correct to prevent cheating)
        $questions = $exam->questions()
            ->with(['options' => function ($q) {
                $q->select('id', 'question_id', 'option_text_en', 'option_text_ar', 'position')
                    ->orderBy('position');
            }])
            ->orderBy('position')
            ->get();

        $savedAnswers = $attempt->answers->pluck('selected_option_id', 'question_id')->toArray();

        return Inertia::render('student/take-exam', [
            'exam' => [
                'id' => $exam->id,
                'title_en' => $exam->title_en,
                'title_ar' => $exam->title_ar,
                'instructions_en' => $exam->instructions_en,
                'instructions_ar' => $exam->instructions_ar,
                'duration_minutes' => $exam->duration_minutes,
                'passing_score' => $exam->passing_score,
                'course' => [
                    'slug' => $exam->course->slug,
                    'title_en' => $exam->course->title_en,
                    'title_ar' => $exam->course->title_ar,
                ],
            ],
            'attempt' => [
                'id' => $attempt->id,
                'attempt_number' => $attempt->attempt_number,
                'started_at' => $attempt->started_at->toIso8601String(),
                'expires_at' => $attempt->expires_at->toIso8601String(),
                'remaining_seconds' => max(0, now()->diffInSeconds($attempt->expires_at, false)),
            ],
            'questions' => $questions,
            'savedAnswers' => $savedAnswers,
        ]);
    }

    /**
     * Submit exam attempt.
     */
    public function submitExam(Request $request, ExamAttempt $attempt): Response|RedirectResponse
    {
        $user = $request->user();

        if ($attempt->user_id !== $user->id) {
            abort(403, 'Unauthorized attempt access.');
        }

        $validated = $request->validate([
            'answers' => 'present|array',
        ]);

        $attempt = $this->examService->submitAttempt($attempt, $validated['answers']);

        return Inertia::render('student/exam-result', [
            'attempt' => [
                'id' => $attempt->id,
                'attempt_number' => $attempt->attempt_number,
                'score' => (float) $attempt->score,
                'max_score' => (float) $attempt->max_score,
                'percentage' => (float) $attempt->percentage,
                'passed' => $attempt->passed,
                'status' => $attempt->status,
                'time_spent_seconds' => $attempt->time_spent_seconds,
            ],
            'exam' => [
                'id' => $attempt->exam->id,
                'title_en' => $attempt->exam->title_en,
                'title_ar' => $attempt->exam->title_ar,
                'passing_score' => $attempt->exam->passing_score,
                'course' => [
                    'slug' => $attempt->exam->course->slug,
                    'title_en' => $attempt->exam->course->title_en,
                    'title_ar' => $attempt->exam->course->title_ar,
                ],
            ],
        ]);
    }

    /**
     * Student's earned certificates list.
     */
    public function certificates(Request $request): Response
    {
        $user = $request->user();

        $certificates = Certificate::with('course')
            ->where('user_id', $user->id)
            ->latest('issue_date')
            ->get();

        return Inertia::render('student/certificates', [
            'certificates' => $certificates,
        ]);
    }
}
