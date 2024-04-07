<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            [
                'name' => 'admin',
                'email' => 'admin@test.com',
                'password' => Hash::make($_ENV['ADMIN_USER_PASSWORD']),
            ],
            [
                'name' => 'test',
                'email' => 'test@test.com',
                'password' => Hash::make($_ENV['TEST_USER_PASSWORD']),
            ],
        ]);
    }
}