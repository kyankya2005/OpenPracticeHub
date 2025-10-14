// Random Quote Generator - OpenPracticeHub
// This is a simple, beginner-friendly JavaScript project that anyone can contribute to!

class QuoteGenerator {
    constructor() {
        this.quotes = [];
        this.currentQuote = null;
        this.quotesShown = 0;
        
        // Get DOM elements
        this.quoteText = document.getElementById('quoteText');
        this.quoteAuthor = document.getElementById('quoteAuthor');
        this.quoteCategory = document.getElementById('quoteCategory');
        this.newQuoteBtn = document.getElementById('newQuoteBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.shareBtn = document.getElementById('shareBtn');
        this.quotesShownElement = document.getElementById('quotesShown');
        this.totalQuotesElement = document.getElementById('totalQuotes');
        this.quoteContainer = document.getElementById('quoteContainer');
        
        // Initialize the app
        this.init();
    }
    
    async init() {
        try {
            await this.loadQuotes();
            this.setupEventListeners();
            this.showRandomQuote();
            this.updateStats();
        } catch (error) {
            console.error('Error initializing quote generator:', error);
            this.showError('Failed to load quotes. Please refresh the page.');
        }
    }
    
    async loadQuotes() {
        try {
            const response = await fetch('quotes.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.quotes = data.quotes || [];
        } catch (error) {
            console.error('Error loading quotes:', error);
            // Fallback quotes if JSON fails to load
            this.quotes = this.getFallbackQuotes();
        }
    }
    
    getFallbackQuotes() {
        return [
            {
                text: "The only way to learn programming is by programming.",
                author: "Dennis Ritchie",
                category: "learning"
            },
            {
                text: "First, solve the problem. Then, write the code.",
                author: "John Johnson",
                category: "problem-solving"
            },
            {
                text: "Experience is the name everyone gives to their mistakes.",
                author: "Oscar Wilde",
                category: "experience"
            },
            {
                text: "The best time to plant a tree was 20 years ago. The second best time is now.",
                author: "Chinese Proverb",
                category: "motivation"
            },
            {
                text: "Code is like humor. When you have to explain it, it's bad.",
                author: "Cory House",
                category: "humor"
            }
        ];
    }
    
    setupEventListeners() {
        this.newQuoteBtn.addEventListener('click', () => this.showRandomQuote());
        this.copyBtn.addEventListener('click', () => this.copyQuote());
        this.shareBtn.addEventListener('click', () => this.shareQuote());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.showRandomQuote();
            }
        });
    }
    
    showRandomQuote() {
        if (this.quotes.length === 0) {
            this.showError('No quotes available!');
            return;
        }
        
        // Add loading animation
        this.quoteContainer.classList.add('loading');
        
        // Simulate loading delay for better UX
        setTimeout(() => {
            let randomQuote;
            
            // Make sure we don't show the same quote twice in a row
            do {
                const randomIndex = Math.floor(Math.random() * this.quotes.length);
                randomQuote = this.quotes[randomIndex];
            } while (this.currentQuote && randomQuote.text === this.currentQuote.text && this.quotes.length > 1);
            
            this.currentQuote = randomQuote;
            this.displayQuote(randomQuote);
            this.quotesShown++;
            this.updateStats();
            
            // Remove loading animation
            this.quoteContainer.classList.remove('loading');
        }, 300);
    }
    
    displayQuote(quote) {
        this.quoteText.textContent = quote.text;
        this.quoteAuthor.textContent = quote.author;
        
        // Update category badge
        const categoryBadge = this.quoteCategory.querySelector('.category-badge');
        categoryBadge.textContent = quote.category || 'inspiration';
        categoryBadge.className = `category-badge category-${quote.category || 'general'}`;
        
        // Add animation class
        this.quoteContainer.classList.add('fade-in');
        setTimeout(() => {
            this.quoteContainer.classList.remove('fade-in');
        }, 500);
    }
    
    async copyQuote() {
        if (!this.currentQuote) return;
        
        const quoteText = `"${this.currentQuote.text}" — ${this.currentQuote.author}`;
        
        try {
            await navigator.clipboard.writeText(quoteText);
            this.showToast('Quote copied to clipboard! 📋');
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = quoteText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast('Quote copied to clipboard! 📋');
        }
    }
    
    shareQuote() {
        if (!this.currentQuote) return;
        
        const quoteText = `"${this.currentQuote.text}" — ${this.currentQuote.author}`;
        const shareUrl = window.location.href;
        
        if (navigator.share) {
            // Use Web Share API if available
            navigator.share({
                title: 'Random Quote Generator',
                text: quoteText,
                url: shareUrl
            }).then(() => {
                this.showToast('Quote shared successfully! 🎉');
            }).catch(() => {
                this.showToast('Sharing cancelled');
            });
        } else {
            // Fallback: Copy to clipboard with URL
            const shareText = `${quoteText}\n\nCheck out more quotes at: ${shareUrl}`;
            navigator.clipboard.writeText(shareText).then(() => {
                this.showToast('Quote and link copied to clipboard! 📋');
            });
        }
    }
    
    updateStats() {
        this.quotesShownElement.textContent = this.quotesShown;
        this.totalQuotesElement.textContent = this.quotes.length;
    }
    
    showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    showError(message) {
        this.quoteText.textContent = message;
        this.quoteAuthor.textContent = '';
        this.quoteCategory.innerHTML = '<span class="category-badge">Error</span>';
    }
    
    // Method to add new quotes (useful for contributors!)
    addQuote(text, author, category = 'general') {
        const newQuote = {
            text: text.trim(),
            author: author.trim(),
            category: category.toLowerCase().trim()
        };
        
        // Validate quote
        if (!newQuote.text || !newQuote.author) {
            console.error('Quote must have both text and author');
            return false;
        }
        
        // Check for duplicates
        const isDuplicate = this.quotes.some(quote => 
            quote.text.toLowerCase() === newQuote.text.toLowerCase() &&
            quote.author.toLowerCase() === newQuote.author.toLowerCase()
        );
        
        if (isDuplicate) {
            console.warn('This quote already exists!');
            return false;
        }
        
        this.quotes.push(newQuote);
        this.updateStats();
        this.showToast('New quote added successfully! 🎉');
        return true;
    }
    
    // Method to get quotes by category
    getQuotesByCategory(category) {
        return this.quotes.filter(quote => 
            quote.category.toLowerCase() === category.toLowerCase()
        );
    }
    
    // Method to search quotes
    searchQuotes(searchTerm) {
        const term = searchTerm.toLowerCase();
        return this.quotes.filter(quote => 
            quote.text.toLowerCase().includes(term) ||
            quote.author.toLowerCase().includes(term) ||
            quote.category.toLowerCase().includes(term)
        );
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.quoteGenerator = new QuoteGenerator();
});

// Expose some functions globally for easy testing and contribution
window.QuoteApp = {
    addQuote: (text, author, category) => {
        if (window.quoteGenerator) {
            return window.quoteGenerator.addQuote(text, author, category);
        }
        console.error('Quote generator not initialized yet');
        return false;
    },
    
    getStats: () => {
        if (window.quoteGenerator) {
            return {
                totalQuotes: window.quoteGenerator.quotes.length,
                quotesShown: window.quoteGenerator.quotesShown,
                categories: [...new Set(window.quoteGenerator.quotes.map(q => q.category))]
            };
        }
        return null;
    },
    
    search: (term) => {
        if (window.quoteGenerator) {
            return window.quoteGenerator.searchQuotes(term);
        }
        return [];
    }
};