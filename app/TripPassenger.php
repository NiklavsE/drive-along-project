<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TripPassenger extends Model
{
    public function __construct($trip_id, $user_id)
    {
        $this->trip_id = $trip_id;
        $this->user_id = $user_id;
    }

    /**
     * A Passenger belongs to a Trip.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function trip()
    {
        return $this->belongsTo(Trip::class);
    }

    /**
     * A Passenger belongs to a User.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
