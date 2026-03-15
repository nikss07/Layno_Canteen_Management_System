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
    // Revenue - all non-cancelled orders
    $total_sales = Order::whereNotIn('status', ['cancelled'])->sum('total_amount');
    $total_orders = Order::count();
    $avg_order_value = Order::whereNotIn('status', ['cancelled'])->avg('total_amount') ?? 0;
    $today_orders = Order::whereDate('created_at', today())->count();

    // Trends - this month vs last month
    $this_month_sales = Order::whereNotIn('status', ['cancelled'])
        ->whereMonth('created_at', now()->month)
        ->whereYear('created_at', now()->year)
        ->sum('total_amount');

    $last_month_sales = Order::whereNotIn('status', ['cancelled'])
        ->whereMonth('created_at', now()->subMonth()->month)
        ->whereYear('created_at', now()->subMonth()->year)
        ->sum('total_amount');

    $this_month_orders = Order::whereMonth('created_at', now()->month)
        ->whereYear('created_at', now()->year)
        ->count();

    $last_month_orders = Order::whereMonth('created_at', now()->subMonth()->month)
        ->whereYear('created_at', now()->subMonth()->year)
        ->count();

    $today_orders_count = Order::whereDate('created_at', today())->count();
    $yesterday_orders = Order::whereDate('created_at', today()->subDay())->count();

    $sales_trend = $last_month_sales > 0
        ? round((($this_month_sales - $last_month_sales) / $last_month_sales) * 100, 1)
        : 0;

    $orders_trend = $last_month_orders > 0
        ? round((($this_month_orders - $last_month_orders) / $last_month_orders) * 100, 1)
        : 0;

    $today_trend = $yesterday_orders > 0
        ? round((($today_orders_count - $yesterday_orders) / $yesterday_orders) * 100, 1)
        : 0;

    return response()->json([
        'total_sales'     => $total_sales,
        'total_orders'    => $total_orders,
        'avg_order_value' => $avg_order_value,
        'today_orders'    => $today_orders,
        'trends' => [
            'sales'        => $sales_trend,
            'orders'       => $orders_trend,
            'today_orders' => $today_trend,
        ]
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