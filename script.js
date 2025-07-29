// المتغيرات العامة
let currentSection = 'home';
let isScrolling = false;

// تهيئة الموقع عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
    setupEventListeners();
    animateOnScroll();
    createProgressBar();
});

// تهيئة الموقع
function initializeWebsite() {
    // تأثير التحميل للعناصر
    const elements = document.querySelectorAll('.section');
    elements.forEach((element, index) => {
        element.classList.add('loading');
        setTimeout(() => {
            element.classList.add('loaded');
        }, index * 200);
    });
    
    // تحديث الرابط النشط في التنقل
    updateActiveNavLink();
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // التنقل المتنقل
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // روابط التنقل
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            scrollToSection(sectionId);
            
            // إغلاق القائمة المتنقلة
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // نموذج التواصل
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', handleFormSubmission);
    
    // تحديث التنقل عند التمرير
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            requestAnimationFrame(() => {
                handleScroll();
                updateProgressBar();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
    
    // تأثيرات الكشف عند التمرير
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    // تحديث القسم النشط
                    currentSection = entry.target.id;
                    updateActiveNavLink();
                }
            });
        },
        { threshold: 0.3 }
    );
    
    // مراقبة جميع الأقسام
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}

// التمرير إلى قسم معين
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // تعديل للشريط الثابت
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        currentSection = sectionId;
        updateActiveNavLink();
    }
}

// تحديث الرابط النشط في التنقل
function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === currentSection) {
            link.classList.add('active');
        }
    });
}

// معالجة التمرير
function handleScroll() {
    const scrolled = window.pageYOffset;
    const navbar = document.querySelector('.navbar');
    
    // تأثير الشفافية للشريط العلوي
    if (scrolled > 100) {
        navbar.style.background = 'linear-gradient(180deg, #E2E8F0 0%, #BFDBFE 100%)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'linear-gradient(180deg, #F1F5F9 0%, #E0F2FE 100%)';
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    }
    
    // تحديد القسم النشط
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
            if (currentSection !== section.id) {
                currentSection = section.id;
                updateActiveNavLink();
            }
        }
    });
}

// إنشاء شريط التقدم
function createProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.style.width = '0%';
    document.body.appendChild(progressBar);
}

// تحديث شريط التقدم
function updateProgressBar() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = scrollPercent + '%';
    }
}

// الرسوم المتحركة عند التمرير
function animateOnScroll() {
    const animatedElements = document.querySelectorAll('.objective-card, .skill-category, .timeline-item, .experience-card, .project-card, .team-card');
    
    const animationObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        },
        { threshold: 0.1 }
    );
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.8s ease';
        animationObserver.observe(element);
    });
}
// دالة لحفظ السيرة الذاتية كملف PDF
function saveResumeAsPDF() {
    const element = document.querySelector('main');
    const buttons = document.querySelector('.action-buttons');
    
    // إخفاء الأزرار مؤقتًا
    buttons.classList.add('no-pdf');
    
    const opt = {
        margin: 0.5,
        filename: 'Abdulwali_Bakeel_Resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().from(element).set(opt).save().then(() => {
        // إعادة إظهار الأزرار بعد الحفظ
        buttons.classList.remove('no-pdf');
        showNotification('تم حفظ السيرة الذاتية بنجاح!', 'success');
    });
}
// معالجة إرسال النموذج
function handleFormSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // التحقق من صحة البيانات
    if (!name || !email || !message) {
        showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('يرجى إدخال بريد إلكتروني صحيح', 'error');
        return;
    }
    
    // محاكاة إرسال النموذج
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
    submitButton.disabled = true;
    
    // إنشاء رابط WhatsApp
    const phoneNumber = '+967778447779';
    const whatsappMessage = `الاسم: ${encodeURIComponent(name)}\nالبريد الإلكتروني: ${encodeURIComponent(email)}\nالرسالة: ${encodeURIComponent(message)}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;
    
    setTimeout(() => {
        showNotification('تم إرسال رسالتك بنجاح! جاري التوجيه إلى WhatsApp...', 'success');
        e.target.reset();
        
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // إعادة التوجيه إلى WhatsApp
        setTimeout(() => {
            window.location.href = whatsappUrl;
        }, 1000); // تأخير قصير لعرض الإشعار
    }, 2000);
}

// التحقق من صحة البريد الإلكتروني
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// عرض الإشعارات
function showNotification(message, type = 'info') {
    // إزالة الإشعارات السابقة
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // إضافة الأنماط
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1001;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        min-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // إزالة الإشعار تلقائياً بعد 5 ثوان
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}
// عرض الإشعارات
function showNotification(message, type = 'info') {
    // إزالة الإشعارات السابقة
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // إضافة الأنماط
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1001;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        min-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // إزالة الإشعار تلقائياً بعد 5 ثوان
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// أيقونات الإشعارات
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// ألوان الإشعارات
function getNotificationColor(type) {
    const colors = {
        success: '#22C55E',
        error: '#EF4444',
        warning: '#F97316',
        info: '#2563EB'
    };
    return colors[type] || '#2563EB';
}

// إضافة الرسوم المتحركة للإشعارات
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        margin-right: auto;
        padding: 0.25rem;
        border-radius: 4px;
        transition: background 0.2s ease;
    }
    
    .notification-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`;
