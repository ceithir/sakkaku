<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContextualizedRollsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contextualized_rolls', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('user_id')
                ->nullable()
                ->index()
                ->constrained()
                ->onDelete('set null');
            $table->string('type');
            $table->string('campaign')->index();
            $table->string('character')->index();
            $table->text('description');
            $table->jsonb('roll');
            $table->jsonb('result')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('contextualized_rolls');
    }
}
