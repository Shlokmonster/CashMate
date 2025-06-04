// DOM Elements
const loanAmountInput = document.getElementById('loan-amount');
const loanAmountSlider = document.getElementById('loan-amount-slider');
const interestRateInput = document.getElementById('interest-rate');
const interestRateSlider = document.getElementById('interest-rate-slider');
const loanTenureInput = document.getElementById('loan-tenure');
const loanTenureSlider = document.getElementById('loan-tenure-slider');
const emiAmount = document.getElementById('emi-amount');
const calculateBtn = document.getElementById('calculate-btn');

// Initialize Chart
let emiChart = null;

// Format currency
const formatCurrency = (amount) => {
    return '₹' + amount.toLocaleString('en-IN', {
        maximumFractionDigits: 0,
        style: 'currency',
        currency: 'INR'
    }).replace('₹', '');
};

// Calculate EMI
const calculateEMI = () => {
    const principal = parseFloat(loanAmountInput.value);
    const rate = parseFloat(interestRateInput.value) / 12 / 100; // Monthly interest rate
    const time = parseFloat(loanTenureInput.value) * 12; // Convert years to months
    
    // EMI formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
    const emi = principal * rate * Math.pow(1 + rate, time) / (Math.pow(1 + rate, time) - 1);
    const totalPayment = emi * time;
    const totalInterest = totalPayment - principal;
    
    updateChart(principal, totalInterest);
    emiAmount.textContent = formatCurrency(isNaN(emi) ? 0 : Math.round(emi));
};