document.head.appendChild(style);

// تأثيرات خاصة للمهارات
function addSkillAnimations() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach((skill, index) => {
        skill.addEventListener('mouseenter', () => {
            skill.style.transform = 'translateY(-5px) scale(1.05)';
        });
        
        skill.addEventListener('mouseleave', () => {
            skill.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// تأثيرات المشاريع والفريق
function addProjectAndTeamAnimations() {
    const cards = document.querySelectorAll('.project-card, .team-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.project-icon') || card.querySelector('.team-image img');
            if (icon) icon.style.transform = 'rotate(10deg) scale(1.1)';
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.project-icon') || card.querySelector('.team-image img');
            if (icon) icon.style.transform = 'rotate(0deg) scale(1)';
        });
    });
}

// تأثير الكتابة المتحركة للعنوان الرئيسي
function typewriterEffect() {
    const title = document.querySelector('.hero-title');
    if (!title) return;
    
    const text = title.textContent;
    title.textContent = '';
    title.style.borderLeft = '3px solid var(--primary-color)';
    
    let i = 0;
    const timer = setInterval(() => {
        title.textContent += text.charAt(i);
        i++;
        
        if (i > text.length) {
            clearInterval(timer);
            title.style.borderLeft = 'none';
        }
    }, 100);
}

// تأثيرات إضافية عند التحميل
window.addEventListener('load', () => {
    addSkillAnimations();
    addProjectAndTeamAnimations();
    
    // تأثير الكتابة بعد ثانية من التحميل
    setTimeout(typewriterEffect, 1000);
});

// تأثير المؤشر المخصص (اختياري)
function addCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: var(--primary-color);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        transition: transform 0.1s ease;
    `;
    
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    // تأثيرات خاصة عند التمرير على العناصر التفاعلية
    const interactiveElements = document.querySelectorAll('a, button, .skill-item, .project-card, .team-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
        });
    });
}

// تفعيل المؤشر المخصص على أجهزة سطح المكتب فقط
if (window.innerWidth > 768) {
    addCustomCursor();
}

// دالة لتبديل اللغة (اختيارية للمستقبل)
function toggleLanguage() {
    console.log('تبديل اللغة - قريباً');
}

// تحسين التحميل المؤجل للصور
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// تشغيل تحميل الصور المؤجل
lazyLoadImages();

// دالة لطباعة السيرة الذاتية
function printResume() {
    window.print();
}

// إضافة زر الطباعة

// إضافة زر الطباعة
function addPrintButton() {
    const actionButtons = document.createElement('div');
    actionButtons.className = 'action-buttons no-pdf';

    const printButton = document.createElement('button');
    printButton.innerHTML = '<i class="fas fa-print"></i> طباعة السيرة الذاتية';
    printButton.className = 'btn btn-secondary print-btn';
    printButton.addEventListener('click', printResume);

    const saveButton = document.createElement('button');
    saveButton.innerHTML = '<i class="fas fa-download"></i> حفظ السيرة الذاتية PDF';
    saveButton.className = 'btn save-pdf-btn';
    saveButton.addEventListener('click', saveResumeAsPDF);

    actionButtons.appendChild(printButton);
    actionButtons.appendChild(saveButton);
    document.body.appendChild(actionButtons);
}

// تشغيل زر الطباعة على أجهزة سطح المكتب
if (window.innerWidth > 768) {
    addPrintButton();
}

// تحسين الوصولية
function improveAccessibility() {
    // إضافة تسميات للشاشة القارئة
    const interactiveItems = document.querySelectorAll('.skill-item, .project-card, .team-card');
    interactiveItems.forEach(item => {
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
    });
    
    // دعم التنقل بلوحة المفاتيح
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
}

// تشغيل تحسينات الوصولية
improveAccessibility();

// دالة لحفظ تفضيلات المستخدم
function saveUserPreferences() {
    const preferences = {
        lastVisitedSection: currentSection,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('cvWebsitePreferences', JSON.stringify(preferences));
}

// استرجاع تفضيلات المستخدم
function loadUserPreferences() {
    const saved = localStorage.getItem('cvWebsitePreferences');
    if (saved) {
        try {
            const preferences = JSON.parse(saved);
            if (preferences.lastVisitedSection && preferences.lastVisitedSection !== 'home') {
                setTimeout(() => {
                    scrollToSection(preferences.lastVisitedSection);
                }, 1000);
            }
        } catch (e) {
            console.log('خطأ في تحميل التفضيلات');
        }
    }
}

// حفظ التفضيلات عند إغلاق الصفحة
window.addEventListener('beforeunload', saveUserPreferences);

// تحميل التفضيلات عند بدء الموقع
loadUserPreferences();

console.log('🚀 تم تحميل موقع السيرة الذاتية بنجاح!');