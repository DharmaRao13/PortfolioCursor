// Import necessary GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Interactive Background Animation
const hero = document.querySelector('.hero');
const interactiveBg = document.createElement('div');
interactiveBg.className = 'interactive-bg';
hero.insertBefore(interactiveBg, hero.firstChild);

// Create floating elements
const NUM_ELEMENTS = 15;
const floatingElements = [];
const mouseTrails = [];
let mouseX = 0;
let mouseY = 0;

// Create glow effect
const glowEffect = document.createElement('div');
glowEffect.className = 'glow-effect';
interactiveBg.appendChild(glowEffect);

// Create floating elements
for (let i = 0; i < NUM_ELEMENTS; i++) {
    const element = document.createElement('div');
    element.className = 'floating-element';
    const size = Math.random() * 100 + 50;
    
    const floatingElement = {
        element,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 0.5
    };
    
    gsap.set(element, {
        width: size,
        height: size,
        x: floatingElement.x,
        y: floatingElement.y,
        rotation: floatingElement.rotation
    });
    
    interactiveBg.appendChild(element);
    floatingElements.push(floatingElement);
}

// Mouse trail effect
function createMouseTrail() {
    const trail = document.createElement('div');
    trail.className = 'mouse-trail';
    interactiveBg.appendChild(trail);
    return trail;
}

// Create multiple trail elements
for (let i = 0; i < 10; i++) {
    mouseTrails.push({
        element: createMouseTrail(),
        x: 0,
        y: 0,
        delay: i * 2
    });
}

// Update animation
function updateAnimation() {
    // Update floating elements
    floatingElements.forEach(element => {
        // Update position
        element.x += element.speedX;
        element.y += element.speedY;
        element.rotation += element.rotationSpeed;
        
        // Mouse interaction
        const dx = mouseX - element.x;
        const dy = mouseY - element.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 400;
        
        if (distance < maxDistance) {
            const force = (1 - distance / maxDistance) * 0.05;
            element.speedX -= dx * force;
            element.speedY -= dy * force;
        }
        
        // Bounce off edges
        if (element.x < -element.size) element.x = window.innerWidth + element.size;
        if (element.x > window.innerWidth + element.size) element.x = -element.size;
        if (element.y < -element.size) element.y = window.innerHeight + element.size;
        if (element.y > window.innerHeight + element.size) element.y = -element.size;
        
        // Apply speed limits
        const maxSpeed = 2;
        element.speedX = Math.max(Math.min(element.speedX, maxSpeed), -maxSpeed);
        element.speedY = Math.max(Math.min(element.speedY, maxSpeed), -maxSpeed);
        
        // Update element position
        gsap.to(element.element, {
            x: element.x,
            y: element.y,
            rotation: element.rotation,
            duration: 1,
            ease: 'power1.out'
        });
    });
    
    // Update mouse trails
    mouseTrails.forEach((trail, index) => {
        gsap.to(trail.element, {
            x: mouseX,
            y: mouseY,
            duration: 0.5,
            delay: trail.delay * 0.02,
            ease: 'power2.out',
            onStart: () => {
                gsap.to(trail.element, {
                    opacity: 0.3,
                    duration: 0.2
                });
            },
            onComplete: () => {
                gsap.to(trail.element, {
                    opacity: 0,
                    duration: 0.3
                });
            }
        });
    });
    
    // Update glow effect
    gsap.to(glowEffect, {
        x: mouseX,
        y: mouseY,
        duration: 1,
        ease: 'power2.out'
    });
    
    requestAnimationFrame(updateAnimation);
}

// Mouse move handler
hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    
    // Create ripple effect on mouse move
    const ripple = document.createElement('div');
    ripple.className = 'mouse-trail';
    interactiveBg.appendChild(ripple);
    
    gsap.fromTo(ripple, 
        {
            x: mouseX,
            y: mouseY,
            scale: 0,
            opacity: 0.5
        },
        {
            scale: 2,
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
            onComplete: () => ripple.remove()
        }
    );
});

// Start animation
updateAnimation();

// Handle window resize
window.addEventListener('resize', () => {
    floatingElements.forEach(element => {
        element.x = Math.random() * window.innerWidth;
        element.y = Math.random() * window.innerHeight;
    });
});

// Custom Cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
const links = document.querySelectorAll('a, button');

document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0
    });
    
    gsap.to(cursorFollower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3
    });
});

