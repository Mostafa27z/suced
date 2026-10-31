<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\Lecture;
use App\Models\PlatformSetting;
use App\Models\User;
use App\Services\CertificateService;
use App\Services\CourseCompletionService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminPortalController extends Controller
{
    public function __construct(
        protected CourseCompletionService $courseCompletionService,
        protected CertificateService $certificateService
    ) {}

    /**
     * Admin overview dashboard.
     */
    public function dashboard(Request $request): Response
    {
        // 1. Metric Counts
        $totalStudents = User::where('role', 'student')->count();
        $totalTeachers = User::where('role', 'teacher')->count();
        $totalAdmins = User::where('role', 'admin')->count();
        $publishedCourses = Course::where('is_published', true)->count();
        $totalCourses = Course::count();
        $totalEnrollments = Enrollment::count();
        $completedEnrollments = Enrollment::where('status', 'completed')->count();
        $examsEvaluated = ExamAttempt::where('status', 'completed')->count();
        $certificatesIssued = Certificate::where('is_revoked', false)->count();

        // 2. Real Analytics for Recharts: Enrollment trends over last 30 days
        $thirtyDaysAgo = Carbon::now()->subDays(30);
        $enrollmentRows = Enrollment::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $enrollmentTrends = [];
        for ($i = 29; $i >= 0; $i--) {
            $dateStr = Carbon::now()->subDays($i)->format('Y-m-d');
            $label = Carbon::now()->subDays($i)->format('M d');
            $enrollmentTrends[] = [
                'date' => $label,
                'enrollments' => (int) ($enrollmentRows[$dateStr]->count ?? 0),
            ];
        }

        // 3. Category Completion Rates
        $categories = ['technology', 'business', 'healthcare', 'management'];
        $completionRatesByCategory = [];

        foreach ($categories as $cat) {
            $catCourseIds = Course::where('department', $cat)->pluck('id');
            $catEnrollments = Enrollment::whereIn('course_id', $catCourseIds)->count();
            $catCompleted = Enrollment::whereIn('course_id', $catCourseIds)->where('status', 'completed')->count();
            $rate = $catEnrollments > 0 ? round(($catCompleted / $catEnrollments) * 100, 1) : 80.0;

            $completionRatesByCategory[] = [
                'department' => ucfirst($cat),
                'rate' => $rate,
                'total_enrolled' => $catEnrollments,
            ];
        }

        // 4. Governance Courses list
        $courses = Course::with(['teachers'])
            ->withCount(['students', 'lectures', 'exams'])
            ->latest()
            ->take(8)
            ->get();

        // 5. Recent enrollments and certificate ledgers
        $recentEnrollments = Enrollment::with(['user', 'course'])
            ->latest('enrolled_at')
            ->take(5)
            ->get();

        $recentCertificates = Certificate::with(['user', 'course'])
            ->latest('issue_date')
            ->take(5)
            ->get();

        return Inertia::render('admin/dashboard', [
            'metrics' => [
                'total_students' => $totalStudents,
                'total_teachers' => $totalTeachers,
                'total_admins' => $totalAdmins,
                'published_courses' => $publishedCourses,
                'total_courses' => $totalCourses,
                'total_enrollments' => $totalEnrollments,
                'completed_courses' => $completedEnrollments,
                'exams_evaluated' => $examsEvaluated,
                'certificates_issued' => $certificatesIssued,
            ],
            'enrollmentTrends' => $enrollmentTrends,
            'completionRatesByCategory' => $completionRatesByCategory,
            'courses' => $courses,
            'recentEnrollments' => $recentEnrollments,
            'recentCertificates' => $recentCertificates,
        ]);
    }

    /**
     * Admin courses governance.
     */
    public function courses(Request $request): Response
    {
        $query = Course::with(['teachers'])->withCount(['students', 'lectures', 'exams']);

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title_en', 'like', "%{$search}%")
                    ->orWhere('title_ar', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($status = $request->get('status')) {
            if ($status === 'published') {
                $query->where('is_published', true);
            } elseif ($status === 'draft') {
                $query->where('is_published', false);
            }
        }

        $courses = $query->latest()->paginate(10)->withQueryString();
        $courses->getCollection()->transform(function ($c) {
            $c->effective_certificate_template = $c->getCertificateTemplate();
            return $c;
        });
        $teachers = User::where('role', 'teacher')->get(['id', 'name', 'email']);

        return Inertia::render('admin/courses', [
            'courses' => $courses,
            'teachers' => $teachers,
            'filters' => [
                'search' => $request->get('search', ''),
                'status' => $request->get('status', 'all'),
            ],
        ]);
    }

    /**
     * Create course.
     */
    public function storeCourse(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title_en' => 'required|string|max:255',
            'title_ar' => 'required|string|max:255',
            'code' => 'required|string|max:20',
            'department' => 'required|string|in:technology,business,healthcare,management',
            'description_en' => 'required|string',
            'description_ar' => 'required|string',
            'duration_weeks' => 'required|integer|min:1',
            'duration_hours' => 'required|integer|min:1',
            'passing_score' => 'required|integer|min:1|max:100',
            'thumbnail' => 'nullable|string',
            'teacher_ids' => 'nullable|array',
            'is_published' => 'boolean',
        ]);

        $course = Course::create([
            'slug' => Str::slug($validated['title_en']),
            'code' => strtoupper($validated['code']),
            'department' => $validated['department'],
            'title_en' => $validated['title_en'],
            'title_ar' => $validated['title_ar'],
            'description_en' => $validated['description_en'],
            'description_ar' => $validated['description_ar'],
            'duration_weeks' => $validated['duration_weeks'],
            'duration_hours' => $validated['duration_hours'],
            'passing_score' => $validated['passing_score'],
            'thumbnail' => $validated['thumbnail'] ?? '/images/stitch/campus_architecture_hero.png',
            'is_published' => $validated['is_published'] ?? false,
            'published_at' => ($validated['is_published'] ?? false) ? now() : null,
            'created_by' => $request->user()->id,
        ]);

        if (!empty($validated['teacher_ids'])) {
            $course->teachers()->sync($validated['teacher_ids']);
        }

        return back()->with('success', 'Course created successfully.');
    }

    /**
     * Update course.
     */
    public function updateCourse(Request $request, Course $course): RedirectResponse
    {
        $validated = $request->validate([
            'title_en' => 'required|string|max:255',
            'title_ar' => 'required|string|max:255',
            'code' => 'required|string|max:20',
            'department' => 'required|string|in:technology,business,healthcare,management',
            'description_en' => 'required|string',
            'description_ar' => 'required|string',
            'duration_weeks' => 'required|integer|min:1',
            'duration_hours' => 'required|integer|min:1',
            'passing_score' => 'required|integer|min:1|max:100',
            'thumbnail' => 'nullable|string',
            'teacher_ids' => 'nullable|array',
            'is_published' => 'boolean',
        ]);

        $course->update([
            'code' => strtoupper($validated['code']),
            'department' => $validated['department'],
            'title_en' => $validated['title_en'],
            'title_ar' => $validated['title_ar'],
            'description_en' => $validated['description_en'],
            'description_ar' => $validated['description_ar'],
            'duration_weeks' => $validated['duration_weeks'],
            'duration_hours' => $validated['duration_hours'],
            'passing_score' => $validated['passing_score'],
            'thumbnail' => $validated['thumbnail'] ?? $course->thumbnail,
            'is_published' => $validated['is_published'],
            'published_at' => $validated['is_published'] && !$course->published_at ? now() : $course->published_at,
        ]);

        if (isset($validated['teacher_ids'])) {
            $course->teachers()->sync($validated['teacher_ids']);
        }

        return back()->with('success', 'Course updated successfully.');
    }

    /**
     * Toggle course publish status.
     */
    public function toggleCoursePublish(Request $request, Course $course): RedirectResponse
    {
        $newStatus = !$course->is_published;
        $course->update([
            'is_published' => $newStatus,
            'published_at' => $newStatus && !$course->published_at ? now() : $course->published_at,
        ]);

        return back()->with('success', 'Course publication status toggled.');
    }

    /**
     * Delete course.
     */
    public function deleteCourse(Request $request, Course $course): RedirectResponse
    {
        $course->delete();
        return back()->with('success', 'Course deleted.');
    }

    /**
     * Update certificate template for a specific course.
     */
    public function updateCertificateTemplate(Request $request, Course $course): RedirectResponse
    {
        $validated = $request->validate([
            'theme' => 'required|string|in:classic_navy,royal_gold,emerald_heritage,burgundy_excellence,slate_modern',
            'border_style' => 'required|string|in:classic_double,modern_clean,vintage_ornate',
            'org_name_en' => 'required|string|max:255',
            'org_name_ar' => 'nullable|string|max:255',
            'center_name_en' => 'nullable|string|max:255',
            'center_name_ar' => 'nullable|string|max:255',
            'certificate_title_en' => 'required|string|max:255',
            'certificate_title_ar' => 'nullable|string|max:255',
            'introduction_text_en' => 'nullable|string|max:255',
            'introduction_text_ar' => 'nullable|string|max:255',
            'completion_text_en' => 'nullable|string|max:255',
            'completion_text_ar' => 'nullable|string|max:255',
            'signatory1_name' => 'required|string|max:255',
            'signatory1_title' => 'required|string|max:255',
            'signatory1_name_ar' => 'nullable|string|max:255',
            'signatory1_title_ar' => 'nullable|string|max:255',
            'signatory2_name' => 'required|string|max:255',
            'signatory2_title' => 'required|string|max:255',
            'signatory2_name_ar' => 'nullable|string|max:255',
            'signatory2_title_ar' => 'nullable|string|max:255',
            'show_qr' => 'boolean',
            'show_grade' => 'boolean',
            'show_watermark' => 'boolean',
        ]);

        $course->update([
            'certificate_template' => $validated,
        ]);

        return back()->with('success', 'Certificate template updated successfully for this course.');
    }

    /**
     * Preview sample certificate PDF for this course in specified language (ar/en).
     */
    public function previewCertificate(Request $request, Course $course): \Symfony\Component\HttpFoundation\Response
    {
        $overrideTemplate = $request->has('theme') ? $request->all() : null;
        $lang = $request->get('lang', app()->getLocale() ?: 'ar');
        $pdf = $this->certificateService->previewPdf($course, $overrideTemplate, $lang);

        return $pdf->stream('Certificate_Preview_' . $course->code . '_' . strtoupper($lang) . '.pdf');
    }

    /**
     * User management.
     */
    public function users(Request $request): Response
    {
        $query = User::query();

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('national_id', 'like', "%{$search}%");
            });
        }

        if ($role = $request->get('role')) {
            if ($role !== 'all') {
                $query->where('role', $role);
            }
        }

        $users = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('admin/users', [
            'users' => $users,
            'filters' => [
                'search' => $request->get('search', ''),
                'role' => $request->get('role', 'all'),
            ],
        ]);
    }

    /**
     * Create user account (Admin, Teacher, Student).
     */
    public function storeUser(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role' => 'required|in:admin,teacher,student',
            'national_id' => 'nullable|string|max:50',
            'phone' => 'nullable|string|max:50',
            'password' => 'required|string|min:8',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'national_id' => $validated['national_id'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
            'is_active' => true,
        ]);

        return back()->with('success', 'User account created successfully.');
    }

    /**
     * Update user details or role (including optional password update).
     */
    public function updateUser(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role' => 'required|in:admin,teacher,student',
            'national_id' => 'nullable|string|max:50',
            'phone' => 'nullable|string|max:50',
            'is_active' => 'boolean',
            'password' => 'nullable|string|min:8',
        ]);

        // Security check: do not deactivate or demote the last usable admin
        if ($user->isAdmin() && ($validated['role'] !== 'admin' || !($validated['is_active'] ?? true))) {
            $otherActiveAdmins = User::where('role', 'admin')
                ->where('is_active', true)
                ->where('id', '!=', $user->id)
                ->count();

            if ($otherActiveAdmins === 0) {
                return back()->with('error', 'Cannot modify the last active administrator account.');
            }
        }

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return back()->with('success', 'User updated successfully.');
    }

    /**
     * Update user password directly by admin.
     */
    public function updateUserPassword(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'User password updated successfully.');
    }

    /**
     * Certificates management.
     */
    public function certificates(Request $request): Response
    {
        $certificates = Certificate::with(['user', 'course'])
            ->latest('issue_date')
            ->paginate(15);

        $courses = Course::where('is_published', true)->get(['id', 'title_en', 'title_ar']);
        $students = User::where('role', 'student')->get(['id', 'name', 'email']);

        return Inertia::render('admin/certificates', [
            'certificates' => $certificates,
            'courses' => $courses,
            'students' => $students,
        ]);
    }

    /**
     * Revoke certificate.
     */
    public function revokeCertificate(Request $request, Certificate $certificate): RedirectResponse
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:255',
        ]);

        $certificate->update([
            'is_revoked' => true,
            'revocation_reason' => $validated['reason'],
        ]);

        return back()->with('success', 'Certificate revoked.');
    }

    /**
     * Export CSV reports.
     */
    public function exportReport(Request $request, string $type): StreamedResponse
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"suced_{$type}_report.csv\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        return response()->stream(function () use ($type) {
            $handle = fopen('php://output', 'w');

            if ($type === 'enrollments') {
                fputcsv($handle, ['ID', 'Student Name', 'Student Email', 'Course Code', 'Course Title', 'Status', 'Enrolled At', 'Completed At']);
                Enrollment::with(['user', 'course'])->chunk(100, function ($enrollments) use ($handle) {
                    foreach ($enrollments as $e) {
                        fputcsv($handle, [
                            $e->id,
                            $e->user->name,
                            $e->user->email,
                            $e->course->code,
                            $e->course->title_en,
                            $e->status,
                            $e->enrolled_at?->toIso8601String(),
                            $e->completed_at?->toIso8601String(),
                        ]);
                    }
                });
            } elseif ($type === 'certificates') {
                fputcsv($handle, ['Certificate Number', 'Student Name', 'Course Title', 'Score (%)', 'Issue Date', 'Status']);
                Certificate::chunk(100, function ($certs) use ($handle) {
                    foreach ($certs as $c) {
                        fputcsv($handle, [
                            $c->certificate_number,
                            $c->student_name,
                            $c->course_title_en,
                            $c->score_percentage,
                            $c->issue_date->format('Y-m-d'),
                            $c->is_revoked ? 'Revoked' : 'Valid',
                        ]);
                    }
                });
            }

            fclose($handle);
        }, 200, $headers);
    }
}
