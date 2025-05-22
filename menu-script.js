// Script SIMPLIFICADO - Menú hamburguesa que SÍ funciona
document.addEventListener('DOMContentLoaded', function() {
    
    // Precarga de imagen (simplificada)
    const heroImg = new Image();
    heroImg.src = 'Fotos/su.jpg';
    heroImg.onload = function() {
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('Fotos/su.jpg')";
        }
    };
    
    // MENÚ HAMBURGUESA SIMPLE Y FUNCIONAL
    const menuButton = document.getElementById('menuToggle');
    const mainMenu = document.getElementById('mainMenu');
    
    console.log('🍔 Menú Button:', menuButton);
    console.log('📋 Main Menu:', mainMenu);
    
    if (menuButton && mainMenu) {
        
        // Click en el botón hamburguesa
        menuButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🍔 CLICK en menú hamburguesa');
            
            // Toggle del menú
            if (mainMenu.classList.contains('show')) {
                mainMenu.classList.remove('show');
                this.innerHTML = '☰';
                console.log('❌ Menú CERRADO');
            } else {
                mainMenu.classList.add('show');
                this.innerHTML = '✕';
                console.log('✅ Menú ABIERTO');
            }
        });
        
        // Click en enlaces del menú
        const links = mainMenu.querySelectorAll('a');
        console.log('🔗 Enlaces encontrados:', links.length);
        
        links.forEach(function(link) {
            link.addEventListener('click', function(e) {
                console.log('🔗 Click en enlace:', this.textContent);
                
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    
                    // Cerrar menú
                    mainMenu.classList.remove('show');
                    menuButton.innerHTML = '☰';
                    
                    // Scroll suave
                    const target = document.querySelector(href);
                    if (target) {
                        setTimeout(function() {
                            target.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }, 100);
                    }
                }
            });
        });
        
        // Click fuera del menú para cerrarlo
        document.addEventListener('click', function(e) {
            if (!menuButton.contains(e.target) && !mainMenu.contains(e.target)) {
                if (mainMenu.classList.contains('show')) {
                    mainMenu.classList.remove('show');
                    menuButton.innerHTML = '☰';
                    console.log('🚪 Menú cerrado por click fuera');
                }
            }
        });
        
        console.log('✅ MENÚ HAMBURGUESA CONFIGURADO');
        
    } else {
        console.error('❌ ERROR: Elementos del menú no encontrados');
    }
    
    // FLECHA SCROLL (simplificada)
    const scrollBtn = document.getElementById('scrollToTop');
    let timeout;
    
    if (scrollBtn && window.innerWidth <= 768) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset;
            
            if (scrollTop > 300) {
                scrollBtn.classList.add('show');
                scrollBtn.classList.remove('hide');
                
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    scrollBtn.classList.remove('show');
                    scrollBtn.classList.add('hide');
                }, 5000);
            } else {
                scrollBtn.classList.remove('show');
                clearTimeout(timeout);
            }
        });
        
        scrollBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('¡Gracias por suscribirte!');
                this.reset();
            } else {
                alert('Por favor, ingresa un email válido.');
            }
        });
    }
    
    console.log('🚀 SCRIPT CARGADO COMPLETAMENTE');
});
