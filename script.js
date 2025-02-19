// المتغيرات العامة للتطبيق
let textSizeLevel = 0; // 0: عادي، 1: كبير، 2: أكبر
let imageSizeLevel = 0; // 0: عادي، 1: كبير، 2: أكبر
let isVisuallyImpairedMode = false; // وضع ضعاف البصر
let isReadingMode = false; // وضع القراءة

// متغيرات النطق
let currentUtterance = null;
const synth = window.speechSynthesis;

// المتغيرات الأخرى
let cart = {
    items: [],
    total: 0
};

// أسعار العملات
const exchangeRates = {
    'JOD': 1,      // دينار أردني
    'USD': 1.41,   // دولار أمريكي
    'EUR': 1.52,   // يورو
    'SAR': 0.38    // ريال سعودي
};

// التحقق من دعم النطق وتحميل الأصوات
if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = function() {
        const voices = window.speechSynthesis.getVoices();
        console.log('تم تحميل الأصوات:', voices.length);
    };
} else {
    console.warn('متصفحك لا يدعم خاصية تحويل النص إلى كلام');
}

// دالة نطق النص
function speakText(text) {
    if (!text || typeof text !== 'string') {
        console.error('النص غير صالح للقراءة');
        return;
    }

    // إيقاف النطق الحالي إذا كان موجوداً
    stopSpeaking();

    try {
        // إنشاء كائن نطق جديد
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar'; // تعيين اللغة العربية
        utterance.rate = 1.0; // سرعة النطق
        utterance.pitch = 1.0; // درجة الصوت
        utterance.volume = 1.0; // مستوى الصوت

        // إضافة معالج انتهاء النطق
        utterance.onend = function() {
            currentUtterance = null;
        };

        // إضافة معالج الأخطاء
        utterance.onerror = function(event) {
            console.error('خطأ في النطق:', event.error);
            currentUtterance = null;
        };

        // تعيين النطق الحالي وبدء النطق
        currentUtterance = utterance;
        synth.speak(utterance);
    } catch (error) {
        console.error('حدث خطأ أثناء تهيئة النطق:', error);
        currentUtterance = null;
    }
}

// دالة إيقاف النطق
function stopSpeaking() {
    if (synth.speaking) {
        synth.cancel();
    }
    currentUtterance = null;
}

// دالة نطق النص
function speakText(text) {
    if (!text || typeof text !== 'string') {
        console.error('النص غير صالح للقراءة');
        return;
    }

    // إيقاف النطق الحالي إذا كان موجوداً
    stopSpeaking();

    try {
        // إنشاء كائن نطق جديد
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar'; // تعيين اللغة العربية
        utterance.rate = 1.0; // سرعة النطق
        utterance.pitch = 1.0; // درجة الصوت
        utterance.volume = 1.0; // مستوى الصوت

        // إضافة معالج انتهاء النطق
        utterance.onend = function() {
            currentUtterance = null;
        };

        // إضافة معالج الأخطاء
        utterance.onerror = function(event) {
            console.error('خطأ في النطق:', event.error);
            currentUtterance = null;
        };

        // تعيين النطق الحالي وبدء النطق
        currentUtterance = utterance;
        synth.speak(utterance);
    } catch (error) {
        console.error('حدث خطأ أثناء تهيئة النطق:', error);
        currentUtterance = null;
    }
}

// دالة إيقاف النطق
function stopSpeaking() {
    if (synth.speaking) {
        synth.cancel();
    }
    currentUtterance = null;
}

// تهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من دعم النطق وتحميل الأصوات
    if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = function() {
            const voices = window.speechSynthesis.getVoices();
            console.log('تم تحميل الأصوات:', voices.length);
        };
    } else {
        console.warn('متصفحك لا يدعم خاصية تحويل النص إلى كلام');
    }

    // إضافة شريط الأدوات
    addAccessibilityToolbar();
    
    // تهيئة أحداث التكبير للصور
    initializeImageZoom();
    
    // تهيئة أحداث النص والقراءة
    initializeTextFeatures();

    // تهيئة النصوص القابلة للقراءة
    initializeReadableText();
});

