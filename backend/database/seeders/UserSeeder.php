<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name' => 'user1',
            'email' => 'user1@user1.com',
            'password' => Hash::make('password123'),
        ]);

        User::create([
            'name' => 'user2',
            'email' => 'user2@user2.com',
            'password' => Hash::make('password123'),
        ]);

        User::create([
            'name' => 'user3',
            'email' => 'user3@user3.com',
            'password' => Hash::make('password123'),
        ]);

    }
}
