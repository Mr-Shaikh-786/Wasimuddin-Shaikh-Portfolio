// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Matrix Background
    initMatrixBackground();
    
    // Initialize 3D Globe
    init3DGlobe();
    
    // Initialize GSAP Animations
    initAnimations();
    
    // Initialize Terminal Typing Effect
    initTerminalTyping();
    
    // Setup Event Listeners
    setupEventListeners();
    
    // Setup Navigation
    setupNavigation();
    
    // Setup Certificate Modal
    setupCertificateModal();
});

// Matrix Background Animation
function initMatrixBackground() {
    const canvas = document.getElementById('matrix-bg');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Matrix characters
    const matrixChars = "01abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
    const charsArray = matrixChars.split('');
    
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Create an array to track the y position of each column
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * canvas.height / fontSize) * fontSize;
    }
    
    // Matrix colors
    const colors = ['#0f0', '#0ff', '#0a0', '#0af'];
    
    function drawMatrix() {
        // Semi-transparent black background for trail effect
        ctx.fillStyle = 'rgba(10, 10, 15, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw the characters
        for (let i = 0; i < drops.length; i++) {
            // Random character
            const char = charsArray[Math.floor(Math.random() * charsArray.length)];
            
            // Random color
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            ctx.fillStyle = color;
            ctx.font = `${fontSize}px 'Roboto Mono', monospace`;
            
            // Draw the character
            ctx.fillText(char, i * fontSize, drops[i] * fontSize);
            
            // Move the drop down
            drops[i] += fontSize;
            
            // Randomly reset drop to top
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
        }
    }
    
    // Animation loop
    function animate() {
        drawMatrix();
        requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// 3D Globe Initialization
function init3DGlobe() {
    const container = document.getElementById('globe-container');
    
    // Create a simple 3D sphere with Three.js
    if (typeof THREE !== 'undefined') {
        // Scene
        const scene = new THREE.Scene();
        
        // Camera
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        camera.position.z = 5;
        
        // Renderer
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        container.appendChild(renderer.domElement);
        
        // Create a wireframe sphere (cyber globe)
        const geometry = new THREE.SphereGeometry(2, 16, 16);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff9d,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
        
        // Add glowing points
        const pointsGeometry = new THREE.BufferGeometry();
        const pointsCount = 200;
        const positions = new Float32Array(pointsCount * 3);
        
        for (let i = 0; i < pointsCount * 3; i += 3) {
            // Random points on sphere
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const radius = 2.1;
            
            positions[i] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i + 2] = radius * Math.cos(phi);
        }
        
        pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const pointsMaterial = new THREE.PointsMaterial({
            color: 0x00eeff,
            size: 0.05,
            transparent: true
        });
        
        const points = new THREE.Points(pointsGeometry, pointsMaterial);
        scene.add(points);
        
        // Add connecting lines
        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = new Float32Array(pointsCount * 3 * 2);
        
        for (let i = 0; i < pointsCount; i++) {
            const idx = i * 6;
            const pointIdx = i * 3;
            
            // Start point
            linePositions[idx] = positions[pointIdx];
            linePositions[idx + 1] = positions[pointIdx + 1];
            linePositions[idx + 2] = positions[pointIdx + 2];
            
            // Connect to a random other point (but not all to avoid clutter)
            if (Math.random() > 0.7) {
                const otherIdx = Math.floor(Math.random() * pointsCount) * 3;
                linePositions[idx + 3] = positions[otherIdx];
                linePositions[idx + 4] = positions[otherIdx + 1];
                linePositions[idx + 5] = positions[otherIdx + 2];
            } else {
                // Connect to center for visual effect
                linePositions[idx + 3] = 0;
                linePositions[idx + 4] = 0;
                linePositions[idx + 5] = 0;
            }
        }
        
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00ff9d,
            transparent: true,
            opacity: 0.1
        });
        
        const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(lines);
        
        // Animation loop
        function animateGlobe() {
            requestAnimationFrame(animateGlobe);
            
            // Rotate the sphere
            sphere.rotation.x += 0.002;
            sphere.rotation.y += 0.003;
            
            // Rotate points and lines
            points.rotation.x += 0.001;
            points.rotation.y += 0.002;
            lines.rotation.x += 0.001;
            lines.rotation.y += 0.002;
            
            renderer.render(scene, camera);
        }
        
        // Start animation
        animateGlobe();
        
        // Handle window resize
        window.addEventListener('resize', function() {
            camera.aspect = container.offsetWidth / container.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.offsetWidth, container.offsetHeight);
        });
    } else {
        // Fallback if Three.js fails to load
        container.innerHTML = '<div class="globe-fallback"></div>';
        container.style.background = 'radial-gradient(circle, rgba(0,255,157,0.1) 0%, transparent 70%)';
    }
}

// GSAP Animations
function initAnimations() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero section animation
    gsap.from('.profile-container', {
        duration: 1.5,
        y: 50,
        opacity: 0,
        ease: 'power3.out'
    });
    
    // Animate section titles on scroll
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            duration: 1,
            x: -50,
            opacity: 0,
            ease: 'power3.out'
        });
    });
    
    // Animate cards on scroll
    gsap.utils.toArray('.skill-item, .cert-card, .project-card, .stat-card, .tool-item').forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            duration: 0.8,
            y: 30,
            opacity: 0,
            ease: 'power2.out'
        });
    });
    
    // Animate timeline items
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            duration: 1,
            x: i % 2 === 0 ? 50 : -50,
            opacity: 0,
            ease: 'power3.out',
            delay: i * 0.1
        });
    });
    
    // Parallax effect for hero section
    gsap.to('#globe-container', {
        scrollTrigger: {
            trigger: '#home',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: 100,
        ease: 'none'
    });
}

