<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CourseCatalogController extends Controller
{
    /**
     * Display course catalog.
     */
    public function index(Request $request): Response
    {
        $query = Course::with(['teachers', 'lectures'])
            ->where('is_published', true);

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title_en', 'like', "%{$search}%")
                    ->orWhere('title_ar', 'like', "%{$search}%")
                    ->orWhere('description_en', 'like', "%{$search}%")
                    ->orWhere('description_ar', 'like', "%{$search}%");
            });
        }

        if ($department = $request->get('department')) {
            if ($department !== 'all') {
                $query->where('department', $department);
            }
        }

        $courses = $query->latest('published_at')->paginate(12)->withQueryString();

        return Inertia::render('courses/index', [
            'courses' => $courses,
            'filters' => [
                'search' => $request->get('search', ''),
                'department' => $request->get('department', 'all'),
            ],
        ]);
    }

    /**
     * Display course details page.
     */
    public function show(Request $request, Course $course): Response
    {
        if (!$course->is_published && (!$request->user() || (!$request->user()->isAdmin() && !$course->teachers()->where('users.id', $request->user()->id)->exists()))) {
            abort(404, 'Course not found or unpublished.');
        }

        $course->load([
            'teachers',
            'lectures' => function ($q) {
                $q->where('is_published', true)->orderBy('position');
            },
            'exams' => function ($q) {
                $q->where('is_published', true);
            },
        ]);

        $user = $request->user();
        $enrollment = null;

        if ($user) {
            $enrollment = Enrollment::where('user_id', $user->id)
                ->where('course_id', $course->id)
                ->first();
        }

        return Inertia::render('courses/show', [
            'course' => $course,
            'enrollment' => $enrollment,
            'isEnrolled' => $enrollment !== null,
        ]);
    }
}
