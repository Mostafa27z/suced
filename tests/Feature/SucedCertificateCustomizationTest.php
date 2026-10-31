<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\User;
use App\Services\CertificateService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SucedCertificateCustomizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_customize_certificate_theme_and_signatories_per_course(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $course = Course::create([
            'slug' => 'ai-diploma',
            'code' => 'AI-500',
            'title_en' => 'Executive AI Diploma',
            'title_ar' => 'الدبلومة التنفيذية في الذكاء الاصطناعي',
            'duration_hours' => 60,
            'is_published' => true,
        ]);

        $customTemplate = [
            'theme' => 'emerald_heritage',
            'border_style' => 'vintage_ornate',
            'org_name_en' => 'Sohag University AI Institute',
            'org_name_ar' => 'معهد الذكاء الاصطناعي بجامعة سوهاج',
            'center_name_en' => 'Faculty of Computers & Artificial Intelligence',
            'center_name_ar' => 'كلية الحاسبات والذكاء الاصطناعي',
            'certificate_title_en' => 'Professional Executive Diploma',
            'certificate_title_ar' => 'دبلوم مهني تنفيذي معتمد',
            'introduction_text_en' => 'This is to formally certify that',
            'completion_text_en' => 'has fulfilled all academic and practical requirements for the completion of',
            'signatory1_name' => 'Prof. Dr. Magdy El-Sayed',
            'signatory1_title' => 'Dean of Faculty of Computers',
            'signatory1_name_ar' => 'أ.د. مجدي السيد',
            'signatory1_title_ar' => 'عميد كلية الحاسبات والذكاء الاصطناعي',
            'signatory2_name' => 'Prof. Dr. Khaled Abdel-Ghaffar',
            'signatory2_title' => 'Vice President for Academic Affairs',
            'signatory2_name_ar' => 'أ.د. خالد عبد الغفار',
            'signatory2_title_ar' => 'نائب رئيس الجامعة للشؤون الأكاديمية',
            'show_qr' => true,
            'show_grade' => true,
            'show_watermark' => false,
        ];

        $response = $this->actingAs($admin)->post(
            route('admin.courses.certificate-template', $course->id),
            $customTemplate
        );

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();

        $course->refresh();
        $this->assertEquals('emerald_heritage', $course->certificate_template['theme']);
        $this->assertEquals('vintage_ornate', $course->certificate_template['border_style']);
        $this->assertEquals('Prof. Dr. Magdy El-Sayed', $course->certificate_template['signatory1_name']);
        $this->assertEquals('عميد كلية الحاسبات والذكاء الاصطناعي', $course->certificate_template['signatory1_title_ar']);
        $this->assertEquals('Prof. Dr. Khaled Abdel-Ghaffar', $course->certificate_template['signatory2_name']);
    }

    public function test_non_admin_cannot_customize_certificate_template(): void
    {
        $student = User::factory()->create(['role' => 'student']);
        $course = Course::create([
            'slug' => 'biz-course',
            'code' => 'BIZ-101',
            'title_en' => 'Business Course',
            'title_ar' => 'دورة الأعمال',
            'duration_hours' => 20,
            'is_published' => true,
        ]);

        $response = $this->actingAs($student)->post(
            route('admin.courses.certificate-template', $course->id),
            ['theme' => 'royal_gold']
        );

        $response->assertForbidden();
    }

    public function test_admin_can_preview_course_certificate_pdf(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $course = Course::create([
            'slug' => 'sample-course',
            'code' => 'SAMPLE-99',
            'title_en' => 'Sample Course',
            'title_ar' => 'دورة تجريبية',
            'duration_hours' => 15,
            'is_published' => true,
            'certificate_template' => [
                'theme' => 'royal_gold',
                'border_style' => 'modern_clean',
                'signatory1_name' => 'Center Director',
                'signatory1_title' => 'Academic Director',
                'signatory2_name' => 'Dean of University Faculty',
                'signatory2_title' => 'Dean of College',
            ],
        ]);

        $response = $this->actingAs($admin)->get(
            route('admin.courses.certificate-preview', $course->id)
        );

        $response->assertOk();
        $this->assertEquals('application/pdf', $response->headers->get('content-type'));
    }
}
