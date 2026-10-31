<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlatformNotification extends Model
{
    use HasFactory;

    protected $table = 'platform_notifications';

    protected $fillable = [
        'user_id',
        'type',
        'title_ar',
        'title_en',
        'message_ar',
        'message_en',
        'action_url',
        'is_read',
    ];

    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getLocalizedTitle(string $locale = 'en'): string
    {
        return $locale === 'ar' ? $this->title_ar : $this->title_en;
    }

    public function getLocalizedMessage(string $locale = 'en'): string
    {
        return $locale === 'ar' ? $this->message_ar : $this->message_en;
    }
}
