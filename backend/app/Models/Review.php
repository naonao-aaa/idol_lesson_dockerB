<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = ['product_id', 'rating', 'user_id', 'comment'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
