// ============================================
// 配置区域 - 请在这里配置API密钥
// ============================================

// Formspree配置（推荐使用Formspree，免费且简单）
const FORMSPREEE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'; // 替换为您的Formspree表单ID

// EmailJS配置（备选方案）
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // 替换为您的EmailJS服务ID
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // 替换为您的EmailJS模板ID
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // 替换为您的EmailJS公钥

// 使用哪个服务：'formspree' 或 'emailjs'
const FORM_SERVICE = 'formspree'; // 默认使用Formspree

// ============================================
// 移动端汉堡菜单动画
// ============================================
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const hamburgerLine1 = document.getElementById('hamburger-line1');
const hamburgerLine2 = document.getElementById('hamburger-line2');
const hamburgerLine3 = document.getElementById('hamburger-line3');

let isMenuOpen = false;

function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    
    if (isMenuOpen) {
        // 打开菜单：三条线变成X
        mobileMenu.classList.remove('hidden');
        mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
        hamburgerLine1.classList.add('rotate-45', 'top-1/2', '-translate-y-1/2');
        hamburgerLine1.classList.remove('top-2');
        hamburgerLine2.classList.add('opacity-0');
        hamburgerLine3.classList.add('-rotate-45', 'top-1/2', '-translate-y-1/2');
        hamburgerLine3.classList.remove('bottom-2');
        // 防止背景滚动
        document.body.style.overflow = 'hidden';
    } else {
        // 关闭菜单：X变回三条线
        mobileMenu.style.maxHeight = '0';
        setTimeout(() => {
            mobileMenu.classList.add('hidden');
        }, 300);
        hamburgerLine1.classList.remove('rotate-45', 'top-1/2', '-translate-y-1/2');
        hamburgerLine1.classList.add('top-2');
        hamburgerLine2.classList.remove('opacity-0');
        hamburgerLine3.classList.remove('-rotate-45', 'top-1/2', '-translate-y-1/2');
        hamburgerLine3.classList.add('bottom-2');
        // 恢复背景滚动
        document.body.style.overflow = '';
    }
}

if (mobileMenuBtn && mobileMenu && hamburgerLine1 && hamburgerLine2 && hamburgerLine3) {
    // 初始化菜单高度
    mobileMenu.style.maxHeight = '0';
    mobileMenu.style.transition = 'max-height 0.3s ease-out, opacity 0.3s ease-out';
    
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // 点击菜单链接后关闭菜单
    const menuLinks = mobileMenu.querySelectorAll('a, button');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) {
                toggleMobileMenu();
            }
        });
    });
    
    // 点击外部区域关闭菜单
    document.addEventListener('click', (e) => {
        if (isMenuOpen && 
            !mobileMenu.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            toggleMobileMenu();
        }
    });
}

// ============================================
// 导航栏滚动效果（透明/固定）
// ============================================
const nav = document.querySelector('nav');
let lastScroll = 0;
let ticking = false;

function updateNavbar() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        // 滚动超过100px时，导航栏变透明并添加背景模糊
        nav.classList.add('nav-scrolled');
        nav.style.backgroundColor = 'rgba(30, 58, 138, 0.95)'; // blue-900 with opacity
        nav.style.backdropFilter = 'blur(10px)';
    } else {
        // 回到顶部时，恢复原始样式
        nav.classList.remove('nav-scrolled');
        nav.style.backgroundColor = '';
        nav.style.backdropFilter = '';
    }
    
    lastScroll = currentScroll;
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateNavbar);
        ticking = true;
    }
});

// 页面加载时检查初始位置
updateNavbar();

// ============================================
// 平滑滚动到锚点
// ============================================
function smoothScrollTo(targetId) {
    if (!targetId || targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;
    
    const navHeight = nav ? nav.offsetHeight : 0;
    const targetPosition = targetElement.offsetTop - navHeight;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// 为所有锚点链接添加平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        
        if (targetId && targetId !== '#') {
            e.preventDefault();
            smoothScrollTo(targetId);
            
            // 移动端点击后关闭菜单
            if (isMenuOpen && mobileMenuBtn) {
                toggleMobileMenu();
            }
        }
    });
});

// ============================================
// 联系表单提交处理（使用Formspree或EmailJS）
// ============================================
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

