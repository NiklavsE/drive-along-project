<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Trip;
use App\TripPassenger;
use App\Services\TripPassengerService;
use App\TripComment;
use App\Repositories\TripCommentsRepository;
use App\User;

class UserTripController extends ApiController
{

    protected $passenger_service;

    protected $trip_comment_repository;

    public function __construct(TripPassengerService $passenger_service, TripCommentsRepository $trip_comment_repository)
    {
        $this->passenger_service = $passenger_service;
        $this->trip_comment_repository = $trip_comment_repository;
    }

    public function index(Request $request)
    {
        $trips_array = array();

        // Get user from $request token.
        if (!$user = auth()->setRequest($request)->user()) {
            return $this->responseUnauthorized();
        }

        // TO-DO write a repository for this
        $user_trip_ids = TripPassenger::where('user_id', $user->id)->pluck('trip_id');
        $trips = Trip::whereIn('id', $user_trip_ids)->get();

        $trip_comments = $this->trip_comment_repository->getMappedTripComments($user_trip_ids);

        foreach ($trips as $trip) {
            $driver = User::Where('id', $trip->user_id)->first();

            $trips_array[] = [
                "starting_point" => $trip->starting_point,
                "destination" => $trip->destination,
                "time" => $trip->time,
                "id" => $trip->id,
                "passenger_count" => $trip->passanger_count,
                "driver" => $driver->name . ' ' . $driver->surname,
                "comments" => isset($trip_comments[$trip->id]) ? $trip_comments[$trip->id] : [],
            ];
        }

        return response()->json($trips_array);
    }

    public function destroy($trip_id, Request $request)
    {
        // Get user from $request token.
        if (!$user = auth()->setRequest($request)->user()) {
            return $this->responseUnauthorized();
        }

        $passenger_deleted = $this->passenger_service->removePassenger();

        return response()->json([
            'error' => $passenger_deleted ? false : true
        ]);
    }
}
