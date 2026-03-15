# JKM Canteen Management System

A web-based canteen management system for University of Mindanao - Visayan Campus, Tagum City.

## What it does

- Customers can browse the menu and place orders
- Cashiers can process orders using the POS system
- Admins can manage the menu, inventory, and view sales reports

## Requirements

- PHP 8.2+
- Composer
- Node.js and npm
- PostgreSQL

## Backend Setup

cd Canteen_Backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link
php artisan serve

Backend runs at: http://localhost:8000

## Frontend Setup

cd canteen-frontend
npm install
npm start

Frontend runs at: http://localhost:3000

## Database Configuration

Open Canteen_Backend/.env and update:

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=CanteenManagement
DB_USERNAME=postgres
DB_PASSWORD=your_password

## Login Accounts

Admin    - karyll@admin.com    - css@1234
Cashier  - junaica@cashier.com - css@1234
Customer - mel@customer.com    - css@1234

## Built with

Backend:  Laravel 12, PHP 8.4, PostgreSQL
Frontend: React 19, Tailwind CSS, Recharts
Auth:     Laravel Sanctum

© 2026 JKM Canteen - University of Mindanao Tagum Campus