links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
        cursorFollower.style.transform = 'scale(1.5)';
    });
    
    link.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursorFollower.style.transform = 'scale(1)';
    });
});

// Preloader Animation
const preloader = document.querySelector('.preloader');
const counter = document.querySelector('.counter');
let count = 0;

const updateCounter = () => {
    counter.textContent = count + '%';
    if (count < 100) {
        count++;
        setTimeout(updateCounter, 20);
    } else {
        gsap.to(preloader, {
            yPercent: -100,
            duration: 1,
            ease: 'power4.inOut'
        });
    }
};

window.addEventListener('load', updateCounter);

// Navigation Menu
const menuBtn = document.querySelector('.nav-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const menuSpans = document.querySelectorAll('.nav-menu-btn span');

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    
    if (mobileMenu.classList.contains('active')) {
        gsap.to(menuSpans[0], {
            rotate: 45,
            y: 8,
            duration: 0.3
        });
        gsap.to(menuSpans[1], {
            opacity: 0,
            duration: 0.3
        });
        gsap.to(menuSpans[2], {
            rotate: -45,
            y: -8,
            duration: 0.3
        });
    } else {
        gsap.to(menuSpans, {
            rotate: 0,
            y: 0,
            opacity: 1,
            duration: 0.3
        });
    }
});

// Hero Section Animations
const heroText = document.querySelector('.hero-text h1');
const heroName = document.querySelector('.hero-name');
const heroSubtext = document.querySelector('.hero-text p');

// Split text animation for the name
const splitName = new SplitType('.hero-name', { types: 'chars, words' });
const nameChars = splitName.chars;
const nameWords = splitName.words;

// Create timeline for initial animation
const nameTimeline = gsap.timeline({ delay: 3 });

// Initial animation for the name with bounce effect
nameTimeline
    .from(nameChars, {
        opacity: 0,
        y: 100,
        rotateX: -90,
        stagger: {
            each: 0.05,
            from: "start"
        },
        duration: 1,
        ease: 'back.out(1.7)',
    })
    .to(nameChars, {
        y: -20,
        stagger: {
            each: 0.05,
            from: "start"
        },
        duration: 0.4,
        ease: 'power2.out',
    })
    .to(nameChars, {
        y: 0,
        stagger: {
            each: 0.05,
            from: "start"
        },
        duration: 0.3,
        ease: 'bounce.out',
    });

// Hero text animations
gsap.from(heroText, {
    y: 100,
    opacity: 0,
    duration: 1,
    delay: 3.5,
    ease: 'power4.out'
});

gsap.from(heroSubtext, {
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 4,
    ease: 'power4.out'
});

// Interactive animations for name characters
nameChars.forEach((char, index) => {
    // Rainbow colors array
    const rainbowColors = [
        '#FF0000', // Red
        '#FF7F00', // Orange
        '#FFFF00', // Yellow
        '#00FF00', // Green
        '#0000FF', // Blue
        '#4B0082', // Indigo
        '#9400D3'  // Violet
    ];

    char.addEventListener('mouseenter', () => {
        // Create a wave effect starting from the hovered character
        nameChars.forEach((c, i) => {
            const distance = Math.abs(index - i);
            const delay = distance * 0.05;
            const colorIndex = Math.floor(Math.random() * rainbowColors.length);
            
            gsap.to(c, {
                y: -20 * Math.exp(-distance * 0.2),
                scale: 1.2 * Math.exp(-distance * 0.2),
                color: rainbowColors[colorIndex],
                duration: 0.4,
                delay: delay,
                ease: 'power2.out',
                rotation: gsap.utils.random(-15, 15)
            });
        });

        // Add glowing effect to the hovered character
        gsap.to(char, {
            textShadow: '0 0 20px currentColor',
            duration: 0.3
        });
    });

    char.addEventListener('mouseleave', () => {
        // Reset all characters with a wave effect
        nameChars.forEach((c, i) => {
            const distance = Math.abs(index - i);
            const delay = distance * 0.05;
            
            gsap.to(c, {
                y: 0,
                scale: 1,
                color: 'var(--text-color)',
                rotation: 0,
                textShadow: 'none',
                duration: 0.3,
                delay: delay,
                ease: 'power2.inOut'
            });
        });
    });
});

// Add floating animation to each word with different timing
nameWords.forEach((word, index) => {
    gsap.to(word, {
        y: '10px',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: index * 0.2
    });
});

// Add magnetic effect to the name wrapper
const nameWrapper = document.querySelector('.hero-name-wrapper');
const magnetStrength = 0.3;
let isHovered = false;

