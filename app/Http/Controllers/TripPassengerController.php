<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\TripPassengerService;
use App\Trip;
use App\TripPassenger;

class TripPassengerController extends Controller
{

    protected $passenger_service;

    public function __construct(TripPassengerService $passenger_service)
    {
        $this->passenger_service = $passenger_service;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, $trip_id)
    {
         // Get user from $request token.
         if (! $user = auth()->setRequest($request)->user()) {
            return $this->responseUnauthorized();
        }

        $participants = $this->passenger_service->getParticipants($trip_id, $user->id);

        return response()->json([
            'error' => false,
            'participants' => $participants
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $trip_id)
    {
        // Get user from $request token.
        if (! $user = auth()->setRequest($request)->user()) {
            return $this->responseUnauthorized();
        }

        $user = auth()->setRequest($request)->user();

        $passenger_add = $this->passenger_service->addPassenger((int)$trip_id, $user->id);

        return response()->json([
            'error' => $passenger_add != 'success' ? true : false,
            'status' => $passenger_add
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $user_id)
    {
        // Get user from $request token.
        if (! $user = auth()->setRequest($request)->user()) {
            return $this->responseUnauthorized();
        }

        $deleted_passenger = TripPassenger::where('user_id', $user_id)->delete();

        return response()->json([
            'error' => false
        ]);
    }
}
