document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const heroSection = document.getElementById('home');
    const giftGrid = document.getElementById('gift-grid');
    const totalGiftsSpan = document.getElementById('total-gifts');
    const availableGiftsSpan = document.getElementById('available-gifts');
    const reservedGiftsSpan = document.getElementById('reserved-gifts');
    const categoryFilters = document.getElementById('category-filters');
    const giftModal = document.getElementById('gift-modal');
    const modalClose = document.getElementById('modal-close');
    const reservationForm = document.getElementById('reservation-form');
    const guestNameInput = document.getElementById('guest-name');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    let currentGiftId = null;

    // Configuração do seu projeto Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyCQvNUuSKixQN9i4VWkvlVU4-eGkkGb_js",
        authDomain: "felipe-juliana-casamento.firebaseapp.com",
        projectId: "felipe-juliana-casamento",
        storageBucket: "felipe-juliana-casamento.firebasestorage.app",
        messagingSenderId: "951298865422",
        appId: "1:951298865422:web:7a843c95a9f7aa6052ff5f"
    };

    // Inicializar o Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // Função para rolar a página suavemente
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animação da navbar ao rolar
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Contagem regressiva
    const countdownDate = new Date("Oct 18, 2025 15:30:00").getTime();
    const countdown = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerHTML = days.toString().padStart(2, '0');
        document.getElementById("hours").innerHTML = hours.toString().padStart(2, '0');
        document.getElementById("minutes").innerHTML = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").innerHTML = seconds.toString().padStart(2, '0');

        if (distance < 0) {
            clearInterval(countdown);
            document.getElementById("countdown").innerHTML = "NOS CASAMOS!";
        }
    }, 1000);

    // DADOS DA LISTA DE PRESENTES
    const initialGifts = [
        { name: "Exaustor", description: "Para manter o ar da cozinha fresco.", category: "Eletrodomésticos", reserved: false, reservedBy: "" },
        { name: "Gás de cozinha", description: "Gás de cozinha para o dia a dia.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Sanduicheira", description: "Para sanduíches rápidos e saborosos.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Liquidificador", description: "O essencial para sucos e vitaminas.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Processador de alimentos", description: "Agiliza o preparo de diversas receitas.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Mixer", description: "Ideal para misturar líquidos e massas leves.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Batedeira", description: "Para massas, bolos e cremes perfeitos.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Espremedor de frutas", description: "Sucos naturais e frescos a qualquer hora.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Cafeteira", description: "Para um café delicioso e quentinho.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Chaleira", description: "Para ferver água com rapidez e segurança.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Garrafa térmica", description: "Mantém a temperatura das bebidas por mais tempo.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Jogo de Panelas", description: "Conjunto completo para todas as receitas.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Jogo de copos", description: "Copos elegantes para o dia a dia.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Jogo de xícaras", description: "Para café e chá com estilo.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Jogo de talheres", description: "Talheres de qualidade para a mesa de jantar.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Jogo de jantar", description: "Elegância para todas as refeições.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Jogo de sobremesas", description: "Ideal para servir doces e sobremesas.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Jogo de utensílios de cozinha", description: "Utensílios essenciais para a cozinha.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Jogo americano", description: "Proteção e estilo para a mesa.", category: "Decoração", reserved: false, reservedBy: "" },
        { name: "Fruteira de mesa", description: "Decora e organiza as frutas.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Escorredor de louças", description: "Praticidade para secar a louça.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Panela elétrica de arroz", description: "Arroz soltinho e perfeito sem esforço.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Panela de pressão", description: "Cozinha mais rápido e economiza tempo.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Assadeira de alumínio", description: "Para assados e tortas deliciosos.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Refratário", description: "Ideal para ir ao forno e à mesa.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Tábua para carne", description: "Essencial para o preparo de carnes.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Potes de mantimento", description: "Organiza a despensa com praticidade.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Potes herméticos", description: "Preserva os alimentos frescos por mais tempo.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Bowls", description: "Para servir saladas e massas.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Frigideiras antiaderente", description: "Para cozinhar sem grudar.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Boleira", description: "Exibe bolos e tortas com elegância.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Tábua de frios", description: "Para servir queijos e embutidos com estilo.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Jarra de vidro", description: "Para servir sucos e água na mesa.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Saladeira", description: "Para servir saladas de forma prática.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Bule", description: "Ideal para servir café e chá.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Amolador de facas", description: "Mantém as facas sempre afiadas.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Espátulas de silicone", description: "Utensílios que não riscam as panelas.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Balança de cozinha", description: "Para medir ingredientes com precisão.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Termômetro de cozinha", description: "Para o ponto certo de carnes e doces.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Kit mesa posta", description: "Deixa a mesa mais bonita e organizada.", category: "Decoração", reserved: false, reservedBy: "" },
        { name: "Descanso de panela", description: "Protege a mesa e a bancada.", category: "Decoração", reserved: false, reservedBy: "" },
        { name: "Triturador de alho", description: "Facilita o preparo de temperos.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Forma de fundo removível", description: "Para bolos e tortas fáceis de desenformar.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "Jogo de peneiras", description: "Conjunto de peneiras de diferentes tamanhos.", category: "Cozinha", reserved: false, reservedBy: "" },
        { name: "TV", description: "Para assistir a filmes e séries confortavelmente.", category: "Eletrônicos", reserved: false, reservedBy: "" },
        { name: "Tapetes para sala", description: "Conforto e decoração para o ambiente.", category: "Decoração", reserved: false, reservedBy: "" },
        { name: "Cortinas para sala", description: "Para controlar a luz e adicionar privacidade.", category: "Decoração", reserved: false, reservedBy: "" },
        { name: "Cortina black out para quarto", description: "Para um ambiente de sono perfeito.", category: "Decoração", reserved: false, reservedBy: "" },
        { name: "Luminárias", description: "Adiciona um toque de luz e estilo.", category: "Decoração", reserved: false, reservedBy: "" },
        { name: "Ventilador", description: "Para refrescar o ambiente nos dias quentes.", category: "Eletrodomésticos", reserved: false, reservedBy: "" },
        { name: "Porta chave", description: "Organiza as chaves na entrada de casa.", category: "Decoração", reserved: false, reservedBy: "" },
        { name: "Relógio de parede", description: "Funcional e decorativo.", category: "Decoração", reserved: false, reservedBy: "" },
        { name: "Almofadas para sofá", description: "Conforto extra e estilo para a sala.", category: "Decoração", reserved: false, reservedBy: "" },
        { name: "Escrivaninha", description: "Para montar um home office ou espaço de estudo.", category: "Móveis", reserved: false, reservedBy: "" },
        { name: "Cadeira de escritório", description: "Para trabalhar ou estudar com conforto.", category: "Móveis", reserved: false, reservedBy: "" },
        { name: "Criado mudo", description: "Mesa de cabeceira para o quarto.", category: "Móveis", reserved: false, reservedBy: "" },
        { name: "Cômoda", description: "Para organizar roupas e objetos no quarto.", category: "Móveis", reserved: false, reservedBy: "" },
        { name: "Sapateira", description: "Para manter os calçados organizados.", category: "Móveis", reserved: false, reservedBy: "" },
        { name: "Espelho grande", description: "Amplia o ambiente e é funcional para se arrumar.", category: "Decoração", reserved: false, reservedBy: "" },
        { name: "Chuveiro", description: "Essencial para o banheiro.", category: "Banheiro", reserved: false, reservedBy: "" },
        { name: "Secador", description: "Para secar os cabelos com agilidade.", category: "Eletrodomésticos", reserved: false, reservedBy: "" },
        { name: "Barbeador elétrico", description: "Para o cuidado pessoal diário.", category: "Eletrodomésticos", reserved: false, reservedBy: "" },
        { name: "Porta escova de dentes", description: "Organiza as escovas de dentes na pia.", category: "Banheiro", reserved: false, reservedBy: "" },
        { name: "Saboneteira", description: "Para sabonete líquido ou em barra.", category: "Banheiro", reserved: false, reservedBy: "" },
        { name: "Varal de chão", description: "Para secar roupas com praticidade.", category: "Limpeza", reserved: false, reservedBy: "" },
        { name: "Ferro de passar", description: "Para roupas lisinhas e bem cuidadas.", category: "Eletrodomésticos", reserved: false, reservedBy: "" },
        { name: "Tábua de passar roupa", description: "Superfície para passar roupas sem amassar.", category: "Limpeza", reserved: false, reservedBy: "" },
        { name: "Aspirador de pó", description: "Praticidade para a limpeza de pisos e tapetes.", category: "Limpeza", reserved: false, reservedBy: "" },
        { name: "Escada", description: "Para alcançar lugares altos com segurança.", category: "Ferramentas", reserved: false, reservedBy: "" },
        { name: "Kit ferramentas", description: "Para pequenos reparos em casa.", category: "Ferramentas", reserved: false, reservedBy: "" },
        { name: "Robô aspirador", description: "Limpeza automática e inteligente.", category: "Eletrodomésticos", reserved: false, reservedBy: "" },
        { name: "Caixas organizadoras", description: "Ajuda a manter a casa arrumada.", category: "Organização", reserved: false, reservedBy: "" },
        { name: "Cesto de lixo grande", description: "Para a cozinha ou área de serviço.", category: "Limpeza", reserved: false, reservedBy: "" },
        { name: "Cama box casal", description: "Para noites de sono tranquilas e confortáveis.", category: "Móveis", reserved: false, reservedBy: "" },
        { name: "Guarda-roupa", description: "Para organizar as roupas do casal.", category: "Móveis", reserved: false, reservedBy: "" },
        { name: "Armário de cozinha", description: "Para guardar louças e mantimentos.", category: "Móveis", reserved: false, reservedBy: "" },
        { name: "Conjunto de mesa e cadeiras", description: "Para refeições em família.", category: "Móveis", reserved: false, reservedBy: "" },
        { name: "Sofá", description: "Conforto para a sala de estar.", category: "Móveis", reserved: false, reservedBy: "" },
        { name: "Rack de sala", description: "Para organizar a televisão e objetos.", category: "Móveis", reserved: false, reservedBy: "" },
        { name: "Jogo de cama", description: "Lençóis, fronhas e edredom para o quarto.", category: "Roupa de Cama", reserved: false, reservedBy: "" },
        { name: "Jogo de toalha de banho", description: "Toalhas macias e de qualidade.", category: "Roupa de Banho", reserved: false, reservedBy: "" },
        { name: "Jogo de toalha de rosto", description: "Para a higiene diária.", category: "Roupa de Banho", reserved: false, reservedBy: "" },
        { name: "Jogo de pano de prato", description: "Pano de prato para o dia a dia.", category: "Roupa de Cozinha", reserved: false, reservedBy: "" }
    ];

    let gifts = [...initialGifts]; // Usar uma cópia para modificação local

    const renderGiftCards = (gifts) => {
        giftGrid.innerHTML = '';
        gifts.forEach((gift, index) => {
            const giftCard = document.createElement('div');
            giftCard.className = `gift-card ${gift.reserved ? 'reserved' : ''}`;
            giftCard.dataset.id = index;

            let reservedSection = '';
            let actionButton = `<button class="btn-reserve">Reservar</button>`;

            if (gift.reserved) {
                reservedSection = `<p class="reserved-by">Reservado por: ${gift.reservedBy}</p>`;
                actionButton = `<button class="btn-cancel" data-id="${index}">Cancelar Reserva</button>`;
            }

            giftCard.innerHTML = `
                <div class="gift-content">
                    <h4 class="gift-name">${gift.name}</h4>
                    <p class="gift-description">${gift.description}</p>
                    <div class="gift-meta">
                        <span class="gift-category">${gift.category}</span>
                    </div>
                    <div class="gift-actions">
                        ${actionButton}
                    </div>
                    ${reservedSection}
                </div>
            `;
            giftGrid.appendChild(giftCard);
        });
    };

    const updateStats = (gifts) => {
        const totalGifts = gifts.length;
        const reservedGifts = gifts.filter(gift => gift.reserved).length;
        const availableGifts = totalGifts - reservedGifts;

        totalGiftsSpan.textContent = totalGifts;
        availableGiftsSpan.textContent = availableGifts;
        reservedGiftsSpan.textContent = reservedGifts;
    };

    const renderCategories = (gifts) => {
        const categories = ['all', ...new Set(gifts.map(gift => gift.category))];
        categoryFilters.innerHTML = '';
        categories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category === 'all' ? 'Todos' : category;
            button.className = `filter-btn ${category === 'all' ? 'active' : ''}`;
            button.dataset.category = category;
            categoryFilters.appendChild(button);
        });
    };

    // Persistência local (simulada)
    const saveGifts = () => {
        localStorage.setItem('weddingGifts', JSON.stringify(gifts));
    };

    const loadGifts = () => {
        const storedGifts = localStorage.getItem('weddingGifts');
        if (storedGifts) {
            gifts = JSON.parse(storedGifts);
        } else {
            saveGifts();
        }
        renderGifts();
    };

    const renderGifts = () => {
        renderGiftCards(gifts);
        updateStats(gifts);
        renderCategories(gifts);
    };

    // Event listener para abrir o modal
    giftGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.gift-card');
        if (!card) return;

        const giftId = card.dataset.id;
        const gift = gifts[giftId];

        if (gift.reserved && !e.target.classList.contains('btn-cancel')) {
            return;
        }

        if (e.target.classList.contains('btn-reserve')) {
            currentGiftId = giftId;
            modalTitle.textContent = `Reservar: ${gift.name}`;
            modalDescription.textContent = gift.description;
            giftModal.classList.add('show');
        } else if (e.target.classList.contains('btn-cancel')) {
            const guestName = gifts[giftId].reservedBy;
            if (confirm(`Deseja cancelar a reserva de ${gifts[giftId].name} feita por ${guestName}?`)) {
                gifts[giftId].reserved = false;
                gifts[giftId].reservedBy = "";
                saveGifts();
                renderGifts();
            }
        }
    });

    // Event listener para fechar o modal
    modalClose.addEventListener('click', () => {
        giftModal.classList.remove('show');
    });

    window.addEventListener('click', (e) => {
        if (e.target === giftModal) {
            giftModal.classList.remove('show');
        }
    });

    // Event listener para o formulário de reserva
    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const guestName = guestNameInput.value.trim();
        if (guestName && currentGiftId !== null) {
            gifts[currentGiftId].reserved = true;
            gifts[currentGiftId].reservedBy = guestName;
            saveGifts();
            renderGifts();
            alert(`Obrigado, ${guestName}! O presente foi reservado com sucesso.`);
            giftModal.classList.remove('show');
            guestNameInput.value = '';
            currentGiftId = null;
        }
    });

    // Event listener para filtros de categoria
    categoryFilters.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            const category = e.target.dataset.category;
            const filteredGifts = category === 'all' ? gifts : gifts.filter(gift => gift.category === category);
            renderGiftCards(filteredGifts);
        }
    });

    loadGifts();

    // Rolar para o topo da página ao carregar
    window.scrollTo(0, 0);

    // Adicionar funcionalidade do menu hamburguer
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');

    hamburgerMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburgerMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburgerMenu.classList.remove('active');
            }
        });
    });

    // Esconder tela de carregamento após 2 segundos
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        heroSection.style.opacity = 1;
    }, 2000);

});
