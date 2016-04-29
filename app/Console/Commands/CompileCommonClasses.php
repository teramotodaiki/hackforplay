<?php
namespace App\Console\Commands;
use Illuminate\Foundation\Console\OptimizeCommand;
use Illuminate\Support\Composer;
class CompileCommonClasses extends OptimizeCommand
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'optimize:classes';
    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Optimize common classes for Laravel';
    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(Composer $composer)
    {
        parent::__construct($composer);
    }
    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $this->info('Compiling common classes');
        $this->compileClasses();
    }
}
