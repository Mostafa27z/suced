<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lecture extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'title_ar',
        'title_en',
        'description_ar',
        'description_en',
        'youtube_url',
        'embed_url',
        'resource_path',
        'position',
        'duration_minutes',
        'is_published',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'position' => 'integer',
            'duration_minutes' => 'integer',
        ];
    }

    public static function extractYouTubeVideoId(string $url): ?string
    {
        $patterns = [
            '#(?:https?://)?(?:www\.)?(?:youtube\.com/(?:watch\?v=|embed/|v/)|youtu\.be/)([a-zA-Z0-9_-]{11})#i',
            '#(?:https?://)?(?:www\.)?youtube\.com/shorts/([a-zA-Z0-9_-]{11})#i',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, trim($url), $matches)) {
                return $matches[1];
            }
        }

        return null;
    }

    public static function generateEmbedUrl(string $url): string
    {
        $videoId = static::extractYouTubeVideoId($url);
        if ($videoId) {
            return "https://www.youtube-nocookie.com/embed/{$videoId}?rel=0&modestbranding=1&enablejsapi=1";
        }
        return '';
    }

    protected static function booted()
    {
        static::saving(function ($lecture) {
            if (!empty($lecture->youtube_url)) {
                $lecture->embed_url = static::generateEmbedUrl($lecture->youtube_url);
            }
        });
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function progress(): HasMany
    {
        return $this->hasMany(LectureProgress::class);
    }

    public function isCompletedBy(?User $user): bool
    {
        if (!$user) {
            return false;
        }

        return $this->progress()->where('user_id', $user->id)->where('completed', true)->exists();
    }

    public function getLocalizedTitle(string $locale = 'en'): string
    {
        return $locale === 'ar' ? $this->title_ar : $this->title_en;
    }

    public function getLocalizedDescription(string $locale = 'en'): string
    {
        return $locale === 'ar' ? $this->description_ar : $this->description_en;
    }
}
