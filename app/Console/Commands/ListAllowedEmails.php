<?php

namespace App\Console\Commands;

use App\Models\AllowedEmail;
use Illuminate\Console\Command;

class ListAllowedEmails extends Command
{
    protected $signature = 'admin:list-emails';
    protected $description = 'List all allowed admin emails';

    public function handle()
    {
        $allowedEmails = AllowedEmail::all();

        if ($allowedEmails->isEmpty()) {
            $this->info('No allowed admin emails found');
            return 0;
        }

        $this->info('Allowed Admin Emails:');
        $this->line('');

        $headers = ['ID', 'Email', 'Description', 'Created At'];
        $rows = $allowedEmails->map(function ($email) {
            return [
                $email->id,
                $email->email,
                $email->description ?: '-',
                $email->created_at->format('Y-m-d H:i:s'),
            ];
        });

        $this->table($headers, $rows);

        return 0;
    }
}
