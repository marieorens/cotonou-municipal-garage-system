<?php

namespace App\Http\Controllers;

use App\Http\Requests\Owner\StoreOwnerRequest;
use App\Http\Requests\Owner\UpdateOwnerRequest;
use App\Http\Resources\OwnerResource;
use App\Models\Owner;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class OwnerController extends Controller
{
    /**
     * @OA\Get(
     *      path="/owners",
     *      operationId="getOwnersList",
     *      tags={"Owners"},
     *      summary="Get list of owners",
     *      description="Returns list of owners",
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="search", in="query", description="Search term", required=false, @OA\Schema(type="string")),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/OwnerResource"))
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
     *      path="/owners",
     *      operationId="storeOwner",
     *      tags={"Owners"},
     *      summary="Store new owner",
     *      description="Returns owner data",
     *      security={{"bearerAuth":{}}},
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(ref="#/components/schemas/StoreOwnerRequest")
     *      ),
     *      @OA\Response(
     *          response=201,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/OwnerResource")
     *       ),
     *      @OA\Response(response=400, description="Bad Request"),
     *      @OA\Response(response=401, description="Unauthenticated"),
     * )
     */
    public function store(StoreOwnerRequest $request)
    {
// ... existing code ...
    }

    /**
     * @OA\Get(
     *      path="/owners/{id}",
     *      operationId="getOwnerById",
     *      tags={"Owners"},
     *      summary="Get owner information",
     *      description="Returns owner data",
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="id", in="path", description="ID of owner", required=true, @OA\Schema(type="integer")),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/OwnerResource")
     *       ),
     *      @OA\Response(response=404, description="Not Found"),
     *      @OA\Response(response=401, description="Unauthenticated"),
     * )
     */
    public function show(Owner $owner)
    {
// ... existing code ...
    }

    /**
     * @OA\Put(
     *      path="/owners/{id}",
     *      operationId="updateOwner",
     *      tags={"Owners"},
     *      summary="Update existing owner",
     *      description="Returns updated owner data",
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="id", in="path", description="ID of owner", required=true, @OA\Schema(type="integer")),
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(ref="#/components/schemas/UpdateOwnerRequest")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/OwnerResource")
     *       ),
     *      @OA\Response(response=400, description="Bad Request"),
     *      @OA\Response(response=401, description="Unauthenticated"),
     *      @OA\Response(response=404, description="Not Found"),
     * )
     */
    public function update(UpdateOwnerRequest $request, Owner $owner)
    {
// ... existing code ...
    }

    /**
     * @OA\Delete(
     *      path="/owners/{id}",
     *      operationId="deleteOwner",
     *      tags={"Owners"},
     *      summary="Delete existing owner",
     *      description="Deletes a record and returns no content",
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="id", in="path", description="ID of owner", required=true, @OA\Schema(type="integer")),
     *      @OA\Response(response=204, description="Successful operation"),
     *      @OA\Response(response=401, description="Unauthenticated"),
     *      @OA\Response(response=404, description="Not Found"),
     * )
     */
    public function destroy(Owner $owner)
    {
// ... existing code ...
    }
}
