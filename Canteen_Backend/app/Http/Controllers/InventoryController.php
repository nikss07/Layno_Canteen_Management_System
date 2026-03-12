<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use App\Models\InventoryLog;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function index()
    {
        return response()->json(MenuItem::with('category')->get());
    }

    public function adjust(Request $request, MenuItem $menuItem)
    {
        $request->validate([
            'change' => 'required|integer',
            'reason' => 'required|string',
        ]);

        $menuItem->increment('stock', $request->change);

        InventoryLog::create([
            'menu_item_id' => $menuItem->id,
            'change' => $request->change,
            'reason' => $request->reason,
        ]);

        return response()->json($menuItem);
    }

    public function logs()
    {
        return response()->json(InventoryLog::with('menuItem')->latest()->get());
    }
}