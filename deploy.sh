#!/bin/bash

# Laravel deployment script for Coolify
set -e

echo "Starting Laravel deployment..."

# Install PHP dependencies
echo "Installing Composer dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction

# Install Node dependencies
echo "Installing NPM dependencies..."
npm ci --only=production

# Build frontend assets
echo "Building frontend assets..."
npm run build

# Laravel optimizations
echo "Optimizing Laravel..."

# Generate application key if not set
if [ -z "$APP_KEY" ]; then
    echo "Generating application key..."
    php artisan key:generate --force
fi

# Cache configurations
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run database migrations
echo "Running database migrations..."
php artisan migrate --force

# Clear and cache everything
php artisan optimize:clear
php artisan optimize

# Set proper permissions
echo "Setting permissions..."
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

echo "Deployment completed successfully!"
