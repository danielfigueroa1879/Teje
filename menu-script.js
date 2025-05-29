// Script súper optimizado para carga instantánea de imagen - CORREGIDO
document.addEventListener('DOMContentLoaded', function() {
    // Evitar múltiples inicializaciones
    if (window.tejidosLunaInitialized) {
        return;
    }
    window.tejidosLunaInitialized = true;

    console.log('🧶 Tejidos Luna cargado correctamente');
    
    // Carga agresiva e inmediata de la imagen hero
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
                }
            };
            // Mantener referencias globales
            window['heroImg' + i] = img;
        }
    }
    
    // Ejecutar inmediatamente
    forceLoadHeroImage();
    
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
        tempImg.src = 'Fotos/su.jpg';
        
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
    
    // Funcionalidad de música de fondo - CORREGIDA
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = document.getElementById('musicIcon');
    let musicIsPlaying = false;
    let musicStarted = false;
    let musicInitialized = false;

    // Función para iniciar música - SOLO UNA VEZ
    function startMusic() {
        if (!backgroundMusic || musicStarted || musicInitialized) return;
        
        musicInitialized = true;
        backgroundMusic.volume = 0.3;
        
        const playPromise = backgroundMusic.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                musicIsPlaying = true;
                musicStarted = true;
                updateMusicButton();
                console.log('🎵 Música iniciada correctamente');
                removeAllInteractionListeners();
            }).catch((error) => {
                console.log('⚠️ Autoplay bloqueado - esperando interacción del usuario');
                musicInitialized = false;
            });
        }
    }

    // Toggle de música
    window.toggleMusic = function() {
        if (!backgroundMusic) return;
        
        if (!musicStarted) {
            startMusic();
            return;
        }
        
        if (backgroundMusic.paused) {
            backgroundMusic.play().then(() => {
                musicIsPlaying = true;
                updateMusicButton();
            }).catch(() => {
                console.log('Error al reproducir música');
            });
        } else {
            backgroundMusic.pause();
            musicIsPlaying = false;
            updateMusicButton();
        }
    };

    function updateMusicButton() {
        if (!musicIcon || !musicToggle) return;
        
        if (musicIsPlaying && !backgroundMusic.paused) {
            musicIcon.textContent = '🎵';
            musicToggle.classList.add('playing');
            musicToggle.title = 'Pausar música';
        } else {
            musicIcon.textContent = '🔇';
            musicToggle.classList.remove('playing');
            musicToggle.title = 'Reproducir música';
        }
    }

    // Event listeners del audio - SOLO SI EXISTEN
    if (backgroundMusic) {
        // Remover listeners anteriores si existen
        backgroundMusic.removeEventListener('play', handleMusicPlay);
        backgroundMusic.removeEventListener('pause', handleMusicPause);
        
        function handleMusicPlay() {
            musicIsPlaying = true;
            updateMusicButton();
        }
        
        function handleMusicPause() {
            musicIsPlaying = false;
            updateMusicButton();
        }
        
        backgroundMusic.addEventListener('play', handleMusicPlay);
        backgroundMusic.addEventListener('pause', handleMusicPause);
    }

    // Función para manejar interacciones - CORREGIDA
    function handleInteraction(e) {
        if (musicStarted || musicInitialized) return;
        
        // CORRECCIÓN: Verificar que e.target existe y tiene el método closest
        if (!e || !e.target || typeof e.target.closest !== 'function') {
            return;
        }
        
        // No interferir con controles específicos
        if (e.target.closest('.modal-nav') || 
            e.target.closest('.modal-controls') || 
            e.target.closest('#musicToggle') ||
            e.target.closest('.close')) {
            return;
        }
        
        startMusic();
    }

    function removeAllInteractionListeners() {
        document.removeEventListener('click', handleInteraction, true);
        document.removeEventListener('keydown', handleInteraction, true);
        document.removeEventListener('touchstart', handleInteraction, true);
        document.removeEventListener('scroll', handleInteraction, true);
        document.removeEventListener('mousemove', handleInteraction, true);
    }

    // Intentar iniciar música después de un delay
    setTimeout(() => {
        if (!musicInitialized) {
            startMusic();
        }
    }, 1000);

    // Agregar listeners para interacciones - SOLO UNA VEZ
    if (!window.interactionListenersAdded) {
        window.interactionListenersAdded = true;
        
        document.addEventListener('click', handleInteraction, { capture: true, once: false });
        document.addEventListener('keydown', handleInteraction, { capture: true, once: false });
        document.addEventListener('touchstart', handleInteraction, { passive: true, capture: true, once: false });
        document.addEventListener('scroll', handleInteraction, { passive: true, capture: true, once: false });
        document.addEventListener('mousemove', handleInteraction, { passive: true, capture: true, once: false });
    }

    // Resto del código del menú (solo si no se ha inicializado)
    if (!window.menuInitialized) {
        window.menuInitialized = true;
        
        var menuButton = document.getElementById('menuToggle');
        var mainMenu = document.getElementById('mainMenu');
        
        if (menuButton && mainMenu) {
            menuButton.addEventListener('click', function(e) {
                e.preventDefault();
                mainMenu.classList.toggle('show');
                this.innerHTML = mainMenu.classList.contains('show') ? '✕' : '☰';
            });
            
            // Cerrar menú al hacer clic en enlaces
            var links = mainMenu.getElementsByTagName('a');
            for (var i = 0; i < links.length; i++) {
                links[i].addEventListener('click', function(e) {
                    var href = this.getAttribute('href');
                    if (href.charAt(0) === '#') {
                        e.preventDefault();
                        var targetElement = document.querySelector(href);
                        if (targetElement) {
                            mainMenu.classList.remove('show');
                            menuButton.innerHTML = '☰';
                            window.scrollTo({
                                top: targetElement.offsetTop - 80,
                                behavior: 'smooth'
                            });
                        }
                    } else {
                        mainMenu.classList.remove('show');
                        menuButton.innerHTML = '☰';
                    }
                });
            }
            
            // Cerrar menú al hacer clic fuera
            document.addEventListener('click', function(e) {
                if (!menuButton.contains(e.target) && !mainMenu.contains(e.target)) {
                    if (mainMenu.classList.contains('show')) {
                        mainMenu.classList.remove('show');
                        menuButton.innerHTML = '☰';
                    }
                }
            });
        }
    }

    // Scroll suave para enlaces internos
    if (!window.smoothScrollInitialized) {
        window.smoothScrollInitialized = true;
        
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
    }

    // Botón scroll to top (solo móvil)
    var scrollToTopBtn = document.getElementById('scrollToTop');
    var isMobile = window.innerWidth <= 768;
    
    if (scrollToTopBtn && isMobile && !window.scrollToTopInitialized) {
        window.scrollToTopInitialized = true;
        
        var timeoutId = null;
        
        function handleScroll() {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 300) {
                if (!scrollToTopBtn.classList.contains('show')) {
                    scrollToTopBtn.classList.remove('hide');
                    scrollToTopBtn.classList.add('show');
                }
                
                if (timeoutId) clearTimeout(timeoutId);
                
                timeoutId = setTimeout(function() {
                    if (scrollToTopBtn.classList.contains('show')) {
                        scrollToTopBtn.classList.remove('show');
                        scrollToTopBtn.classList.add('hide');
                        setTimeout(() => scrollToTopBtn.classList.remove('hide'), 300);
                    }
                }, 5000);
            } else {
                if (scrollToTopBtn.classList.contains('show')) {
                    scrollToTopBtn.classList.remove('show');
                    scrollToTopBtn.classList.add('hide');
                    setTimeout(() => scrollToTopBtn.classList.remove('hide'), 300);
                }
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }
            }
        }
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Actualizar año del copyright
    var currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Funciones del modal (definir globalmente)
    let currentZoom = 1;
    let currentImageIndex = 0;
    let allImages = [];

    function collectAllImages() {
        allImages = [];
        const productImages = document.querySelectorAll('.product-image img[onclick]');
        const featuredImages = document.querySelectorAll('.featured-image img[onclick]');
        const blogImages = document.querySelectorAll('.blog-image img[onclick]');
        
        productImages.forEach(img => allImages.push(img));
        featuredImages.forEach(img => allImages.push(img));
        blogImages.forEach(img => allImages.push(img));
    }

    // Definir funciones globales del modal
    window.openModal = function(img) {
        collectAllImages();
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        
        if (!modal || !modalImg) return;
        
        currentImageIndex = allImages.findIndex(image => image.src === img.src);
        if (currentImageIndex === -1) currentImageIndex = 0;
        
        modal.style.display = 'flex';
        modal.classList.add('show');
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        currentZoom = 1;
        modalImg.style.transform = `scale(${currentZoom})`;
        
        updateImageCounter();
        document.body.style.overflow = 'hidden';
    };

    window.closeModal = function() {
        const modal = document.getElementById('imageModal');
        if (!modal) return;
        
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);
        document.body.style.overflow = 'auto';
        currentZoom = 1;
    };

    window.nextImage = function(e) {
        if (e) e.stopPropagation();
        if (allImages.length === 0) return;
        currentImageIndex = (currentImageIndex + 1) % allImages.length;
        showCurrentImage();
    };

    window.prevImage = function(e) {
        if (e) e.stopPropagation();
        if (allImages.length === 0) return;
        currentImageIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
        showCurrentImage();
    };

    function showCurrentImage() {
        const modalImg = document.getElementById('modalImage');
        if (!modalImg || !allImages[currentImageIndex]) return;
        
        const currentImg = allImages[currentImageIndex];
        modalImg.src = currentImg.src;
        modalImg.alt = currentImg.alt;
        currentZoom = 1;
        modalImg.style.transform = `scale(${currentZoom})`;
        updateImageCounter();
    }

    function updateImageCounter() {
        const currentSpan = document.getElementById('currentImageIndex');
        const totalSpan = document.getElementById('totalImages');
        if (currentSpan && totalSpan) {
            currentSpan.textContent = currentImageIndex + 1;
            totalSpan.textContent = allImages.length;
        }
    }

    window.zoomIn = function() {
        const modalImg = document.getElementById('modalImage');
        if (!modalImg) return;
        currentZoom += 0.2;
        if (currentZoom > 4) currentZoom = 4;
        modalImg.style.transform = `scale(${currentZoom})`;
    };

    window.zoomOut = function() {
        const modalImg = document.getElementById('modalImage');
        if (!modalImg) return;
        currentZoom -= 0.2;
        if (currentZoom < 0.3) currentZoom = 0.3;
        modalImg.style.transform = `scale(${currentZoom})`;
    };

    window.resetZoom = function() {
        const modalImg = document.getElementById('modalImage');
        if (!modalImg) return;
        currentZoom = 1;
        modalImg.style.transform = `scale(${currentZoom})`;
    };

    // Event listeners para el modal - SOLO UNA VEZ
    if (!window.modalListenersAdded) {
        window.modalListenersAdded = true;
        
        // Cerrar con Escape, navegación con flechas
        document.addEventListener('keydown', function(e) {
            const modal = document.getElementById('imageModal');
            if (!modal || !modal.classList.contains('show')) return;
            
            switch(e.key) {
                case 'Escape': window.closeModal(); break;
                case 'ArrowLeft': window.prevImage(); break;
                case 'ArrowRight': window.nextImage(); break;
                case '+': case '=': window.zoomIn(); break;
                case '-': window.zoomOut(); break;
                case '0': window.resetZoom(); break;
            }
        });

        // Zoom con scroll del mouse
        document.addEventListener('wheel', function(e) {
            const modal = document.getElementById('imageModal');
            if (!modal || !modal.classList.contains('show')) return;
            
            e.preventDefault();
            if (e.deltaY < 0) {
                window.zoomIn();
            } else {
                window.zoomOut();
            }
        }, { passive: false });
    }

    // Event listeners para el modal
    const modal = document.getElementById('imageModal');
    if (modal) {
        // Cerrar modal solo cuando se hace clic en el fondo
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                window.closeModal();
            }
        });
        
        const modalImg = document.getElementById('modalImage');
        if (modalImg) {
            modalImg.addEventListener('click', function(e) {
                e.stopPropagation();
            });
            
            // Prevenir el menú contextual en la imagen
            modalImg.addEventListener('contextmenu', function(e) {
                e.preventDefault();
            });
        }

        // Prevenir que los clics en controles cierren el modal
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
            modalContent.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }

        // Event listeners específicos para botones de navegación
        const prevBtn = document.querySelector('.modal-nav.prev');
        const nextBtn = document.querySelector('.modal-nav.next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                window.prevImage();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                window.nextImage();
            });
        }
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

    console.log('✅ Tejidos Luna inicializado correctamente');
});
