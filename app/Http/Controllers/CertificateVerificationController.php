<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Services\CertificateService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class CertificateVerificationController extends Controller
{
    public function __construct(
        protected CertificateService $certificateService
    ) {}

    /**
     * Public verification search page or direct code lookup.
     */
    public function verify(Request $request, ?string $code = null): Response
    {
        $searchQuery = trim($code ?: (string) $request->get('query'));
        $certificate = null;
        $status = null;

        if ($searchQuery) {
            $certificate = Certificate::where('public_code', $searchQuery)
                ->orWhere('certificate_number', $searchQuery)
                ->first();

            if ($certificate) {
                $status = $certificate->is_revoked ? 'revoked' : 'valid';
            } else {
                $status = 'not_found';
            }
        }

        return Inertia::render('certificates/verify', [
            'initialQuery' => $searchQuery,
            'status' => $status,
            'certificate' => $certificate ? [
                'public_code' => $certificate->public_code,
                'certificate_number' => $certificate->certificate_number,
                'student_name' => $certificate->student_name,
                'course_title_en' => $certificate->course_title_en,
                'course_title_ar' => $certificate->course_title_ar,
                'score_percentage' => (float) $certificate->score_percentage,
                'issue_date' => $certificate->issue_date->format('Y-m-d'),
                'is_revoked' => $certificate->is_revoked,
                'revocation_reason' => $certificate->revocation_reason,
            ] : null,
        ]);
    }

    /**
     * Download certificate PDF with authorization check.
     */
    public function download(Request $request, Certificate $certificate): SymfonyResponse
    {
        $user = $request->user();

        // Authorization: owner, admin, or teacher of the course
        if (!$user) {
            abort(403, 'Unauthorized. Please login to download your certificate.');
        }

        $isOwner = $certificate->user_id === $user->id;
        $isAdmin = $user->isAdmin();
        $isTeacher = $user->isTeacher() && $certificate->course->teachers()->where('users.id', $user->id)->exists();

        if (!$isOwner && !$isAdmin && !$isTeacher) {
            abort(403, 'Unauthorized access to this certificate PDF.');
        }

        $lang = $request->query('lang', $user->locale ?: session('locale', app()->getLocale()));

        return $this->certificateService->downloadPdf($certificate, $lang);
    }
}
