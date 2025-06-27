<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class FreshWithCleanup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrate:fresh-clean {--seed : Run seeders after migration} {--force : Skip confirmation}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run migrate:fresh with automatic image cleanup';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if (!$this->option('force')) {
            if (!$this->confirm('⚠️  This will drop all tables and delete product images. Continue?')) {
                $this->info('❌ Operation cancelled.');
                return 0;
            }
        }

        $this->info('🚀 Starting fresh migration with cleanup...');
        $this->newLine();

        // Step 1: Clear all product images
        $this->info('🗑️  Step 1: Clearing all product images...');
        Artisan::call('images:clear-all', ['--force' => true]);
        $this->line(Artisan::output());

        // Step 2: Run migrate:fresh
        $this->info('🔄 Step 2: Running migrate:fresh...');
        $migrateOptions = ['--force' => true];
        Artisan::call('migrate:fresh', $migrateOptions);
        $this->line(Artisan::output());

        // Step 3: Run seeders if requested
        if ($this->option('seed')) {
            $this->info('🌱 Step 3: Running seeders...');
            Artisan::call('db:seed', ['--force' => true]);
            $this->line(Artisan::output());
        }

        // Step 4: Clear caches
        $this->info('🧹 Step 4: Clearing caches...');
        Artisan::call('cache:clear');
        Artisan::call('config:clear');
        Artisan::call('route:clear');

        $this->newLine();
        $this->info('🎉 Fresh migration with cleanup completed successfully!');
        $this->line('✅ Database reset');
        $this->line('✅ Images cleaned');
        if ($this->option('seed')) {
            $this->line('✅ Seeders executed');
        }
        $this->line('✅ Caches cleared');

        return 0;
    }
}
