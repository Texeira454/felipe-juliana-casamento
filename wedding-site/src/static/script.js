// Wedding Site JavaScript
class WeddingSite {
    constructor() {
        this.weddingData = null;
        this.gifts = [];
        this.categories = [];
        this.currentFilter = 'all';
        this.countdownInterval = null;
        
        this.init();
    }

    async init() {
        this.showLoading();
        
        // Remove a chamada à API para garantir que a data não seja alterada.
        await this.loadWeddingData();
        this.loadGiftsFromLocalStorage();
        
        this.initNavigation();
        this.initCountdown();
        this.initModal();
        this.initScrollEffects();
        
        setTimeout(() => this.hideLoading(), 1500);
    }

    showLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
        }
    }

    hideLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }

    // Agora a função carrega os dados diretamente, sem depender de uma API.
    async loadWeddingData() {
        this.weddingData = {
            bride_name: 'Juliana',
            groom_name: 'Felipe',
            wedding_date: '2025-10-19', 
            wedding_time: '15:30:00',
            venue_name: 'Espaço Colinas Eventos',
            venue_address: 'Estr. Colina, 33 - Parque Primavera, Poços de Caldas - MG, 37700-001'
        };
        this.updateWeddingInfo();
    }

    updateWeddingInfo() {
        if (!this.weddingData) return;

        const brideNameEl = document.getElementById('bride-name');
        const groomNameEl = document.getElementById('groom-name');
        if (brideNameEl) brideNameEl.textContent = this.weddingData.bride_name;
        if (groomNameEl) groomNameEl.textContent = this.weddingData.groom_name;

        const weddingDateEl = document.getElementById('wedding-date');
        const ceremonyDateEl = document.getElementById('ceremony-date');
        const ceremonyTimeEl = document.getElementById('ceremony-time');
        const venueNameEl = document.getElementById('venue-name');
        const venueAddressEl = document.getElementById('venue-address');

        if (this.weddingData.wedding_date) {
            const date = new Date(this.weddingData.wedding_date);
            const formattedDate = date.toLocaleDateString('pt-BR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            
            if (weddingDateEl) {
                weddingDateEl.innerHTML = `<i class="fas fa-calendar-heart"></i><span>${formattedDate}</span>`;
            }
            if (ceremonyDateEl) ceremonyDateEl.textContent = formattedDate;
        }

        if (ceremonyTimeEl && this.weddingData.wedding_time) {
            ceremonyTimeEl.textContent = this.weddingData.wedding_time.substring(0, 5);
        }
        if (venueNameEl) venueNameEl.textContent = this.weddingData.venue_name;
        if (venueAddressEl) venueAddressEl.textContent = this.weddingData.venue_address;
    }

    initNavigation() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        const navbar = document.getElementById('navbar');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }

                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });

        window.addEventListener('scroll', () => {
            if (navbar) {
                if (window.scrollY > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }

            this.updateActiveNavLink();
        });
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    initCountdown() {
        if (!this.weddingData || !this.weddingData.wedding_date) return;

        // Corrigido para especificar o fuso horário (-03:00) para evitar problemas de contagem
        const weddingDateTime = new Date('2025-10-18T15:30:00-03:00');
        
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }

        this.countdownInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = weddingDateTime.getTime() - now;

            if (distance < 0) {
                clearInterval(this.countdownInterval);
                const countdownEl = document.getElementById('countdown');
                if (countdownEl) {
                    countdownEl.innerHTML = '<div class="countdown-item"><span class="countdown-number">🎉</span><span class="countdown-label">É hoje!</span></div>';
                }
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const daysEl = document.getElementById('days');
            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');
            const secondsEl = document.getElementById('seconds');
            
            if (daysEl) daysEl.textContent = days;
            if (hoursEl) hoursEl.textContent = hours;
            if (minutesEl) minutesEl.textContent = minutes;
            if (secondsEl) secondsEl.textContent = seconds;
        }, 1000);
    }

    loadGiftsFromLocalStorage() {
        const savedGifts = localStorage.getItem('weddingGifts');
        if (savedGifts) {
            this.gifts = JSON.parse(savedGifts);
        } else {
            this.gifts = [
                { id: 1, name: 'Exaustor', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 2, name: 'Gás de cozinha', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 3, name: 'Sanduicheira', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 4, name: 'Liquidificador', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 5, name: 'Processador de alimentos', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 6, name: 'Mixer', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 7, name: 'Batedeira', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 8, name: 'Espremedor de frutas', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 9, name: 'Cafeteira', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 10, name: 'Chaleira', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 11, name: 'Garrafa térmica', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 12, name: 'Jogo de Panelas', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 13, name: 'Jogo de copos', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 14, name: 'Jogo de xícaras', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 15, name: 'Jogo de talheres', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 16, name: 'Jogo de jantar', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 17, name: 'Jogo de sobremesas', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 18, name: 'Jogo de utensílios de cozinha', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 19, name: 'Jogo americano', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 20, name: 'Sanduicheira', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 21, name: 'Fruteira de mesa', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 22, name: 'Escorredor de louças', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 23, name: 'Panela elétrica de arroz', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 24, name: 'Panela de pressão', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 25, name: 'Assadeira de alumínio', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 26, name: 'Garrafa térmica', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 27, name: 'Refratário', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 28, name: 'Tábua para carne', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 29, name: 'Potes de mantimento', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 30, name: 'Potes herméticos', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 31, name: 'Bowls', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 32, name: 'Frigideiras antiaderente', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 33, name: 'Boleira', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 34, name: 'Tábua de frios', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 35, name: 'Jarra de vidro', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 36, name: 'Saladeira', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 37, name: 'Bule', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 38, name: 'Amolador de facas', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 39, name: 'Espátulas de silicone', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 40, name: 'Balança de cozinha', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 41, name: 'Termômetro de cozinha', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 42, name: 'Kit mesa posta', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 43, name: 'Descanso de panela', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 44, name: 'Triturador de alho', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 45, name: 'Forma de fundo removível', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 46, name: 'Jogo de peneiras', category: 'Cozinha', is_reserved: false, reserved_by: null },
                { id: 47, name: 'TV', category: 'Sala', is_reserved: false, reserved_by: null },
                { id: 48, name: 'Tapetes para sala', category: 'Sala', is_reserved: false, reserved_by: null },
                { id: 49, name: 'Cortinas para sala', category: 'Sala', is_reserved: false, reserved_by: null },
                { id: 50, name: 'Cortina black out para quarto', category: 'Quarto', is_reserved: false, reserved_by: null },
                { id: 51, name: 'Luminárias', category: 'Sala', is_reserved: false, reserved_by: null },
                { id: 52, name: 'Ventilador', category: 'Sala', is_reserved: false, reserved_by: null },
                { id: 53, name: 'Porta chave', category: 'Sala', is_reserved: false, reserved_by: null },
                { id: 54, name: 'Relógio de parede', category: 'Sala', is_reserved: false, reserved_by: null },
                { id: 55, name: 'Almofadas para sofá', category: 'Sala', is_reserved: false, reserved_by: null },
                { id: 56, name: 'Escrivaninha', category: 'Quarto', is_reserved: false, reserved_by: null },
                { id: 57, name: 'Cadeira de escritório', category: 'Quarto', is_reserved: false, reserved_by: null },
                { id: 58, name: 'Criado mudo', category: 'Quarto', is_reserved: false, reserved_by: null },
                { id: 59, name: 'Cômoda', category: 'Quarto', is_reserved: false, reserved_by: null },
                { id: 60, name: 'Sapateira', category: 'Quarto', is_reserved: false, reserved_by: null },
                { id: 61, name: 'Espelho grande', category: 'Quarto', is_reserved: false, reserved_by: null },
                { id: 62, name: 'Chuveiro', category: 'Banheiro', is_reserved: false, reserved_by: null },
                { id: 63, name: 'Secador', category: 'Banheiro', is_reserved: false, reserved_by: null },
                { id: 64, name: 'Barbeador elétrico', category: 'Banheiro', is_reserved: false, reserved_by: null },
                { id: 65, name: 'Porta escova de dentes', category: 'Banheiro', is_reserved: false, reserved_by: null },
                { id: 66, name: 'Saboneteira', category: 'Banheiro', is_reserved: false, reserved_by: null },
                { id: 67, name: 'Varal de chão', category: 'Lavanderia', is_reserved: false, reserved_by: null },
                { id: 68, name: 'Ferro de passar', category: 'Lavanderia', is_reserved: false, reserved_by: null },
                { id: 69, name: 'Tábua de passar roupa', category: 'Lavanderia', is_reserved: false, reserved_by: null },
                { id: 70, name: 'Aspirador de pó', category: 'Lavanderia', is_reserved: false, reserved_by: null },
                { id: 71, name: 'Escada', category: 'Lavanderia', is_reserved: false, reserved_by: null },
                { id: 72, name: 'Kit ferramentas', category: 'Lavanderia', is_reserved: false, reserved_by: null },
                { id: 73, name: 'Robô aspirador', category: 'Lavanderia', is_reserved: false, reserved_by: null },
                { id: 74, name: 'Caixas organizadoras', category: 'Lavanderia', is_reserved: false, reserved_by: null },
                { id: 75, name: 'Cesto de lixo grande', category: 'Lavanderia', is_reserved: false, reserved_by: null },
            ];
        }
    
        this.categories = [...new Set(this.gifts.map(gift => gift.category))];
        
        this.updateGiftStats();
        this.renderGiftFilters();
        this.renderGifts();
    }
    
    saveGiftsToLocalStorage() {
        localStorage.setItem('weddingGifts', JSON.stringify(this.gifts));
    }

    updateGiftStats() {
        const totalGifts = this.gifts.length;
        const reservedGifts = this.gifts.filter(gift => gift.is_reserved).length;
        const availableGifts = totalGifts - reservedGifts;

        const totalGiftsEl = document.getElementById('total-gifts');
        const availableGiftsEl = document.getElementById('available-gifts');
        const reservedGiftsEl = document.getElementById('reserved-gifts');

        if (totalGiftsEl) totalGiftsEl.textContent = totalGifts;
        if (availableGiftsEl) availableGiftsEl.textContent = availableGifts;
        if (reservedGiftsEl) reservedGiftsEl.textContent = reservedGifts;
    }

    renderGiftFilters() {
        const categoryFilters = document.getElementById('category-filters');
        if (!categoryFilters) return;

        categoryFilters.innerHTML = '';

        const allButton = document.createElement('button');
        allButton.className = 'filter-btn active';
        allButton.setAttribute('data-category', 'all');
        allButton.textContent = 'Todos';
        allButton.addEventListener('click', () => this.filterGifts('all'));
        categoryFilters.appendChild(allButton);

        this.categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'filter-btn';
            button.setAttribute('data-category', category);
            button.textContent = category;
            button.addEventListener('click', () => this.filterGifts(category));
            categoryFilters.appendChild(button);
        });
    }

    filterGifts(category) {
        this.currentFilter = category;
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`[data-category="${category}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        this.renderGifts();
    }

    renderGifts() {
        const giftGrid = document.getElementById('gift-grid');
        if (!giftGrid) return;

        const filteredGifts = this.currentFilter === 'all' 
            ? this.gifts 
            : this.gifts.filter(gift => gift.category === this.currentFilter);

        giftGrid.innerHTML = '';

        if (filteredGifts.length === 0) {
            giftGrid.innerHTML = '<p class="text-center">Nenhum presente encontrado nesta categoria.</p>';
            return;
        }

        filteredGifts.forEach(gift => {
            const giftCard = this.createGiftCard(gift);
            giftGrid.appendChild(giftCard);
        });
    }

    createGiftCard(gift) {
    const card = document.createElement('div');
    card.className = `gift-card ${gift.is_reserved ? 'reserved' : ''}`;
    
    const giftImage = gift.image_url 
        ? `<img src="${gift.image_url}" alt="${gift.name}" style="width: 100%; height: 100%; object-fit: cover;">`
        : '<i class="fas fa-gift"></i>';

    card.innerHTML = `
        <div class="gift-image">
            ${giftImage}
        </div>
        <div class="gift-content">
            <h3 class="gift-name">${gift.name}</h3>
            <p class="gift-description">${gift.description || ''}</p>
            <div class="gift-meta">
                <span class="gift-category">${gift.category}</span>
                <span class="gift-price">${gift.price_range || ''}</span>
            </div>
            ${gift.is_reserved 
                ? `<div class="reserved-by">Reservado por: ${gift.reserved_by}</div>
                   <div class="gift-actions">
                        <button class="btn-cancel" onclick="weddingSite.cancelReservation(${gift.id})">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                   </div>`
                : `<div class="gift-actions">
                      <button class="btn-reserve" onclick="weddingSite.openReservationModal(${gift.id})">
                          <i class="fas fa-heart"></i> Reservar
                      </button>
                   </div>`
            }
        </div>
    `;

    return card;
}

    cancelReservation(giftId) {
    if (!confirm('Tem certeza que deseja cancelar a reserva deste presente?')) {
        return;
    }

    const giftIndex = this.gifts.findIndex(g => g.id === giftId);
    if (giftIndex !== -1) {
        this.gifts[giftIndex].is_reserved = false;
        this.gifts[giftIndex].reserved_by = null;
        this.saveGiftsToLocalStorage();
        alert(`Reserva cancelada com sucesso!`);
        
        this.updateGiftStats();
        this.renderGifts();
    } else {
        alert('Erro ao cancelar reserva. Tente novamente.');
    }
}

    initModal() {
        const modal = document.getElementById('gift-modal');
        const closeBtn = document.getElementById('modal-close');
        const cancelBtn = document.getElementById('cancel-reservation');
        const form = document.getElementById('reservation-form');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeModal());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        if (form) {
            form.addEventListener('submit', (e) => this.handleReservation(e));
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    openReservationModal(giftId) {
        const gift = this.gifts.find(g => g.id === giftId);
        if (!gift || gift.is_reserved) return;

        const modal = document.getElementById('gift-modal');
        const modalDetails = document.getElementById('modal-gift-details');
        
        if (modalDetails) {
            modalDetails.innerHTML = `
                <div class="gift-details">
                    <h4>${gift.name}</h4>
                    <p>${gift.description || ''}</p>
                    <div class="gift-meta">
                        <span class="gift-category">${gift.category}</span>
                        <span class="gift-price">${gift.price_range || ''}</span>
                    </div>
                </div>
            `;
        }

        modal.setAttribute('data-gift-id', giftId);
        
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }

        setTimeout(() => {
            const nameInput = document.getElementById('guest-name');
            if (nameInput) nameInput.focus();
        }, 300);
    }

    closeModal() {
        const modal = document.getElementById('gift-modal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }

        const form = document.getElementById('reservation-form');
        if (form) form.reset();
    }

    handleReservation(e) {
        e.preventDefault();
        
        const modal = document.getElementById('gift-modal');
        const giftId = parseInt(modal.getAttribute('data-gift-id'));
        const guestName = document.getElementById('guest-name').value.trim();
        
        if (!guestName) {
            alert('Por favor, digite seu nome.');
            return;
        }

        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Reservando...';
        submitBtn.disabled = true;

        setTimeout(() => {
            const giftIndex = this.gifts.findIndex(g => g.id === giftId);
            if (giftIndex !== -1) {
                this.gifts[giftIndex].is_reserved = true;
                this.gifts[giftIndex].reserved_by = guestName;
                this.saveGiftsToLocalStorage();
                alert(`Presente reservado com sucesso para ${guestName}! Obrigado!`);
                
                this.closeModal();
                this.updateGiftStats();
                this.renderGifts();
            } else {
                alert('Erro ao reservar presente. Tente novamente.');
            }
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1000); 
    }

    initScrollEffects() {
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

        const animateElements = document.querySelectorAll('.story-item, .detail-card, .gift-card, .contact-item');
        animateElements.forEach(el => observer.observe(el));

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.weddingSite = new WeddingSite();
});

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function formatTime(timeString) {
    return timeString.substring(0, 5);
}

window.addEventListener('resize', () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (window.innerWidth > 768) {
        if (hamburger) hamburger.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
    }
});

document.addEventListener('visibilitychange', () => {
    if (window.weddingSite && window.weddingSite.countdownInterval) {
        if (document.hidden) {
            clearInterval(window.weddingSite.countdownInterval);
        } else {
            window.weddingSite.initCountdown();
        }
    }
});
