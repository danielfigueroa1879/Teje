// Script optimizado para carga rápida de imágenes en móvil
document.addEventListener('DOMContentLoaded', function() {
    // Función para precargar y mantener imagen en memoria
    function preloadHeroImage() {
        var heroImage = new Image();
        heroImage.onload = function() {
            // Forzar que la imagen se mantenga en caché
            document.querySelector('.hero').style.backgroundImage = 
                "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('su.jpg')";
        };
        heroImage.src = 'su.jpg';
        
        // Mantener referencia para evitar garbage collection
        window.heroImageRef = heroImage;
    }
    
    // Precargar inmediatamente
    preloadHeroImage();
    
    // Para dispositivos móvil: crear elementos invisibles para mantener imagen en memoria
    if (window.innerWidth <= 768) {
        var hiddenImg = document.createElement('img');
        hiddenImg.src = 'su.jpg';
        hiddenImg.style.position = 'absolute';
        hiddenImg.style.left = '-9999px';
        hiddenImg.style.width = '1px';
        hiddenImg.style.height = '1px';
        hiddenImg.style.opacity = '0';
        document.body.appendChild(hiddenImg);
        
        // Forzar que se mantenga en memoria
        window.hiddenImageRef = hiddenImg;
    }
    
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

    // Funcionalidad del botón scroll to top (solo móvil)
    var scrollToTopBtn = document.getElementById('scrollToTop');
    var timeoutId = null;
    var isMobile = window.innerWidth <= 768;
    
    if (scrollToTopBtn && isMobile) {
        // Mostrar/ocultar el botón basado en el scroll
        window.addEventListener('scroll', function() {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 300) { // Mostrar después de 300px de scroll
                if (!scrollToTopBtn.classList.contains('show')) {
                    scrollToTopBtn.classList.remove('hide');
                    scrollToTopBtn.classList.add('show');
                }
                
                // Limpiar timeout anterior si existe
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                
                // Auto-ocultar después de 5 segundos de inactividad
                timeoutId = setTimeout(function() {
                    if (scrollToTopBtn.classList.contains('show')) {
                        scrollToTopBtn.classList.remove('show');
                        scrollToTopBtn.classList.add('hide');
                        
                        // Esperar a que termine la animación antes de ocultar completamente
                        setTimeout(function() {
                            scrollToTopBtn.classList.remove('hide');
                        }, 300);
                    }
                }, 5000);
                
            } else {
                // Ocultar cuando esté cerca del top
                if (scrollToTopBtn.classList.contains('show')) {
                    scrollToTopBtn.classList.remove('show');
                    scrollToTopBtn.classList.add('hide');
                    
                    setTimeout(function() {
                        scrollToTopBtn.classList.remove('hide');
                    }, 300);
                }
                
                // Limpiar timeout
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }
            }
        });
        
        // Acción al hacer clic en el botón
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Mostrar el botón inmediatamente al llegar al final de la página
        window.addEventListener('scroll', function() {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
                if (!scrollToTopBtn.classList.contains('show')) {
                    scrollToTopBtn.classList.remove('hide');
                    scrollToTopBtn.classList.add('show');
                }
                
                // Limpiar timeout anterior
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                
                // Auto-ocultar después de 5 segundos
                timeoutId = setTimeout(function() {
                    if (scrollToTopBtn.classList.contains('show')) {
                        scrollToTopBtn.classList.remove('show');
                        scrollToTopBtn.classList.add('hide');
                        
                        setTimeout(function() {
                            scrollToTopBtn.classList.remove('hide');
                        }, 300);
                    }
                }, 5000);
            }
        });
    }
    
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
