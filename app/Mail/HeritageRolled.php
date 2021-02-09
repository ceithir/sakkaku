<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\ContextualizedRoll;
use Illuminate\Support\Facades\URL;

class HeritageRolled extends Mailable
{
    use Queueable, SerializesModels;

    public ContextualizedRoll $roll;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(ContextualizedRoll $roll)
    {
        $this->roll = $roll;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this
            ->subject('New heritage rolled on Sakkaku')
            ->markdown(
                'emails.heritage.rolled',
                [
                    'url' => URL::route('heritage.show', ['uuid' => $this->roll->uuid]),
                ]
            )
        ;
    }
}
