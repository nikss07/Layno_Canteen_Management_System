<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = ['Meals', 'Snacks', 'Beverages', 'Desserts', 'Combos'];

        foreach ($categories as $category) {
            Category::create(['name' => $category]);
        }
    }
}