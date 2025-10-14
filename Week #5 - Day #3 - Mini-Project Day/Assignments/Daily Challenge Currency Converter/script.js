// Currency Converter - Daily Challenge
// Using ExchangeRate API with async/await

class CurrencyConverter {
    constructor() {
        // ExchangeRate API Configuration
        this.apiKey = 'f2c413786f8806caf7bdf1f5'; // Updated API key
        this.baseURL = 'https://v6.exchangerate-api.com/v6';
        
        // DOM Elements
        this.fromCurrency = document.getElementById('fromCurrency');
        this.toCurrency = document.getElementById('toCurrency');
        this.amountInput = document.getElementById('amount');
        this.convertBtn = document.getElementById('convertBtn');
        this.switchBtn = document.getElementById('switchBtn');
        this.resultAmount = document.getElementById('resultAmount');
        this.resultText = document.getElementById('resultText');
        this.exchangeRate = document.getElementById('exchangeRate');
        this.errorMessage = document.getElementById('errorMessage');
        this.resultSection = document.getElementById('resultSection');
        this.convertText = document.getElementById('convertText');

        // State
        this.isLoading = false;
        this.supportedCurrencies = {};

        // Initialize the app
        this.init();
    }

    async init() {
        try {
            await this.loadSupportedCurrencies();
            this.setupEventListeners();
            this.setDefaultCurrencies();
        } catch (error) {
            this.showError('Failed to initialize currency converter. Please refresh the page.');
            console.error('Initialization error:', error);
        }
    }

