<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
// 1. Import Logging classes
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class User extends Authenticatable
{
    // 2. Add LogsActivity to your traits
    use HasApiTokens, HasFactory, Notifiable, HasRoles, LogsActivity;

    protected $fillable = [
        'fullName',
        'mobile',
        'password',
        'role', // Note: You are keeping this for simple access, synced with Spatie
        'interests',
        'member_status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'interests' => 'array',
    ];

    // Automatically hashes any password assigned
    public function setPasswordAttribute($value)
    {
        // Only hash if it's not already hashed (prevent double hashing issues)
        $this->attributes['password'] = bcrypt($value);
    }

    public function member()
    {
        return $this->hasOne(Member::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Audit Log Configuration
    |--------------------------------------------------------------------------
    | This function tells the system what to record in the database
    | whenever a User is created, updated, or deleted.
    */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            // Log changes made to these specific attributes
            ->logOnly(['fullName', 'mobile', 'role', 'member_status', 'interests'])
            // Do not log the password!
            
            // Only log if something actually changed (e.g. name changed from John to Jon)
            ->logOnlyDirty()
            
            // Don't create a log entry if nothing changed
            ->dontSubmitEmptyLogs()
            
            // Add a description to the log
            ->setDescriptionForEvent(fn(string $eventName) => "User has been {$eventName}");
    }
}