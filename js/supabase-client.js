// js/supabase-client.js

// Initialisation de Supabase
const SUPABASE_URL = 'https://phmzhwsetedymwueamtv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBobXpod3NldGVkeW13dWVhbXR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMTAzNjgsImV4cCI6MjA4NjU4NjM2OH0.YIhCFtosWQemmGpJ7Wo_dbpa2rFhgGhbb9pDCm5DLcA';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fonctions pour charger les données depuis Supabase
async function loadTimeline() {
    try {
        const { data, error } = await supabase
            .from('timeline')
            .select('*')
            .order('year', { ascending: true });
        
        if (error) throw error;
        
        const container = document.getElementById('timeline-container');
        if (container && data) {
            container.innerHTML = '';
            data.forEach((item, index) => {
                const position = index % 2 === 0 ? 'left' : 'right';
                container.innerHTML += `
                    <div class="timeline-item">
                        <div class="timeline-date">${item.year}</div>
                        <div class="timeline-content">
                            <h3>${item.title}</h3>
                            <p>${item.description}</p>
                        </div>
                    </div>
                `;
            });
        }
    } catch (error) {
        console.error('Erreur lors du chargement de la timeline:', error);
    }
}

async function loadValues() {
    try {
        const { data, error } = await supabase
            .from('values_table')
            .select('*');
        
        if (error) throw error;
        
        const container = document.getElementById('missions-container');
        if (container && data) {
            container.innerHTML = '';
            data.forEach(item => {
                container.innerHTML += `
                    <div class="card">
                        <i class="${item.icon || 'fas fa-star'}"></i>
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                    </div>
                `;
            });
        }
    } catch (error) {
        console.error('Erreur lors du chargement des valeurs:', error);
    }
}

async function loadEvents() {
    try {
        const now = new Date().toISOString();
        
        // Événements à venir
        const { data: upcoming, error: error1 } = await supabase
            .from('events')
            .select('*')
            .gte('date', now)
            .order('date', { ascending: true })
            .limit(3);
        
        if (error1) throw error1;
        
        // Événements passés
        const { data: past, error: error2 } = await supabase
            .from('events')
            .select('*')
            .lt('date', now)
            .order('date', { ascending: false })
            .limit(3);
        
        if (error2) throw error2;
        
        // Afficher les événements à venir
        const upcomingContainer = document.getElementById('upcoming-events-container');
        if (upcomingContainer && upcoming) {
            upcomingContainer.innerHTML = '';
            upcoming.forEach(event => {
                const date = new Date(event.date);
                upcomingContainer.innerHTML += `
                    <div class="upcoming-item">
                        <div class="event-date-badge">
                            <span class="day">${date.getDate()}</span>
                            <span class="month">${date.toLocaleString('fr', { month: 'short' })}</span>
                        </div>
                        <div class="event-details">
                            <h3>${event.title}</h3>
                            <p>${event.location}</p>
                            <a href="#" class="btn-detail" onclick="showEventDetails('${event.id}')">Détails</a>
                        </div>
                    </div>
                `;
            });
        }
        
        // Afficher les événements passés
        const pastContainer = document.getElementById('past-events-container');
        if (pastContainer && past) {
            pastContainer.innerHTML = '';
            past.forEach(event => {
                pastContainer.innerHTML += `
                    <div class="event-card">
                        <img src="${event.image || 'images/default-event.jpg'}" alt="${event.title}">
                        <div class="event-info">
                            <h3>${event.title}</h3>
                            <p class="event-date">${new Date(event.date).toLocaleDateString('fr')}</p>
                            <p class="event-summary">${event.description.substring(0, 100)}...</p>
                            <a href="#" class="btn-more" onclick="showEventDetails('${event.id}')">Lire plus</a>
                        </div>
                    </div>
                `;
            });
        }
    } catch (error) {
        console.error('Erreur lors du chargement des événements:', error);
    }
}

async function loadGallery() {
    try {
        const { data, error } = await supabase
            .from('gallery')
            .select('*')
            .order('uploaded_at', { ascending: false });
        
        if (error) throw error;
        
        const container = document.getElementById('gallery-container');
        if (container && data) {
            container.innerHTML = '';
            data.forEach(item => {
                container.innerHTML += `
                    <div class="gallery-item" data-category="${item.category}">
                        <img src="${item.image_url}" alt="${item.title || 'Photo'}">
                        <div class="gallery-overlay">
                            <i class="fas fa-search-plus"></i>
                        </div>
                    </div>
                `;
            });
        }
    } catch (error) {
        console.error('Erreur lors du chargement de la galerie:', error);
    }
}

async function loadStatistics() {
    try {
        const { data, error } = await supabase
            .from('statistics')
            .select('*')
            .limit(1)
            .single();
        
        if (error) throw error;
        
        const container = document.getElementById('stats-container');
        if (container && data) {
            container.innerHTML = `
                <div>
                    <span class="stat-number" data-target="${data.members_count || 0}">0</span>
                    <span class="stat-label">Membres</span>
                </div>
                <div>
                    <span class="stat-number" data-target="${data.events_count || 0}">0</span>
                    <span class="stat-label">Événements</span>
                </div>
                <div>
                    <span class="stat-number" data-target="${data.years_count || 0}">0</span>
                    <span class="stat-label">Années</span>
                </div>
                <div>
                    <span class="stat-number" data-target="${data.cities_count || 0}">0</span>
                    <span class="stat-label">Villes</span>
                </div>
            `;
        }
    } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
    }
}

