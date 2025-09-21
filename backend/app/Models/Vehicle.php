<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\GPSLocation;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Vehicle extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'plate_number', 'brand', 'model'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function gpsLocations()
    {
        return $this->hasMany(GPSLocation::class);
    }
}
