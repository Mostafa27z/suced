<?php

namespace App\Services;

use App\Models\Certificate;
use App\Models\Course;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;

class CertificateService
{
    public function __construct(
        protected ArabicShaper $arabicShaper
    ) {}

    /**
     * Generate downloadable PDF for a certificate strictly in the requested language ('ar' or 'en').
     */
    public function generatePdf(Certificate $certificate, string $lang = 'en'): \Barryvdh\DomPDF\PDF
    {
        $lang = in_array(strtolower($lang), ['ar', 'en']) ? strtolower($lang) : 'en';

        $certificate->load(['course', 'user']);

        $template = $certificate->getTemplateData();

        $content = [];

        if ($lang === 'ar') {
            $studentNameAr = $certificate->user?->name ?: $certificate->student_name;
            $courseTitleAr = $certificate->course_title_ar ?: ($certificate->course?->title_ar ?: $certificate->course_title_en);

            $orgNameAr = !empty($template['org_name_ar']) ? $template['org_name_ar'] : 'جامعة سوهاج';
            $centerNameAr = !empty($template['center_name_ar']) ? $template['center_name_ar'] : 'مركز التعليم المستمر وتطوير القدرات';
            $certTitleAr = !empty($template['certificate_title_ar']) ? $template['certificate_title_ar'] : 'شهادة إتمام معتمدة';
            $introTextAr = !empty($template['introduction_text_ar']) ? $template['introduction_text_ar'] : 'تشهد إدارة مركز التعليم المستمر وتطوير القدرات بأن المتدرب /';
            $completionTextAr = !empty($template['completion_text_ar']) ? $template['completion_text_ar'] : 'قد اجتاز بنجاح كافة متطلبات البرنامج التدريبي والاختبارات المقررة لمقرر:';

            $signatory1NameAr = !empty($template['signatory1_name_ar']) ? $template['signatory1_name_ar'] : (!empty($template['signatory1_name']) ? $template['signatory1_name'] : 'د. مصطفى كامل');
            $signatory1TitleAr = !empty($template['signatory1_title_ar']) ? $template['signatory1_title_ar'] : (!empty($template['signatory1_title']) ? $template['signatory1_title'] : 'مدير مركز التعليم المستمر');
            $signatory2NameAr = !empty($template['signatory2_name_ar']) ? $template['signatory2_name_ar'] : (!empty($template['signatory2_name']) ? $template['signatory2_name'] : 'أ.د. حسان النعماني');
            $signatory2TitleAr = !empty($template['signatory2_title_ar']) ? $template['signatory2_title_ar'] : (!empty($template['signatory2_title']) ? $template['signatory2_title'] : 'رئيس الجامعة');

            $gradeWord = $certificate->score_percentage >= 85 ? 'اجتياز بامتياز' : 'ناجح معتمد';
            $gradeText = 'الدرجة النهائية: ' . number_format($certificate->score_percentage, 1) . '% • ' . $gradeWord;

            $content = [
                'org_name' => $this->arabicShaper->shape($orgNameAr),
                'center_name' => $this->arabicShaper->shape($centerNameAr),
                'certificate_title' => $this->arabicShaper->shape($certTitleAr),
                'intro_text' => $this->arabicShaper->shape($introTextAr),
                'student_name' => $this->arabicShaper->shape($studentNameAr),
                'completion_text' => $this->arabicShaper->shape($completionTextAr),
                'course_title' => $this->arabicShaper->shape($courseTitleAr),
                'grade_badge' => $this->arabicShaper->shape($gradeText),
                'signatory1_name' => $this->arabicShaper->shape($signatory1NameAr),
                'signatory1_title' => $this->arabicShaper->shape($signatory1TitleAr),
                'signatory2_name' => $this->arabicShaper->shape($signatory2NameAr),
                'signatory2_title' => $this->arabicShaper->shape($signatory2TitleAr),
                'verified_stamp' => $this->arabicShaper->shape('وثيقة رقمية رسمية معتمدة وموثقة'),
                'serial_label' => $this->arabicShaper->shape('رقم السجل:'),
                'issue_date_label' => $this->arabicShaper->shape('تاريخ الإصدار:'),
                'verify_label' => $this->arabicShaper->shape('رمز التحقق الإلكتروني:'),
            ];
        } else {
            // English version
            $studentNameEn = $certificate->student_name;
            $courseTitleEn = $certificate->course_title_en ?: ($certificate->course?->title_en ?: 'Course of Study');

            $orgNameEn = !empty($template['org_name_en']) ? $template['org_name_en'] : 'Sohag University';
            $centerNameEn = !empty($template['center_name_en']) ? $template['center_name_en'] : 'Center for Continuing Education & Development (SUCED)';
            $certTitleEn = !empty($template['certificate_title_en']) ? $template['certificate_title_en'] : 'Certificate of Completion';
            $introTextEn = !empty($template['introduction_text_en']) ? $template['introduction_text_en'] : 'This is officially certified to acknowledge that';
            $completionTextEn = !empty($template['completion_text_en']) ? $template['completion_text_en'] : 'has successfully completed all prescribed coursework, assessments, and requirements for';

            $signatory1NameEn = !empty($template['signatory1_name']) ? $template['signatory1_name'] : 'Dr. Mostafa Kamel';
            $signatory1TitleEn = !empty($template['signatory1_title']) ? $template['signatory1_title'] : 'Director of Continuing Education';
            $signatory2NameEn = !empty($template['signatory2_name']) ? $template['signatory2_name'] : 'Prof. Dr. Hassan El-Noubi';
            $signatory2TitleEn = !empty($template['signatory2_title']) ? $template['signatory2_title'] : 'President, Sohag University';

            $gradeWord = $certificate->score_percentage >= 85 ? 'Passed with Distinction' : 'Successfully Passed';
            $gradeText = 'Final Grade: ' . number_format($certificate->score_percentage, 1) . '% • ' . $gradeWord;

            $content = [
                'org_name' => $orgNameEn,
                'center_name' => $centerNameEn,
                'certificate_title' => $certTitleEn,
                'intro_text' => $introTextEn,
                'student_name' => $studentNameEn,
                'completion_text' => $completionTextEn,
                'course_title' => $courseTitleEn,
                'grade_badge' => $gradeText,
                'signatory1_name' => $signatory1NameEn,
                'signatory1_title' => $signatory1TitleEn,
                'signatory2_name' => $signatory2NameEn,
                'signatory2_title' => $signatory2TitleEn,
                'verified_stamp' => '✓ VERIFIED CREDENTIAL',
                'serial_label' => 'Serial No:',
                'issue_date_label' => 'Issue Date:',
                'verify_label' => 'Verify at:',
            ];
        }

        $pdf = Pdf::loadView('certificates.pdf', [
            'certificate' => $certificate,
            'student' => $certificate->user,
            'course' => $certificate->course,
            'template' => $template,
            'lang' => $lang,
            'content' => $content,
            'verificationUrl' => route('verify.show', ['code' => $certificate->public_code]),
        ]);

        $pdf->setPaper('a4', 'landscape');
        $pdf->setOption([
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled' => true,
            'defaultFont' => 'DejaVu Sans',
        ]);

        return $pdf;
    }

