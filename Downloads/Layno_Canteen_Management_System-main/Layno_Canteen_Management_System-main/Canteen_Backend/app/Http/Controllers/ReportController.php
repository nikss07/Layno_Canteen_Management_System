<?php
namespace App\Http\Controllers;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{  
    public function index()
    {
        $total_sales = Order::where('status', 'completed')->sum('total_amount');
        $total_orders = Order::count();
        $avg_order_value = Order::where('status', 'completed')->avg('total_amount') ?? 0;
        $today_orders = Order::whereDate('created_at', today())->count();

        return response()->json([
            'total_sales' => $total_sales,
            'total_orders' => $total_orders,
            'avg_order_value' => $avg_order_value,
            'today_orders' => $today_orders,
        ]);
    }
    public function sales(Request $request)
    {
        $period = $request->period ?? 'daily';

        $format = match($period) {
            'weekly' => '%Y-%u',
            'monthly' => '%Y-%m',
            default => '%Y-%m-%d',
        };

        $sales = Order::where('status', 'completed')
            ->selectRaw("DATE_FORMAT(created_at, '{$format}') as period, SUM(total_amount) as revenue, COUNT(*) as orders")
            ->groupBy('period')
            ->orderBy('period')
            ->get();

        return response()->json($sales);
    }

    public function topItems()
    {
        $items = OrderItem::with('menuItem')
            ->selectRaw('menu_item_id, SUM(quantity) as total_qty, SUM(quantity * price) as total_revenue')
            ->groupBy('menu_item_id')
            ->orderByDesc('total_qty')
            ->limit(10)
            ->get();

        return response()->json($items);
    }

    public function categoryBreakdown()
    {
        $data = OrderItem::join('menu_items', 'order_items.menu_item_id', '=', 'menu_items.id')
            ->join('categories', 'menu_items.category_id', '=', 'categories.id')
            ->selectRaw('categories.name as category, SUM(order_items.quantity * order_items.price) as revenue')
            ->groupBy('categories.name')
            ->get();

        return response()->json($data);
    }
}