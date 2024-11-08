// scripts/contact.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation de la carte
    const map = L.map('map').setView([14.6937, -17.4441], 13); // Coordonnées de Dakar
    
    // Ajout du layer OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Ajout du marqueur pour l'emplacement
    const marker = L.marker([48.8566, 2.3522]).addTo(map);
    marker.bindPopup("<b>ESPOIR</b><br>Point-E<br>Dakar").openPopup();

    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contactForm');
    const formGroups = document.querySelectorAll('.form-group');

    // Fonction pour afficher les messages d'erreur
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        const existingError = formGroup.querySelector('.error-message');
        
        if (!existingError) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            formGroup.appendChild(errorDiv);
        }
    }

    // Fonction pour supprimer les messages d'erreur
    function removeError(input) {
        const formGroup = input.closest('.form-group');
        const error = formGroup.querySelector('.error-message');
        if (error) {
            error.remove();
        }
    }

    // Validation des champs
    function validateField(input) {
        removeError(input);

        if (input.required && !input.value.trim()) {
            showError(input, 'Ce champ est obligatoire');
            return false;
        }

        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                showError(input, 'Veuillez entrer une adresse email valide');
                return false;
            }
        }

        if (input.type === 'tel' && input.value) {
            const phoneRegex = /^[+]?[\d\s-]{8,}$/;
            if (!phoneRegex.test(input.value)) {
                showError(input, 'Veuillez entrer un numéro de téléphone valide');
                return false;
            }
        }

        return true;
    }

    // Affichage du message de succès
    function showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.style.display = 'block';
        successMessage.textContent = 'Votre message a été envoyé avec succès!';
        contactForm.insertBefore(successMessage, contactForm.firstChild);

        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }

    // Gestion de la soumission du formulaire
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        let isValid = true;
        const formData = new FormData();

        // Valider tous les champs
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea');
            if (input) {
                if (!validateField(input)) {
                    isValid = false;
                }
                formData.append(input.name, input.value);
            }
        });

        // Vérifier la case à cocher de politique de confidentialité
        const privacyCheckbox = document.querySelector('input[type="checkbox"]');
        if (!privacyCheckbox.checked) {
            showError(privacyCheckbox, 'Vous devez accepter la politique de confidentialité');
            isValid = false;
        }

        if (isValid) {
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    showSuccessMessage();
                    contactForm.reset();
                } else {
                    throw new Error('Erreur lors de l\'envoi du formulaire');
                }
            } catch (error) {
                console.error('Erreur:', error);
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.textContent = 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.';
                contactForm.insertBefore(errorDiv, contactForm.firstChild);
            }
        }
    });

    // Validation en temps réel
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        if (input) {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => removeError(input));
        }
    });
});