// scripts/projects.js
document.addEventListener('DOMContentLoaded', function() {
    // Données des projets
    const projects = [
        {
            id: 1,
            title: "School-Tour",
            category: "education",
            description: "Faire le tour des écoles dans l'ESPOIR de découvrir qui nous sommes",
            image: "src/project-education.jpg",
            progress: 75,
            goal: "100000",
            current: "75000",
            date: "2024-09-30"
        },
        {
            id: 2,
            title: "Reforestation Urbaine",
            category: "environment",
            description: "Plantation de 100 arbres dans les zones urbaines",
            image: "src/project-environment.jpg",
            progress: 60,
            goal: "50000",
            current: "30000",
            date: "2024-08-15"
        },
        {
            id: 3,
            title: "Parainage et dons de médicament",
            category: "health",
            description: "Service social médical mobile pour les communautés isolées",
            image: "src/project-health.jpg",
            progress: 40,
            goal: "150000",
            current: "60000",
            date: "2024-12-31"
        },
        {
            id: 4,
            title: "Projet d'aide dans la periode de froid",
            category: "community",
            description: "Dons de vetements de froid ",
            image: "src/project-community.jpg",
            progress: 90,
            goal: "80000",
            current: "72000",
            date: "2024-05-15"
        }
    ];

    // Fonction pour créer une carte de projet
    function createProjectCard(project) {
        return `
            <div class="project-card" data-category="${project.category}">
                <img src="${project.image}" alt="${project.title}" class="project-image">
                <div class="project-content">
                    <span class="project-category">${project.category}</span>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-status">
                        <div class="status-bar">
                            <div class="status-progress" style="width: ${project.progress}%"></div>
                        </div>
                        <span>${project.progress}%</span>
                    </div>
                    <div class="project-meta">
                        <span>${Number(project.current).toLocaleString()} frcfa collectés</span>
                        <span>Objectif: ${Number(project.goal).toLocaleString()} frcfa</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Fonction pour afficher les projets
    function displayProjects(category = 'all') {
        const projectsContainer = document.querySelector('.projects-container');
        const filteredProjects = category === 'all' 
            ? projects 
            : projects.filter(project => project.category === category);
        
        projectsContainer.innerHTML = filteredProjects
            .map(project => createProjectCard(project))
            .join('');
    }

    // Gestionnaire de filtres
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Mise à jour des classes actives
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrage des projets
            const category = this.dataset.category;
            displayProjects(category);

            // Animation des cartes
            const cards = document.querySelectorAll('.project-card');
            cards.forEach((card, index) => {
                card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
            });
        });
    });

    // Affichage initial des projets
    displayProjects();

    // Animation au scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    });

    document.querySelectorAll('.project-card').forEach(card => {
        observer.observe(card);
    });
});