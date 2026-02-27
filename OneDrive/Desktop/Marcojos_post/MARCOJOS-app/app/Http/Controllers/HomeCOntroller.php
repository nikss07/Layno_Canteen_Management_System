<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HomeCOntroller extends Controller
{
    public function index(){
        $allCategories = ['apple', 'banana', 'orange', 'grape'];

        return view('home', ['categories' => $allCategories]);
    }
}
