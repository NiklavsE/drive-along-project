<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TripRoute extends Model
{
    protected $guarded = [];

    /**
     * A Route has many Trips
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function trips()
    {
        return $this->hasMany(Trip::class);
    }
}
