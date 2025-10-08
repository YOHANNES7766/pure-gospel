<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    use HasFactory;

   protected $fillable = [
        'user_id',
        'full_name',
        'phone',
        'email',
        'member_id',
        'id_number',
        'birth_date',
        'address',
        'gender',
        'church_group',
        'status',
        'member_category', // ✅ important new field
    ];

    // Each member belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Each member has many attendance records
    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }
}
