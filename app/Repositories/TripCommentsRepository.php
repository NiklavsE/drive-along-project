<?php

namespace App\Repositories;

use App\TripComment;
use App\Trip;
use App\User;

class TripCommentsRepository 
{
    /**
     * Get all trip comments.
     *
     * @param  array  $trips
     * @return array $comment_array
     */

    public function getTripComments($trips)
    {
        $comment_array = array();

        foreach ($trips as $trip) {
            $comments = TripComment::where('trip_id', $trip)->get();
            
            if (isset($comments)) {
                foreach ($comments as $comment) {
                    $user = User::where('id', $comment->user_id)->first();
    
                    $comment_array[$trip][] = [
                        'id' => $comment->id,
                        'text' => $comment->text,
                        'author' => $user->name . ' ' . $user->surname,
                        'timestamp' => $comment->created_at->format('d-m-y h:i:s'),
                    ];
                }
            }
        }

        return $comment_array;
    }
} 