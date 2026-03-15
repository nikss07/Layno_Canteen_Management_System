<?php
namespace App\Http\Controllers;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MenuController extends Controller
{
    public function index(Request $request)
    {
        $query = MenuItem::with('category');
        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }
        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name'        => 'required|string',
            'price'       => 'required|numeric',
            'stock'       => 'required|integer',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $data = $request->except('image');

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('menu-images', 'public');
            $data['image'] = Storage::url($path);
        }

        $item = MenuItem::create($data);
        return response()->json($item->load('category'), 201);
    }

    public function show(MenuItem $menuItem)
    {
        return response()->json($menuItem->load('category'));
    }

    public function update(Request $request, MenuItem $menuItem)
    {
        $request->validate([
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $data = $request->except('image');

        if ($request->hasFile('image')) {
            // Delete old image
            if ($menuItem->image) {
                $oldPath = str_replace('/storage/', '', $menuItem->image);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('menu-images', 'public');
            $data['image'] = Storage::url($path);
        }

        $menuItem->update($data);
        return response()->json($menuItem->load('category'));
    }

    public function destroy(MenuItem $menuItem)
    {
        if ($menuItem->image) {
            $oldPath = str_replace('/storage/', '', $menuItem->image);
            Storage::disk('public')->delete($oldPath);
        }
        $menuItem->delete();
        return response()->json(['message' => 'Item deleted.']);
    }

    public function toggleAvailability(MenuItem $menuItem)
    {
        $menuItem->update(['is_available' => !$menuItem->is_available]);
        return response()->json($menuItem);
    }
}