// تهيئة النصوص القابلة للقراءة
function initializeReadableText() {
    document.querySelectorAll('[data-readable]').forEach(element => {
        element.style.cursor = 'pointer';
        element.title = 'انقر للاستماع إلى النص';
        element.addEventListener('click', function() {
            const text = this.textContent.trim();
            if (text) {
                speakText(text);
            }
        });
    });
}

// تهيئة ميزات النص والقراءة
function initializeTextFeatures() {
    // إضافة مؤشر للعناصر القابلة للقراءة
    const readableElements = document.querySelectorAll('[data-readable]');
    readableElements.forEach(element => {
        element.title = 'انقر للاستماع في وضع القراءة';
    });
}

// تهيئة تكبير الصور
function initializeImageZoom() {
    const images = document.querySelectorAll('img:not(.navbar-brand img)');
    images.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            this.classList.toggle('zoomed');
        });
    });
}

// دالة تكبير/تصغير النص
function toggleTextSize() {
    textSizeLevel = (textSizeLevel + 1) % 3;
    const elements = document.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, button, a, span, label, input, textarea');
    
    elements.forEach(element => {
        let baseSize;
        // تحديد الحجم الأساسي حسب نوع العنصر
        switch(element.tagName.toLowerCase()) {
            case 'h1': baseSize = 2.5; break;
            case 'h2': baseSize = 2; break;
            case 'h3': baseSize = 1.75; break;
            case 'h4': baseSize = 1.5; break;
            case 'h5': baseSize = 1.25; break;
            case 'h6': baseSize = 1; break;
            default: baseSize = 1;
        }
        
        // تطبيق مستوى التكبير
        switch(textSizeLevel) {
            case 0: // عادي
                element.style.fontSize = `${baseSize}em`;
                break;
            case 1: // كبير
                element.style.fontSize = `${baseSize * 1.5}em`;
                break;
            case 2: // أكبر
                element.style.fontSize = `${baseSize * 2}em`;
                break;
        }
    });
    
    // تحديث مؤشر الحجم
    const indicator = document.getElementById('text-size-indicator');
    if (indicator) {
        indicator.textContent = ['عادي', 'كبير', 'أكبر'][textSizeLevel];
    }
}

// دالة تكبير/تصغير الصور
function toggleImageSize() {
    imageSizeLevel = (imageSizeLevel + 1) % 3;
    const images = document.querySelectorAll('img:not(.logo)'); // استثناء الشعار
    
    images.forEach(image => {
        switch(imageSizeLevel) {
            case 0: // عادي
                image.style.transform = 'scale(1)';
                break;
            case 1: // كبير
                image.style.transform = 'scale(1.5)';
                break;
            case 2: // أكبر
                image.style.transform = 'scale(2)';
                break;
        }
    });
    
    // تحديث مؤشر الحجم
    const indicator = document.getElementById('image-size-indicator');
    if (indicator) {
        indicator.textContent = ['عادي', 'كبير', 'أكبر'][imageSizeLevel];
    }
}

// دالة تبديل وضع ضعاف البصر
function toggleVisuallyImpairedMode() {
    isVisuallyImpairedMode = !isVisuallyImpairedMode;
    document.body.classList.toggle('visually-impaired-mode');
    
    // تحديث نص الزر
    const indicator = document.getElementById('visually-impaired-indicator');
    if (indicator) {
        indicator.textContent = isVisuallyImpairedMode ? 'مفعل' : 'معطل';
    }
    
    // تحديث حالة الزر
    const button = document.querySelector('.visually-impaired-button');
    if (button) {
        button.setAttribute('aria-pressed', isVisuallyImpairedMode);
        button.classList.toggle('active', isVisuallyImpairedMode);
    }

    // تطبيق التغييرات
    if (isVisuallyImpairedMode) {
        applyVisuallyImpairedMode();
    } else {
        removeVisuallyImpairedMode();
    }
}