nameWrapper.addEventListener('mouseenter', () => {
    isHovered = true;
    // Add a subtle scale effect
    gsap.to(heroName, {
        scale: 1.05,
        duration: 0.5,
        ease: 'power2.out'
    });
});

nameWrapper.addEventListener('mousemove', (e) => {
    if (!isHovered) return;
    
    const rect = nameWrapper.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    gsap.to(heroName, {
        x: x * magnetStrength,
        y: y * magnetStrength,
        rotation: x * 0.05,
        duration: 1,
        ease: 'power3.out'
    });
});

nameWrapper.addEventListener('mouseleave', () => {
    isHovered = false;
    gsap.to(heroName, {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.3)'
    });
});

// Add 3D tilt effect
nameWrapper.addEventListener('mousemove', (e) => {
    if (!isHovered) return;
    
    const rect = nameWrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xPercent = (x / rect.width - 0.5) * 2;
    const yPercent = (y / rect.height - 0.5) * 2;
    
    gsap.to(heroName, {
        rotateY: xPercent * 10,
        rotateX: -yPercent * 10,
        duration: 0.5,
        ease: 'power2.out'
    });
});

// Work Section Animations
const workItems = document.querySelectorAll('.work-item');

workItems.forEach((item, index) => {
    gsap.from(item, {
        scrollTrigger: {
            trigger: item,
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse'
        },
        y: 100,
        opacity: 0,
        duration: 1,
        delay: index * 0.2,
        ease: 'power4.out'
    });

    // Add hover animations
    item.addEventListener('mouseenter', () => {
        gsap.to(item, {
            y: -10,
            scale: 1.02,
            duration: 0.4,
            ease: 'power2.out'
        });

        // Add glow effect
        gsap.to(item, {
            boxShadow: '0 10px 30px rgba(67, 83, 255, 0.3)',
            duration: 0.4
        });
    });

    item.addEventListener('mouseleave', () => {
        gsap.to(item, {
            y: 0,
            scale: 1,
            boxShadow: 'none',
            duration: 0.4,
            ease: 'power2.out'
        });
    });
});

// Skills Section Animations
const skillCategories = document.querySelectorAll('.skill-category');
const skillItems = document.querySelectorAll('.skill-item');

// GSAP Scroll Trigger for skill categories
skillCategories.forEach((category, index) => {
    gsap.from(category, {
        scrollTrigger: {
            trigger: category,
            start: "top bottom-=100",
            toggleActions: "play none none reverse"
        },
        y: 100,
        opacity: 0,
        duration: 1,
        delay: index * 0.2,
        ease: "power4.out"
    });

    // Add hover effect
    category.addEventListener('mouseenter', () => {
        gsap.to(category, {
            y: -10,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            boxShadow: '0 15px 30px rgba(67, 83, 255, 0.3)',
            borderColor: 'var(--accent-color)',
            duration: 0.4,
            ease: 'power2.out'
        });
    });

    category.addEventListener('mouseleave', () => {
        gsap.to(category, {
            y: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            duration: 0.4,
            ease: 'power2.out'
        });
    });
});

// GSAP animations for skill items
skillItems.forEach((item, index) => {
    gsap.from(item, {
        scrollTrigger: {
            trigger: item,
            start: "top bottom-=50",
            toggleActions: "play none none reverse"
        },
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        delay: index * 0.1,
        ease: "back.out(1.7)"
    });

    item.addEventListener('mouseenter', () => {
        gsap.to(item, {
            scale: 1.1,
            y: -5,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderColor: 'var(--accent-color)',
            boxShadow: '0 10px 20px rgba(67, 83, 255, 0.2)',
            duration: 0.3,
            ease: "power2.out"
        });

        const icon = item.querySelector('i');
        gsap.to(icon, {
            scale: 1.2,
            rotation: 360,
            duration: 0.5,
            ease: "back.out(1.7)"
        });

        // Add glow effect to text
        const text = item.querySelector('span');
        gsap.to(text, {
            color: 'var(--secondary-color)',
            textShadow: '0 0 10px rgba(67, 83, 255, 0.5)',
            duration: 0.3
        });
    });

    item.addEventListener('mouseleave', () => {
        gsap.to(item, {
            scale: 1,
            y: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderColor: 'rgba(255, 255, 255, 0.05)',
            boxShadow: 'none',
            duration: 0.3,
            ease: "power2.out"
        });

        const icon = item.querySelector('i');
        gsap.to(icon, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: "power2.inOut"
        });

        const text = item.querySelector('span');
        gsap.to(text, {
            color: 'var(--gray-color)',
            textShadow: 'none',
            duration: 0.3
        });
    });
});

