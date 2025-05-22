// Script súper optimizado para carga instantánea de imagen - ADAPTADO para Fotos/su.jpg
document.addEventListener('DOMContentLoaded', function() {
    // Carga agresiva e inmediata de la imagen hero
    function forceLoadHeroImage() {
        // Crear múltiples instancias para asegurar carga
        for (let i = 0; i < 3; i++) {
            const img = new Image();
            img.src = 'Fotos/su.jpg'; // CAMBIO AQUÍ: Nueva ruta
            img.onload = function() {
                // Aplicar imagen inmediatamente al elemento hero
                const hero = document.querySelector('.hero');
                if (hero) {
                    hero.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('Fotos/su.jpg')"; // CAMBIO AQUÍ
                    hero.style.backgroundSize = 'cover';
                    hero.style.backgroundPosition = 'center center';
                }
            };
            // Mantener referencias globales
            window['heroImg' + i] = img;
        }
    }
    
    // Función para cargar imágenes de productos - SIMPLIFICADA
    function forceLoadProductImages() {
        const productImages = [
            'Fotos/trajeBebe.jpeg',
            'Fotos/trajeBebe1.jpeg', 
            'Fotos/trajeBebe2.jpeg'
        ];
        
        // Solo precargar las imágenes sin manipular el DOM
        productImages.forEach((src, index) => {
            const img = new Image();
            img.onload = function() {
                console.log('Imagen cargada:', src);
            };
            img.onerror = function() {
                console.error('Error cargando imagen:', src);
            };
            img.src = src;
            // Mantener referencia global
            window['productImg' + index] = img;
        });
    }
    
    // Ejecutar inmediatamente
    forceLoadHeroImage();
    // forceLoadProductImages(); // Comentado para evitar interferencia
    
    // Para móviles: técnicas adicionales de optimización
    if (window.innerWidth <= 768) {
        // Crear canvas invisible para pre-renderizar
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const tempImg = new Image();
        tempImg.onload = function() {
            canvas.width = this.width;
            canvas.height = this.height;
            ctx.drawImage(this, 0, 0);
            // Mantener canvas en memoria
            window.heroCanvas = canvas;
        };
        tempImg.src = 'Fotos/su.jpg'; // CAMBIO AQUÍ: Nueva ruta
        
        // Forzar repaint del hero cada 100ms por 1 segundo
        let attempts = 0;
        const forceRepaint = setInterval(() => {
            const hero = document.querySelector('.hero');
            if (hero && attempts < 10) {
                hero.style.transform = 'translateZ(0)';
                attempts++;
            } else {
                clearInterval(forceRepaint);
            }
        }, 100);
    }
    
    // Resto del código del menú
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

// Funciones para el modal de imágenes
let currentZoom = 1;

function openModal(img) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    
    modal.classList.add('show');
    modalImg.src = img.src;
    modalImg.alt = img.alt;
    currentZoom = 1;
    modalImg.style.transform = `scale(${currentZoom})`;
    
    // Prevenir scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
    
    // Restaurar scroll del body
    document.body.style.overflow = 'auto';
    currentZoom = 1;
}

function zoomIn() {
    const modalImg = document.getElementById('modalImage');
    currentZoom += 0.2;
    if (currentZoom > 3) currentZoom = 3; // Máximo zoom
    modalImg.style.transform = `scale(${currentZoom})`;
}

function zoomOut() {
    const modalImg = document.getElementById('modalImage');
    currentZoom -= 0.2;
    if (currentZoom < 0.5) currentZoom = 0.5; // Mínimo zoom
    modalImg.style.transform = `scale(${currentZoom})`;
}

function resetZoom() {
    const modalImg = document.getElementById('modalImage');
    currentZoom = 1;
    modalImg.style.transform = `scale(${currentZoom})`;
}

// Cerrar modal con tecla Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Prevenir que el clic en la imagen cierre el modal
document.getElementById('modalImage').addEventListener('click', function(e) {
    e.stopPropagation();
});
