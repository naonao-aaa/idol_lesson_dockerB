<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('products')->insert([
            [
                'name' => "ダンスレッスン",
                'user_id' => 1,
                'image' => "/images/dance_tanpatukeiyaku.png",
                'description' => "1時間のダンスレッスンをします！",
                'contract_type' => "単発契約",
                'category' => "dance",
                'price' => 1500,
                'rating' => 4.5,
                'num_reviews' => 12,
            ],
            [
                'name' => "ボーカルレッスン",
                'user_id' => 1,
                'image' => "/images/vocal_tanpatukeiyaku.png",
                'description' => "1時間のボーカルレッスンをします！",
                'contract_type' => "単発契約",
                'category' => "vocal",
                'price' => 1600,
                'rating' => 4.0,
                'num_reviews' => 8,
            ],
            [
                'name' => "メイクレッスン",
                'user_id' => 1,
                'image' => "/images/make_tanpatukeiyaku.png",
                'description' => "1時間のメイクレッスンをします！",
                'contract_type' => "単発契約",
                'category' => "make",
                'price' => 1800,
                'rating' => 3,
                'num_reviews' => 12,
            ],
            [
                'name' => "食事管理方法伝授",
                'user_id' => 1,
                'image' => "/images/shokujikanri_tanpatukeiyaku.png",
                'description' => "1時間で、食事管理についてのコツや疑問にお答えします！",
                'contract_type' => "単発契約",
                'category' => "others",
                'price' => 1200,
                'rating' => 5,
                'num_reviews' => 12,
            ],
            [
                'name' => "週一ダンスレッスン",
                'user_id' => 1,
                'image' => "/images/dance_tukikeiyaku.png",
                'description' => "週1で、ダンスのレッスンを行います！1回のレッスンは45分です！",
                'contract_type' => "月契約",
                'category' => "dance",
                'price' => 5000,
                'rating' => 4.5,
                'num_reviews' => 10,
            ],
            [
                'name' => "週一ボーカルレッスン",
                'user_id' => 1,
                'image' => "/images/vocal_tukikeiyaku.png",
                'description' =>
                  "週1で、ボーカルのレッスンを行います！1回のレッスンは45分です！",
                'contract_type' => "月契約",
                'category' => "vocal",
                'price' => 5500,
                'rating' => 4,
                'num_reviews' => 8,
            ],
        ]);
    }
}