// تطبيق وضع ضعاف البصر
function applyVisuallyImpairedMode() {
    // تكبير النص تلقائياً
    const elements = document.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, button, a, span, label, input, textarea');
    elements.forEach(element => {
        const currentSize = window.getComputedStyle(element).fontSize;
        const newSize = parseFloat(currentSize) * 1.2;
        element.style.fontSize = `${newSize}px`;
    });
    
    // تحسين التباين
    document.querySelectorAll('*').forEach(element => {
        const style = window.getComputedStyle(element);
        if (style.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
            style.backgroundColor !== 'transparent') {
            element.style.backgroundColor = '#FFFFFF';
            element.style.color = '#000000';
        }
    });
    
    // تحسين تفاعلات العناصر
    document.querySelectorAll('a, button').forEach(element => {
        element.style.transition = 'all 0.3s ease';
        element.addEventListener('mouseover', addHoverEffect);
        element.addEventListener('mouseout', removeHoverEffect);
    });
}

// إزالة وضع ضعاف البصر
function removeVisuallyImpairedMode() {
    document.querySelectorAll('*').forEach(element => {
        element.style.removeProperty('font-size');
        element.style.removeProperty('background-color');
        element.style.removeProperty('color');
        element.style.removeProperty('transform');
        element.style.removeProperty('box-shadow');
    });
    
    // إزالة مستمعي الأحداث
    document.querySelectorAll('a, button').forEach(element => {
        element.removeEventListener('mouseover', addHoverEffect);
        element.removeEventListener('mouseout', removeHoverEffect);
    });
}

// تأثيرات التحويم
function addHoverEffect() {
    this.style.transform = 'scale(1.1)';
    this.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
}

function removeHoverEffect() {
    this.style.transform = 'scale(1)';
    this.style.boxShadow = 'none';
}

// إضافة شريط الأدوات
function addAccessibilityToolbar() {
    // التحقق من عدم وجود شريط الأدوات مسبقاً
    if (document.querySelector('.accessibility-toolbar')) {
        return;
    }

    const toolbar = document.createElement('div');
    toolbar.className = 'accessibility-toolbar';
    toolbar.innerHTML = `
        <div class="container-fluid">
            <div class="accessibility-controls">
                <div class="control-group">
                    <span class="control-label">حجم النص:</span>
                    <button onclick="toggleTextSize()" class="btn btn-primary">
                        <i class="fas fa-text-height"></i>
                        <span id="text-size-indicator">عادي</span>
                    </button>
                </div>
                <div class="control-group">
                    <span class="control-label">حجم الصور:</span>
                    <button onclick="toggleImageSize()" class="btn btn-primary">
                        <i class="fas fa-image"></i>
                        <span id="image-size-indicator">عادي</span>
                    </button>
                </div>
                <div class="control-group">
                    <span class="control-label">وضع ضعاف البصر:</span>
                    <button onclick="toggleVisuallyImpairedMode()" 
                            class="btn btn-warning visually-impaired-button"
                            aria-pressed="false">
                        <i class="fas fa-eye"></i>
                        <span id="visually-impaired-indicator">معطل</span>
                    </button>
                </div>
            </div>
        </div>
    `;

    // إضافة شريط الأدوات في أعلى الصفحة
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.parentNode.insertBefore(toolbar, navbar.nextSibling);
    }
}

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add animation class to elements when they come into view
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.card, .package-card');
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight;
        
        if(elementPosition < screenPosition) {
            element.classList.add('fade-in');
        }
    });
}

// Listen for scroll events
window.addEventListener('scroll', animateOnScroll);

// Form submission handling
const contactForm = document.querySelector('#contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const formDetails = {};
        formData.forEach((value, key) => formDetails[key] = value);
        
        // Here you would typically send this data to your server
        // For now, we'll just show a success message
        alert('شكراً لتواصلك معنا. سنقوم بالرد عليك في أقرب وقت ممكن.');
        this.reset();
    });
}

// Package button click handlers
document.querySelectorAll('.package-card button').forEach(button => {
    button.addEventListener('click', function() {
        const packageType = this.closest('.package-card').querySelector('h3').textContent;
        document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
        document.querySelector('select').value = packageType.toLowerCase();
    });
});

