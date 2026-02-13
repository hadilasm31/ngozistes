<?php
// config/supabase.php

require_once __DIR__ . '/../vendor/autoload.php';

use Supabase\SupabaseClient;

class SupabaseConfig {
    private static $instance = null;
    private $client;
    
    private function __construct() {
        $this->client = new SupabaseClient(
            'https://phmzhwsetedymwueamtv.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBobXpod3NldGVkeW13dWVhbXR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMTAzNjgsImV4cCI6MjA4NjU4NjM2OH0.YIhCFtosWQemmGpJ7Wo_dbpa2rFhgGhbb9pDCm5DLcA'
        );
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getClient() {
        return $this->client;
    }
    
    public function query($table) {
        return $this->client->from($table);
    }
}
?>