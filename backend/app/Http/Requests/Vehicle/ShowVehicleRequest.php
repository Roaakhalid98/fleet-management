<?php

namespace App\Http\Requests\Vehicle;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Vehicle;

class ShowVehicleRequest extends FormRequest
{
    public function authorize()
    {
        // Check the vehicle exists and belongs to the authenticated user
        $vehicle = Vehicle::findOrFail($this->route('id'));
        return $vehicle && $vehicle->user_id === auth()->id();
    }

    public function rules()
    {
        return [];
    }
}