// Update date and time
function updateDateTime() {
    const now = new Date();
    const timeElement = document.getElementById('current-time');
    const dateElement = document.getElementById('current-date');
    
    // Time format
    const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    
    // Date format
    const dateOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    timeElement.innerHTML = `<i class="far fa-clock"></i> ${now.toLocaleTimeString('ar-SA', timeOptions)}`;
    dateElement.innerHTML = `<i class="far fa-calendar-alt"></i> ${now.toLocaleDateString('ar-SA', dateOptions)}`;
}

// Update every second
setInterval(updateDateTime, 1000);
updateDateTime(); // Initial call

// Visit counter
function updateVisitCount() {
    let visits = localStorage.getItem('visitCount') || 0;
    visits = parseInt(visits) + 1;
    localStorage.setItem('visitCount', visits);
    document.getElementById('visit-count').textContent = visits;
}

// Survey handling
document.getElementById('submitSurvey')?.addEventListener('click', function() {
    const form = document.getElementById('surveyForm');
    const formData = new FormData(form);
    const surveyData = {};
    
    formData.forEach((value, key) => {
        if (key === 'satisfaction') {
            surveyData[key] = parseInt(value);
        } else {
            surveyData[key] = value;
        }
    });
    
    // Here you would typically send this data to your server
    console.log('Survey submitted:', surveyData);
    
    // Show thank you message
    const modal = document.querySelector('#surveyModal');
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    
    alert('شكراً لمشاركتنا رأيك!');
    form.reset();
});

// وضع القراءة
let isReadingMode = false;

function toggleReadingMode() {
    isReadingMode = !isReadingMode;
    const readableElements = document.querySelectorAll('[data-readable]');
    
    if (!isReadingMode) {
        // إيقاف القراءة الحالية
        if (currentUtterance) {
            speechSynthesis.cancel();
        }
        // إزالة التأثير البصري
        readableElements.forEach(element => {
            element.style.backgroundColor = '';
            element.style.cursor = '';
        });
    } else {
        // إضافة تأثير بصري للعناصر القابلة للقراءة
        readableElements.forEach(element => {
            element.style.backgroundColor = 'rgba(0, 123, 255, 0.1)';
            element.style.cursor = 'pointer';
            
            // إضافة حدث النقر
            element.addEventListener('click', function() {
                if (isReadingMode) {
                    // إيقاف القراءة السابقة إذا كانت موجودة
                    if (currentUtterance) {
                        speechSynthesis.cancel();
                    }
                    
                    // قراءة النص
                    const text = this.textContent;
                    speakText(text);
                }
            });
        });
    }
}

// Image zoom functionality
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img:not(.navbar-brand img)');
    
    images.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function() {
            const modal = document.createElement('div');
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0,0,0,0.9)';
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.zIndex = '1000';
            modal.style.cursor = 'zoom-out';

            const zoomedImg = document.createElement('img');
            zoomedImg.src = this.src;
            zoomedImg.style.maxHeight = '90vh';
            zoomedImg.style.maxWidth = '90vw';
            zoomedImg.style.objectFit = 'contain';

            modal.appendChild(zoomedImg);
            document.body.appendChild(modal);

            modal.addEventListener('click', function() {
                document.body.removeChild(modal);
            });
        });
    });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    animateOnScroll();
    updateDateTime();
    updateVisitCount();
    
    // Show survey after 1 minute
    setTimeout(() => {
        const hasSeenSurvey = localStorage.getItem('hasSeenSurvey');
        if (!hasSeenSurvey) {
            const surveyModal = new bootstrap.Modal(document.getElementById('surveyModal'));
            surveyModal.show();
            localStorage.setItem('hasSeenSurvey', 'true');
        }
    }, 60000);
});

// التحقق من تاريخ الموعد
document.getElementById('preferredDate').addEventListener('change', function() {
    const selectedDate = new Date(this.value);
    const today = new Date();
    const dayOfWeek = selectedDate.getDay();

    // التحقق من أن التاريخ ليس في الماضي
    if (selectedDate < today) {
        alert('الرجاء اختيار تاريخ في المستقبل');
        this.value = '';
        return;
    }

    // التحقق من أن اليوم ليس جمعة أو سبت
    if (dayOfWeek === 5 || dayOfWeek === 6) {
        alert('عذراً، لا نعمل في أيام الجمعة والسبت. الرجاء اختيار يوم آخر.');
        this.value = '';
        return;
    }
});

