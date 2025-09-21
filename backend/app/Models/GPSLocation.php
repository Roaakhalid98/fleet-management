<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class GPSLocation extends Model
{
    use HasFactory;
    protected   $table = 'gps_locations';
    protected $fillable = ['vehicle_id', 'latitude', 'longitude', 'timestamp'];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }
}
