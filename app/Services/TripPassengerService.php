<?php
namespace App\Services;

use App\Repositories\TripPassengerRepository;
use App\Trip;
use App\TripPassenger;

class TripPassengerService
{
    protected $passenger_repository;

    public function __construct(TripPassengerRepository $passenger_repository)
    {
        $this->passenger_repository = $passenger_repository;
    }

    public function addPassenger($trip_id, $user_id)
    {
        $trip = Trip::where('id', $trip_id)->first();
        
        $passenger_validation = $this->passengerValidation($trip_id, $user_id);
        
        if ($passenger_validation == 'success') {
            $trip->decrementPassangerCount();
            $trip_passenger = new TripPassenger();
            $trip_passenger->trip_id = $trip_id;
            $trip_passenger->user_id = $user_id;
            $trip->save();
            $trip_passenger->save();
            return $passenger_validation;
        } else {
            return $passenger_validation;
        }
    }

    public function removePassenger($trip_id, $user_id)
    {   
        $deleted_trip_passenger_records = TripPassenger::where(
            array(
                'user_id' => $user_id, 
                'trip_id' => $trip_id
            )
        )->delete();

        $trip = Trip::where('id', $trip_id)->first();
        $trip->incrementPassengerCount();
        $trip->save();

        return true;
    }

    public function passengerValidation($trip_id, $user_id)
    {
        $return_array = [
            'is_already_joined',
            'trip_full',
            'success'

        ];

        if ($this->passenger_repository->isTripFull($trip_id, $user_id)) {
            return $return_array[1];
        } else if ($this->passenger_repository->isalreadyJoinedAsPassenger($trip_id, $user_id)) {
            return $return_array[0];
        } else {
            return $return_array[2];
        }
    }
}