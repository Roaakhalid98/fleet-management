<?php

namespace App\Http\Controllers;

use App\Helpers\GeoHelper;
use App\Http\Requests\Vehicle\StoreGPSLocationRequest;
use App\Http\Requests\Vehicle\StoreVehicleRequest;
use App\Http\Requests\Vehicle\ShowVehicleRequest;
use App\Http\Requests\Vehicle\UpdateVehicleRequest;
use App\Http\Requests\Vehicle\DestroyVehicleRequest;
use App\Models\GPSLocation;
use App\Models\Vehicle;
use Illuminate\Http\Request;

class VehicleController extends Controller
{
    /**
     * List all vehicles for the logged-in user with pagination
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10);

        $vehicles = Vehicle::with('gpsLocations')
            ->where('user_id', auth()->id())
            ->paginate($perPage);

        $vehicles->getCollection()->transform(function ($vehicle) {
            $vehicle->total_distance = GeoHelper::totalDistance($vehicle->gpsLocations);
            return $vehicle;
        });

        return response()->json($vehicles);
    }

    /**
     * Create a new vehicle
     */
    public function store(StoreVehicleRequest $request)
    {
        $vehicle = Vehicle::create(array_merge($request->validated(), [
            'user_id' => auth()->id(),
        ]));

        return response()->json($vehicle, 201);
    }

    /**
     * Show a vehicle (authorization handled in ShowVehicleRequest)
     */
    public function show(ShowVehicleRequest $request, $id)
    {
        $vehicle = Vehicle::with('gpsLocations')->findOrFail($id);

        $vehicle->total_distance = GeoHelper::totalDistance($vehicle->gpsLocations);


        return response()->json($vehicle);
    }

    /**
     * Update a vehicle (authorization handled in UpdateVehicleRequest)
     */
    public function update(UpdateVehicleRequest $request, $id)
    {
        $vehicle = Vehicle::findOrFail($id);
        $vehicle->update($request->validated());

        return response()->json($vehicle);
    }

    /**
     * Delete a vehicle (authorization handled in DestroyVehicleRequest)
     */
    public function destroy(DestroyVehicleRequest $request, $id)
    {
        \Log::info("test");
        $vehicle = Vehicle::findOrFail($id);
        $vehicle->delete();

        return response()->json(['message' => 'Vehicle deleted successfully']);
    }

    public function addLocation(StoreGPSLocationRequest $request, $id)
    {
        $lastLocation = GPSLocation::where('vehicle_id', $id)
            ->latest()
            ->first();

        if ($lastLocation &&
            $lastLocation->latitude == $request->latitude &&
            $lastLocation->longitude == $request->longitude
        ) {
            return response()->json([
                'message' => 'Duplicate GPS point ignored'
            ], 200);
        }

        $location = GPSLocation::insert(array_merge(
            $request->validated(),
            ['vehicle_id' => $id]
        ));

        return response()->json($location, 201);
    }

    /**
     * Get all GPS locations for a vehicle
     */
    public function getLocations(ShowVehicleRequest $request, $id)
    {
        $vehicle = Vehicle::with('gpsLocations')->findOrFail($id);
        return response()->json($vehicle->gpsLocations);
    }



}
