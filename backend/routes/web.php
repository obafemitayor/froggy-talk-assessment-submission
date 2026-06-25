<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect(config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:5173')));
});
