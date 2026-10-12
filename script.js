function getRandomCardData() {
    const mena = ["Marek Horváth", "Lucia Vargová", "Tomáš Kováč", "Katarína Novotná", "Peter Ďuriš", "Michal Lukáč", "Veronika Blašková", "Andrej Gábor"];
    const firmy = ["Stavotech, s.r.o.", "BuildMaster, a.s.", "Apex Construct", "GeoMont, s.r.o.", "HighWork SK", "Vertical Pro s.r.o."];
    const skolitelia = ["Ing. Zuzana Hubinská", "Ing. Milan Krtko, PhD.", "Mgr. Robert Švec", "Ing. Pavol Hruška"];
    const druhy = ["Opakované", "Vstupné", "Mimoriadne"];

    return {
        id: Date.now() + Math.floor(Math.random() * 1000),
        druh: druhy[Math.floor(Math.random() * druhy.length)],
        rozsah: "Práce vo výškach a nad voľnou hĺbkou s využitím kolektívneho zabezpečenia (lešenia, plošiny, zábradlia); Práce vo výškach s osobným zabezpečením (postroje, laná)",
        datumSkolenia: "15.5.2026",
        platnost: "14.5.2027",
        skolitel: skolitelia[Math.floor(Math.random() * skolitelia.length)],
        cisloDokladu: Math.floor(100 + Math.random() * 899) + "/2026",
        meno: mena[Math.floor(Math.random() * mena.length)],
        datumNarodenia: "12.4.1985",
        zamestnavatel: firmy[Math.floor(Math.random() * firmy.length)]
    };
}

let cardsData = JSON.parse(localStorage.getItem('captainandrej_cards')) || [getRandomCardData()];
let activeCardId = cardsData[0] ? cardsData[0].id : 1;
let currentTheme = localStorage.getItem('captainandrej_theme') || 'dark';
let currentZoom = 1.0;
let searchQuery = "";

setTheme(currentTheme);

function saveToStorage() {
    localStorage.setItem('captainandrej_cards', JSON.stringify(cardsData));
    updateStats();
}

function updateStats() {
    const countEl = document.getElementById('totalCardsCount');
    const pagesEl = document.getElementById('totalPagesCount');
    if (countEl && pagesEl) {
        countEl.textContent = cardsData.length;
        pagesEl.textContent = Math.ceil(cardsData.length / 3);
    }
}

function setTheme(mode) {
    currentTheme = mode;
    localStorage.setItem('captainandrej_theme', mode);
    const lightBtn = document.getElementById('lightThemeBtn');
    const darkBtn = document.getElementById('darkThemeBtn');
    
    if (mode === 'dark') {
        document.body.classList.add('dark-mode');
        darkBtn.classList.add('active');
        lightBtn.classList.remove('active');
    } else {
        document.body.classList.remove('dark-mode');
        lightBtn.classList.add('active');
        darkBtn.classList.remove('active');
    }
}

function changeZoom(delta) {
    currentZoom = Math.min(Math.max(0.5, currentZoom + delta), 2.0);
    applyZoom();
}

function resetZoom() {
    currentZoom = 1.0;
    applyZoom();
}

function applyZoom() {
    const container = document.getElementById('cardsContainer');
    const zoomText = document.getElementById('zoomVal');
    if (container && zoomText) {
        container.style.transform = `scale(${currentZoom})`;
        zoomText.textContent = `${Math.round(currentZoom * 100)}%`;
    }
}

function filterCards() {
    searchQuery = document.getElementById('searchInput').value.toLowerCase().trim();
    renderApp();
}

function autoFillDates() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    
    const startDate = `${day}.${month}.${year}`;
    const endDate = `${day - 1 > 0 ? day - 1 : day}.${month}.${year + 1}`;

    document.getElementById('bulkDatum').value = startDate;
    document.getElementById('bulkPlatnost').value = endDate;
}

/* MODAL TOGGLE & SPEECH BUBBLE INTERVAL */
function toggleHelpModal() {
    const modal = document.getElementById('helpModalOverlay');
    if (modal) {
        modal.classList.toggle('active');
        // Hide badge when opened once
        const badge = document.getElementById('helpBadge');
        if (badge) badge.style.display = 'none';
    }
}

function closeModalOnOverlay(e) {
    if (e.target.id === 'helpModalOverlay') {
        toggleHelpModal();
    }
}

function showHelpBubble() {
    const bubble = document.getElementById('helpSpeechBubble');
    if (bubble) {
        bubble.classList.add('visible');
        setTimeout(() => {
            bubble.classList.remove('visible');
        }, 8000); // Hide after 8 seconds
    }
}

