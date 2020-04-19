<?php

namespace App\Repositories;

use App\TripPassenger;
use App\Trip;

class TripPassengerRepository
{
    
    public function isalreadyJoinedAsPassenger($trip_id, $user_id)
    {
        $is_already_joined = false;

        $user_passenger = TripPassenger::where('trip_id', $trip_id)->where('user_id', $user_id)->first();

        if (isset($user_passenger)) {
            $is_already_joined = !$is_already_joined;
        }

        return $is_already_joined;
    }

    
    public function isTripFull($trip_id)
    {
        $is_trip_full = false;

        $trip = Trip::where('id', $trip_id)->first();

        if ($trip->passanger_count == 0) {
            $is_trip_full = !$is_trip_full;
        }

        return $is_trip_full;
    }

}