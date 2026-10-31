<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class CourseTeacher extends Pivot
{
    protected $table = 'course_teachers';

    protected $fillable = [
        'course_id',
        'user_id',
        'role_title_en',
        'role_title_ar',
    ];
}