async function loadActivities(category = 'all') {
    try {
        let query = supabase
            .from('activities')
            .select('*')
            .order('date', { ascending: false });
        
        if (category !== 'all') {
            query = query.eq('category', category);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        const container = document.getElementById('activities-container');
        if (container && data) {
            container.innerHTML = '';
            data.forEach(activity => {
                container.innerHTML += `
                    <div class="activity-card" data-category="${activity.category}">
                        <div class="activity-image">
                            <img src="${activity.image || 'images/default-activity.jpg'}" alt="${activity.title}">
                            <span class="activity-category">${activity.category}</span>
                        </div>
                        <div class="activity-content">
                            <div class="activity-date">
                                <i class="fas fa-calendar"></i> ${new Date(activity.date).toLocaleDateString('fr')}
                            </div>
                            <h3 class="activity-title">${activity.title}</h3>
                            <p class="activity-description">${activity.description.substring(0, 100)}...</p>
                            <a href="#" class="btn-activity" onclick="showActivityDetails('${activity.id}')">Voir plus</a>
                        </div>
                    </div>
                `;
            });
        }
    } catch (error) {
        console.error('Erreur lors du chargement des activités:', error);
    }
}

async function loadTeam() {
    try {
        const { data, error } = await supabase
            .from('team')
            .select('*')
            .order('order_position', { ascending: true });
        
        if (error) throw error;
        
        const container = document.getElementById('team-container');
        if (container && data) {
            container.innerHTML = '';
            data.forEach(member => {
                container.innerHTML += `
                    <div class="team-member">
                        <div class="member-image">
                            <img src="${member.photo || 'images/default-avatar.png'}" alt="${member.prenom} ${member.nom}">
                        </div>
                        <div class="member-info">
                            <h3>${member.prenom} ${member.nom}</h3>
                            <p class="member-role">${member.role}</p>
                        </div>
                    </div>
                `;
            });
        }
    } catch (error) {
        console.error('Erreur lors du chargement de l\'équipe:', error);
    }
}

// Fonction de connexion
async function login(email, password) {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        
        if (error) throw error;
        
        if (data) {
            // Vérifier le mot de passe (dans un environnement réel, utilisez bcrypt côté serveur)
            if (password === 'admin123' && email === 'admin@ngozistesduroyaume.org') {
                localStorage.setItem('user', JSON.stringify(data));
                
                if (data.role === 'admin') {
                    window.location.href = 'admin/dashboard.html';
                } else {
                    window.location.href = 'member/dashboard.html';
                }
                return { success: true };
            }
        }
        return { success: false, message: 'Email ou mot de passe incorrect' };
    } catch (error) {
        console.error('Erreur de connexion:', error);
        return { success: false, message: 'Erreur de connexion' };
    }
}

// Fonction d'inscription
async function register(userData) {
    try {
        const { data, error } = await supabase
            .from('users')
            .insert([{
                nom: userData.nom,
                prenom: userData.prenom,
                email: userData.email,
                telephone: userData.telephone,
                motivation: userData.motivation,
                newsletter: userData.newsletter || false,
                role: 'pending',
                created_at: new Date().toISOString()
            }])
            .select();
        
        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error('Erreur d\'inscription:', error);
        return { success: false, message: error.message };
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', async function() {
    // Charger les données selon la page
    if (document.getElementById('timeline-container')) {
        await loadTimeline();
    }
    
    if (document.getElementById('missions-container')) {
        await loadValues();
    }
    
    if (document.getElementById('past-events-container') || document.getElementById('upcoming-events-container')) {
        await loadEvents();
    }
    
    if (document.getElementById('gallery-container')) {
        await loadGallery();
    }
    
    if (document.getElementById('stats-container')) {
        await loadStatistics();
    }
    
    if (document.getElementById('activities-container')) {
        await loadActivities();
    }
    
    if (document.getElementById('team-container')) {
        await loadTeam();
    }
    
    // Gestionnaire de formulaire d'inscription
    const adhesionForm = document.getElementById('adhesion-form');
    if (adhesionForm) {
        adhesionForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(adhesionForm);
            const userData = {
                nom: formData.get('nom'),
                prenom: formData.get('prenom'),
                email: formData.get('email'),
                telephone: formData.get('telephone'),
                motivation: formData.get('motivation'),
                newsletter: formData.get('newsletter') === 'on'
            };
            
            const result = await register(userData);
            
            if (result.success) {
                alert('Votre demande d\'adhésion a été envoyée avec succès ! Elle sera traitée dans les plus brefs délais.');
                adhesionForm.reset();
            } else {
                alert('Erreur lors de l\'envoi de votre demande : ' + result.message);
            }
        });
    }
    
    // Gestionnaire de formulaire de connexion
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            const result = await login(email, password);
            
            if (!result.success) {
                const alertDiv = document.getElementById('login-alert');
                alertDiv.textContent = result.message;
                alertDiv.className = 'alert error';
                alertDiv.style.display = 'block';
            }
        });
    }
});