    /**
     * Download certificate PDF in specific language ('ar' or 'en').
     */
    public function downloadPdf(Certificate $certificate, ?string $lang = null): Response
    {
        $lang = $lang ?: (request()->get('lang') ?: app()->getLocale());
        $lang = in_array(strtolower($lang), ['ar', 'en']) ? strtolower($lang) : 'en';

        $pdf = $this->generatePdf($certificate, $lang);
        $fileName = 'SUCED_Certificate_' . $certificate->certificate_number . '_' . strtoupper($lang) . '.pdf';

        return $pdf->download($fileName);
    }

    /**
     * Preview sample certificate for a course using customized template settings in specific language.
     */
    public function previewPdf(Course $course, ?array $overrideTemplate = null, string $lang = 'en'): \Barryvdh\DomPDF\PDF
    {
        $lang = in_array(strtolower($lang), ['ar', 'en']) ? strtolower($lang) : 'en';
        $template = array_merge($course->getCertificateTemplate(), $overrideTemplate ?? []);

        $dummyCert = new Certificate([
            'public_code' => 'preview-sample-uuid-000000',
            'certificate_number' => 'SUCED-PREVIEW-' . ($course->code ?: 'SAMPLE'),
            'student_name' => $lang === 'ar' ? 'أحمد منصور بدوي' : 'Ahmed Mansour Badawi',
            'course_title_en' => $course->title_en ?: 'Sample Course Title',
            'course_title_ar' => $course->title_ar ?: 'عنوان المقرر التدريبي التجريبي',
            'score_percentage' => 98.5,
            'issue_date' => now()->toDateString(),
            'template_data' => $template,
            'is_revoked' => false,
        ]);

        $dummyCert->setRelation('course', $course);

        return $this->generatePdf($dummyCert, $lang);
    }
}
