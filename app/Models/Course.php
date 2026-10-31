<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'code',
        'title_ar',
        'title_en',
        'description_ar',
        'description_en',
        'thumbnail',
        'certificate_template',
        'department',
        'duration_weeks',
        'duration_hours',
        'rating',
        'reviews_count',
        'passing_score',
        'is_published',
        'requirements_ar',
        'requirements_en',
        'created_by',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'published_at' => 'datetime',
            'rating' => 'decimal:2',
            'duration_weeks' => 'integer',
            'duration_hours' => 'integer',
            'passing_score' => 'integer',
            'certificate_template' => 'array',
        ];
    }

    protected static function booted()
    {
        static::creating(function ($course) {
            if (empty($course->slug)) {
                $course->slug = Str::slug($course->title_en ?: 'course-' . Str::random(6));
            }
        });
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function teachers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'course_teachers')
            ->withPivot('role_title_en', 'role_title_ar')
            ->withTimestamps();
    }

    public function lectures(): HasMany
    {
        return $this->hasMany(Lecture::class)->orderBy('position');
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'enrollments')
            ->withPivot('status', 'enrolled_at', 'completed_at')
            ->withTimestamps();
    }

    public function exams(): HasMany
    {
        return $this->hasMany(Exam::class);
    }

    public function finalExam()
    {
        return $this->hasOne(Exam::class)->where('is_final', true)->latest();
    }

    public function certificates(): HasMany
    {
        return $this->hasMany(Certificate::class);
    }

    public function getLocalizedTitle(string $locale = 'en'): string
    {
        return $locale === 'ar' ? $this->title_ar : $this->title_en;
    }

    public function getLocalizedDescription(string $locale = 'en'): string
    {
        return $locale === 'ar' ? $this->description_ar : $this->description_en;
    }

    /**
     * Get customized certificate template settings with fallback defaults.
     */
    public function getCertificateTemplate(): array
    {
        $defaults = [
            'theme' => 'classic_navy', // classic_navy, royal_gold, emerald_heritage, burgundy_excellence, slate_modern
            'border_style' => 'classic_double', // classic_double, modern_clean, vintage_ornate
            'org_name_en' => 'Sohag University',
            'org_name_ar' => 'جامعة سوهاج',
            'center_name_en' => 'Center for Continuing Education & Development (SUCED)',
            'center_name_ar' => 'مركز التعليم المستمر وتطوير القدرات',
            'certificate_title_en' => 'Certificate of Completion',
            'certificate_title_ar' => 'شهادة إتمام معتمدة',
            'introduction_text_en' => 'This is officially certified to acknowledge that',
            'introduction_text_ar' => 'تشهد إدارة مركز التعليم المستمر وتطوير القدرات بأن المتدرب /',
            'completion_text_en' => 'has successfully completed all prescribed coursework, assessments, and requirements for',
            'completion_text_ar' => 'قد اجتاز بنجاح كافة متطلبات البرنامج التدريبي والاختبارات المقررة لمقرر',
            'signatory1_name' => 'Dr. Mostafa Kamel',
            'signatory1_title' => 'Director of Continuing Education',
            'signatory1_name_ar' => 'د. مصطفى كامل',
            'signatory1_title_ar' => 'مدير مركز التعليم المستمر',
            'signatory2_name' => 'Prof. Dr. Hassan El-Noubi',
            'signatory2_title' => 'President, Sohag University',
            'signatory2_name_ar' => 'أ.د. حسان النعماني',
            'signatory2_title_ar' => 'رئيس الجامعة',
            'show_qr' => true,
            'show_grade' => true,
            'show_watermark' => true,
        ];

        return array_merge($defaults, $this->certificate_template ?? []);
    }
}
