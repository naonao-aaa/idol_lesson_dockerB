<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('image');
            // $table->string('category');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->text('description');
            // $table->decimal('rating', 3, 1)->default(0);
            // $table->unsignedInteger('num_reviews')->default(0);
            $table->integer('price')->default(0);
            $table->enum('contract_type', ['月契約', '単発契約']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
};
