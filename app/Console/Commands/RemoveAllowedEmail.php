<?php

namespace App\Console\Commands;

use App\Models\AllowedEmail;
use Illuminate\Console\Command;

class RemoveAllowedEmail extends Command
{
    protected $signature = 'admin:remove-email {email}';
    protected $description = 'Remove email from admin whitelist';

    public function handle()
    {
        $email = $this->argument('email');

        $allowedEmail = AllowedEmail::where('email', $email)->first();

        if ($allowedEmail) {
            $allowedEmail->delete();
            $this->info("Email {$email} removed from admin whitelist");
        } else {
            $this->warn("Email {$email} not found in whitelist");
        }

        return 0;
    }
}
