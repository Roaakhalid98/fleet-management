<?php

namespace App\Http\Requests\Vehicle;

use App\Models\Vehicle;
use Illuminate\Foundation\Http\FormRequest;

class UpdateVehicleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $vehicle = Vehicle::findOrFail($this->route('id'));
        return $vehicle && $vehicle->user_id === auth()->id();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $vehicleId = $this->route('id');

        return [
            'plate_number' => 'sometimes|required|string|unique:vehicles,plate_number,' . $vehicleId,
            'brand' => 'sometimes|required|string',
            'model' => 'sometimes|required|string',
        ];
    }
}
