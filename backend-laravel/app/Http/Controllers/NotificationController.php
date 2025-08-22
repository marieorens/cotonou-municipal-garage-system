<?php

namespace App\Http\Controllers;

use App\Http\Resources\NotificationResource;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * @OA\Get(
     *      path="/notifications",
     *      operationId="getNotifications",
     *      tags={"Notifications"},
     *      summary="Get user notifications",
     *      description="Returns list of notifications for the authenticated user",
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="unread", in="query", description="Filter by unread notifications", required=false, @OA\Schema(type="boolean")),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/NotificationResource"))
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
     *      path="/notifications/{id}/read",
     *      operationId="markNotificationAsRead",
     *      tags={"Notifications"},
     *      summary="Mark a specific notification as read",
     *      description="Marks a single notification as read",
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="id", in="path", description="ID of notification", required=true, @OA\Schema(type="string")),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/NotificationResource")
     *       ),
     *      @OA\Response(response=401, description="Unauthenticated"),
     *      @OA\Response(response=404, description="Not Found"),
     * )
     */
    public function markAsRead(Request $request, string $id)
    {
// ... existing code ...
    }

    /**
     * @OA\Post(
     *      path="/notifications/mark-all-read",
     *      operationId="markAllNotificationsAsRead",
     *      tags={"Notifications"},
     *      summary="Mark all notifications as read",
     *      description="Marks all unread notifications for the user as read",
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(
     *              @OA\Property(property="message", type="string", example="All notifications marked as read.")
     *          )
     *       ),
     *      @OA\Response(response=401, description="Unauthenticated"),
     * )
     */
    public function markAllAsRead(Request $request)
    {
// ... existing code ...
    }
}
