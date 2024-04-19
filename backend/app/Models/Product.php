<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'name', 'price', 'image', 'contract_type', 'category_id', 'description'];

    public function orders()
    {
        return $this->belongsToMany(Order::class, 'order_product')
        ->withPivot(['id', 'quantity']);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
