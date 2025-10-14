// Main JavaScript for OpenPracticeHub showcase website

// Project data - This will be dynamically loaded in a real implementation
const projectsData = [
    {
        name: "Random Quote Generator",
        folder: "random-quotes",
        description: "A beautiful quote generator that displays inspiring quotes with smooth animations and sharing features.",
        features: [
            "Display random quotes with smooth animations",
            "Copy quotes to clipboard",
            "Share quotes on social media",
            "Add your favorite quotes",
            "Responsive design for all devices"
        ],
        technologies: ["HTML", "CSS", "JavaScript", "JSON"],
        difficulty: "Beginner",
        contributionCount: 0
    }
];

// GitHub API configuration
const GITHUB_REPO = "Ratul345/OpenPracticeHub";

// DOM elements
const projectsGrid = document.getElementById('projects-grid');
const projectsCount = document.getElementById('projects-count');
const contributorsCount = document.getElementById('contributors-count');
const commitsCount = document.getElementById('commits-count');
const starsCount = document.getElementById('stars-count');

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
    loadGitHubStats();
    setupSmoothScrolling();
    addFadeInAnimations();
});

// Load and display projects
function loadProjects() {
    // In a real implementation, this would scan the projects folder
    // For now, we'll use the hardcoded data
    displayProjects(projectsData);
    updateProjectsCount(projectsData.length);
}

// Display projects in the grid
function displayProjects(projects) {
    projectsGrid.innerHTML = '';
    
    projects.forEach(project => {
        const projectCard = createProjectCard(project);
        projectsGrid.appendChild(projectCard);
    });
}

// Create a project card element
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card fade-in';
    
    card.innerHTML = `
        <div class="project-header">
            <h3 class="project-title">${project.name}</h3>
            <p class="project-description">${project.description}</p>
        </div>
        <div class="project-body">
            <ul class="project-features">
                ${project.features.map(feature => `
                    <li><i class="fas fa-check"></i> ${feature}</li>
                `).join('')}
            </ul>
            <div class="project-footer">
                <div class="project-tech">
                    ${project.technologies.map(tech => `
                        <span class="tech-badge">${tech}</span>
                    `).join('')}
                </div>
                <a href="projects/${project.folder}/index.html" target="_blank" class="project-link">
                    View Project <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
        </div>
    `;
    
    return card;
}

// Load GitHub repository statistics
async function loadGitHubStats() {
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`);
        
        if (response.ok) {
            const data = await response.json();
            
            // Update UI with real GitHub stats
            updateStatWithAnimation('stars-count', data.stargazers_count);
            updateStatWithAnimation('contributors-count', 1); // Will be updated with contributors API
            
            // Load contributor count separately
            loadContributorCount();
        } else {
            // Use fallback values if API fails
            updateStatWithAnimation('stars-count', 0);
            updateStatWithAnimation('contributors-count', 1);
        }
    } catch (error) {
        console.error('Error loading GitHub stats:', error);
        // Use fallback values
        updateStatWithAnimation('stars-count', 0);
        updateStatWithAnimation('contributors-count', 1);
    }
}

// Load contributor count
async function loadContributorCount() {
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contributors`);
        
        if (response.ok) {
            const contributors = await response.json();
            updateStatWithAnimation('contributors-count', contributors.length);
        }
    } catch (error) {
        console.error('Error loading contributor count:', error);
    }
}

// Update a stat with smooth animation
function updateStatWithAnimation(elementId, value) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startValue = 0;
    const endValue = value;
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
        
        element.textContent = currentValue.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

// Update projects count
function updateProjectsCount(count) {
    updateStatWithAnimation('projects-count', count);
}

// Setup smooth scrolling for navigation links
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"], .hero-buttons a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Add fade-in animations on scroll
function addFadeInAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements that should fade in
    const elementsToObserve = document.querySelectorAll('.project-card, .step, .stat-item');
    elementsToObserve.forEach(element => {
        observer.observe(element);
    });
}

// Header scroll effect
function setupHeaderScrollEffect() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = 'var(--shadow-md)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });
}

// Initialize header scroll effect
document.addEventListener('DOMContentLoaded', setupHeaderScrollEffect);

// Utility function to format numbers
function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

// Add loading states for better UX
function showLoading(element) {
    element.innerHTML = '<div class="loading"></div>';
}

function hideLoading(element) {
    element.innerHTML = '';
}

// Error handling for failed API calls
function handleApiError(error, fallbackMessage = 'Unable to load data') {
    console.error('API Error:', error);
    // You could show a user-friendly message here
    return fallbackMessage;
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadProjects,
        loadGitHubStats,
        createProjectCard,
        updateStatWithAnimation
    };
}