<?php
namespace App\Services;

use App\Trip;
use App\TripPassenger;

class TripPassengerService
{
    public function addPassenger($trip_id, $user_id)
    {
        $trip = Trip::where('id', $trip_id)->first();

        if ($trip->passanger_count != 0) {
            $trip->decrementPassangerCount();
            $trip_passenger = new TripPassenger($trip_id, $user_id);
        } else {
            return false;
        }

        $trip->save();
        $trip_passenger->save();

        return true;
    }

    public function removePassenger($trip, $user)
    {

    }
}