// Update Chart
const updateChart = (principal, interest) => {
    const canvas = document.getElementById('emi-chart');
    const ctx = canvas.getContext('2d');
    
    // Get the parent container dimensions
    const container = document.querySelector('.chart-outer');
    const size = Math.min(container.offsetWidth, container.offsetHeight) * 0.9; // 90% of container size
    
    // Set explicit dimensions on the canvas
    canvas.width = size;
    canvas.height = size;
    
    // Destroy previous chart if it exists
    if (emiChart) {
        emiChart.destroy();
    }
    
    emiChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Principal', 'Interest'],
            datasets: [{
                data: [principal, interest],
                backgroundColor: ['#4CAF50', '#2196F3'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 1,
            cutout: '70%',
            layout: {
                padding: 0
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                label += formatCurrency(context.parsed);
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
};

// Event Listeners for Inputs
const syncInputs = () => {
    // Sync loan amount input and slider
    loanAmountInput.addEventListener('input', (e) => {
        loanAmountSlider.value = e.target.value;
    });
    
    loanAmountSlider.addEventListener('input', (e) => {
        loanAmountInput.value = e.target.value;
    });
    
    // Sync interest rate input and slider
    interestRateInput.addEventListener('input', (e) => {
        interestRateSlider.value = e.target.value;
    });
    
    interestRateSlider.addEventListener('input', (e) => {
        interestRateInput.value = e.target.value;
    });
    
    // Sync loan tenure input and slider
    loanTenureInput.addEventListener('input', (e) => {
        loanTenureSlider.value = e.target.value;
    });
    
    loanTenureSlider.addEventListener('input', (e) => {
        loanTenureInput.value = e.target.value;
    });
};

// Initialize input synchronization
syncInputs();

// Calculate button click handler
calculateBtn.addEventListener('click', calculateEMI);

// Initial calculation on page load
calculateEMI();

// Handle window resize
let resizeTimer;
const handleResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (emiChart) {
            const container = document.querySelector('.chart-outer');
            const size = Math.min(container.offsetWidth, container.offsetHeight) * 0.9;
            const canvas = document.getElementById('emi-chart');
            canvas.width = size;
            canvas.height = size;
            emiChart.update('resize');
        }
    }, 250);
};

window.addEventListener('resize', handleResize);

// Format input values
const formatInputs = () => {
    // Format loan amount with commas
    loanAmountInput.addEventListener('blur', function() {
        this.value = parseFloat(this.value).toLocaleString('en-IN');
    });
    
    loanAmountInput.addEventListener('focus', function() {
        this.value = this.value.replace(/,/g, '');
    });
};

formatInputs();

//  how it works page js

        // Wait for DOM to be fully loaded
        document.addEventListener('DOMContentLoaded', function() {
            initializeEventListeners();
            initializeStickyElements();
        });
        
        // FAQ Toggle Functionality
        function toggleFAQ(element) {
            const answer = element.nextElementSibling;
            const icon = element.querySelector('.faq-icon');
            
            if (!answer || !icon) {
                console.error('FAQ elements not found');
                return;
            }
            
            if (answer.classList.contains('active')) {
                // Close the clicked FAQ
                answer.classList.remove('active');
                icon.classList.remove('active');
                element.classList.remove('active');
            } else {
                // Close all other FAQs
                const allAnswers = document.querySelectorAll('.faq-answer');
                const allIcons = document.querySelectorAll('.faq-icon');
                const allQuestions = document.querySelectorAll('.faq-question');
                
                allAnswers.forEach(a => a.classList.remove('active'));
                allIcons.forEach(i => i.classList.remove('active'));
                allQuestions.forEach(q => q.classList.remove('active'));
                
                // Open clicked FAQ
                answer.classList.add('active');
                icon.classList.add('active');
                element.classList.add('active');
                
                // Smooth scroll to FAQ if it's not fully visible
                setTimeout(() => {
                    const rect = element.getBoundingClientRect();
                    if (rect.top < 100) {
                        element.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start',
                            inline: 'nearest' 
                        });
                    }
                }, 300);
            }
        }
        
        // Video Modal Functionality
        function openVideo(videoType) {
            const modal = document.getElementById('modal');
            const title = document.getElementById('modal-title');
            const text = document.getElementById('modal-text');
            const modalContent = modal?.querySelector('.modal-content');
            
            if (!modal || !title || !text) {
                console.error('Modal elements not found');
                return;
            }
            
            // Video content configuration
            const videoContent = {
                'borrower-guide': {
                    title: 'Borrower Guide Video',
                    text: 'This comprehensive video will guide you through the complete loan application process step by step. Learn about eligibility criteria, required documents, and how to increase your approval chances.',
                    videoUrl: '#', // Replace with actual video URL
                    duration: '5:30'
                },
                'lender-guide': {
                    title: 'Lender Guide Video',
                    text: 'Discover how to evaluate borrowers effectively and maximize your investment returns safely. This guide covers risk assessment, portfolio diversification, and earning strategies.',
                    videoUrl: '#', // Replace with actual video URL
                    duration: '7:15'
                },
                'kyc-process': {
                    title: 'KYC Verification Video',
                    text: 'Quick and easy tutorial on completing your KYC verification without any hassle. Learn what documents you need and how to submit them through our secure platform.',
                    videoUrl: '#', // Replace with actual video URL
                    duration: '3:45'
                },
                'community-vouching': {
                    title: 'Community Vouching Video',
                    text: 'Understand how community vouches work and how they can significantly benefit your loan application. Learn about trust networks and social lending.',
                    videoUrl: '#', // Replace with actual video URL
                    duration: '4:20'
                }
            };
            
            const content = videoContent[videoType];
            if (!content) {
                console.error('Unknown video type:', videoType);
                return;
            }
            
            title.textContent = content.title;
            text.innerHTML = `
                <p>${content.text}</p>
                <div class="video-info">
                    <span class="video-duration">Duration: ${content.duration}</span>
                </div>
            `;
            
            // Add video-specific modal actions
            updateModalActions('video', content.videoUrl);
            showModal(modal);
        }
        
        // General Modal Functions
        function openModal(type) {
            const modal = document.getElementById('modal');
            const title = document.getElementById('modal-title');
            const text = document.getElementById('modal-text');
            
            if (!modal || !title || !text) {
                console.error('Modal elements not found');
                return;
            }
            
            const modalContent = {
                'apply-loan': {
                    title: 'Apply for Loan',
                    text: `
                        <p>Ready to get the financial support you need? Download the CashMate mobile app to start your loan application process.</p>
                        <div class="app-download-info">
                            <p><strong>Available on:</strong></p>
                            <ul>
                                <li>📱 Google Play Store (Android)</li>
                                <li>🍎 Apple App Store (iOS)</li>
                            </ul>
                            <p><small>Quick approval • Competitive rates • Secure process</small></p>
                        </div>
                    `,
                    actions: 'loan'
                },
                'start-lending': {
                    title: 'Start Lending',
                    text: `
                        <p>Begin your investment journey and earn attractive returns by lending to verified borrowers.</p>
                        <div class="app-download-info">
                            <p><strong>Available on:</strong></p>
                            <ul>
                                <li>📱 Google Play Store (Android)</li>
                                <li>🍎 Apple App Store (iOS)</li>
                            </ul>
                            <p><small>High returns • Low risk • Diversified portfolio</small></p>
                        </div>
                    `
                }
            };
            
            const content = modalContent[type];
            if (!content) {
                console.error('Unknown modal type:', type);
                return;
            }
            
            title.textContent = content.title;
            text.innerHTML = content.text;
            
            updateModalActions(type);
            showModal(modal);
        }
        
        // Update modal action buttons based on type
        function updateModalActions(type, videoUrl = null) {
            const modal = document.getElementById('modal');
            let actionsHTML = '';
            
            switch(type) {
                case 'video':
                    actionsHTML = `
                        <div class="modal-actions">
                            <button class="modal-btn secondary" onclick="closeModal()">Close</button>
                            <button class="modal-btn primary" onclick="playVideo('${videoUrl}')">Watch Video</button>
                        </div>
                    `;
                    break;
                case 'apply-loan':
                    actionsHTML = `
                        <div class="modal-actions">
                            <button class="modal-btn secondary" onclick="closeModal()">Maybe Later</button>
                            <button class="modal-btn primary" onclick="downloadApp('loan')">Download App</button>
                        </div>
                    `;
                    break;
                case 'start-lending':
                    actionsHTML = `
                        <div class="modal-actions">
                            <button class="modal-btn secondary" onclick="closeModal()">Not Now</button>
                            <button class="modal-btn primary" onclick="downloadApp('lend')">Download App</button>
                        </div>
                    `;
                    break;
                default:
                    actionsHTML = `
                        <div class="modal-actions">
                            <button class="modal-btn primary" onclick="closeModal()">Close</button>
                        </div>
                    `;
            }
            
            // Remove existing actions and add new ones
            const existingActions = modal.querySelector('.modal-actions');
            if (existingActions) {
                existingActions.remove();
            }
            
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.insertAdjacentHTML('beforeend', actionsHTML);
            }
        }
        
        // Show modal with animation
        function showModal(modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            
            // Focus trap for accessibility
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        }
        
        // Close modal function
        function closeModal() {
            const modal = document.getElementById('modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto'; // Restore scrolling
            }
        }
        
        // Play video function
        function playVideo(videoUrl) {
            if (videoUrl && videoUrl !== '#') {
                window.open(videoUrl, '_blank');
            } else {
                alert('Video will be available soon!');
            }
            closeModal();
        }
        
        // Download app function
        function downloadApp(type) {
            const userAgent = navigator.userAgent.toLowerCase();
            let downloadUrl = '';
            
            if (userAgent.includes('android')) {
                downloadUrl = 'https://play.google.com/store/apps/details?id=com.cashmate.app'; // Replace with actual Play Store URL
            } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
                downloadUrl = 'https://apps.apple.com/app/cashmate/id123456789'; // Replace with actual App Store URL
            } else {
                // Desktop users - show both options
                alert('Please download the CashMate app from Google Play Store (Android) or Apple App Store (iOS)');
                return;
            }
            
            if (downloadUrl) {
                window.open(downloadUrl, '_blank');
            }
            
            closeModal();
        }
        
        // Sticky CTA functionality
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        
        // Show/hide scroll to top button based on scroll position
        function toggleScrollButton() {
            const scrollButton = document.querySelector('.scroll-to-top');
            if (scrollButton) {
                if (window.pageYOffset > 300) {
                    scrollButton.style.display = 'flex';
                } else {
                    scrollButton.style.display = 'none';
                }
            }
        }
        
        // Initialize sticky elements
        function initializeStickyElements() {
            // Hide scroll button initially
            const scrollButton = document.querySelector('.scroll-to-top');
            if (scrollButton) {
                scrollButton.style.display = 'none';
            }
            
            // Add scroll listener
            window.addEventListener('scroll', throttle(toggleScrollButton, 100));
        }
        
        // Initialize all event listeners
        function initializeEventListeners() {
            // Modal close on outside click
            window.addEventListener('click', function(event) {
                const modal = document.getElementById('modal');
                if (event.target === modal) {
                    closeModal();
                }
            });
            
            // Keyboard navigation
            document.addEventListener('keydown', function(event) {
                const modal = document.getElementById('modal');
                if (modal && modal.style.display === 'block') {
                    if (event.key === 'Escape') {
                        closeModal();
                    }
                }
            });
            
            // FAQ keyboard navigation
            document.addEventListener('keydown', function(event) {
                if (event.target.classList.contains('faq-question')) {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        toggleFAQ(event.target);
                    }
                }
            });
        }
        
        // Utility function to throttle scroll events
        function throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            }
        }
        
        // Contact form handler (if you have a contact form)
        function handleContactForm(event) {
            event.preventDefault();
            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData);
            
            // Add your form submission logic here
            console.log('Contact form submitted:', data);
            
            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            event.target.reset();
        }
        
        // Newsletter subscription handler
        function handleNewsletterSubscription(email) {
            if (!email || !isValidEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Add your newsletter subscription logic here
            console.log('Newsletter subscription:', email);
            
            alert('Thank you for subscribing to our newsletter!');
        }
        
        // Email validation utility
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        
        // Analytics tracking (optional)
        function trackEvent(eventName, eventData = {}) {
            // Add your analytics tracking code here
            console.log('Event tracked:', eventName, eventData);
            
            // Example for Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', eventName, eventData);
            }
        }
        
        // Enhanced FAQ functionality with search
        function searchFAQs(searchTerm) {
            const faqItems = document.querySelectorAll('.faq-item');
            const searchLower = searchTerm.toLowerCase();
            
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question').textContent.toLowerCase();
                const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
                
                if (question.includes(searchLower) || answer.includes(searchLower)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        }
        
        // Smooth scroll to section
        function scrollToSection(sectionId) {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
        
        // Initialize everything when page loads
        window.addEventListener('load', function() {
            console.log('CashMate website fully loaded and ready!');
            
            // Track page load
            trackEvent('page_view', {
                page_title: document.title,
                page_location: window.location.href
            });
        });