// Framer Motion animations for skill items (using custom elements)
skillItems.forEach(item => {
    // Create animation for floating effect
    const floatingAnimation = {
        y: [-5, 5],
        transition: {
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
        }
    };

    // Add floating animation on hover
    item.addEventListener('mouseenter', () => {
        gsap.to(item, {
            y: "-=5",
            duration: 0.3,
            ease: "power2.out",
            yoyo: true,
            repeat: -1
        });
    });

    item.addEventListener('mouseleave', () => {
        gsap.killTweensOf(item);
        gsap.to(item, {
            y: 0,
            duration: 0.3,
            ease: "power2.out"
        });
    });
});

// Stagger animation for skill categories on scroll
const skillsSection = document.querySelector('.skills-section');
const skillsTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: skillsSection,
        start: "top center",
        toggleActions: "play none none reverse"
    }
});

skillsTimeline
    .from('.section-header', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power4.out"
    })
    .from(skillCategories, {
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power4.out"
    }, "-=0.5")
    .from(skillItems, {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: "back.out(1.7)"
    }, "-=0.3");

// Add parallax effect to skill categories
skillCategories.forEach(category => {
    gsap.to(category, {
        scrollTrigger: {
            trigger: category,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
        },
        y: 50,
        ease: "none"
    });
});

// Animate skill levels on scroll
const skillLevels = document.querySelectorAll('.skill-progress');
skillLevels.forEach(level => {
    const percentage = level.getAttribute('data-progress');
    gsap.to(level, {
        scrollTrigger: {
            trigger: level,
            start: "top bottom-=100",
            toggleActions: "play none none reverse"
        },
        width: percentage + "%",
        duration: 1.5,
        ease: "power4.out"
    });
});

// Projects Section Animations
const projectCards = document.querySelectorAll('.project-card');
const projectLinks = document.querySelectorAll('.project-link');

