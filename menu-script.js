// Script mejorado para el menú móvil con desplazamiento suave a las secciones
document.addEventListener('DOMContentLoaded', function() {
    // Obtener los elementos del menú
    var menuButton = document.getElementById('menuToggle');
    var mainMenu = document.getElementById('mainMenu');
    
    if (menuButton && mainMenu) {
        // Evento para mostrar/ocultar el menú móvil cuando se hace clic en el botón
        menuButton.addEventListener('click', function(e) {
            e.preventDefault(); // Prevenir comportamiento predeterminado
            mainMenu.classList.toggle('show');
            
            // Cambiar el ícono del botón
            this.innerHTML = mainMenu.classList.contains('show') ? '✕' : '☰';
        });
        
        // Evento para cerrar el menú al hacer clic en un enlace y hacer scroll suave
        var links = mainMenu.getElementsByTagName('a');
        
        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener('click', function(e) {
                // Verificar si el enlace es interno
                var href = this.getAttribute('href');
                if (href.charAt(0) === '#') {
                    e.preventDefault(); // Prevenir navegación estándar
                    
                    var targetElement = document.querySelector(href);
                    if (targetElement) {
                        // Cerrar el menú
                        mainMenu.classList.remove('show');
                        menuButton.innerHTML = '☰';
                        
                        // Desplazamiento suave hacia la sección
                        window.scrollTo({
                            top: targetElement.offsetTop - 80, // Ajuste para el encabezado fijo
                            behavior: 'smooth'
                        });
                    }
                }
                else {
                    // Cerrar el menú para enlaces externos
                    mainMenu.classList.remove('show');
                    menuButton.innerHTML = '☰';
                }
            });
        }
        
        // Cerrar el menú al hacer clic fuera de él
        document.addEventListener('click', function(e) {
            if (!menuButton.contains(e.target) && !mainMenu.contains(e.target)) {
                if (mainMenu.classList.contains('show')) {
                    mainMenu.classList.remove('show');
                    menuButton.innerHTML = '☰';
                }
            }
        });
    } else {
        console.error('Menú móvil: No se encontraron los elementos necesarios.');
    }
    
    // Funcionalidad de desplazamiento suave para todos los enlaces internos (no solo móvil)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href !== '#') { // Evitar enlaces "#" vacíos
                e.preventDefault();
                
                var targetElement = document.querySelector(href);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Ajuste para el encabezado fijo
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Actualizar año actual en el copyright si existe el elemento
    var currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Validación básica del formulario de newsletter en el footer
    var newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let valid = true;
            const emailField = this.querySelector('input[type="email"]');
            
            if (!emailField.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
                emailField.classList.add('error');
                valid = false;
            } else {
                emailField.classList.remove('error');
            }
            
            if (valid) {
                alert('¡Gracias por suscribirte a nuestra newsletter!');
                this.reset();
            } else {
                alert('Por favor, ingresa un correo electrónico válido.');
            }
        });
    }
});
