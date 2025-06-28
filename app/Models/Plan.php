<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;

    protected $table = 'plans';

    const FREE_PLAN = 'free plan';

    public const FREE_PLAN_NO_OF_FOLDERS = 3;

    public const FREE_PLAN_NO_OF_PROJECTS = 100;

    public const FREE_PLAN_NO_OF_INVITATIONS = 3;

    protected $fillable = [
        'chargebee_id',
        'display_name',
        'description',
        'price',
        'chargebee_product',
        'frequency',
        'currency',
        'quantity',
        'features',
        'details',
        'limitations',
        'cta',
        'popular',
    ];

    protected $casts = [
        'features' => 'array',
        'details' => 'array',
        'limitations' => 'array',
    ];
}