// Terminal Typing Effect
function initTerminalTyping() {
    const typingElement = document.querySelector('.terminal .typing');
    const commands = [
        'whoami',
        'nmap -sV target.com',
        'sqlmap --dbs -u "http://target.com/vuln.php?id=1"',
        'hydra -l admin -P passlist.txt ssh://target.com',
        'use exploit/multi/handler',
        'set payload windows/x64/meterpreter/reverse_tcp',
        'exploit'
    ];
    
    let commandIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;
    
    function typeText() {
        const currentCommand = commands[commandIndex];
        
        if (!isPaused) {
            if (!isDeleting && charIndex <= currentCommand.length) {
                // Typing forward
                typingElement.textContent = currentCommand.substring(0, charIndex);
                charIndex++;
                setTimeout(typeText, 50);
            } else if (isDeleting && charIndex >= 0) {
                // Deleting
                typingElement.textContent = currentCommand.substring(0, charIndex);
                charIndex--;
                setTimeout(typeText, 30);
            } else if (!isDeleting && charIndex > currentCommand.length) {
                // Pause at the end of typing
                isPaused = true;
                setTimeout(() => {
                    isPaused = false;
                    isDeleting = true;
                    setTimeout(typeText, 500);
                }, 1500);
            } else if (isDeleting && charIndex < 0) {
                // Move to next command
                isDeleting = false;
                commandIndex = (commandIndex + 1) % commands.length;
                setTimeout(typeText, 500);
            }
        }
    }
    
    // Start typing effect
    setTimeout(typeText, 1000);
}

// Setup Event Listeners
function setupEventListeners() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.querySelector('i').classList.toggle('fa-bars');
            this.querySelector('i').classList.toggle('fa-times');
        });
    }
    
    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            menuToggle.querySelector('i').classList.add('fa-bars');
            menuToggle.querySelector('i').classList.remove('fa-times');
        });
    });
    
    // Contact form submission
    const contactForm = document.getElementById('message-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real application, you would send the form data to a server
            // For demo purposes, we'll just show an alert
            alert('Message sent successfully! In a real implementation, this would connect to a backend.');
            this.reset();
        });
    }
    
    // View all certificates button
    const viewAllCertsBtn = document.getElementById('view-all-certs');
    if (viewAllCertsBtn) {
        viewAllCertsBtn.addEventListener('click', function() {
            alert('In a full implementation, this would show all certificates in a detailed view or open a modal with all certificates.');
        });
    }
}

// Setup Navigation
function setupNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Highlight active nav link on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Setup Certificate Modal
function setupCertificateModal() {
    const certCards = document.querySelectorAll('.cert-card');
    const modal = document.getElementById('cert-modal');
    const modalClose = modal.querySelector('.modal-close');
    const modalImage = document.getElementById('modal-cert-image');
    const modalTitle = document.getElementById('modal-cert-title');
    const modalIssuer = document.getElementById('modal-cert-issuer');
    
    // Certificate data (in a real app, this would come from a database)
    const certData = {
        0: {
            title: "Armour Infosec Certified Linux Server Administrator (AICLSA)",
            issuer: "Armour Infosec",
            description: "Certification demonstrating advanced Linux server administration and security skills.",
            image: "https://via.placeholder.com/400x300/00ff9d/0a0a0f?text=Linux+Cert"
        },
        1: {
            title: "Advent of Cyber 2025",
            issuer: "TryHackMe",
            description: "Completed the Advent of Cyber 2025 challenge, covering various cybersecurity topics.",
            image: "https://via.placeholder.com/400x300/00eeff/0a0a0f?text=Advent+of+Cyber"
        },
        2: {
            title: "Armour Infosec Certified WordPress Security Expert (AICWSE)",
            issuer: "Armour Infosec",
            description: "Specialized certification in WordPress security, vulnerabilities, and hardening techniques.",
            image: "https://via.placeholder.com/400x300/00ff9d/0a0a0f?text=WordPress+Security"
        },
        3: {
            title: "Certified Cybersecurity Educator Professional (CCEP)",
            issuer: "Professional Certification",
            description: "Certification for cybersecurity educators, focusing on teaching methodologies and knowledge transfer.",
            image: "https://via.placeholder.com/400x300/00eeff/0a0a0f?text=Educator+Cert"
        },
        4: {
            title: "Armour Infosec Certified Windows Server Administrator (AICWSA)",
            issuer: "Armour Infosec",
            description: "Certification for Windows server administration with a focus on security best practices.",
            image: "https://via.placeholder.com/400x300/00ff9d/0a0a0f?text=Windows+Server"
        },
        5: {
            title: "eWPTXv3",
            issuer: "eLearnSecurity",
            description: "eLearnSecurity Web Application Penetration Tester eXtreme certification, covering advanced web app testing.",
            image: "https://via.placeholder.com/400x300/00eeff/0a0a0f?text=eWPTXv3"
        }
    };
    
    // Open modal when clicking a certificate card
    certCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            if (certData[index]) {
                modalImage.src = certData[index].image;
                modalTitle.textContent = certData[index].title;
                modalIssuer.textContent = `Issued by: ${certData[index].issuer}`;
                document.getElementById('modal-cert-description').textContent = certData[index].description;
                
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close modal
    modalClose.addEventListener('click', function() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}
