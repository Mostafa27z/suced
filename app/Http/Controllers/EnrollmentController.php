<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\PlatformNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    /**
     * Enroll authenticated student into a course.
     */
    public function enroll(Request $request, Course $course): RedirectResponse
    {
        $user = $request->user();

        if (!$course->is_published) {
            return back()->with('error', 'This course is currently not open for enrollment.');
        }

        $existing = Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->first();

        if ($existing) {
            return redirect()->route('student.learn', ['course' => $course->slug])
                ->with('status', 'You are already enrolled in this course.');
        }

        Enrollment::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'status' => 'enrolled',
            'enrolled_at' => now(),
        ]);

        // Create welcome notification
        PlatformNotification::create([
            'user_id' => $user->id,
            'type' => 'enrollment',
            'title_en' => "Enrolled in {$course->title_en}",
            'title_ar' => "تم التسجيل في {$course->title_ar}",
            'message_en' => "You have successfully enrolled in {$course->title_en}. Start watching lectures now!",
            'message_ar' => "لقد تم تسجيلك بنجاح في مقرر {$course->title_ar}. ابدأ بمشاهدة المحاضرات الآن!",
            'action_url' => route('student.learn', ['course' => $course->slug]),
        ]);

        return redirect()->route('student.learn', ['course' => $course->slug])
            ->with('success', 'Enrollment successful! Welcome to the course.');
    }
}
