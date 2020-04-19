<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class FixNamingAndRemoveUserId extends Migration
{
    public function __construct()
    {
        DB::getDoctrineSchemaManager()->getDatabasePlatform()->registerDoctrineTypeMapping('enum', 'string');
    }
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('trips', function (Blueprint $table) {
            $table->renameColumn('passanger_count', 'passenger_count');
            $table->dropColumn('user_id');
            $table->dropColumn('status');
            $table->integer('trip_status')->default(1);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('trips', function (Blueprint $table) {
            $table->integer('user_id');
            $table->renameColumn('passenger_count', 'passanger_count');
            $table->enum('status', ['open', 'closed'])->default('open');
        });
    }
}
