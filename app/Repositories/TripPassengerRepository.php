<?php

namespace App\Repositories;

use App\TripPassenger;
use App\Trip;
use App\TripRoute;
use Illuminate\Support\Carbon;

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

        if ($trip->passenger_count == 0) {
            $is_trip_full = !$is_trip_full;
        }

        return $is_trip_full;
    }

    public function isRestricted($trip_id, $user_id) 
    {
        $is_restricted = false;

        $today = Carbon::today();

        $trip_to_join = Trip::where('id', $trip_id)->first();
        $route_to_join = TripRoute::where('id', $trip_to_join->route_id)->first();

        // route to join return route
        $return_route_arr = array($route_to_join->from, $route_to_join->to);

        $existing_passenger = TripPassenger::where('user_id', $user_id)->WhereDate('created_at', $today)->first();
        
        if ($existing_passenger) {
            $existing_trips = Trip::where('id', $existing_passenger->trip_id);
    
            if ($existing_trips->count() > 1) {
                $is_restricted = true;
            } else {
                $existing_trip = $existing_trips->first();
                $existing_trip_route = TripRoute::where('id', $existing_trip->route_id)->first();
                
                $existing_route_arr = array($existing_trip_route->to, $existing_trip_route->from);
                
                // compare if trip to join route is not a return route
                if ($return_route_arr != $existing_route_arr) {
                    $is_restricted = true;
                }
            }
        }

        return $is_restricted;
    }
}