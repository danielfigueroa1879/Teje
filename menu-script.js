// Script CORREGIDO para móvil - Menú hamburguesa y imagen
document.addEventListener('DOMContentLoaded', function() {
    // OPTIMIZACIÓN IMAGEN PARA MÓVIL
    function forceLoadHeroImage() {
        // Crear múltiples instancias para asegurar carga
        for (let i = 0; i < 3; i++) {
            const img = new Image();
            img.src = 'Fotos/su.jpg';
            img.onload = function() {
                // Aplicar imagen inmediatamente al elemento hero
                const hero = document.querySelector('.hero');
                if (hero) {
                    hero.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('Fotos/su.jpg')";
                    hero.style.backgroundSize = 'cover';
                    hero.style.backgroundPosition = 'center center';
                    hero.style.backgroundRepeat = 'no-repeat';
                    hero.style.backgroundAttachment = 'scroll';
                }
            };
            // Mantener referencias globales
            window['heroImg' + i] = img;
        }
    }
    
    // Ejecutar inmediatamente
    forceLoadHeroImage();
    
    // Para móviles: crear imagen invisible para mantener en cache
    if (window.innerWidth <= 768) {
        const hiddenImg = document.createElement('img');
        hiddenImg.src = 'Fotos/su.jpg';
        hiddenImg.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0;';
        document.body.appendChild(hiddenImg);
        window.hiddenHeroImg = hiddenImg;
    }
    
    // MENÚ HAMBURGUESA CORREGIDO
    var menuButton = document.getElementById('menuToggle');
    var mainMenu = document.getElementById('mainMenu');
    
    console.log('Menú button:', menuButton); // Debug
    console.log('Main menu:', mainMenu); // Debug
    
    if (menuButton && mainMenu) {
        // Evento para mostrar/ocultar el menú móvil
        menuButton.addEventListener('click', function(e) {
            console.log('Click en menú hamburguesa'); // Debug
            e.preventDefault();
            e.stopPropagation();
            
            mainMenu.classList.toggle('show');
            
            // Cambiar el ícono del botón
            this.innerHTML = mainMenu.classList.contains('show') ? '✕' : '☰';
            
            console.log('Menú show class:', mainMenu.classList.contains('show')); // Debug
        });
        
        // Evento para cerrar el menú al hacer clic en un enlace
        var links = mainMenu.getElementsByTagName('a');
        console.log('Enlaces encontrados:', links.length); // Debug
        
        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener('click', function(e) {
                console.log('Click en enlace:', this.textContent); // Debug
                
                // Verificar si el enlace es interno
                var href = this.getAttribute('href');
                if (href && href.charAt(0) === '#') {
                    e.preventDefault();
                    
                    var targetElement = document.querySelector(href);
                    if (targetElement) {
                        // Cerrar el menú
                        mainMenu.classList.remove('show');
                        menuButton.innerHTML = '☰';
                        
                        // Desplazamiento suave hacia la sección
                        setTimeout(function() {
                            window.scrollTo({
                                top: targetElement.offsetTop - 80,
                                behavior: 'smooth'
                            });
                        }, 100);
                    }
                } else {
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
        
        console.log('Menú hamburguesa configurado correctamente'); // Debug
    } else {
        console.error('ERROR: No se encontraron los elementos del menú');
        console.error('menuButton:', menuButton);
        console.error('mainMenu:', mainMenu);
    }
    
    // Funcionalidad de desplazamiento suave mejorada
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                
                var targetElement = document.querySelector(href);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // FUNCIONALIDAD FLECHA CORREGIDA PARA MÓVIL
    var scrollToTopBtn = document.getElementById('scrollToTop');
    var timeoutId = null;
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    
    console.log('Es móvil:', isMobile); // Debug
    console.log('Botón flecha encontrado:', !!scrollToTopBtn); // Debug
    
    if (scrollToTopBtn && isMobile) {
        // Mostrar/ocultar el botón basado en el scroll
        window.addEventListener('scroll', function() {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 300) {
                if (!scrollToTopBtn.classList.contains('show')) {
                    scrollToTopBtn.classList.remove('hide');
                    scrollToTopBtn.classList.add('show');
                    console.log('Mostrando flecha'); // Debug
                }
                
                // Auto-ocultar después de 5 segundos
                if (timeoutId) clearTimeout(timeoutId);
                timeoutId = setTimeout(function() {
                    if (scrollToTopBtn.classList.contains('show')) {
                        scrollToTopBtn.classList.remove('show');
                        scrollToTopBtn.classList.add('hide');
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
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }
            }
        });
        
        // Acción al hacer clic en el botón
        scrollToTopBtn.addEventListener('click', function() {
            console.log('Click en flecha'); // Debug
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Newsletter form
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
