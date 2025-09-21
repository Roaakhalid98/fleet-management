<?php

namespace App\Helpers;

class GeoHelper
{
    /**
     * Calculate the distance between two GPS points using the Haversine formula
     *
     * @param float $lat1
     * @param float $lon1
     * @param float $lat2
     * @param float $lon2
     * @param string $unit 'km' or 'miles'
     * @return float
     */
    public static function haversine($lat1, $lon1, $lat2, $lon2, $unit = 'km')
    {
        $earthRadius = ($unit === 'km') ? 6371 : 3958.8; // Radius of Earth

        $latFrom = deg2rad($lat1);
        $lonFrom = deg2rad($lon1);
        $latTo = deg2rad($lat2);
        $lonTo = deg2rad($lon2);

        $latDelta = $latTo - $latFrom;
        $lonDelta = $lonTo - $lonFrom;

        $a = sin($latDelta / 2) ** 2 +
            cos($latFrom) * cos($latTo) * sin($lonDelta / 2) ** 2;

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }

    /**
     * Calculate total distance for a collection of GPS locations
     *
     * @param \Illuminate\Support\Collection $locations
     * @param string $unit
     * @return float
     */
    public static function totalDistance($locations, $unit = 'km')
    {
        return $locations->reduce(function ($carry, $location, $key) use ($locations, $unit) {
            if ($key === 0) return 0;
            $prev = $locations[$key - 1];
            return $carry + self::haversine(
                    $prev->latitude,
                    $prev->longitude,
                    $location->latitude,
                    $location->longitude,
                    $unit
                );
        }, 0);
    }
}
