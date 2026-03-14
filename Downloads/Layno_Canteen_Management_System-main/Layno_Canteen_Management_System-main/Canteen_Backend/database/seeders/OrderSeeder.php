<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\MenuItem;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $statuses = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
        $menuItems = MenuItem::all();

        for ($i = 1; $i <= 200; $i++) {
            $itemCount = rand(1, 4);
            $selectedItems = $menuItems->random($itemCount);
            $total = 0;

            $order = Order::create([
                'user_id' => rand(1, 3),
                'order_number' => 'ORD-' . str_pad($i, 5, '0', STR_PAD_LEFT),
                'total_amount' => 0,
                'status' => $statuses[array_rand($statuses)],
                'created_at' => now()->subDays(rand(0, 30)),
            ]);

            foreach ($selectedItems as $item) {
                $qty = rand(1, 3);
                $total += $item->price * $qty;

                OrderItem::create([
                    'order_id' => $order->id,
                    'menu_item_id' => $item->id,
                    'quantity' => $qty,
                    'price' => $item->price,
                ]);
            }

            $order->update(['total_amount' => $total]);
        }
    }
}