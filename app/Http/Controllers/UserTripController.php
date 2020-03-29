<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Trip;
use App\TripPassenger;
use App\Services\TripPassengerService;

class UserTripController extends Controller
{

    protected $passenger_service;

    public function __construct(TripPassengerService $passenger_service)
    {
        $this->passenger_service = $passenger_service;
    }

    public function index(Request $request)
    {
        // Get user from $request token.
        if (!$user = auth()->setRequest($request)->user()) {
            return $this->responseUnauthorized();
        }

        // TO-DO write a repository for this
        $user_trip_ids = TripPassenger::where('user_id', $user->id)->pluck('trip_id');
        $trips = Trip::whereIn('id', $user_trip_ids)->get();


        return response()->json($trips);
    }

    public function destroy($trip_id, Request $request)
    {
        // Get user from $request token.
        if (!$user = auth()->setRequest($request)->user()) {
            return $this->responseUnauthorized();
        }

        $passenger_deleted = $this->passenger_service->removePassenger();

        return response()->json([
            'error' => $passenger_added ? false : true
        ]);
    }
}
