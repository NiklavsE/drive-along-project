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
            $trip_passenger = new TripPassenger();
            $trip_passenger->trip_id = $trip_id;
            $trip_passenger->user_id = $user_id;
        } else {
            return false;
        }

        $trip->save();
        $trip_passenger->save();

        return true;
    }

    public function removePassenger($trip_id, $user_id)
    {   
        $deleted_trip_passenger_records = TripPassenger::where('user_id', $user_id)->delete();

        $trip = Trip::where('id', $trip_id)->first();
        $trip->incrementPassengerCount();
        $trip->save();

        return;
    }
}