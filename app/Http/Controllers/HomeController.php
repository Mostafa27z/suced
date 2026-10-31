<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(Request $request): Response
    {
        $coursesQuery = Course::with(['teachers', 'lectures'])
            ->where('is_published', true);

        if ($department = $request->get('department')) {
            if ($department !== 'all') {
                $coursesQuery->where('department', $department);
            }
        }

        $featuredCourses = $coursesQuery->latest('published_at')
            ->take(8)
            ->get()
            ->map(function ($course) {
                return [
                    'id' => $course->id,
                    'slug' => $course->slug,
                    'code' => $course->code,
                    'title_en' => $course->title_en,
                    'title_ar' => $course->title_ar,
                    'description_en' => $course->description_en,
                    'description_ar' => $course->description_ar,
                    'department' => $course->department,
                    'duration_weeks' => $course->duration_weeks,
                    'duration_hours' => $course->duration_hours,
                    'thumbnail' => $course->thumbnail,
                    'rating' => (float) $course->rating,
                    'reviews_count' => $course->reviews_count,
                    'lectures_count' => $course->lectures->count(),
                    'lead_teacher' => $course->teachers->first() ? [
                        'name' => $course->teachers->first()->name,
                        'role_en' => $course->teachers->first()->pivot->role_title_en ?? 'Lead Instructor',
                        'role_ar' => $course->teachers->first()->pivot->role_title_ar ?? 'أستاذ المقرر',
                    ] : null,
                ];
            });

        // Database-backed real metrics
        $metrics = [
            'published_courses' => Course::where('is_published', true)->count(),
            'registered_students' => User::where('role', 'student')->count(),
            'completed_courses' => Enrollment::where('status', 'completed')->count(),
            'certificates_issued' => Certificate::where('is_revoked', false)->count(),
        ];

        return Inertia::render('welcome', [
            'featuredCourses' => $featuredCourses,
            'metrics' => $metrics,
            'selectedDepartment' => $request->get('department', 'all'),
        ]);
    }
}
