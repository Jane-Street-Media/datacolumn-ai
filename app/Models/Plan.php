<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;

    protected $table = 'plans';

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