function showFormMessage(message, isSuccess = true) {
    formMessage.classList.remove('hidden');
    formMessage.classList.remove('success', 'error', 'message');
    formMessage.classList.add('message', isSuccess ? 'success' : 'error');
    formMessage.textContent = message;
    
    // 滚动到消息位置
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // 3秒后隐藏消息
    setTimeout(() => {
        formMessage.classList.add('hidden');
    }, 5000);
}

function resetFormButton(submitBtn, originalText) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
}

async function submitToFormspree(formData) {
    const response = await fetch(FORMSPREEE_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        })
    });
    
    if (response.ok) {
        const data = await response.json();
        return { success: true, data };
    } else {
        const error = await response.json();
        throw new Error(error.error || '提交失败，请稍后重试');
    }
}

async function submitToEmailJS(formData) {
    // 加载EmailJS库（如果未加载）
    if (typeof emailjs === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        document.head.appendChild(script);
        await new Promise((resolve) => {
            script.onload = resolve;
        });
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }
    
    const templateParams = {
        from_name: formData.get('name'),
        from_email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    return await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
}

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // 验证表单
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }
        
        // 显示加载状态
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading"></span> 发送中...';
        
        try {
            const formData = new FormData(contactForm);
            let result;
            
            // 根据配置选择服务
            if (FORM_SERVICE === 'formspree') {
                if (FORMSPREEE_ENDPOINT.includes('YOUR_FORM_ID')) {
                    throw new Error('请先配置Formspree端点！请在script.js中设置FORMSPREEE_ENDPOINT');
                }
                result = await submitToFormspree(formData);
            } else if (FORM_SERVICE === 'emailjs') {
                if (EMAILJS_SERVICE_ID.includes('YOUR_') || EMAILJS_TEMPLATE_ID.includes('YOUR_') || EMAILJS_PUBLIC_KEY.includes('YOUR_')) {
                    throw new Error('请先配置EmailJS参数！请在script.js中设置EMAILJS相关配置');
                }
                result = await submitToEmailJS(formData);
            } else {
                throw new Error('未配置表单服务，请在script.js中设置FORM_SERVICE');
            }
            
            // 成功
            resetFormButton(submitBtn, originalText);
            showFormMessage(`谢谢 ${formData.get('name')}！您的消息已成功发送。我们会尽快回复您。`, true);
            contactForm.reset();
            
        } catch (error) {
            // 失败
            resetFormButton(submitBtn, originalText);
            console.error('表单提交错误:', error);
            showFormMessage(error.message || '发送失败，请检查网络连接或稍后重试。', false);
        }
    });
}

// ============================================
// 滚动动画（元素进入视口时显示）
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// 观察需要动画的元素
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.text-center, .grid > div');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
});

// ============================================
// 返回顶部按钮
// ============================================
let backToTopBtn = null;

function createBackToTopButton() {
    backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.className = 'fixed bottom-8 right-8 bg-blue-900 text-white w-12 h-12 rounded-full shadow-lg hover:bg-blue-800 transition-all duration-300 opacity-0 pointer-events-none z-50 flex items-center justify-center text-xl font-bold';
    backToTopBtn.setAttribute('aria-label', '返回顶部');
    document.body.appendChild(backToTopBtn);
    
    // 显示/隐藏按钮
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
            backToTopBtn.classList.add('opacity-100');
        } else {
            backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
            backToTopBtn.classList.remove('opacity-100');
        }
    });
    
    // 点击返回顶部
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 初始化返回顶部按钮
createBackToTopButton();

// ============================================
// 页面加载完成后的初始化
// ============================================
window.addEventListener('load', () => {
    console.log('页面加载完成 - 所有功能已初始化');
    
    // 检查API配置
    if (FORM_SERVICE === 'formspree' && FORMSPREEE_ENDPOINT.includes('YOUR_FORM_ID')) {
        console.warn('⚠️ 请配置Formspree端点：在script.js中设置FORMSPREEE_ENDPOINT');
    } else if (FORM_SERVICE === 'emailjs' && 
               (EMAILJS_SERVICE_ID.includes('YOUR_') || EMAILJS_TEMPLATE_ID.includes('YOUR_') || EMAILJS_PUBLIC_KEY.includes('YOUR_'))) {
        console.warn('⚠️ 请配置EmailJS参数：在script.js中设置EMAILJS相关配置');
    }
});
