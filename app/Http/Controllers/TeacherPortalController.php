<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\Lecture;
use App\Models\Question;
use App\Models\QuestionOption;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeacherPortalController extends Controller
{
    /**
     * Teacher dashboard.
     */
    public function dashboard(Request $request): Response
    {
        $user = $request->user();

        // Assigned courses
        $assignedCourses = $user->teachingCourses()
            ->with(['lectures', 'students', 'exams'])
            ->get();

        $assignedCourseIds = $assignedCourses->pluck('id');

        $totalEnrolled = Enrollment::whereIn('course_id', $assignedCourseIds)->count();
        $totalLectures = Lecture::whereIn('course_id', $assignedCourseIds)->where('is_published', true)->count();
        $totalExams = Exam::whereIn('course_id', $assignedCourseIds)->count();
        $recentAttemptsCount = ExamAttempt::whereHas('exam', fn($q) => $q->whereIn('course_id', $assignedCourseIds))
            ->where('status', 'completed')
            ->count();

        // Detailed course cards data
        $courseCards = $assignedCourses->map(function ($course) {
            $totalStudents = $course->students()->count();
            $completedStudents = $course->enrollments()->where('status', 'completed')->count();
            $completionRate = $totalStudents > 0 ? (int) round(($completedStudents / $totalStudents) * 100) : 0;

            return [
                'id' => $course->id,
                'slug' => $course->slug,
                'code' => $course->code,
                'title_en' => $course->title_en,
                'title_ar' => $course->title_ar,
                'description_en' => $course->description_en,
                'description_ar' => $course->description_ar,
                'thumbnail' => $course->thumbnail,
                'department' => $course->department,
                'total_learners' => $totalStudents,
                'total_lectures' => $course->lectures->count(),
                'total_exams' => $course->exams->count(),
                'completion_rate' => $completionRate,
            ];
        });

        // Recent lecture list across assigned courses
        $recentLectures = Lecture::with('course')
            ->whereIn('course_id', $assignedCourseIds)
            ->latest('updated_at')
            ->take(10)
            ->get();

        return Inertia::render('teacher/dashboard', [
            'metrics' => [
                'assigned_courses' => $assignedCourses->count(),
                'total_enrolled' => $totalEnrolled,
                'published_lectures' => $totalLectures,
                'recent_attempts' => $recentAttemptsCount,
            ],
            'assignedCourses' => $courseCards,
            'recentLectures' => $recentLectures,
        ]);
    }

    /**
     * Teacher courses list.
     */
    public function courses(Request $request): Response
    {
        $user = $request->user();

        $courses = $user->teachingCourses()
            ->withCount(['lectures', 'students', 'exams'])
            ->paginate(10);

        return Inertia::render('teacher/courses', [
            'courses' => $courses,
        ]);
    }

    /**
     * Manage course lectures.
     */
    public function courseLectures(Request $request, Course $course): Response
    {
        $this->authorizeTeacherCourse($request->user(), $course);

        $lectures = $course->lectures()->orderBy('position')->get();

        return Inertia::render('teacher/lectures', [
            'course' => $course,
            'lectures' => $lectures,
        ]);
    }

    /**
     * Store new lecture.
     */
    public function storeLecture(Request $request, Course $course): RedirectResponse
    {
        $this->authorizeTeacherCourse($request->user(), $course);

        $validated = $request->validate([
            'title_en' => 'required|string|max:255',
            'title_ar' => 'required|string|max:255',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'youtube_url' => ['required', 'string', 'regex:#^(https?://)?(www\.)?(youtube\.com|youtu\.be)/.+$#i'],
            'duration_minutes' => 'required|integer|min:1',
            'is_published' => 'boolean',
        ]);

        $nextPos = ($course->lectures()->max('position') ?? 0) + 1;

        Lecture::create([
            'course_id' => $course->id,
            'title_en' => $validated['title_en'],
            'title_ar' => $validated['title_ar'],
            'description_en' => $validated['description_en'] ?? null,
            'description_ar' => $validated['description_ar'] ?? null,
            'youtube_url' => $validated['youtube_url'],
            'duration_minutes' => $validated['duration_minutes'],
            'position' => $nextPos,
            'is_published' => $validated['is_published'] ?? true,
            'created_by' => $request->user()->id,
        ]);

        return back()->with('success', 'Lecture added successfully.');
    }

    /**
     * Update lecture.
     */
    public function updateLecture(Request $request, Lecture $lecture): RedirectResponse
    {
        $this->authorizeTeacherCourse($request->user(), $lecture->course);

        $validated = $request->validate([
            'title_en' => 'required|string|max:255',
            'title_ar' => 'required|string|max:255',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'youtube_url' => ['required', 'string', 'regex:#^(https?://)?(www\.)?(youtube\.com|youtu\.be)/.+$#i'],
            'duration_minutes' => 'required|integer|min:1',
            'position' => 'required|integer|min:1',
            'is_published' => 'boolean',
        ]);

        $lecture->update($validated);

        return back()->with('success', 'Lecture updated successfully.');
    }

    /**
     * Delete lecture.
     */
    public function deleteLecture(Request $request, Lecture $lecture): RedirectResponse
    {
        $this->authorizeTeacherCourse($request->user(), $lecture->course);

        $lecture->delete();

        return back()->with('success', 'Lecture deleted successfully.');
    }

    /**
     * Toggle lecture published state.
     */
    public function toggleLecturePublish(Request $request, Lecture $lecture): RedirectResponse
    {
        $this->authorizeTeacherCourse($request->user(), $lecture->course);

        $lecture->update([
            'is_published' => !$lecture->is_published,
        ]);

        return back()->with('success', 'Lecture status toggled.');
    }

    /**
     * Teacher exams list.
     */
    public function exams(Request $request): Response
    {
        $user = $request->user();
        $assignedCourseIds = $user->teachingCourses()->pluck('courses.id');

        $exams = Exam::with(['course'])
            ->withCount(['questions', 'attempts'])
            ->whereIn('course_id', $assignedCourseIds)
            ->latest()
            ->paginate(10);

        $courses = $user->teachingCourses()->get(['courses.id', 'title_en', 'title_ar']);

        return Inertia::render('teacher/exams', [
            'exams' => $exams,
            'courses' => $courses,
        ]);
    }

    /**
     * Store exam.
     */
    public function storeExam(Request $request, Course $course): RedirectResponse
    {
        $this->authorizeTeacherCourse($request->user(), $course);

        $validated = $request->validate([
            'title_en' => 'required|string|max:255',
            'title_ar' => 'required|string|max:255',
            'instructions_en' => 'nullable|string',
            'instructions_ar' => 'nullable|string',
            'duration_minutes' => 'required|integer|min:5|max:180',
            'passing_score' => 'required|integer|min:1|max:100',
            'max_attempts' => 'required|integer|min:1|max:10',
            'is_final' => 'boolean',
            'is_published' => 'boolean',
        ]);

        Exam::create([
            'course_id' => $course->id,
            'title_en' => $validated['title_en'],
            'title_ar' => $validated['title_ar'],
            'instructions_en' => $validated['instructions_en'] ?? null,
            'instructions_ar' => $validated['instructions_ar'] ?? null,
            'duration_minutes' => $validated['duration_minutes'],
            'passing_score' => $validated['passing_score'],
            'max_attempts' => $validated['max_attempts'],
            'is_final' => $validated['is_final'] ?? true,
            'is_published' => $validated['is_published'] ?? true,
            'created_by' => $request->user()->id,
        ]);

        return back()->with('success', 'Exam created successfully.');
    }

    /**
     * Manage exam questions.
     */
    public function examQuestions(Request $request, Exam $exam): Response
    {
        $this->authorizeTeacherCourse($request->user(), $exam->course);

        $questions = $exam->questions()->with('options')->orderBy('position')->get();

        return Inertia::render('teacher/questions', [
            'exam' => $exam->load('course'),
            'questions' => $questions,
        ]);
    }

    /**
     * Add question with options to exam.
     */
    public function storeQuestion(Request $request, Exam $exam): RedirectResponse
    {
        $this->authorizeTeacherCourse($request->user(), $exam->course);

        $validated = $request->validate([
            'question_text_en' => 'required|string',
            'question_text_ar' => 'required|string',
            'question_type' => 'required|in:multiple_choice,true_false',
            'points' => 'required|numeric|min:0.5',
            'explanation_en' => 'nullable|string',
            'explanation_ar' => 'nullable|string',
            'options' => 'required|array|min:2',
            'options.*.option_text_en' => 'required|string',
            'options.*.option_text_ar' => 'required|string',
            'options.*.is_correct' => 'required|boolean',
        ]);

        $nextPos = ($exam->questions()->max('position') ?? 0) + 1;

        $question = Question::create([
            'exam_id' => $exam->id,
            'question_text_en' => $validated['question_text_en'],
            'question_text_ar' => $validated['question_text_ar'],
            'question_type' => $validated['question_type'],
            'points' => $validated['points'],
            'position' => $nextPos,
            'explanation_en' => $validated['explanation_en'] ?? null,
            'explanation_ar' => $validated['explanation_ar'] ?? null,
        ]);

        foreach ($validated['options'] as $idx => $opt) {
            QuestionOption::create([
                'question_id' => $question->id,
                'option_text_en' => $opt['option_text_en'],
                'option_text_ar' => $opt['option_text_ar'],
                'is_correct' => (bool) $opt['is_correct'],
                'position' => $idx + 1,
            ]);
        }

        return back()->with('success', 'Question created successfully.');
    }

    /**
     * Delete question.
     */
    public function deleteQuestion(Request $request, Question $question): RedirectResponse
    {
        $this->authorizeTeacherCourse($request->user(), $question->exam->course);

        $question->delete();

        return back()->with('success', 'Question deleted successfully.');
    }

    /**
     * Student progress across teacher's assigned courses.
     */
    public function studentProgress(Request $request): Response
    {
        $user = $request->user();
        $assignedCourseIds = $user->teachingCourses()->pluck('courses.id');

        $enrollments = Enrollment::with(['user', 'course'])
            ->whereIn('course_id', $assignedCourseIds)
            ->latest('enrolled_at')
            ->paginate(15);

        return Inertia::render('teacher/student-progress', [
            'enrollments' => $enrollments,
        ]);
    }

    /**
     * Exam results list for teacher's courses.
     */
    public function examResults(Request $request): Response
    {
        $user = $request->user();
        $assignedCourseIds = $user->teachingCourses()->pluck('courses.id');

        $attempts = ExamAttempt::with(['user', 'exam.course'])
            ->whereHas('exam', fn($q) => $q->whereIn('course_id', $assignedCourseIds))
            ->where('status', 'completed')
            ->latest('submitted_at')
            ->paginate(15);

        return Inertia::render('teacher/exam-results', [
            'attempts' => $attempts,
        ]);
    }

    /**
     * Server-side authorization check: teacher must be assigned to course, or be admin.
     */
    protected function authorizeTeacherCourse($user, Course $course): void
    {
        if ($user->isAdmin()) {
            return;
        }

        if (!$user->isTeacher() || !$course->teachers()->where('users.id', $user->id)->exists()) {
            abort(403, 'Unauthorized. You are not assigned to manage this course.');
        }
    }
}
