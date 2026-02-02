// ==================== //
// SMOOTH NAVIGATION   //
// ==================== //
document.addEventListener('DOMContentLoaded', () => {

    // Smooth scroll for navigation links
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));

            // Add active class to clicked item
            item.classList.add('active');

            // Get target section
            const targetId = item.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==================== //
    // SCROLL TO TOP       //
    // ==================== //
    const scrollTopBtn = document.getElementById('scrollTop');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ==================== //
    // ACTIVE NAV ON SCROLL //
    // ==================== //
    const sections = document.querySelectorAll('.content-section');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // ==================== //
    // INTERSECTION OBSERVER //
    // ==================== //
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all content sections
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // ==================== //
    // CARD ANIMATIONS     //
    // ==================== //
    const cards = document.querySelectorAll('.info-card, .character-card, .ayah-card, .hadith-card, .chapter, .issue-card, .sunnah-card');

    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;

        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        cardObserver.observe(card);
    });

    // ==================== //
    // COPY TO CLIPBOARD   //
    // ==================== //
    const hadithTexts = document.querySelectorAll('.hadith-text');
    const ayahTexts = document.querySelectorAll('.ayah-text');
    const duaaTexts = document.querySelectorAll('.duaa-text');

    const addCopyListener = (elements) => {
        elements.forEach(element => {
            element.style.cursor = 'pointer';
            element.title = 'انقر للنسخ';

            element.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(element.textContent);

                    // Visual feedback
                    const originalBg = element.style.background;
                    element.style.background = 'rgba(212, 175, 55, 0.2)';

                    // Show tooltip
                    const tooltip = document.createElement('span');
                    tooltip.textContent = '✓ تم النسخ';
                    tooltip.style.cssText = `
                        position: absolute;
                        background: #d4af37;
                        color: #0a0a0a;
                        padding: 0.5rem 1rem;
                        border-radius: 6px;
                        font-size: 0.9rem;
                        font-weight: 600;
                        z-index: 1000;
                        animation: fadeInOut 2s ease;
                    `;

                    element.style.position = 'relative';
                    element.appendChild(tooltip);

                    setTimeout(() => {
                        element.style.background = originalBg;
                        tooltip.remove();
                    }, 2000);

                } catch (err) {
                    console.error('فشل النسخ:', err);
                }
            });
        });
    };

    addCopyListener(hadithTexts);
    addCopyListener(ayahTexts);
    addCopyListener(duaaTexts);

    // ==================== //
    // SEARCH FUNCTIONALITY //
    // ==================== //
    const createSearchBox = () => {
        const searchContainer = document.createElement('div');
        searchContainer.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 999;
            opacity: 0;
            visibility: hidden;
            transition: 0.3s ease;
        `;

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = '🔍 ابحث في الدرس...';
        searchInput.style.cssText = `
            padding: 0.8rem 1.5rem;
            border-radius: 25px;
            border: 2px solid #d4af37;
            background: #151515;
            color: #f5f5f5;
            font-size: 1rem;
            width: 300px;
            outline: none;
        `;

        searchContainer.appendChild(searchInput);
        document.body.appendChild(searchContainer);

        // Show search on Ctrl+F or Cmd+F
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                searchContainer.style.opacity = '1';
                searchContainer.style.visibility = 'visible';
                searchInput.focus();
            }

            if (e.key === 'Escape') {
                searchContainer.style.opacity = '0';
                searchContainer.style.visibility = 'hidden';
                searchInput.value = '';
                removeHighlights();
            }
        });

        // Search functionality
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            removeHighlights();

            if (searchTerm.length > 2) {
                highlightText(searchTerm);
            }
        });
    };

    const highlightText = (searchTerm) => {
        const contentSections = document.querySelectorAll('.content-section');

        contentSections.forEach(section => {
            const walker = document.createTreeWalker(
                section,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            const textNodes = [];
            while (walker.nextNode()) {
                textNodes.push(walker.currentNode);
            }

            textNodes.forEach(node => {
                const text = node.textContent;
                const lowerText = text.toLowerCase();

                if (lowerText.includes(searchTerm)) {
                    const span = document.createElement('span');
                    span.innerHTML = text.replace(
                        new RegExp(searchTerm, 'gi'),
                        match => `<mark style="background: #d4af37; color: #0a0a0a; padding: 2px 4px; border-radius: 3px;">${match}</mark>`
                    );
                    node.parentNode.replaceChild(span, node);
                }
            });
        });
    };

    const removeHighlights = () => {
        const marks = document.querySelectorAll('mark');
        marks.forEach(mark => {
            const parent = mark.parentNode;
            parent.replaceChild(document.createTextNode(mark.textContent), mark);
            parent.normalize();
        });
    };

    createSearchBox();

    // ==================== //
    // PRINT FUNCTIONALITY //
    // ==================== //
    const addPrintButton = () => {
        const printBtn = document.createElement('button');
        printBtn.innerHTML = '🖨️';
        printBtn.title = 'طباعة الدرس';
        printBtn.style.cssText = `
            position: fixed;
            bottom: 90px;
            left: 30px;
            background: #3b82f6;
            color: #0a0a0a;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
            transition: 0.3s ease;
            z-index: 1000;
        `;

        printBtn.addEventListener('click', () => {
            window.print();
        });

        printBtn.addEventListener('mouseenter', () => {
            printBtn.style.transform = 'translateY(-5px)';
            printBtn.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.6)';
        });

        printBtn.addEventListener('mouseleave', () => {
            printBtn.style.transform = 'translateY(0)';
            printBtn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.5)';
        });

        document.body.appendChild(printBtn);
    };

    addPrintButton();

    // ==================== //
    // THEME TOGGLE        //
    // ==================== //
    console.log('🕌 موقع القلب السليم - تم التحميل بنجاح!');
    console.log('📚 استخدم Ctrl+F للبحث في الدرس');
    console.log('🖨️ انقر على زر الطباعة لطباعة الدرس');
});

// ==================== //
// CSS FOR ANIMATIONS  //
// ==================== //
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translateY(-10px); }
        10%, 90% { opacity: 1; transform: translateY(0); }
    }
    
    @media print {
        .main-nav,
        .scroll-top,
        button {
            display: none !important;
        }
        
        body {
            background: white;
            color: black;
        }
        
        .content-section {
            page-break-inside: avoid;
        }
    }
`;
document.head.appendChild(style);
