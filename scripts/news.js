// scripts/news.js
document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const ITEMS_PER_PAGE = 6;
    let currentPage = 1;
    let currentCategory = 'all';
    let searchQuery = '';

    // Données des actualités
    const newsData = [
        {
            id: 1,
            title: "School Tour : Une initiative pour la santé mentale des jeunes en collaboration avec ESPOIR",
            category: "evenements",
            excerpt: "Dans le cadre de leur engagement commun pour le bien-être des jeunes, School Tour et ESPOIR ont uni leurs forces pour sensibiliser les élèves aux enjeux de la santé mentale. Ce partenariat innovant a permis de créer un espace de dialogue au sein des écoles, où les élèves ont pu exprimer leurs préoccupations et s’informer sur des sujets souvent tabous",
            image: "src/g.jpg",
            date: "2024-10-07",
            author: "Espoir"
        },
        {
            id: 2,
            title: "ESPOIR : Une journée de pêche pour rassembler et inspirer",
            category: "projets",
            excerpt: "Dans le cadre de ses activités pour favoriser l’inclusion sociale et créer des moments de partage, l’association ESPOIR a récemment organisé une sortie de pêche inoubliable. Cette journée, placée sous le signe de la convivialité et de la découverte, a permis aux participants de profiter de la nature tout en renforçant les liens au sein de la communauté.",
            image: "src/m.jpg",
            date: "2024-03-10",
            author: "A.SY"
        },
        {
            id: 3,
            title: "Un Ramadan de Solidarité : Dons de Nourriture et de Vivres avec ESPOIR,YarYewuYete, et Musaaada",
            category: "temoignages",
            excerpt: "Pendant le mois sacré de Ramadan, les associations ESPOIR,YarYewuYete et Musaaada ont uni leurs forces pour organiser des journées de dons de nourriture et de vivres, apportant soutien et réconfort aux familles dans le besoin. Ce partenariat, fondé sur des valeurs de partage et de générosité, a permis d’atteindre des centaines de bénéficiaires, offrant ainsi une aide précieuse en cette période spéciale.",
            image: "src/i.jpg",
            date: "2024-05-05",
            author: "Falcon"
        }
    ];

    // Sélecteurs DOM
    const newsGrid = document.querySelector('.news-grid');
    const categoryFilters = document.querySelector('.category-filters');
    const searchInput = document.querySelector('.search-bar input');
    const pagination = document.querySelector('.pagination');
    const pageNumbers = document.querySelector('.page-numbers');

    // Fonction pour créer une carte d'actualité
    function createNewsCard(news) {
        return `
            <article class="news-card">
                <img src="${news.image}" alt="${news.title}" class="news-image">
                <div class="news-content-wrapper">
                    <span class="news-category">${news.category}</span>
                    <h3 class="news-title">${news.title}</h3>
                    <p class="news-excerpt">${news.excerpt}</p>
                    <div class="news-meta">
                        <span>${new Date(news.date).toLocaleDateString('fr-FR')}</span>
                        <span>${news.author}</span>
                    </div>
                </div>
            </article>
        `;
    }

    // Fonction pour filtrer et rechercher les actualités
    function filterNews() {
        return newsData.filter(news => {
            const categoryMatch = currentCategory === 'all' || news.category === currentCategory;
            const searchMatch = !searchQuery || 
                news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                news.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
            return categoryMatch && searchMatch;
        });
    }

    // Fonction pour afficher les actualités
    function displayNews() {
        const filteredNews = filterNews();
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const paginatedNews = filteredNews.slice(start, end);
        
        newsGrid.innerHTML = paginatedNews.map(news => createNewsCard(news)).join('');
        updatePagination(filteredNews.length);
    }

    // Fonction pour mettre à jour la pagination
    function updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        
        // Générer les boutons de pagination
        let paginationHTML = `
            <button class="prev-btn" ${currentPage === 1 ? 'disabled' : ''}>Précédent</button>
            <div class="page-numbers">
        `;

        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <button class="page-number ${currentPage === i ? 'active' : ''}">${i}</button>
            `;
        }

        paginationHTML += `
            </div>
            <button class="next-btn" ${currentPage === totalPages ? 'disabled' : ''}>Suivant</button>
        `;

        pagination.innerHTML = paginationHTML;

        // Ajouter les écouteurs d'événements pour la pagination
        const prevBtn = pagination.querySelector('.prev-btn');
        const nextBtn = pagination.querySelector('.next-btn');
        const pageButtons = pagination.querySelectorAll('.page-number');

        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayNews();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayNews();
            }
        });

        pageButtons.forEach(button => {
            button.addEventListener('click', () => {
                currentPage = parseInt(button.textContent);
                displayNews();
            });
        });
    }

    // Initialiser les filtres de catégorie
    function initializeCategoryFilters() {
        const categories = ['all', 'evenements', 'projets', 'temoignages', 'communaute'];
        const categoryLabels = {
            'all': 'Tous',
            'evenements': 'Événements',
            'projets': 'Projets',
            'temoignages': 'Témoignages',
            'communaute': 'Communauté'
        };

        categoryFilters.innerHTML = categories.map(category => `
            <button class="filter-btn ${currentCategory === category ? 'active' : ''}" 
                    data-category="${category}">
                ${categoryLabels[category]}
            </button>
        `).join('');

        // Ajouter les écouteurs d'événements pour les filtres
        categoryFilters.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', () => {
                currentCategory = button.dataset.category;
                currentPage = 1;
                
                // Mettre à jour l'état actif des boutons
                categoryFilters.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.category === currentCategory);
                });
                
                displayNews();
            });
        });
    }

    // Initialiser la barre de recherche
    function initializeSearchBar() {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchQuery = e.target.value;
                currentPage = 1;
                displayNews();
            }, 300);
        });
    }

    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            // Add your newsletter subscription logic here
            alert('Merci de votre inscription à la newsletter !');
            newsletterForm.reset();
        });
    }

    // Initialisation
    function initialize() {
        initializeCategoryFilters();
        initializeSearchBar();
        displayNews();
    }

    initialize();
});