projectCards.forEach((card, index) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse'
        },
        y: 100,
        opacity: 0,
        duration: 1,
        delay: index * 0.2,
        ease: 'power4.out'
    });
    
    // Hover animations for project cards
    card.addEventListener('mouseenter', () => {
        gsap.to(card.querySelector('.project-image img'), {
            scale: 1.1,
            duration: 0.5,
            ease: 'power2.out'
        });
        
        gsap.to(card.querySelector('.project-links'), {
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
        
        gsap.to(card.querySelectorAll('.project-link'), {
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'back.out(1.7)'
        });
    });
    
    card.addEventListener('mouseleave', () => {
        gsap.to(card.querySelector('.project-image img'), {
            scale: 1,
            duration: 0.5,
            ease: 'power2.out'
        });
        
        gsap.to(card.querySelector('.project-links'), {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
        
        gsap.to(card.querySelectorAll('.project-link'), {
            y: 20,
            duration: 0.5,
            stagger: 0.1,
            ease: 'back.in(1.7)'
        });
    });
});

// Project tech stack animations
const projectTechSpans = document.querySelectorAll('.project-tech span');

projectTechSpans.forEach(span => {
    span.addEventListener('mouseenter', () => {
        gsap.to(span, {
            scale: 1.1,
            backgroundColor: 'var(--accent-color)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    span.addEventListener('mouseleave', () => {
        gsap.to(span, {
            scale: 1,
            backgroundColor: 'rgba(255,255,255,0.1)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// About Section Animations
const aboutText = document.querySelector('.about-text');
const aboutImage = document.querySelector('.about-image');
const skillBars = document.querySelectorAll('.skill-progress');

gsap.from(aboutText, {
    scrollTrigger: {
        trigger: aboutText,
        start: 'top bottom-=100',
        toggleActions: 'play none none reverse'
    },
    x: -100,
    opacity: 0,
    duration: 1,
    ease: 'power4.out'
});

gsap.from(aboutImage, {
    scrollTrigger: {
        trigger: aboutImage,
        start: 'top bottom-=100',
        toggleActions: 'play none none reverse'
    },
    x: 100,
    opacity: 0,
    duration: 1,
    ease: 'power4.out'
});

// Animate skill bars
skillBars.forEach(bar => {
    const percentage = bar.getAttribute('data-progress');
    gsap.to(bar, {
        scrollTrigger: {
            trigger: bar,
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse'
        },
        width: percentage + '%',
        duration: 1.5,
        ease: 'power4.out'
    });
});

// Contact Section Animations
const contactContent = document.querySelector('.contact-content');
const formGroups = document.querySelectorAll('.form-group');

gsap.from(contactContent, {
    scrollTrigger: {
        trigger: contactContent,
        start: 'top bottom-=100',
        toggleActions: 'play none none reverse'
    },
    y: 100,
    opacity: 0,
    duration: 1,
    ease: 'power4.out'
});

formGroups.forEach((group, index) => {
    gsap.from(group, {
        scrollTrigger: {
            trigger: group,
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: 'power4.out'
    });
});

// Navigation Active State
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const mobileNavLinks = document.querySelectorAll('.mobile-menu-links a');

function updateActiveLink() {
    const scrollY = window.scrollY;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
            
            mobileNavLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveLink);
window.addEventListener('load', updateActiveLink);

// Smooth Scrolling Update
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            gsap.to(window, {
                duration: 1,
                scrollTo: {
                    y: target,
                    offsetY: 70
                },
                ease: 'power4.inOut'
            });
            
            // Update active state immediately
            navLinks.forEach(link => link.classList.remove('active'));
            mobileNavLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
            
            // Close mobile menu if open
            if (mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                gsap.to(menuSpans, {
                    rotate: 0,
                    y: 0,
                    opacity: 1,
                    duration: 0.3
                });
            }
        }
    });
});

// Contact Form Handling
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Add your form submission logic here
    
    // Show success message animation
    const successMessage = document.createElement('div');
    successMessage.classList.add('success-message');
    successMessage.textContent = 'Message sent successfully!';
    contactForm.appendChild(successMessage);
    
    gsap.from(successMessage, {
        y: 30,
        opacity: 0,
        duration: 0.5,
        ease: 'power4.out'
    });
    
    // Reset form
    contactForm.reset();
    
    // Remove success message after 3 seconds
    setTimeout(() => {
        gsap.to(successMessage, {
            opacity: 0,
            y: -30,
            duration: 0.5,
            ease: 'power4.in',
            onComplete: () => successMessage.remove()
        });
    }, 3000);
});

// Live Date and Time Display with Animation
function updateLiveDateTime() {
    const now = new Date();
    const timeElement = document.getElementById('current-time');
    const dateElement = document.getElementById('current-date');
    
    // Format time as HH:MM:SS with AM/PM
    const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true 
    };
    const timeString = now.toLocaleTimeString('en-US', timeOptions);
    
    // Format date as "Month Day, Year"
    const dateOptions = { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const dateString = now.toLocaleDateString('en-US', dateOptions);
    
    // Animate time update
    gsap.to(timeElement, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
            timeElement.textContent = timeString;
            gsap.to(timeElement, {
                opacity: 1,
                duration: 0.2
            });
        }
    });
    
    // Update date with fade effect if it changed
    if (dateElement.textContent !== dateString) {
        gsap.to(dateElement, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                dateElement.textContent = dateString;
                gsap.to(dateElement, {
                    opacity: 1,
                    duration: 0.3
                });
            }
        });
    }
}

// Initialize and update datetime
updateLiveDateTime();
setInterval(updateLiveDateTime, 1000);

// Add floating animation to section headers
document.querySelectorAll('.section-header h2').forEach(header => {
    gsap.to(header, {
        y: '10px',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
    });
});

// Contact Section Animations
const contactElements = document.querySelectorAll('.contact-email, .contact-social a');

contactElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        gsap.to(element, {
            y: -5,
            scale: 1.05,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderColor: 'var(--accent-color)',
            boxShadow: '0 10px 30px rgba(67, 83, 255, 0.3)',
            duration: 0.4,
            ease: 'power2.out'
        });

        // Add special animation for icons
        const icon = element.querySelector('i');
        if (icon) {
            gsap.to(icon, {
                scale: 1.2,
                rotation: 5,
                color: 'var(--accent-color)',
                duration: 0.4,
                ease: 'back.out(1.7)'
            });
        }
    });

    element.addEventListener('mouseleave', () => {
        gsap.to(element, {
            y: 0,
            scale: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            duration: 0.4,
            ease: 'power2.out'
        });

        const icon = element.querySelector('i');
        if (icon) {
            gsap.to(icon, {
                scale: 1,
                rotation: 0,
                color: 'var(--secondary-color)',
                duration: 0.4,
                ease: 'power2.inOut'
            });
        }
    });
});

