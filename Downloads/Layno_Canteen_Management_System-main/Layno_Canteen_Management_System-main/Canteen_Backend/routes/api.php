<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\ReportController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Menu & Categories (all authenticated users)
    Route::get('/menu-items', [MenuController::class, 'index']);
    Route::get('/menu-items/{menuItem}', [MenuController::class, 'show']);
    Route::get('/categories', [CategoryController::class, 'index']);

    // Orders
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel']);

    // Cashier + Admin only
    Route::middleware('role:cashier,admin')->group(function () {
        Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus']);
    });

    // Admin only
    Route::middleware('role:admin')->group(function () {
        // Menu management
        Route::post('/menu-items', [MenuController::class, 'store']);
        Route::put('/menu-items/{menuItem}', [MenuController::class, 'update']);
        Route::delete('/menu-items/{menuItem}', [MenuController::class, 'destroy']);
        Route::patch('/menu-items/{menuItem}/toggle', [MenuController::class, 'toggleAvailability']);

        // Categories
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

        // Inventory
        Route::get('/inventory', [InventoryController::class, 'index']);
        Route::patch('/inventory/{menuItem}/adjust', [InventoryController::class, 'adjust']);
        Route::get('/inventory/logs', [InventoryController::class, 'logs']);

        // Reports
        Route::get('/reports/sales', [ReportController::class, 'sales']);
        Route::get('/reports/top-items', [ReportController::class, 'topItems']);
        Route::get('/reports/category-breakdown', [ReportController::class, 'categoryBreakdown']);
    });
});