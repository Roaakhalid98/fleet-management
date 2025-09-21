<?php
// database/factories/VehicleFactory.php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class VehicleFactory extends Factory
{
    protected $model = \App\Models\Vehicle::class;

    public function definition()
    {
        return [
            'user_id' => null, // will assign in seeder
            'plate_number' => strtoupper($this->faker->bothify('???###')),
            'brand' => $this->faker->company(),
            'model' => $this->faker->year(),
        ];
    }
}
