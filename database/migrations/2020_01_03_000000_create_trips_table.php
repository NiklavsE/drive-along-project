<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatetripsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('trips', function (Blueprint $table) {
            $table->timestamps();
            $table->increments('id');
            $table->integer('user_id');
            $table->integer('driver_id');
            $table->integer('route_id');
            $table->string('destination');
            $table->string('starting_point');
            $table->integer('passanger_count');
            $table->dateTime('time', 0);
            $table->enum('status', ['open', 'closed'])->default('open');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('trips');
    }
}
