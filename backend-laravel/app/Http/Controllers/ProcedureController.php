<?php

namespace App\Http\Controllers;

use App\Http\Requests\Procedure\StoreProcedureRequest;
use App\Http\Requests\Procedure\UpdateProcedureRequest;
use App\Http\Resources\ProcedureResource;
use App\Models\Procedure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class ProcedureController extends Controller
{
    /**
     * @OA\Get(
     *      path="/procedures",
     *      operationId="getProceduresList",
     *      tags={"Procedures"},
     *      summary="Get list of procedures",
     *      description="Returns list of procedures",
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="search", in="query", description="Search term", required=false, @OA\Schema(type="string")),
     *      @OA\Parameter(name="status", in="query", description="Filter by status", required=false, @OA\Schema(type="string")),
     *      @OA\Parameter(name="procedure_type", in="query", description="Filter by procedure type", required=false, @OA\Schema(type="string")),
     *      @OA\Parameter(name="date_from", in="query", description="Filter by start date", required=false, @OA\Schema(type="string", format="date")),
     *      @OA\Parameter(name="date_to", in="query", description="Filter by end date", required=false, @OA\Schema(type="string", format="date")),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/ProcedureResource"))
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
     *      path="/procedures",
     *      operationId="storeProcedure",
     *      tags={"Procedures"},
     *      summary="Store new procedure",
     *      description="Returns procedure data",
     *      security={{"bearerAuth":{}}},
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(ref="#/components/schemas/StoreProcedureRequest")
     *      ),
     *      @OA\Response(
     *          response=201,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/ProcedureResource")
     *       ),
     *      @OA\Response(response=400, description="Bad Request"),
     *      @OA\Response(response=401, description="Unauthenticated"),
     * )
     */
    public function store(StoreProcedureRequest $request)
    {
// ... existing code ...
    }

    /**
     * @OA\Get(
     *      path="/procedures/{id}",
     *      operationId="getProcedureById",
     *      tags={"Procedures"},
     *      summary="Get procedure information",
     *      description="Returns procedure data",
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="id", in="path", description="ID of procedure", required=true, @OA\Schema(type="integer")),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/ProcedureResource")
     *       ),
     *      @OA\Response(response=404, description="Not Found"),
     *      @OA\Response(response=401, description="Unauthenticated"),
     * )
     */
    public function show(Procedure $procedure)
    {
// ... existing code ...
    }

    /**
     * @OA\Put(
     *      path="/procedures/{id}",
     *      operationId="updateProcedure",
     *      tags={"Procedures"},
     *      summary="Update existing procedure",
     *      description="Returns updated procedure data",
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="id", in="path", description="ID of procedure", required=true, @OA\Schema(type="integer")),
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(ref="#/components/schemas/UpdateProcedureRequest")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/ProcedureResource")
     *       ),
     *      @OA\Response(response=400, description="Bad Request"),
     *      @OA\Response(response=401, description="Unauthenticated"),
     *      @OA\Response(response=404, description="Not Found"),
     * )
     */
    public function update(UpdateProcedureRequest $request, Procedure $procedure)
    {
// ... existing code ...
    }

    /**
     * @OA\Delete(
     *      path="/procedures/{id}",
     *      operationId="deleteProcedure",
     *      tags={"Procedures"},
     *      summary="Delete existing procedure",
     *      description="Deletes a record and returns no content",
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="id", in="path", description="ID of procedure", required=true, @OA\Schema(type="integer")),
     *      @OA\Response(response=204, description="Successful operation"),
     *      @OA\Response(response=401, description="Unauthenticated"),
     *      @OA\Response(response=404, description="Not Found"),
     * )
     */
    public function destroy(Procedure $procedure)
    {
// ... existing code ...
    }
}
