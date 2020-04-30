<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group.
|
*/

// Auth Endpoints
Route::group([
    'prefix' => 'v1/auth'
], function ($router) {
    Route::post('login', 'Auth\LoginController@login');
    Route::post('logout', 'Auth\LogoutController@logout');
    Route::post('register', 'Auth\RegisterController@register');
    Route::post('forgot-password', 'Auth\ForgotPasswordController@email');
    Route::post('password-reset', 'Auth\ResetPasswordController@reset');
});

// Resource Endpoints
Route::group([
    'prefix' => 'v1'
], function ($router) {
    Route::apiResource('routes', 'TripRoutesController');
    Route::get('trips/{route_id}', 'TripController@index');
    Route::delete('trips/{trip_id}', 'TripController@destroy');
    Route::post('trip-passenger/{trip_id}', 'TripPassengerController@store');
    Route::delete('trip-passenger/{user_id}', 'TripPassengerController@destroy');
    Route::get('trip-passenger/{trip_id}', 'TripPassengerController@index');
    Route::get('user-trips', 'UserTripController@index');
    Route::post('comment/{trip_id}', 'TripCommentController@store');
    Route::get('comments/{trip_id}', 'TripCommentController@index');
    Route::delete('user-trips/{trip_id}', 'UserTripController@destroy');
    Route::post('user-trip', 'UserTripController@create');
});

// Not Found
Route::fallback(function(){
    return response()->json(['message' => 'Resource not found.'], 404);
});
