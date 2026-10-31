<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_id',
        'question_text_ar',
        'question_text_en',
        'question_type', // multiple_choice, true_false
        'points',
        'position',
        'explanation_ar',
        'explanation_en',
    ];

    protected function casts(): array
    {
        return [
            'points' => 'decimal:1',
            'position' => 'integer',
        ];
    }

    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }

    public function options(): HasMany
    {
        return $this->hasMany(QuestionOption::class)->orderBy('position');
    }

    public function correctOption()
    {
        return $this->hasOne(QuestionOption::class)->where('is_correct', true);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(ExamAttemptAnswer::class);
    }

    public function getLocalizedQuestionText(string $locale = 'en'): string
    {
        return $locale === 'ar' ? $this->question_text_ar : $this->question_text_en;
    }

    public function getLocalizedExplanation(string $locale = 'en'): ?string
    {
        return $locale === 'ar' ? $this->explanation_ar : $this->explanation_en;
    }
}