// معالجة نموذج حجز الموعد
document.getElementById('appointmentForm').addEventListener('submit', function(e) {
    e.preventDefault();
        
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        serviceType: document.getElementById('serviceType').value,
        preferredDate: document.getElementById('preferredDate').value,
        notes: document.getElementById('notes').value
    };

    // التحقق من صحة البيانات
    if (!validateJordanianPhone(formData.phone)) {
        alert('الرجاء إدخال رقم هاتف أردني صحيح');
        return;
    }

    // إرسال البيانات (يمكن إضافة كود الإرسال الفعلي هنا)
    console.log('تم إرسال الطلب:', formData);
    alert(`تم إرسال طلبك بنجاح!
سنتواصل معك قريباً على:
الهاتف: ${formData.phone}
البريد الإلكتروني: ${formData.email}

يمكنك أيضاً التواصل معنا مباشرة على:
engfaten1111@gmail.com`);
        
    this.reset();
});

// تعيين الحد الأدنى لتاريخ الموعد كاليوم الحالي
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('preferredDate').min = today;
});

// تتبع عدد الزيارات
function trackVisits() {
    // الحصول على عدد الزيارات السابقة
    let visits = localStorage.getItem('visits') || 0;
    visits = parseInt(visits) + 1;
    
    // تحديث عدد الزيارات
    localStorage.setItem('visits', visits);
    
    // تحديث العداد في الصفحة
    const visitCounter = document.getElementById('visit-counter');
    if (visitCounter) {
        visitCounter.textContent = visits;
    }
}

// تشغيل تتبع الزيارات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', trackVisits);

// وظائف تحويل النص إلى صوت
const synth = window.speechSynthesis;

// سلة المشتريات
let cart = {
    items: [],
    total: 0
};

// إضافة منتج إلى السلة
function addToCart(productId, name, price) {
    const item = cart.items.find(item => item.productId === productId);
    
    if (item) {
        item.quantity++;
    } else {
        cart.items.push({
            productId,
            name,
            price,
            quantity: 1
        });
    }
    
    updateCart();
    showCartNotification('تمت إضافة المنتج إلى السلة');
}

// تحديث السلة
function updateCart() {
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // تحديث عدد العناصر في أيقونة السلة
    const cartBadge = document.getElementById('cart-count');
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    
    // تحديث قائمة المنتجات في السلة
    const cartList = document.getElementById('cart-items');
    if (cartList) {
        cartList.innerHTML = '';
        cart.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span>${item.name}</span>
                    <span>${item.quantity} × ${item.price.toFixed(2)} د.أ</span>
                </div>
            `;
            cartList.appendChild(itemElement);
        });
        
        // تحديث المجموع
        document.getElementById('cart-total').textContent = cart.total.toFixed(2) + ' د.أ';
    }
}

// إظهار إشعار إضافة المنتج
function showCartNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// فتح/إغلاق السلة
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.toggle('open');
}

// تحويل العملة (الأسعار الافتراضية بالدينار الأردني)
const exchangeRates = {
    'JOD': 1,      // دينار أردني
    'USD': 1.41,   // دولار أمريكي
    'EUR': 1.52,   // يورو
    'SAR': 0.38    // ريال سعودي
};

function convertCurrency(price, fromCurrency, toCurrency) {
    return price * (exchangeRates[toCurrency] / exchangeRates[fromCurrency]);
}

// تغيير عملة العرض
function changeCurrency(currency) {
    const currentCurrency = document.querySelector('.currency-selector').value;
    const priceElements = document.querySelectorAll('.product-price');
    
    priceElements.forEach(element => {
        const basePrice = parseFloat(element.dataset.basePrice);
        const convertedPrice = convertCurrency(basePrice, 'JOD', currency);
        element.textContent = `${convertedPrice.toFixed(2)} ${getCurrencySymbol(currency)}`;
    });
}

function getCurrencySymbol(currency) {
    switch(currency) {
        case 'JOD': return 'د.أ';
        case 'USD': return '$';
        case 'EUR': return '€';
        case 'SAR': return 'ر.س';
        default: return currency;
    }
}
