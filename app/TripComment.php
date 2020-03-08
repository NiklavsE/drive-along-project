<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TripComment extends Model
{
    protected $guarded = [];

    /**
     * A Comment belongs to a Trip.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function trip()
    {
        return $this->belongsTo(Trip::class);
    }

    /**
     * A Comment belongs to a User.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function authour()
    {
        return $this->belongsTo(User::class);
    }
}
