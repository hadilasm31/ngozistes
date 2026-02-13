<?php
// Configuration de la base de données Supabase
define('SUPABASE_URL', 'https://votre-projet.supabase.co');
define('SUPABASE_ANON_KEY', 'votre-clé-anon');

// Configuration du site
define('SITE_NAME', 'Ngozistes du Royaume');
define('SITE_URL', 'http://localhost/ngozistes-website');
define('SITE_EMAIL', 'contact@ngozistesduroyaume.org');

// Chemins
define('ROOT_PATH', dirname(__DIR__) . '/');
define('UPLOAD_PATH', ROOT_PATH . 'uploads/');
define('UPLOAD_URL', SITE_URL . '/uploads/');

// Types de fichiers autorisés
define('ALLOWED_IMAGES', ['image/jpeg', 'image/png', 'image/gif']);
define('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5MB

// Sessions
session_start();

// Fonctions utilitaires
function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

function isAdmin() {
    return isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin';
}

function isActiveMember() {
    return isset($_SESSION['user_role']) && in_array($_SESSION['user_role'], ['admin', 'active']);
}

function redirect($url) {
    header("Location: " . $url);
    exit();
}

function sanitize($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

function uploadFile($file, $targetDir) {
    if (!file_exists($targetDir)) {
        mkdir($targetDir, 0777, true);
    }
    
    $fileName = uniqid() . '_' . basename($file['name']);
    $targetPath = $targetDir . $fileName;
    
    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        return $fileName;
    }
    
    return false;
}
?>