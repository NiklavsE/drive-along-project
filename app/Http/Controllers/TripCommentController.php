<?php

namespace App\Http\Controllers;

use App\Repositories\TripCommentsRepository;
use App\TripComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Custom\Hasher;
use App\Http\Controllers\APIController;

class TripCommentController extends ApiController
{
    protected $trip_comment_repository;

    public function __construct(TripCommentsRepository $trip_comment_repository)
    {
        $this->trip_comment_repository = $trip_comment_repository;
    }

    public function index(Request $request, $trip_id)
    {
        $comments = $this->trip_comment_repository->getTripComments($trip_id);

        return response()->json([
            "trip_id" => $trip_id,
            "comments" => $comments
        ]);
    }

    public function store(Request $request, $trip_id)
    {   
        // Get user from $request token.
        if (!$user = auth()->setRequest($request)->user()) {
            return $this->responseUnauthorized();
        }

        $message = $request->getContent();

        $trip_comment = new TripComment();
        $trip_comment->text = $message;
        $trip_comment->user_id = $user->id;
        $trip_comment->trip_id = $trip_id;
        $trip_comment->save();

        return response()->json([
            'error' => false
        ]);
    }
}
