<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(
 *     schema="NotificationResource",
 *     type="object",
 *     title="Notification Resource",
 *     properties={
 *         @OA\Property(property="id", type="string", format="uuid", example="9a7f1b2c-3d4e-5f6a-7b8c-9d0e1f2a3b4c"),
 *         @OA\Property(property="type", type="string", example="App\Notifications\ProcedureCompleted"),
 *         @OA\Property(property="data", type="object"),
 *         @OA\Property(property="read_at", type="string", format="date-time", nullable=true),
 *         @OA\Property(property="created_at", type="string", format="date-time"),
 *     }
 * )
 */
class NotificationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'data' => $this->data,
            'read_at' => $this->read_at,
            'created_at' => $this->created_at,
        ];
    }
}
