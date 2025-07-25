<?php

use App\Enums\ChartStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('charts', function (Blueprint $table) {
            $table->id();
            $table->uuid();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('team_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('project_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('dataset_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('description')->nullable();
            $table->string('type');
            $table->jsonb('config');
            $table->jsonb('data');
            $table->jsonb('embed_settings');
            $table->integer('total_exports')->default(0);
            $table->string('status')->default(ChartStatus::ACTIVE->value);
            $table->integer('total_visits')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('charts');
    }
};
