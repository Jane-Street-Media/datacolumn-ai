<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;

    protected $table = 'plans';

    const FREE_PLAN = 'free plan';

    protected $fillable = [
        'chargebee_id',
        'display_name',
        'price',
        'chargebee_product',
        'frequency',
        'currency',
        'quantity',
        'features',
    ];

    protected $casts = [
        'features' => 'array',
    ];
}