    async loadSupportedCurrencies() {
        try {
            this.showLoading(true);
            
            // Fetch USD rates to get available currencies
            const response = await fetch(`${this.baseURL}/${this.apiKey}/latest/USD`);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.result !== 'success') {
                throw new Error(data['error-type'] || 'Failed to fetch currency data');
            }

            // Store supported currencies from conversion rates
            this.supportedCurrencies = {};
            
            // Add USD as base currency
            this.supportedCurrencies['USD'] = 'United States Dollar';
            
            // Add all currencies from conversion rates
            Object.keys(data.conversion_rates).forEach(code => {
                this.supportedCurrencies[code] = this.getCurrencyName(code);
            });

            // Populate dropdown menus
            this.populateCurrencyDropdowns();
            
        } catch (error) {
            console.error('Error loading currencies:', error);
            throw new Error('Unable to load currency data. Please check your internet connection.');
        } finally {
            this.showLoading(false);
        }
    }

    populateCurrencyDropdowns() {
        // Clear existing options
        this.fromCurrency.innerHTML = '';
        this.toCurrency.innerHTML = '';

        // Add default option
        const defaultOption1 = new Option('Select currency', '', false, false);
        const defaultOption2 = new Option('Select currency', '', false, false);
        this.fromCurrency.add(defaultOption1);
        this.toCurrency.add(defaultOption2);

        // Add currency options
        Object.entries(this.supportedCurrencies)
            .sort(([a], [b]) => a.localeCompare(b))
            .forEach(([code, name]) => {
                const option1 = new Option(`${code} - ${name}`, code);
                const option2 = new Option(`${code} - ${name}`, code);
                this.fromCurrency.add(option1);
                this.toCurrency.add(option2);
            });
    }

    setDefaultCurrencies() {
        // Set default currencies (USD to EUR)
        this.fromCurrency.value = 'USD';
        this.toCurrency.value = 'EUR';
    }

    setupEventListeners() {
        // Convert button click
        this.convertBtn.addEventListener('click', () => {
            this.convertCurrency();
        });

        // Switch currencies button
        this.switchBtn.addEventListener('click', () => {
            this.switchCurrencies();
        });

        // Auto-convert on currency change
        this.fromCurrency.addEventListener('change', () => {
            if (this.amountInput.value && this.toCurrency.value) {
                this.convertCurrency();
            }
        });

        this.toCurrency.addEventListener('change', () => {
            if (this.amountInput.value && this.fromCurrency.value) {
                this.convertCurrency();
            }
        });

        // Auto-convert on amount change (with debounce)
        let timeoutId;
        this.amountInput.addEventListener('input', () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                if (this.amountInput.value && this.fromCurrency.value && this.toCurrency.value) {
                    this.convertCurrency();
                }
            }, 500);
        });

        // Enter key to convert
        this.amountInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.convertCurrency();
            }
        });
    }

    async convertCurrency() {
        try {
            // Validation
            const amount = parseFloat(this.amountInput.value);
            const fromCode = this.fromCurrency.value;
            const toCode = this.toCurrency.value;

            if (!amount || amount <= 0) {
                this.showError('Please enter a valid amount greater than 0');
                return;
            }

            if (!fromCode || !toCode) {
                this.showError('Please select both currencies');
                return;
            }

            if (fromCode === toCode) {
                this.displayResult(amount, fromCode, toCode, 1);
                return;
            }

            this.hideError();
            this.showLoading(true);

            // Fetch conversion rates for the base currency
            const response = await fetch(`${this.baseURL}/${this.apiKey}/latest/${fromCode}`);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();

            if (data.result !== 'success') {
                throw new Error(data['error-type'] || 'Conversion failed');
            }

            // Calculate conversion
            const conversionRate = data.conversion_rates[toCode];
            if (!conversionRate) {
                throw new Error(`Conversion rate for ${toCode} not found`);
            }

            const convertedAmount = amount * conversionRate;

            // Display result
            this.displayResult(convertedAmount, fromCode, toCode, conversionRate);
            
            // Add success animation
            this.resultSection.classList.add('success-animation');
            setTimeout(() => {
                this.resultSection.classList.remove('success-animation');
            }, 600);

        } catch (error) {
            console.error('Conversion error:', error);
            this.showError('Failed to convert currency. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    displayResult(convertedAmount, fromCode, toCode, rate) {
        // Format the converted amount
        const formattedAmount = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: toCode,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(convertedAmount);

        // Display main result
        this.resultAmount.textContent = formattedAmount;
        
        // Display conversion text
        const inputAmount = parseFloat(this.amountInput.value);
        const fromCurrencyName = this.supportedCurrencies[fromCode];
        const toCurrencyName = this.supportedCurrencies[toCode];
        
        this.resultText.textContent = `${inputAmount} ${fromCode} equals`;
        
        // Display exchange rate
        this.exchangeRate.textContent = `1 ${fromCode} = ${rate.toFixed(4)} ${toCode}`;
    }

    switchCurrencies() {
        // Swap the currency selections
        const fromValue = this.fromCurrency.value;
        const toValue = this.toCurrency.value;

        if (fromValue && toValue) {
            this.fromCurrency.value = toValue;
            this.toCurrency.value = fromValue;

            // Auto-convert if amount is entered
            if (this.amountInput.value) {
                this.convertCurrency();
            }
        }
    }

    showLoading(show) {
        this.isLoading = show;
        
        if (show) {
            this.convertBtn.disabled = true;
            this.convertText.innerHTML = '<div class="loading-spinner"></div>Converting...';
        } else {
            this.convertBtn.disabled = false;
            this.convertText.textContent = 'Convert';
        }
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.remove('hidden');
        
        // Auto-hide error after 5 seconds
        setTimeout(() => {
            this.hideError();
        }, 5000);
    }

    hideError() {
        this.errorMessage.classList.add('hidden');
    }

    getCurrencyName(code) {
        const currencyNames = {
            'AED': 'United Arab Emirates Dirham',
            'AFN': 'Afghan Afghani',
            'ALL': 'Albanian Lek',
            'AMD': 'Armenian Dram',
            'ANG': 'Netherlands Antillean Guilder',
            'AOA': 'Angolan Kwanza',
            'ARS': 'Argentine Peso',
            'AUD': 'Australian Dollar',
            'AWG': 'Aruban Florin',
            'AZN': 'Azerbaijani Manat',
            'BAM': 'Bosnia-Herzegovina Convertible Mark',
            'BBD': 'Barbadian Dollar',
            'BDT': 'Bangladeshi Taka',
            'BGN': 'Bulgarian Lev',
            'BHD': 'Bahraini Dinar',
            'BIF': 'Burundian Franc',
            'BMD': 'Bermudan Dollar',
            'BND': 'Brunei Dollar',
            'BOB': 'Bolivian Boliviano',
            'BRL': 'Brazilian Real',
            'BSD': 'Bahamian Dollar',
            'BTN': 'Bhutanese Ngultrum',
            'BWP': 'Botswanan Pula',
            'BYN': 'Belarusian Ruble',
            'BZD': 'Belize Dollar',
            'CAD': 'Canadian Dollar',
            'CDF': 'Congolese Franc',
            'CHF': 'Swiss Franc',
            'CLP': 'Chilean Peso',
            'CNY': 'Chinese Yuan',
            'COP': 'Colombian Peso',
            'CRC': 'Costa Rican Colón',
            'CUP': 'Cuban Peso',
            'CVE': 'Cape Verdean Escudo',
            'CZK': 'Czech Republic Koruna',
            'DJF': 'Djiboutian Franc',
            'DKK': 'Danish Krone',
            'DOP': 'Dominican Peso',
            'DZD': 'Algerian Dinar',
            'EGP': 'Egyptian Pound',
            'ERN': 'Eritrean Nakfa',
            'ETB': 'Ethiopian Birr',
            'EUR': 'Euro',
            'FJD': 'Fijian Dollar',
            'FKP': 'Falkland Islands Pound',
            'FOK': 'Faroese Króna',
            'GBP': 'British Pound Sterling',
            'GEL': 'Georgian Lari',
            'GGP': 'Guernsey Pound',
            'GHS': 'Ghanaian Cedi',
            'GIP': 'Gibraltar Pound',
            'GMD': 'Gambian Dalasi',
            'GNF': 'Guinean Franc',
            'GTQ': 'Guatemalan Quetzal',
            'GYD': 'Guyanaese Dollar',
            'HKD': 'Hong Kong Dollar',
            'HNL': 'Honduran Lempira',
            'HRK': 'Croatian Kuna',
            'HTG': 'Haitian Gourde',
            'HUF': 'Hungarian Forint',
            'IDR': 'Indonesian Rupiah',
            'ILS': 'Israeli New Sheqel',
            'IMP': 'Manx pound',
            'INR': 'Indian Rupee',
            'IQD': 'Iraqi Dinar',
            'IRR': 'Iranian Rial',
            'ISK': 'Icelandic Króna',
            'JEP': 'Jersey Pound',
            'JMD': 'Jamaican Dollar',
            'JOD': 'Jordanian Dinar',
            'JPY': 'Japanese Yen',
            'KES': 'Kenyan Shilling',
            'KGS': 'Kyrgystani Som',
            'KHR': 'Cambodian Riel',
            'KMF': 'Comorian Franc',
            'KPW': 'North Korean Won',
            'KRW': 'South Korean Won',
            'KWD': 'Kuwaiti Dinar',
            'KYD': 'Cayman Islands Dollar',
            'KZT': 'Kazakhstani Tenge',
            'LAK': 'Laotian Kip',
            'LBP': 'Lebanese Pound',
            'LKR': 'Sri Lankan Rupee',
            'LRD': 'Liberian Dollar',
            'LSL': 'Lesotho Loti',
            'LYD': 'Libyan Dinar',
            'MAD': 'Moroccan Dirham',
            'MDL': 'Moldovan Leu',
            'MGA': 'Malagasy Ariary',
            'MKD': 'Macedonian Denar',
            'MMK': 'Myanma Kyat',
            'MNT': 'Mongolian Tugrik',
            'MOP': 'Macanese Pataca',
            'MRU': 'Mauritanian Ouguiya',
            'MUR': 'Mauritian Rupee',
            'MVR': 'Maldivian Rufiyaa',
            'MWK': 'Malawian Kwacha',
            'MXN': 'Mexican Peso',
            'MYR': 'Malaysian Ringgit',
            'MZN': 'Mozambican Metical',
            'NAD': 'Namibian Dollar',
            'NGN': 'Nigerian Naira',
            'NIO': 'Nicaraguan Córdoba',
            'NOK': 'Norwegian Krone',
            'NPR': 'Nepalese Rupee',
            'NZD': 'New Zealand Dollar',
            'OMR': 'Omani Rial',
            'PAB': 'Panamanian Balboa',
            'PEN': 'Peruvian Nuevo Sol',
            'PGK': 'Papua New Guinean Kina',
            'PHP': 'Philippine Peso',
            'PKR': 'Pakistani Rupee',
            'PLN': 'Polish Zloty',
            'PYG': 'Paraguayan Guarani',
            'QAR': 'Qatari Rial',
            'RON': 'Romanian Leu',
            'RSD': 'Serbian Dinar',
            'RUB': 'Russian Ruble',
            'RWF': 'Rwandan Franc',
            'SAR': 'Saudi Riyal',
            'SBD': 'Solomon Islands Dollar',
            'SCR': 'Seychellois Rupee',
            'SDG': 'Sudanese Pound',
            'SEK': 'Swedish Krona',
            'SGD': 'Singapore Dollar',
            'SHP': 'Saint Helena Pound',
            'SLE': 'Sierra Leonean Leone',
            'SLL': 'Sierra Leonean Leone (Old)',
            'SOS': 'Somali Shilling',
            'SRD': 'Surinamese Dollar',
            'SSP': 'South Sudanese Pound',
            'STN': 'São Tomé and Príncipe Dobra',
            'SYP': 'Syrian Pound',
            'SZL': 'Swazi Lilangeni',
            'THB': 'Thai Baht',
            'TJS': 'Tajikistani Somoni',
            'TMT': 'Turkmenistani Manat',
            'TND': 'Tunisian Dinar',
            'TOP': 'Tongan Paʻanga',
            'TRY': 'Turkish Lira',
            'TTD': 'Trinidad and Tobago Dollar',
            'TVD': 'Tuvaluan Dollar',
            'TWD': 'New Taiwan Dollar',
            'TZS': 'Tanzanian Shilling',
            'UAH': 'Ukrainian Hryvnia',
            'UGX': 'Ugandan Shilling',
            'USD': 'United States Dollar',
            'UYU': 'Uruguayan Peso',
            'UZS': 'Uzbekistan Som',
            'VED': 'Venezuelan Bolívar Soberano',
            'VES': 'Venezuelan Bolívar',
            'VND': 'Vietnamese Dong',
            'VUV': 'Vanuatu Vatu',
            'WST': 'Samoan Tala',
            'XAF': 'CFA Franc BEAC',
            'XCD': 'East Caribbean Dollar',
            'XDR': 'Special Drawing Rights',
            'XOF': 'CFA Franc BCEAO',
            'XPF': 'CFP Franc',
            'YER': 'Yemeni Rial',
            'ZAR': 'South African Rand',
            'ZMW': 'Zambian Kwacha',
            'ZWL': 'Zimbabwean Dollar'
        };
        
        return currencyNames[code] || code;
    }
}

// Popular currency codes with flags (for potential future enhancement)
const POPULAR_CURRENCIES = {
    'USD': { name: 'US Dollar', flag: '🇺🇸' },
    'EUR': { name: 'Euro', flag: '🇪🇺' },
    'GBP': { name: 'British Pound', flag: '🇬🇧' },
    'JPY': { name: 'Japanese Yen', flag: '🇯🇵' },
    'CHF': { name: 'Swiss Franc', flag: '🇨🇭' },
    'CAD': { name: 'Canadian Dollar', flag: '🇨🇦' },
    'AUD': { name: 'Australian Dollar', flag: '🇦🇺' },
    'CNY': { name: 'Chinese Yuan', flag: '🇨🇳' },
    'INR': { name: 'Indian Rupee', flag: '🇮🇳' },
    'KRW': { name: 'South Korean Won', flag: '🇰🇷' },
    'SGD': { name: 'Singapore Dollar', flag: '🇸🇬' },
    'HKD': { name: 'Hong Kong Dollar', flag: '🇭🇰' },
    'NZD': { name: 'New Zealand Dollar', flag: '🇳🇿' },
    'SEK': { name: 'Swedish Krona', flag: '🇸🇪' },
    'NOK': { name: 'Norwegian Krone', flag: '🇳🇴' },
    'MXN': { name: 'Mexican Peso', flag: '🇲🇽' },
    'BRL': { name: 'Brazilian Real', flag: '🇧🇷' },
    'RUB': { name: 'Russian Ruble', flag: '🇷🇺' },
    'ZAR': { name: 'South African Rand', flag: '🇿🇦' },
    'TRY': { name: 'Turkish Lira', flag: '🇹🇷' }
};

// Utility functions
const formatCurrency = (amount, currencyCode) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 6
    }).format(amount);
};

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CurrencyConverter();
});

// Handle connection issues
window.addEventListener('online', () => {
    console.log('Connection restored');
});

window.addEventListener('offline', () => {
    console.log('Connection lost');
});