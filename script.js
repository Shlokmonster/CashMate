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