<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Url extends Model
{

    protected  $fillable = [
        'original_url',
        'short_code',
        'clicks',
        'user_id',
    ];

    /**
    * Get the user that owns this model.
    *
    * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
    */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /* returns shortened url using code
     *
     * @return string
     */
    public function shortUrl():string {
        return route('short', ['short_code' => $this->short_code]);
    }
}
