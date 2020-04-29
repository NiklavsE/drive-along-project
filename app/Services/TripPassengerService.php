<?php
namespace App\Services;

use App\Repositories\TripPassengerRepository;
use App\Trip;
use App\TripPassenger;
use App\User;

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
        
        $passenger_validation = $this->validatePassenger($trip_id, $user_id);
        
        if ($passenger_validation == 'success') {
            $trip->decrementPassengerCount();
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

    public function validatePassenger($trip_id, $user_id)
    {
        if ($this->passenger_repository->isTripFull($trip_id, $user_id)) {
            return 'trip full';
        } else if ($this->passenger_repository->isalreadyJoinedAsPassenger($trip_id, $user_id)) {
            return 'is already joined';
        } else if ($this->passenger_repository->isRestricted($trip_id, $user_id)) {
            return 'day limit';
        } else {
            return 'success';
        }
    }

    public function getPassengers($trip_id)
    {
        $participants = array();

        $passenger_ids = TripPassenger::where('trip_id', $trip_id)->pluck('user_id')->toArray();

        if (isset($passenger_ids)) { 
            $users = User::whereIn('id', $passenger_ids)->get();

            if (isset($users)) { 
                foreach($users as $user) {
                    $participants[] = [
                        'id' => $user->id,
                        'name' => $user->name . ' ' . $user->surname
                    ];
                }
            }
        }

        return $participants;
    }
}