// Initial delay pop-up after 3s, then every 2 minutes (120 000 ms)
setTimeout(showHelpBubble, 3000);
setInterval(showHelpBubble, 120000);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('helpModalOverlay');
        if (modal && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    }
});

function renderApp() {
    const container = document.getElementById('cardsContainer');
    const listContainer = document.getElementById('cardsListContainer');
    
    container.innerHTML = '';
    listContainer.innerHTML = '';

    const filteredCards = cardsData.filter(card => {
        if (!searchQuery) return true;
        return (card.meno && card.meno.toLowerCase().includes(searchQuery)) ||
               (card.zamestnavatel && card.zamestnavatel.toLowerCase().includes(searchQuery)) ||
               (card.cisloDokladu && card.cisloDokladu.toLowerCase().includes(searchQuery));
    });

    filteredCards.forEach((card, index) => {
        if (index > 0 && index % 3 === 0) {
            const pageDivider = document.createElement('div');
            pageDivider.style.cssText = "margin: 8px 0; border-top: 2px dashed #94a3b8; position: relative; width: 100%;";
            pageDivider.innerHTML = `<span style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #e2e8f0; padding: 2px 8px; font-size: 10px; color: #475569; font-weight: bold; border-radius: 6px;">New A4 Page</span>`;
            listContainer.appendChild(pageDivider);
        }

        const thumb = document.createElement('div');
        thumb.className = `card-item-thumb ${card.id === activeCardId ? 'active' : ''}`;
        thumb.innerHTML = `
            <div class="thumb-title-group">
                <span class="thumb-badge">#${index + 1}</span>
                <span class="thumb-name">${card.meno || 'Untitled'}</span>
            </div>
            <div class="thumb-actions">
                <button class="btn-icon-sm" onclick="duplicateCard(event, ${card.id})" title="Duplicate">Copy</button>
                ${cardsData.length > 1 ? `<button class="btn-icon-sm danger" onclick="deleteCard(event, ${card.id})" title="Delete">&times;</button>` : ''}
            </div>
        `;
        thumb.onclick = (e) => {
            if(!e.target.classList.contains('btn-icon-sm')) {
                activeCardId = card.id;
                renderApp();
                const targetCard = document.getElementById(`card-${card.id}`);
                if(targetCard) targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        };
        listContainer.appendChild(thumb);

        const cardWrapper = document.createElement('div');
        cardWrapper.className = 'card-wrapper';
        cardWrapper.id = `card-${card.id}`;
        
        cardWrapper.innerHTML = `
            <div class="card-side">
                <div class="left-side-container">
                    <div>
                        <h3>PODROBNOSTI O ŠKOLENÍ</h3>
                        <div class="top-section">
                            <div class="field-group inline">
                                <span class="label">Druh oboznamovania:</span>
                                <span contenteditable="true" class="editable" data-id="${card.id}" data-key="druh">${card.druh}</span>
                            </div>
                            <div class="field-group block">
                                <span class="label">Rozsah školenia:</span>
                                <span contenteditable="true" class="editable" data-id="${card.id}" data-key="rozsah">${card.rozsah}</span>
                            </div>
                        </div>
                    </div>

                    <div class="bottom-section">
                        <div class="field-group inline">
                            <span class="label">Dátum školenia:</span>
                            <span contenteditable="true" class="editable" data-id="${card.id}" data-key="datumSkolenia">${card.datumSkolenia}</span>
                        </div>
                        <div class="field-group inline">
                            <span class="label">Platnosť dokladu do:</span>
                            <span contenteditable="true" class="editable" data-id="${card.id}" data-key="platnost">${card.platnost}</span>
                        </div>
                        <div class="field-group inline">
                            <span class="label">Školiteľ / BT:</span>
                            <span contenteditable="true" class="editable" data-id="${card.id}" data-key="skolitel">${card.skolitel}</span>
                        </div>
                    </div>

                    <div class="signature-line">
                        <span>Podpis a pečiatka BT</span>
                    </div>
                </div>
            </div>

            <div class="card-side">
                <div class="header-group">
                    <h3>DOKLAD O ABSOLVOVANÍ OBOZNÁMOVANIA</h3>
                    <span class="subtitle">pre práce vo výškach a nad voľnou hĺbkou</span>
                    <span class="law">(v zmysle § 7 zákona č. 124/2006 Z. z. a vyhlášky MPSVR SR č. 147/2013 Z. z.)</span>
                </div>

                <div class="content-group">
                    <div class="field-group inline">
                        <span class="label">Číslo dokladu:</span>
                        <span contenteditable="true" class="editable" data-id="${card.id}" data-key="cisloDokladu">${card.cisloDokladu}</span>
                    </div>
                    <div class="field-group inline">
                        <span class="label">Titul, Meno, Priezvisko:</span>
                        <span contenteditable="true" class="editable highlight" data-id="${card.id}" data-key="meno">${card.meno}</span>
                    </div>
                    <div class="field-group inline">
                        <span class="label">Dátum narodenia:</span>
                        <span contenteditable="true" class="editable" data-id="${card.id}" data-key="datumNarodenia">${card.datumNarodenia}</span>
                    </div>
                    <div class="field-group inline">
                        <span class="label">Zamestnávateľ:</span>
                        <span contenteditable="true" class="editable" data-id="${card.id}" data-key="zamestnavatel">${card.zamestnavatel}</span>
                    </div>
                </div>

                <div></div> 
            </div>
        `;
        container.appendChild(cardWrapper);
    });

    document.querySelectorAll('.editable').forEach(el => {
        el.addEventListener('input', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const key = e.target.getAttribute('data-key');
            const card = cardsData.find(c => c.id === id);
            if (card) {
                card[key] = e.target.innerText;
                saveToStorage();
            }
        });

        if (el.getAttribute('data-key') === 'meno') {
            el.addEventListener('blur', () => {
                renderApp();
            });
        }
    });

    updateStats();
}

