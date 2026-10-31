<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Exam extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'lecture_id',
        'title_ar',
        'title_en',
        'instructions_ar',
        'instructions_en',
        'duration_minutes',
        'passing_score',
        'max_attempts',
        'is_final',
        'randomize_questions',
        'randomize_options',
        'is_published',
        'available_from',
        'available_until',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'duration_minutes' => 'integer',
            'passing_score' => 'integer',
            'max_attempts' => 'integer',
            'is_final' => 'boolean',
            'randomize_questions' => 'boolean',
            'randomize_options' => 'boolean',
            'is_published' => 'boolean',
            'available_from' => 'datetime',
            'available_until' => 'datetime',
        ];
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function lecture(): BelongsTo
    {
        return $this->belongsTo(Lecture::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class)->orderBy('position');
    }

    public function attempts(): HasMany
    {
        return $this->hasMany(ExamAttempt::class);
    }

    public function attemptsForUser(int $userId): HasMany
    {
        return $this->hasMany(ExamAttempt::class)->where('user_id', $userId)->orderBy('attempt_number', 'desc');
    }

    public function hasUserPassed(int $userId): bool
    {
        return $this->attempts()->where('user_id', $userId)->where('passed', true)->exists();
    }

    public function getRemainingAttempts(int $userId): int
    {
        $used = $this->attempts()->where('user_id', $userId)->count();
        return max(0, $this->max_attempts - $used);
    }

    public function getLocalizedTitle(string $locale = 'en'): string
    {
        return $locale === 'ar' ? $this->title_ar : $this->title_en;
    }

    public function getLocalizedInstructions(string $locale = 'en'): string
    {
        return $locale === 'ar' ? $this->instructions_ar : $this->instructions_en;
    }
}
