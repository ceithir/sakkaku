<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class MakeContextualizedRollsDescriptionNullable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('contextualized_rolls', function (Blueprint $table) {
            $table->text('description')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('contextualized_rolls', function (Blueprint $table) {
            $table->text('description')->nullable(false)->change();
        });
    }
}
