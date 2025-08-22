<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * @OA\Get(
     *      path="/admin/users",
     *      operationId="getUsersList",
     *      tags={"Admin - Users"},
     *      summary="Get list of users",
     *      description="Returns list of users",
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="search", in="query", description="Search by name or email", required=false, @OA\Schema(type="string")),
     *      @OA\Parameter(name="role", in="query", description="Filter by role", required=false, @OA\Schema(type="string")),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/UserResource"))
     *       ),
     *      @OA\Response(response=401, description="Unauthenticated"),
     *      @OA\Response(response=403, description="Forbidden"),
     * )
     */
    public function index(Request $request)
    {
// ... existing code ...
    }

    /**
     * @OA\Post(
     *      path="/admin/users",
     *      operationId="storeUser",
     *      tags={"Admin - Users"},
     *      summary="Store new user",
     *      description="Returns user data",
     *      security={{"bearerAuth":{}}},
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(ref="#/components/schemas/StoreUserRequest")
     *      ),
     *      @OA\Response(
     *          response=201,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/UserResource")
     *       ),
     *      @OA\Response(response=400, description="Bad Request"),
     *      @OA\Response(response=401, description="Unauthenticated"),
     *      @OA\Response(response=403, description="Forbidden"),
     * )
     */
    public function store(StoreUserRequest $request)
    {
// ... existing code ...
    }

    /**
     * @OA\Get(
     *      path="/admin/users/{id}",
     *      operationId="getUserById",
     *      tags={"Admin - Users"},
     *      summary="Get user information",
     *      description="Returns user data",
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="id", in="path", description="ID of user", required=true, @OA\Schema(type="string")),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/UserResource")
     *       ),
     *      @OA\Response(response=404, description="Not Found"),
     *      @OA\Response(response=401, description="Unauthenticated"),
     *      @OA\Response(response=403, description="Forbidden"),
     * )
     */
    public function show(User $user)
    {
// ... existing code ...
    }

    /**
     * @OA\Put(
     *      path="/admin/users/{id}",
     *      operationId="updateUser",
     *      tags={"Admin - Users"},
     *      summary="Update existing user",
     *      description="Returns updated user data",
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="id", in="path", description="ID of user", required=true, @OA\Schema(type="string")),
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(ref="#/components/schemas/UpdateUserRequest")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/UserResource")
     *       ),
     *      @OA\Response(response=400, description="Bad Request"),
     *      @OA\Response(response=401, description="Unauthenticated"),
     *      @OA\Response(response=403, description="Forbidden"),
     *      @OA\Response(response=404, description="Not Found"),
     * )
     */
    public function update(UpdateUserRequest $request, User $user)
    {
// ... existing code ...
    }

    /**
     * @OA\Delete(
     *      path="/admin/users/{id}",
     *      operationId="deleteUser",
     *      tags={"Admin - Users"},
     *      summary="Delete existing user",
     *      description="Deletes a record and returns no content",
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="id", in="path", description="ID of user", required=true, @OA\Schema(type="string")),
     *      @OA\Response(response=204, description="Successful operation"),
     *      @OA\Response(response=401, description="Unauthenticated"),
     *      @OA\Response(response=403, description="Forbidden"),
     *      @OA\Response(response=404, description="Not Found"),
     * )
     */
    public function destroy(User $user)
    {
// ... existing code ...
    }
}
