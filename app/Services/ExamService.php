<?php

namespace App\Services;

use App\Models\Enrollment;
use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\ExamAttemptAnswer;
use App\Models\PlatformNotification;
use App\Models\QuestionOption;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ExamService
{
    public function __construct(
        protected CourseCompletionService $courseCompletionService
    ) {}

    /**
     * Start a new exam attempt.
     */
    public function startAttempt(User $student, Exam $exam): ExamAttempt
    {
        // 1. Verify enrollment
        $isEnrolled = Enrollment::where('user_id', $student->id)
            ->where('course_id', $exam->course_id)
            ->exists();

        if (!$isEnrolled) {
            throw ValidationException::withMessages([
                'exam' => 'You must be enrolled in the course to attempt this exam.',
            ]);
        }

        // 2. Check remaining attempts
        $usedAttempts = $exam->attempts()->where('user_id', $student->id)->count();
        if ($usedAttempts >= $exam->max_attempts) {
            throw ValidationException::withMessages([
                'exam' => 'You have reached the maximum allowed attempts (' . $exam->max_attempts . ') for this examination.',
            ]);
        }

        // 3. Check for any currently active in-progress attempt that hasn't expired
        $activeAttempt = $exam->attempts()
            ->where('user_id', $student->id)
            ->where('status', 'in_progress')
            ->where('expires_at', '>', now())
            ->first();

        if ($activeAttempt) {
            return $activeAttempt;
        }

        // 4. Create new attempt
        $startedAt = now();
        $expiresAt = now()->addMinutes($exam->duration_minutes);

        return ExamAttempt::create([
            'exam_id' => $exam->id,
            'user_id' => $student->id,
            'attempt_number' => $usedAttempts + 1,
            'started_at' => $startedAt,
            'expires_at' => $expiresAt,
            'status' => 'in_progress',
            'score' => 0,
            'max_score' => $exam->questions()->sum('points') ?: 1,
            'percentage' => 0,
            'passed' => false,
        ]);
    }

    /**
     * Submit an exam attempt and grade it strictly on the server.
     *
     * @param array<int, int> $answers Key: question_id, Value: selected_option_id
     */
    public function submitAttempt(ExamAttempt $attempt, array $answers): ExamAttempt
    {
        if ($attempt->isCompleted()) {
            return $attempt;
        }

        return DB::transaction(function () use ($attempt, $answers) {
            $exam = $attempt->exam()->with('questions.options')->first();
            $questions = $exam->questions;

            $totalScore = 0.0;
            $maxScore = 0.0;
            $now = now();

            foreach ($questions as $question) {
                $maxScore += (float) $question->points;
                $selectedOptionId = $answers[$question->id] ?? null;

                $isCorrect = false;
                $pointsAwarded = 0.0;

                if ($selectedOptionId) {
                    $selectedOption = QuestionOption::where('question_id', $question->id)
                        ->where('id', $selectedOptionId)
                        ->first();

                    if ($selectedOption && $selectedOption->is_correct) {
                        $isCorrect = true;
                        $pointsAwarded = (float) $question->points;
                        $totalScore += $pointsAwarded;
                    }
                }

                ExamAttemptAnswer::updateOrCreate(
                    [
                        'exam_attempt_id' => $attempt->id,
                        'question_id' => $question->id,
                    ],
                    [
                        'selected_option_id' => $selectedOptionId,
                        'is_correct' => $isCorrect,
                        'points_awarded' => $pointsAwarded,
                    ]
                );
            }

            if ($maxScore <= 0) {
                $maxScore = 1.0;
            }

            $percentage = round(($totalScore / $maxScore) * 100, 2);
            $passed = $percentage >= $exam->passing_score;

            $timeSpentSeconds = $attempt->started_at ? min($now->diffInSeconds($attempt->started_at), $exam->duration_minutes * 60) : 0;
            $status = ($attempt->expires_at && $now->isAfter($attempt->expires_at)) ? 'timed_out' : 'completed';

            $attempt->update([
                'submitted_at' => $now,
                'time_spent_seconds' => $timeSpentSeconds,
                'score' => $totalScore,
                'max_score' => $maxScore,
                'percentage' => $percentage,
                'passed' => $passed,
                'status' => $status,
            ]);

            // Notify user of results
            PlatformNotification::create([
                'user_id' => $attempt->user_id,
                'type' => 'exam',
                'title_en' => $passed ? "Passed: {$exam->title_en}" : "Exam Result: {$exam->title_en}",
                'title_ar' => $passed ? "تم اجتياز اختبار: {$exam->title_ar}" : "نتيجة اختبار: {$exam->title_ar}",
                'message_en' => "You achieved {$percentage}% on {$exam->title_en}. Required to pass: {$exam->passing_score}%.",
                'message_ar' => "حققت نسبة {$percentage}% في اختبار {$exam->title_ar}. النسبة المطلوبة للنجاح: {$exam->passing_score}%.",
                'action_url' => route('student.exams'),
            ]);

            // If exam was passed, check course completion and certificate issuance
            if ($passed) {
                $this->courseCompletionService->checkAndComplete($attempt->user, $exam->course);
            }

            return $attempt->fresh(['answers', 'exam.course']);
        });
    }
}
