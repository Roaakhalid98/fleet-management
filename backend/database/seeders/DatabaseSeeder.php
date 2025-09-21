<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\GPSLocation;
use Database\Seeders\UserSeeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call(UserSeeder::class);

        $users = User::all();

        foreach ($users as $user) {
            Vehicle::factory(rand(2, 3))->create([
                'user_id' => $user->id,
            ])->each(function ($vehicle) {
                $lat = 31.945;
                $lng = 35.928;
                $count = rand(5, 10);

                for ($i = 0; $i < $count; $i++) {
                    $lat += mt_rand(-50, 50) / 10000;
                    $lng += mt_rand(-50, 50) / 10000;

                    GpsLocation::insert([
                        'vehicle_id' => $vehicle->id,
                        'latitude' => $lat,
                        'longitude' => $lng,
                        'created_at' => now()->subMinutes($count - $i),
                    ]);
                }
            });
        }
    }
}
