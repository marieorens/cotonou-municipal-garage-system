<?php

namespace App\Http\Controllers;

use App\Http\Requests\Vehicle\StoreVehicleRequest;
use App\Http\Requests\Vehicle\UpdateVehicleRequest;
use App\Http\Resources\VehicleResource;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class VehicleController extends Controller
{
    /**
     * @OA\Get(
     *      path="/vehicles",
     *      operationId="getVehiclesList",
     *      tags={"Vehicles"},
     *      summary="Get list of vehicles",
     *      description="Returns list of vehicles",
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="search", in="query", description="Search term", required=false, @OA\Schema(type="string")),
     *      @OA\Parameter(name="status", in="query", description="Filter by status", required=false, @OA\Schema(type="string")),
     *      @OA\Parameter(name="date_from", in="query", description="Filter by start date", required=false, @OA\Schema(type="string", format="date")),
     *      @OA\Parameter(name="date_to", in="query", description="Filter by end date", required=false, @OA\Schema(type="string", format="date")),
     *      @OA\Parameter(name="vehicle_type", in="query", description="Filter by vehicle type", required=false, @OA\Schema(type="string")),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/VehicleResource"))
     *       ),
     *      @OA\Response(response=401, description="Unauthenticated"),
     * )
     */
    public function index(Request $request)
    {
// ... existing code ...
    }

    /**
     * @OA\Post(
     *      path="/vehicles",
     *      operationId="storeVehicle",
     *      tags={"Vehicles"},
     *      summary="Store new vehicle",
     *      description="Returns vehicle data",
     *      security={{"bearerAuth":{}}},
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(ref="#/components/schemas/StoreVehicleRequest")
     *      ),
     *      @OA\Response(
     *          response=201,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/VehicleResource")
     *       ),
     *      @OA\Response(response=400, description="Bad Request"),
     *      @OA\Response(response=401, description="Unauthenticated"),
     * )
     */
    public function store(StoreVehicleRequest $request)
    {
// ... existing code ...
    }

    /**
     * @OA\Get(
     *      path="/vehicles/{id}",
     *      operationId="getVehicleById",
     *      tags={"Vehicles"},
     *      summary="Get vehicle information",
     *      description="Returns vehicle data",
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="id", in="path", description="ID of vehicle", required=true, @OA\Schema(type="integer")),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/VehicleResource")
     *       ),
     *      @OA\Response(response=404, description="Not Found"),
     *      @OA\Response(response=401, description="Unauthenticated"),
     * )
     */
    public function show(Vehicle $vehicle)
    {
// ... existing code ...
    }

    /**
     * @OA\Put(
     *      path="/vehicles/{id}",
     *      operationId="updateVehicle",
     *      tags={"Vehicles"},
     *      summary="Update existing vehicle",
     *      description="Returns updated vehicle data",
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="id", in="path", description="ID of vehicle", required=true, @OA\Schema(type="integer")),
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(ref="#/components/schemas/UpdateVehicleRequest")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/VehicleResource")
     *       ),
     *      @OA\Response(response=400, description="Bad Request"),
     *      @OA\Response(response=401, description="Unauthenticated"),
     *      @OA\Response(response=404, description="Not Found"),
     * )
     */
    public function update(UpdateVehicleRequest $request, Vehicle $vehicle)
    {
// ... existing code ...
    }

    /**
     * @OA\Delete(
     *      path="/vehicles/{id}",
     *      operationId="deleteVehicle",
     *      tags={"Vehicles"},
     *      summary="Delete existing vehicle",
     *      description="Deletes a record and returns no content",
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="id", in="path", description="ID of vehicle", required=true, @OA\Schema(type="integer")),
     *      @OA\Response(response=204, description="Successful operation"),
     *      @OA\Response(response=401, description="Unauthenticated"),
     *      @OA\Response(response=404, description="Not Found"),
     * )
     */
    public function destroy(Vehicle $vehicle)
    {
// ... existing code ...
    }
}
