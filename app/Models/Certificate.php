<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Certificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'public_code',
        'certificate_number',
        'user_id',
        'course_id',
        'student_name',
        'course_title_en',
        'course_title_ar',
        'score_percentage',
        'issue_date',
        'is_revoked',
        'revocation_reason',
        'template_version',
        'template_data',
    ];

    protected function casts(): array
    {
        return [
            'score_percentage' => 'decimal:2',
            'issue_date' => 'date',
            'is_revoked' => 'boolean',
            'template_data' => 'array',
        ];
    }

    protected static function booted()
    {
        static::creating(function ($certificate) {
            if (empty($certificate->public_code)) {
                $certificate->public_code = (string) Str::uuid();
            }
            if (empty($certificate->certificate_number)) {
                $year = date('Y');
                $courseCode = $certificate->course?->code ?: 'CERT';
                $certificate->certificate_number = sprintf('SUCED-%s-%s-%s', $year, $courseCode, strtoupper(Str::random(6)));
            }
            if (empty($certificate->template_data) && $certificate->course) {
                $certificate->template_data = $certificate->course->getCertificateTemplate();
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function getVerificationUrl(): string
    {
        return route('verify.show', ['code' => $this->public_code]);
    }

    /**
     * Get active template data for this certificate.
     */
    public function getTemplateData(): array
    {
        if (!empty($this->template_data)) {
            return $this->template_data;
        }

        if ($this->course) {
            return $this->course->getCertificateTemplate();
        }

        return (new Course())->getCertificateTemplate();
    }
}
