# Fleet Management System

A simple fleet management system with vehicle tracking and GPS history. This project uses:

- **Backend:** Laravel, JWT Authentication
- **Frontend:** React, Axios for API requests

---

## Table of Contents

- [Requirements](#requirements)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Sample Credentials](#sample-credentials)



---

## Requirements

- PHP >= 8.1
- Composer
- Node.js >= 18
- MySQL
- npm
- Git

---

## Backend Setup (Laravel)

1. Clone the repository:
   ```bash
   git clone https://github.com/Roaakhalid98/fleet-management.git
   cd fleet-management/backend
   
   
composer install

cp .env.example .env

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=fleet_db
DB_USERNAME=root
DB_PASSWORD=

php artisan key:generate
php artisan jwt:secret
php artisan migrate:fresh --seed
php artisan serve --port=8001

## Frontend Setup (react)

cd fleet-management/frontend
cp .env.local.example .env.local
add NEXT_PUBLIC_API_URL
npm install
npm run dev


## Sample creds

            'name' => user1
            'email' => 'user1@user1.com',
            'password' => Hash::make('password123'),
            
            'name' => 'user2',
            'email' => 'user2@user2.com',
            'password' => Hash::make('password123'),
            
            'name' => 'user3',
            'email' => 'user3@user3.com',
            'password' => Hash::make('password123'),
