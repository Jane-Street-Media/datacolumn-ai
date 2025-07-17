<?php

namespace App\Models;

use App\Enums\NotificationType;
use Illuminate\Database\Eloquent\Model;

class NotificationTemplate extends Model
{
    protected $fillable = [
        'name',
        'type',
        'subject',
        'message',
    ];

    protected $casts = [
        'type' => NotificationType::class,
    ];
}
