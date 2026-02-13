// js/main.js

// Menu mobile
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Fermer le menu mobile quand on clique sur un lien
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scroll pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header transparent au scroll
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.style.background = 'white';
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        header.style.background = 'transparent';
        header.style.boxShadow = 'none';
    }
});

// Animation des compteurs de statistiques
const statNumbers = document.querySelectorAll('.stat-number');
const statsSection = document.querySelector('.stats');

function animateStats() {
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const increment = target / 50;
        let current = 0;

        const updateCount = () => {
            if (current < target) {
                current += increment;
                stat.textContent = Math.ceil(current);
                requestAnimationFrame(updateCount);
            } else {
                stat.textContent = target;
            }
        };

        updateCount();
    });
}

// Observer pour lancer l'animation quand la section est visible
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}

// Filtre de la galerie
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        galleryItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Lightbox pour la galerie
const lightbox = document.querySelector('.lightbox');
const lightboxImg = document.querySelector('.lightbox-content');
const closeLightbox = document.querySelector('.close-lightbox');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

if (closeLightbox) {
    closeLightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
}

if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// Animation au scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.card, .event-card, .timeline-item');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Filtre des activités
const activityFilterButtons = document.querySelectorAll('.activity-filters .filter-btn');
if (activityFilterButtons.length > 0) {
    activityFilterButtons.forEach(button => {
        button.addEventListener('click', async () => {
            activityFilterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            await loadActivities(filter);
        });
    });
}

// Fonction pour afficher les détails d'un événement
window.showEventDetails = async function(eventId) {
    try {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('id', eventId)
            .single();
        
        if (error) throw error;
        
        const modal = document.getElementById('eventModal');
        const modalImage = document.getElementById('modalImage');
        const modalTitle = document.getElementById('modalTitle');
        const modalInfo = document.getElementById('modalInfo');
        const modalDescription = document.getElementById('modalDescription');
        
        modalImage.src = data.image || 'images/default-event.jpg';
        modalTitle.textContent = data.title;
        
        modalInfo.innerHTML = `
            <div class="modal-info-item">
                <i class="fas fa-calendar"></i>
                <span>${new Date(data.date).toLocaleDateString('fr')} à ${new Date(data.date).toLocaleTimeString('fr')}</span>
            </div>
            <div class="modal-info-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>${data.location}</span>
            </div>
            <div class="modal-info-item">
                <i class="fas fa-users"></i>
                <span>${data.max_participants ? 'Maximum ' + data.max_participants + ' participants' : 'Nombre de participants illimité'}</span>
            </div>
        `;
        
        modalDescription.innerHTML = `
            <h3>Description</h3>
            <p>${data.description}</p>
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    } catch (error) {
        console.error('Erreur lors du chargement des détails:', error);
    }
};

// Fonction pour fermer le modal
window.closeEventModal = function() {
    const modal = document.getElementById('eventModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
};

// Gestionnaire d'inscription aux événements
const registrationForm = document.getElementById('event-registration-form');
if (registrationForm) {
    registrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.id) {
            alert('Veuillez vous connecter pour vous inscrire à cet événement');
            window.location.href = 'login.html';
            return;
        }
        
        const eventId = document.querySelector('#eventModal').getAttribute('data-event-id');
        const guests = document.getElementById('guests').value;
        const message = document.getElementById('message').value;
        
        try {
            const { data, error } = await supabase
                .from('event_registrations')
                .insert([{
                    event_id: eventId,
                    user_id: user.id,
                    guests: parseInt(guests),
                    message: message,
                    registered_at: new Date().toISOString()
                }]);
            
            if (error) throw error;
            
            alert('Inscription réussie !');
            closeEventModal();
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            alert('Erreur lors de l\'inscription');
        }
    });
}