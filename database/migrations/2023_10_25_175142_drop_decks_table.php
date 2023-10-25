<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DropDecksTable extends Migration
{
    public function up()
    {
        Schema::drop('decks');
        // Dirty to that here, but not worth the "clean" way (with a command and all)
        DB::table('contextualized_rolls')->where('type', 'card')->delete();
    }

    public function down()
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
}
