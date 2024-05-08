<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'payment_method',
        'items_price',
        'tax_price',
        'total_price',
        'is_paid',
        'paid_at',
        'is_done',
        'done_at',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'order_product')
        ->withPivot(['id', 'quantity']);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
