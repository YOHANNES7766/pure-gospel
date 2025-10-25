<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Visitor extends Model
{
    use HasFactory;

    protected $fillable = [
        'member_id',
        'pastor_id',
        'visit_date',
        'visit_status',
        'remarks',
    ];

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    public function pastor()
    {
        return $this->belongsTo(User::class, 'pastor_id');
    }
}
