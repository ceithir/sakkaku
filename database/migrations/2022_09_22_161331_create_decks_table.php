<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDecksTable extends Migration
{
    public function up()
    {
        Schema::create('decks', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->timestamps();
            $table->text('description');
            $table->jsonb('state');
            $table->foreignId('user_id')
                ->nullable()
                ->index()
                ->constrained()
                ->onDelete('set null')
            ;
        });
    }

    public function down()
    {
        Schema::dropIfExists('decks');
    }
}
