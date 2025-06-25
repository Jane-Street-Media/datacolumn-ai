<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('chargebee_id')->unique();
            $table->string('display_name');
            $table->string('description')->nullable();
            $table->integer('price');
            $table->string('chargebee_product');
            $table->string('frequency');
            $table->string('currency')->default('USD');
            $table->json('features')->nullable();
            $table->integer('quantity')->default(1);
            $table->json('details')->nullable();
            $table->json('limitations')->nullable();
            $table->string('cta')->nullable();
            $table->boolean('popular')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
