<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(
 *     schema="Setting",
 *     type="object",
 *     title="Setting",
 *     properties={
 *         @OA\Property(property="key", type="string", example="garage_name"),
 *         @OA\Property(property="value", type="string", example="Garage Municipal de Cotonou"),
 *         @OA\Property(property="group", type="string", example="general"),
 *     }
 * )
 */
class Setting extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $primaryKey = 'key';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'key',
        'value',
        'group',
    ];
}