// Hero Background Animation Setup
const heroBackground = document.createElement('div');
heroBackground.className = 'hero-background';
hero.insertBefore(heroBackground, hero.firstChild);

// Create animated blobs
const blob1 = document.createElement('div');
blob1.className = 'animated-blob blob-1';
heroBackground.appendChild(blob1);

const blob2 = document.createElement('div');
blob2.className = 'animated-blob blob-2';
heroBackground.appendChild(blob2);

// Create particles container
const particlesContainer = document.createElement('div');
particlesContainer.className = 'hero-particles';
heroBackground.appendChild(particlesContainer);

// Create gradient overlay
const gradientOverlay = document.createElement('div');
gradientOverlay.className = 'gradient-overlay';
heroBackground.appendChild(gradientOverlay);

// Wrap existing hero content
const heroContent = document.createElement('div');
heroContent.className = 'hero-content';
while (hero.children.length > 1) {
    heroContent.appendChild(hero.children[1]);
}
hero.appendChild(heroContent);

// Initialize mouse position
let currentX = 0;
let currentY = 0;

// Create particles
const PARTICLE_COUNT = 50;
const particles = [];

for (let i = 0; i < PARTICLE_COUNT; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particlesContainer.appendChild(particle);
    
    const size = Math.random() * 3 + 1;
    gsap.set(particle, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        width: size,
        height: size,
        opacity: Math.random() * 0.6 + 0.2
    });
    
    particles.push({
        element: particle,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1
    });
}

// Animate blobs
function animateBlobs() {
    // Blob 1 animation
    gsap.to(blob1, {
        x: "random(-50, 50, 5)",
        y: "random(-50, 50, 5)",
        scale: "random(0.9, 1.1, 0.05)",
        duration: "random(3, 5)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // Blob 2 animation
    gsap.to(blob2, {
        x: "random(-50, 50, 5)",
        y: "random(-50, 50, 5)",
        scale: "random(0.9, 1.1, 0.05)",
        duration: "random(3, 5)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
}

// Mouse move handler
function handleMouseMove(e) {
    const rect = hero.getBoundingClientRect();
    currentX = e.clientX - rect.left;
    currentY = e.clientY - rect.top;

    // Move blobs with mouse
    gsap.to(blob1, {
        x: (currentX - rect.width / 2) * 0.1,
        y: (currentY - rect.height / 2) * 0.1,
        duration: 1,
        ease: "power2.out"
    });

    gsap.to(blob2, {
        x: (currentX - rect.width / 2) * -0.1,
        y: (currentY - rect.height / 2) * -0.1,
        duration: 1,
        ease: "power2.out"
    });
}

// Update particles
function updateParticles() {
    particles.forEach((particle, i) => {
        // Update position based on speed
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Mouse interaction
        const dx = currentX - particle.x;
        const dy = currentY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200;

        if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            particle.speedX -= dx * force * 0.02;
            particle.speedY -= dy * force * 0.02;
        }

        // Bounce off edges
        if (particle.x < 0 || particle.x > window.innerWidth) {
            particle.speedX *= -1;
        }
        if (particle.y < 0 || particle.y > window.innerHeight) {
            particle.speedY *= -1;
        }

        // Apply speed limits
        const maxSpeed = 2;
        particle.speedX = Math.max(Math.min(particle.speedX, maxSpeed), -maxSpeed);
        particle.speedY = Math.max(Math.min(particle.speedY, maxSpeed), -maxSpeed);

        // Update position with GSAP
        gsap.to(particle.element, {
            x: particle.x,
            y: particle.y,
            duration: 0.5,
            ease: "power1.out"
        });
    });

    requestAnimationFrame(updateParticles);
}

// Initialize animations
function initHeroAnimations() {
    animateBlobs();
    updateParticles();
    
    // Add mouse move listener
    hero.addEventListener('mousemove', handleMouseMove);

    // Add parallax effect to hero content
    hero.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

        gsap.to(heroContent, {
            x: moveX,
            y: moveY,
            duration: 1,
            ease: "power2.out"
        });
    });
}

// Start animations when page loads
window.addEventListener('load', initHeroAnimations);

// Handle window resize
window.addEventListener('resize', () => {
    particles.forEach(particle => {
        particle.x = Math.random() * window.innerWidth;
        particle.y = Math.random() * window.innerHeight;
    });
}); 