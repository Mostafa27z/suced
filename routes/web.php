<?php

use App\Http\Controllers\AdminPortalController;
use App\Http\Controllers\CertificateVerificationController;
use App\Http\Controllers\CourseCatalogController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\StudentPortalController;
use App\Http\Controllers\TeacherPortalController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/courses', [CourseCatalogController::class, 'index'])->name('courses.index');
Route::get('/courses/{course:slug}', [CourseCatalogController::class, 'show'])->name('courses.show');

// Public Certificate Verification
Route::get('/verify/{code?}', [CertificateVerificationController::class, 'verify'])->name('verify.show');
Route::get('/certificates/{certificate}/download', [CertificateVerificationController::class, 'download'])->name('certificates.download');

// Language toggle endpoint
Route::get('/lang/{locale}', function (Request $request, string $locale) {
    if (in_array($locale, ['en', 'ar'])) {
        session(['locale' => $locale]);
        if ($request->user()) {
            $request->user()->update(['locale' => $locale]);
        }
    }
    return back();
})->name('language.switch');

/*
|--------------------------------------------------------------------------
| Authenticated User Redirection
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function (Request $request) {
        $user = $request->user();
        return match ($user->role) {
            'admin' => redirect()->route('admin.dashboard'),
            'teacher' => redirect()->route('teacher.dashboard'),
            default => redirect()->route('student.dashboard'),
        };
    })->name('dashboard');

    Route::post('/courses/{course}/enroll', [EnrollmentController::class, 'enroll'])->name('courses.enroll');

    /*
    |--------------------------------------------------------------------------
    | Student Portal Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('student')->group(function () {
        Route::get('/dashboard', [StudentPortalController::class, 'dashboard'])->name('student.dashboard');
        Route::get('/courses', [StudentPortalController::class, 'courses'])->name('student.courses');
        Route::get('/exams', [StudentPortalController::class, 'exams'])->name('student.exams');
        Route::get('/exams/{exam}/take', [StudentPortalController::class, 'takeExam'])->name('student.exams.take');
        Route::post('/exam-attempts/{attempt}/submit', [StudentPortalController::class, 'submitExam'])->name('student.exams.submit');
        Route::get('/certificates', [StudentPortalController::class, 'certificates'])->name('student.certificates');
    });

    // Learning Room
    Route::get('/courses/{course:slug}/learn/{lecture?}', [StudentPortalController::class, 'learn'])->name('student.learn');
    Route::post('/lectures/{lecture}/complete', [StudentPortalController::class, 'toggleLectureComplete'])->name('student.lectures.complete');

    /*
    |--------------------------------------------------------------------------
    | Teacher Portal Routes (Teacher & Admin)
    |--------------------------------------------------------------------------
    */
    Route::middleware(['role:teacher,admin'])->prefix('teacher')->group(function () {
        Route::get('/dashboard', [TeacherPortalController::class, 'dashboard'])->name('teacher.dashboard');
        Route::get('/courses', [TeacherPortalController::class, 'courses'])->name('teacher.courses');
        Route::get('/courses/{course}/lectures', [TeacherPortalController::class, 'courseLectures'])->name('teacher.courses.lectures');
        Route::post('/courses/{course}/lectures', [TeacherPortalController::class, 'storeLecture'])->name('teacher.lectures.store');
        Route::put('/lectures/{lecture}', [TeacherPortalController::class, 'updateLecture'])->name('teacher.lectures.update');
        Route::post('/lectures/{lecture}/toggle-publish', [TeacherPortalController::class, 'toggleLecturePublish'])->name('teacher.lectures.toggle-publish');
        Route::delete('/lectures/{lecture}', [TeacherPortalController::class, 'deleteLecture'])->name('teacher.lectures.delete');

        Route::get('/exams', [TeacherPortalController::class, 'exams'])->name('teacher.exams');
        Route::post('/courses/{course}/exams', [TeacherPortalController::class, 'storeExam'])->name('teacher.exams.store');
        Route::get('/exams/{exam}/questions', [TeacherPortalController::class, 'examQuestions'])->name('teacher.exams.questions');
        Route::post('/exams/{exam}/questions', [TeacherPortalController::class, 'storeQuestion'])->name('teacher.questions.store');
        Route::delete('/questions/{question}', [TeacherPortalController::class, 'deleteQuestion'])->name('teacher.questions.delete');

        Route::get('/student-progress', [TeacherPortalController::class, 'studentProgress'])->name('teacher.student-progress');
        Route::get('/exam-results', [TeacherPortalController::class, 'examResults'])->name('teacher.exam-results');
    });

    /*
    |--------------------------------------------------------------------------
    | Admin Portal Routes (Admin only)
    |--------------------------------------------------------------------------
    */
    Route::middleware(['role:admin'])->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminPortalController::class, 'dashboard'])->name('admin.dashboard');
        Route::get('/courses', [AdminPortalController::class, 'courses'])->name('admin.courses');
        Route::post('/courses', [AdminPortalController::class, 'storeCourse'])->name('admin.courses.store');
        Route::put('/courses/{course}', [AdminPortalController::class, 'updateCourse'])->name('admin.courses.update');
        Route::post('/courses/{course}/toggle-publish', [AdminPortalController::class, 'toggleCoursePublish'])->name('admin.courses.toggle-publish');
        Route::delete('/courses/{course}', [AdminPortalController::class, 'deleteCourse'])->name('admin.courses.delete');
        Route::post('/courses/{course}/certificate-template', [AdminPortalController::class, 'updateCertificateTemplate'])->name('admin.courses.certificate-template');
        Route::get('/courses/{course}/certificate-preview', [AdminPortalController::class, 'previewCertificate'])->name('admin.courses.certificate-preview');

        Route::get('/users', [AdminPortalController::class, 'users'])->name('admin.users');
        Route::post('/users', [AdminPortalController::class, 'storeUser'])->name('admin.users.store');
        Route::put('/users/{user}', [AdminPortalController::class, 'updateUser'])->name('admin.users.update');
        Route::put('/users/{user}/password', [AdminPortalController::class, 'updateUserPassword'])->name('admin.users.password');

        Route::get('/certificates', [AdminPortalController::class, 'certificates'])->name('admin.certificates');
        Route::post('/certificates/{certificate}/revoke', [AdminPortalController::class, 'revokeCertificate'])->name('admin.certificates.revoke');

        Route::get('/reports/{type}/export', [AdminPortalController::class, 'exportReport'])->name('admin.reports.export');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
