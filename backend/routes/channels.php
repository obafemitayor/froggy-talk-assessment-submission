<?php

use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('customers.{customerId}', function (User $user, int $customerId): bool {
    return $user->id === $customerId;
});