document.getElementById('addCardBtn').addEventListener('click', () => {
    const lastCard = cardsData[cardsData.length - 1];
    const newId = Date.now();
    
    let nextDocNum = "102/2026";
    if (lastCard && lastCard.cisloDokladu) {
        const parts = lastCard.cisloDokladu.split('/');
        if (!isNaN(parts[0])) {
            nextDocNum = (parseInt(parts[0]) + 1) + (parts[1] ? '/' + parts[1] : '');
        }
    }

    const newCard = {
        id: newId,
        druh: lastCard ? lastCard.druh : "Opakované",
        rozsah: lastCard ? lastCard.rozsah : "",
        datumSkolenia: lastCard ? lastCard.datumSkolenia : "",
        platnost: lastCard ? lastCard.platnost : "",
        skolitel: lastCard ? lastCard.skolitel : "",
        cisloDokladu: nextDocNum,
        meno: "New Employee",
        datumNarodenia: "",
        zamestnavatel: lastCard ? lastCard.zamestnavatel : ""
    };

    cardsData.push(newCard);
    activeCardId = newId;
    saveToStorage();
    renderApp();
});

window.duplicateCard = function(e, id) {
    e.stopPropagation();
    const cardToCopy = cardsData.find(c => c.id === id);
    if (!cardToCopy) return;

    const newId = Date.now();
    const duplicated = { 
        ...cardToCopy, 
        id: newId, 
        meno: cardToCopy.meno + " (Copy)" 
    };

    cardsData.push(duplicated);
    activeCardId = newId;
    saveToStorage();
    renderApp();
}

window.deleteCard = function(e, id) {
    e.stopPropagation();
    if (cardsData.length <= 1) return;
    cardsData = cardsData.filter(c => c.id !== id);
    activeCardId = cardsData[cardsData.length - 1].id;
    saveToStorage();
    renderApp();
}

window.applyBulkUpdate = function() {
    const datum = document.getElementById('bulkDatum').value.trim();
    const platnost = document.getElementById('bulkPlatnost').value.trim();
    const skolitel = document.getElementById('bulkSkolitel').value.trim();
    const zamestnavatel = document.getElementById('bulkZamestnavatel').value.trim();
    const cisloDokladu = document.getElementById('bulkCisloDokladu').value.trim();

    if (!datum && !platnost && !skolitel && !zamestnavatel && !cisloDokladu) {
        alert("Please enter at least one field for batch update.");
        return;
    }

    cardsData.forEach(card => {
        if (datum) card.datumSkolenia = datum;
        if (platnost) card.platnost = platnost;
        if (skolitel) card.skolitel = skolitel;
        if (zamestnavatel) card.zamestnavatel = zamestnavatel;
        if (cisloDokladu) card.cisloDokladu = cisloDokladu;
    });

    saveToStorage();
    renderApp();
    alert("Updated all cards successfully.");
}

window.exportDataJSON = function() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cardsData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cards_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

window.importDataJSON = function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const imported = JSON.parse(event.target.result);
            if (Array.isArray(imported) && imported.length > 0) {
                cardsData = imported;
                activeCardId = cardsData[0].id;
                saveToStorage();
                renderApp();
                alert("Workspace restored from file.");
            } else {
                alert("Invalid file structure.");
            }
        } catch (err) {
            alert("Error parsing file.");
        }
    };
    reader.readAsText(file);
}

window.resetAllData = function() {
    if (confirm("Reset workspace to initial state? All unsaved data will be lost.")) {
        localStorage.removeItem('captainandrej_cards');
        cardsData = [getRandomCardData()];
        activeCardId = cardsData[0].id;
        renderApp();
    }
}

renderApp();