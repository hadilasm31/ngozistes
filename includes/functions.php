<?php
// includes/functions.php

require_once __DIR__ . '/../config/supabase.php';

class SupabaseFunctions {
    private $supabase;
    
    public function __construct() {
        $this->supabase = SupabaseConfig::getInstance();
    }
    
    // Authentification
    public function login($email, $password) {
        try {
            $response = $this->supabase->query('users')
                ->select('*')
                ->eq('email', $email)
                ->single()
                ->execute();
            
            if ($response && isset($response['password'])) {
                if (password_verify($password, $response['password'])) {
                    $_SESSION['user_id'] = $response['id'];
                    $_SESSION['user_email'] = $response['email'];
                    $_SESSION['user_nom'] = $response['nom'];
                    $_SESSION['user_prenom'] = $response['prenom'];
                    $_SESSION['user_role'] = $response['role'];
                    
                    // Mettre à jour last_login
                    $this->supabase->query('users')
                        ->update(['last_login' => date('Y-m-d H:i:s')])
                        ->eq('id', $response['id'])
                        ->execute();
                    
                    return ['success' => true, 'user' => $response];
                }
            }
            return ['success' => false, 'message' => 'Email ou mot de passe incorrect'];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
    
    // Inscription
    public function register($data) {
        try {
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
            $data['role'] = 'pending';
            $data['created_at'] = date('Y-m-d H:i:s');
            
            $response = $this->supabase->query('users')
                ->insert($data)
                ->execute();
            
            return ['success' => true, 'data' => $response];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
    
    // Récupérer les événements
    public function getEvents($filter = 'upcoming', $visibility = null) {
        try {
            $query = $this->supabase->query('events')
                ->select('*')
                ->order('date', 'asc');
            
            if ($filter === 'upcoming') {
                $query->gte('date', date('Y-m-d H:i:s'));
            } elseif ($filter === 'past') {
                $query->lt('date', date('Y-m-d H:i:s'));
            }
            
            if ($visibility) {
                $query->in('visibility', $visibility);
            }
            
            $response = $query->execute();
            return ['success' => true, 'data' => $response];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
    
    // S'inscrire à un événement
    public function registerToEvent($eventId, $userId, $guests = 0, $message = '') {
        try {
            $data = [
                'event_id' => $eventId,
                'user_id' => $userId,
                'guests' => $guests,
                'message' => $message,
                'registered_at' => date('Y-m-d H:i:s')
            ];
            
            $response = $this->supabase->query('event_registrations')
                ->insert($data)
                ->execute();
            
            return ['success' => true, 'data' => $response];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
    
    // Récupérer les annonces
    public function getAnnouncements($visibility = 'public') {
        try {
            $response = $this->supabase->query('announcements')
                ->select('*')
                ->in('visibility', ['public', $visibility])
                ->order('created_at', 'desc')
                ->execute();
            
            return ['success' => true, 'data' => $response];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
    
    // Récupérer la timeline
    public function getTimeline() {
        try {
            $response = $this->supabase->query('timeline')
                ->select('*')
                ->order('year', 'asc')
                ->execute();
            
            return ['success' => true, 'data' => $response];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
    
    // Récupérer les valeurs
    public function getValues() {
        try {
            $response = $this->supabase->query('values_table')
                ->select('*')
                ->execute();
            
            return ['success' => true, 'data' => $response];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
    
    // Récupérer l'équipe
    public function getTeam() {
        try {
            $response = $this->supabase->query('team')
                ->select('*')
                ->order('order_position', 'asc')
                ->execute();
            
            return ['success' => true, 'data' => $response];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
    
    // Récupérer les activités
    public function getActivities($category = null) {
        try {
            $query = $this->supabase->query('activities')
                ->select('*')
                ->order('date', 'desc');
            
            if ($category && $category !== 'all') {
                $query->eq('category', $category);
            }
            
            $response = $query->execute();
            return ['success' => true, 'data' => $response];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
    
    // Récupérer les photos de la galerie
    public function getGallery($category = null) {
        try {
            $query = $this->supabase->query('gallery')
                ->select('*')
                ->order('uploaded_at', 'desc');
            
            if ($category && $category !== 'all') {
                $query->eq('category', $category);
            }
            
            $response = $query->execute();
            return ['success' => true, 'data' => $response];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
    
    // Récupérer les statistiques
    public function getStatistics() {
        try {
            $response = $this->supabase->query('statistics')
                ->select('*')
                ->limit(1)
                ->execute();
            
            if ($response && count($response) > 0) {
                return ['success' => true, 'data' => $response[0]];
            }
            return ['success' => false, 'message' => 'Statistiques non trouvées'];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
    
    // Créer un événement (admin)
    public function createEvent($data) {
        try {
            $data['created_at'] = date('Y-m-d H:i:s');
            $data['created_by'] = $_SESSION['user_id'];
            
            $response = $this->supabase->query('events')
                ->insert($data)
                ->execute();
            
            return ['success' => true, 'data' => $response];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
    
    // Mettre à jour un utilisateur (admin)
    public function updateUser($userId, $data) {
        try {
            $data['updated_at'] = date('Y-m-d H:i:s');
            
            $response = $this->supabase->query('users')
                ->update($data)
                ->eq('id', $userId)
                ->execute();
            
            return ['success' => true, 'data' => $response];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
    
    // Récupérer tous les utilisateurs (admin)
    public function getUsers($role = null) {
        try {
            $query = $this->supabase->query('users')
                ->select('*')
                ->order('created_at', 'desc');
            
            if ($role) {
                $query->eq('role', $role);
            }
            
            $response = $query->execute();
            return ['success' => true, 'data' => $response];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
?>