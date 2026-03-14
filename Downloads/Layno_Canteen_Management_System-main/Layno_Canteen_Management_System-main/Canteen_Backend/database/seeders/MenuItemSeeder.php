<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\MenuItem;

class MenuItemSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            // Meals (category_id: 1)
            ['category_id' => 1, 'name' => 'Chicken Adobo', 'description' => 'Classic Filipino chicken adobo', 'price' => 65, 'stock' => 50],
            ['category_id' => 1, 'name' => 'Pork Sinigang', 'description' => 'Sour tamarind pork soup', 'price' => 70, 'stock' => 40],
            ['category_id' => 1, 'name' => 'Beef Caldereta', 'description' => 'Rich beef stew', 'price' => 85, 'stock' => 30],
            ['category_id' => 1, 'name' => 'Fried Chicken', 'description' => 'Crispy fried chicken', 'price' => 60, 'stock' => 60],
            ['category_id' => 1, 'name' => 'Pork BBQ', 'description' => 'Grilled pork skewers', 'price' => 55, 'stock' => 45],
            ['category_id' => 1, 'name' => 'Tinolang Manok', 'description' => 'Ginger chicken soup', 'price' => 65, 'stock' => 35],
            // Snacks (category_id: 2)
            ['category_id' => 2, 'name' => 'Lumpia', 'description' => 'Filipino spring rolls', 'price' => 15, 'stock' => 100],
            ['category_id' => 2, 'name' => 'Kikiam', 'description' => 'Fish cake snack', 'price' => 10, 'stock' => 120],
            ['category_id' => 2, 'name' => 'Fishball', 'description' => 'Deep fried fishballs', 'price' => 10, 'stock' => 150],
            ['category_id' => 2, 'name' => 'Banana Cue', 'description' => 'Caramelized banana skewer', 'price' => 15, 'stock' => 80],
            ['category_id' => 2, 'name' => 'Camote Cue', 'description' => 'Caramelized sweet potato', 'price' => 15, 'stock' => 80],
            ['category_id' => 2, 'name' => 'Pichi Pichi', 'description' => 'Steamed cassava cake', 'price' => 20, 'stock' => 60],
            // Beverages (category_id: 3)
            ['category_id' => 3, 'name' => 'Bottled Water', 'description' => '500ml purified water', 'price' => 15, 'stock' => 200],
            ['category_id' => 3, 'name' => 'Iced Tea', 'description' => 'Cold brewed iced tea', 'price' => 25, 'stock' => 100],
            ['category_id' => 3, 'name' => 'Softdrink', 'description' => 'Canned soda', 'price' => 30, 'stock' => 100],
            ['category_id' => 3, 'name' => 'Fruit Juice', 'description' => 'Fresh fruit juice', 'price' => 35, 'stock' => 80],
            ['category_id' => 3, 'name' => 'Hot Coffee', 'description' => 'Brewed coffee', 'price' => 30, 'stock' => 90],
            ['category_id' => 3, 'name' => 'Chocolate Milk', 'description' => 'Cold chocolate milk', 'price' => 30, 'stock' => 70],
            // Desserts (category_id: 4)
            ['category_id' => 4, 'name' => 'Halo Halo', 'description' => 'Mixed Filipino shaved ice dessert', 'price' => 55, 'stock' => 40],
            ['category_id' => 4, 'name' => 'Leche Flan', 'description' => 'Creamy caramel custard', 'price' => 40, 'stock' => 50],
            ['category_id' => 4, 'name' => 'Buko Pandan', 'description' => 'Coconut pandan salad', 'price' => 35, 'stock' => 45],
            ['category_id' => 4, 'name' => 'Mais Con Yelo', 'description' => 'Corn with shaved ice', 'price' => 30, 'stock' => 50],
            ['category_id' => 4, 'name' => 'Turon', 'description' => 'Fried banana roll', 'price' => 20, 'stock' => 70],
            ['category_id' => 4, 'name' => 'Sapin Sapin', 'description' => 'Layered rice cake', 'price' => 25, 'stock' => 60],
            // Combos (category_id: 5)
            ['category_id' => 5, 'name' => 'Meal + Drink Combo', 'description' => 'Any meal with iced tea', 'price' => 85, 'stock' => 50],
            ['category_id' => 5, 'name' => 'Snack + Drink Combo', 'description' => 'Any snack with softdrink', 'price' => 40, 'stock' => 50],
            ['category_id' => 5, 'name' => 'Budget Meal A', 'description' => 'Rice + viand + water', 'price' => 75, 'stock' => 40],
            ['category_id' => 5, 'name' => 'Budget Meal B', 'description' => 'Rice + 2 viands + juice', 'price' => 95, 'stock' => 40],
            ['category_id' => 5, 'name' => 'Snack Platter', 'description' => 'Assorted snacks for sharing', 'price' => 120, 'stock' => 30],
            ['category_id' => 5, 'name' => 'Dessert + Drink Combo', 'description' => 'Any dessert with cold drink', 'price' => 65, 'stock' => 35],
        ];

        foreach ($items as $item) {
            MenuItem::create(array_merge($item, ['is_available' => true]));
        }
    }
}