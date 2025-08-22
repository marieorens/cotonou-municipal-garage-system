<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OwnerController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProcedureController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\VehicleController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('profile', [AuthController::class, 'profile']);
        Route::post('change-password', [AuthController::class, 'changePassword']);
    });
});

Route::middleware('auth:sanctum')->group(function () {
    // Vehicles
    Route::apiResource('vehicles', VehicleController::class);
    Route::post('vehicles/{id}/photos', [VehicleController::class, 'uploadPhotos']);
    Route::get('vehicles/{id}/qr-code', [VehicleController::class, 'getQrCode']);

    // Owners
    Route::apiResource('owners', OwnerController::class);
    Route::get('owners/{id}/vehicles', [OwnerController::class, 'getVehicles']);

    // Procedures
    Route::apiResource('procedures', ProcedureController::class);
    Route::get('procedures/{id}/documents', [ProcedureController::class, 'getDocuments']);
    Route::post('procedures/{id}/documents', [ProcedureController::class, 'uploadDocuments']);
    Route::delete('procedures/{id}/documents/{docId}', [ProcedureController::class, 'deleteDocument']);

    // Payments
    Route::apiResource('payments', PaymentController::class);
    Route::get('payments/{id}/receipt', [PaymentController::class, 'getReceipt']);

    // Admin Users
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::apiResource('users', UserController::class);
        Route::get('roles', [UserController::class, 'getRoles']);
    });

    // Notifications
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::post('notifications/send', [NotificationController::class, 'send']);

    // Settings
    Route::get('settings', [SettingController::class, 'index']);
    Route::put('settings', [SettingController::class, 'update']);
});
