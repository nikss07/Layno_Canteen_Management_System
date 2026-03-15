\# JKM Canteen Management System



A web-based canteen management system for University of Mindanao - Visayan Campus, Tagum City.



\---



\## What it does



\- Customers can browse the menu and place orders

\- Cashiers can process orders using the POS system

\- Admins can manage the menu, inventory, and view sales reports



\---



\## How to run the project



\### Requirements

\- PHP 8.2+

\- Composer

\- Node.js and npm

\- PostgreSQL



\---



\### Step 1 — Set up the Backend

```bash

cd Canteen\_Backend

composer install

cp .env.example .env

php artisan key:generate

php artisan migrate

php artisan storage:link

php artisan serve

```



Backend runs at: http://localhost:8000



\---



\### Step 2 — Set up the Frontend

```bash

cd canteen-frontend

npm install

npm start

```



Frontend runs at: http://localhost:3000



\---



\### Step 3 — Configure the database



Open `Canteen\_Backend/.env` and update these lines:

```

DB\_CONNECTION=pgsql

DB\_HOST=127.0.0.1

DB\_PORT=5432

DB\_DATABASE=CanteenManagement

DB\_USERNAME=postgres

DB\_PASSWORD=your\_password

```



\---



\## Login Accounts



| Role     | Email               | Password |

|----------|---------------------|----------|

| Admin    | karyll@admin.com    | css@1234 |

| Cashier  | junaica@cashier.com | css@1234 |

| Customer | mel@customer.com    | css@1234 |



\---



\## Built with



\- \*\*Backend:\*\* Laravel 12, PHP 8.4, PostgreSQL

\- \*\*Frontend:\*\* React 19, Tailwind CSS, Recharts

\- \*\*Auth:\*\* Laravel Sanctum



\---





