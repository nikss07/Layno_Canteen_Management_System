<?php
namespace App\Http\Controllers;
use App\Models\Order;
use App\Models\MenuItem;
use App\Models\InventoryLog;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        return response()->json(Order::with('orderItems.menuItem', 'user')->latest()->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.menu_item_id' => 'required|exists:menu_items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'string|in:cash,gcash',
        ]);

        $total = 0;
        $orderItems = [];

        foreach ($request->items as $item) {
            $menuItem = MenuItem::findOrFail($item['menu_item_id']);
            $subtotal = $menuItem->price * $item['quantity'];
            $total += $subtotal;
            $orderItems[] = [
                'menu_item_id' => $menuItem->id,
                'quantity' => $item['quantity'],
                'price' => $menuItem->price,
            ];

            // Deduct stock
            $menuItem->decrement('stock', $item['quantity']);
            InventoryLog::create([
                'menu_item_id' => $menuItem->id,
                'change' => -$item['quantity'],
                'reason' => 'Order placed',
            ]);
        }

        $order = Order::create([
            'user_id' => $request->user()->id,
            'order_number' => 'ORD-' . strtoupper(uniqid()),
            'total_amount' => $total,
            'payment_method' => $request->payment_method ?? 'cash',
            'status' => 'pending',
        ]);

        $order->orderItems()->createMany($orderItems);

        return response()->json($order->load('orderItems.menuItem'), 201);
    }

    public function show(Order $order)
    {
        return response()->json($order->load('orderItems.menuItem', 'user'));
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,preparing,ready,completed,cancelled',
        ]);

        $oldStatus = $order->status;
        $order->update(['status' => $request->status]);

        // Replenish stock if cancelled
        if ($request->status === 'cancelled' && $oldStatus !== 'cancelled') {
            foreach ($order->orderItems as $item) {
                $menuItem = $item->menuItem;
                if ($menuItem) {
                    $menuItem->increment('stock', $item['quantity']);
                    InventoryLog::create([
                        'menu_item_id' => $menuItem->id,
                        'change' => $item['quantity'],
                        'reason' => 'Order cancelled',
                    ]);
                }
            }
        }

        return response()->json($order);
    }

    public function cancel(Request $request, Order $order)
    {
        // Check if order belongs to user
        if ($order->user_id !== $request->user()->id && $request->user()->role === 'customer') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Only pending orders can be cancelled'], 422);
        }

        $order->update(['status' => 'cancelled']);

        // Replenish stock
        foreach ($order->orderItems as $item) {
            $menuItem = $item->menuItem;
            if ($menuItem) {
                $menuItem->increment('stock', $item['quantity']);
                InventoryLog::create([
                    'menu_item_id' => $menuItem->id,
                    'change' => $item['quantity'],
                    'reason' => 'Order cancelled by user',
                ]);
            }
        }

        return response()->json($order);
    }
}