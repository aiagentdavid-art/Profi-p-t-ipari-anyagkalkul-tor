// Anyagnormák adatbázis
const RIGIPS_NORMS = {
    "Válaszfal": {
        "1": {
            "Gipszkarton lap (m2)": 2.1, "UW profil (fm)": 0.8, "CW profil (fm)": 2.0,
            "Gipszkarton csavar 25mm (db)": 26, "Beütő dűbel 6/40 (db)": 1.6,
            "Hézagoló gipsz (kg)": 0.8, "Hézagoló szalag (fm)": 1.6, "Rezgéscsillapító szalag (fm)": 1.2, "Szigetelő ásványgyapot (m2)": 1.0
        },
        "2": {
            "Gipszkarton lap (m2)": 4.1, "UW profil (fm)": 0.8, "CW profil (fm)": 2.0,
            "Gipszkarton csavar 25mm (db)": 12, "Gipszkarton csavar 35mm (db)": 26,
            "Beütő dűbel 6/40 (db)": 1.6, "Hézagoló gipsz (kg)": 1.3, "Hézagoló szalag (fm)": 1.6, "Rezgéscsillapító szalag (fm)": 1.2, "Szigetelő ásványgyapot (m2)": 1.0
        }
    },
    "Előtétfal": {
        "1": {
            "Gipszkarton lap (m2)": 1.05, "UD profil (fm)": 0.8, "CD profil (fm)": 2.1,
            "Gipszkarton csavar 25mm (db)": 22, "Beütő dűbel 6/40 (db)": 1.6,
            "Hézagoló gipsz (kg)": 0.5, "Hézagoló szalag (fm)": 1.6, "Rezgéscsillapító szalag (fm)": 1.2, "Direkt függesztő (db)": 1.8
        },
        "2": {
            "Gipszkarton lap (m2)": 2.1, "UD profil (fm)": 0.8, "CD profil (fm)": 2.1,
            "Gipszkarton csavar 25mm (db)": 6, "Gipszkarton csavar 35mm (db)": 22,
            "Beütő dűbel 6/40 (db)": 1.6, "Hézagoló gipsz (kg)": 0.8, "Hézagoló szalag (fm)": 1.6, "Rezgéscsillapító szalag (fm)": 1.2, "Direkt függesztő (db)": 1.8
        }
    },
    "Álmennyezet": {
        "1": {
            "Gipszkarton lap (m2)": 1.05, "CD profil (fm)": 3.2, "UD profil (fm)": 0.8,
            "Direkt függesztő (db)": 1.8, "CD toldó (db)": 0.6, "Gipszkarton csavar 25mm (db)": 18,
            "Beütő dűbel 6/40 (db)": 1.5, "Hézagoló gipsz (kg)": 0.4, "Hézagoló szalag (fm)": 0.8
        },
        "2": {
            "Gipszkarton lap (m2)": 2.1, "CD profil (fm)": 3.2, "UD profil (fm)": 0.8,
            "Direkt függesztő (db)": 1.8, "CD toldó (db)": 0.6, "Gipszkarton csavar 25mm (db)": 6, "Gipszkarton csavar 35mm (db)": 18,
            "Beütő dűbel 6/40 (db)": 1.5, "Hézagoló gipsz (kg)": 0.7, "Hézagoló szalag (fm)": 1.6
        }
    }
};

const TILING_NORMS = {
    "small_tile": { "glue": 2.5, "fuga": 0.8, "extra": 1.15 },
    "medium_tile": { "glue": 4.0, "fuga": 0.5, "extra": 1.10 },
    "large_tile": { "glue": 5.5, "fuga": 0.3, "extra": 1.10 }
};

const CONCRETE_NORMS = {
    "C12": { "cement": 250, "gravel": 1.1, "water": 130 },
    "C16": { "cement": 300, "gravel": 1.1, "water": 160 },
    "C20": { "cement": 350, "gravel": 1.1, "water": 180 }
};

// UI Kezelés
function switchTab(tab) {
    // Gombok állapota
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Szekciók elrejtése/megjelenítése
    document.getElementById('drywall-section').style.display = 'none';
    document.getElementById('tiling-section').style.display = 'none';
    document.getElementById('concrete-section').style.display = 'none';
    document.getElementById('analysis-section').style.display = 'none';
    document.getElementById('project-section').style.display = 'none';

    document.getElementById(tab + '-section').style.display = 'block';
}

// Fájlfeltöltés Kezelés
document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');

    if (dropZone) {
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length) handleFileUpload(files[0]);
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) handleFileUpload(e.target.files[0]);
        });
    }
});

async function handleFileUpload(file) {
    const status = document.getElementById('upload-status');
    const resultsDiv = document.getElementById('analysis-results');
    const listDiv = document.getElementById('analysis-list');
    
    status.innerText = `Fájl feltöltése: ${file.name}...`;
    status.style.color = "var(--primary)";

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('http://127.0.0.1:5000/upload', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.error) throw new Error(data.error);

        let resultHtml = "";
        for (const [key, val] of Object.entries(data.extracted_data)) {
            resultHtml += createResultItem(key, val, true);
        }

        listDiv.innerHTML = resultHtml;
        resultsDiv.classList.add('visible');
        status.innerText = "Elemzés sikeres!";
        status.style.color = "#4CAF50";

    } catch (e) {
        status.innerText = "Hiba az elemzés során.";
        status.style.color = "#f44336";
        console.error(e);
    }
}

// Árkalkuláció és Projektkezelés
async function fetchPrices(materials, type) {
    const status = document.getElementById(type + '-status');
    const listDiv = document.getElementById(type + '-list');
    
    if (status) {
        status.innerText = "Árak lekérése az AI segítségével...";
        status.style.color = "var(--primary)";
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/get-prices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ materials: materials })
        });
        
        const priceData = await response.json();
        if (priceData.error) throw new Error(priceData.error);

        // Árak beillesztése a listába
        const items = listDiv.querySelectorAll('.result-item');
        let totalCost = 0;

        items.forEach(item => {
            const label = item.querySelector('.result-label').innerText;
            const valueText = item.querySelector('.result-value').innerText;
            const value = parseFloat(valueText.split(' ')[0]);

            // Keresünk egyezést az AI árak között
            for (const [matName, data] of Object.entries(priceData)) {
                if (label.toLowerCase().includes(matName.toLowerCase()) || matName.toLowerCase().includes(label.toLowerCase())) {
                    const price = data.price;
                    const itemTotal = price * value;
                    totalCost += itemTotal;

                    // Hozzáadjuk az árat a UI-hoz
                    const priceInfo = document.createElement('div');
                    priceInfo.className = 'price-tag';
                    priceInfo.innerHTML = `<span>${price.toLocaleString()} ${data.unit}</span> | <b>${itemTotal.toLocaleString()} Ft</b>`;
                    item.appendChild(priceInfo);
                    break;
                }
            }
        });

        // Összesített költség megjelenítése
        const totalDiv = document.createElement('div');
        totalDiv.className = 'total-banner';
        totalDiv.innerHTML = `<h3>Becsült Anyagköltség: <span>${totalCost.toLocaleString()} Ft</span></h3>`;
        listDiv.appendChild(totalDiv);

        status.innerText = "Árak sikeresen frissítve!";
        status.style.color = "#4CAF50";

    } catch (e) {
        status.innerText = "Hiba az árak lekérésekor.";
        status.style.color = "#f44336";
        console.error(e);
    }
}

function getPricesFor(type) {
    const listDiv = document.getElementById(type + '-list');
    const items = listDiv.querySelectorAll('.result-item');
    if (!items.length) return alert("Előbb számold ki a mennyiségeket!");

    const materials = [];
    items.forEach(item => {
        const label = item.querySelector('.result-label').innerText;
        // Ne árazzuk a burkolólap darabszámát és a dobozt
        if (label.toLowerCase().includes('lapok') || label.toLowerCase().includes('doboz')) {
            return;
        }
        materials.push(label);
    });

    fetchPrices(materials, type);
}

function calculate(type) {
    let resultHtml = "";
    let resultsDiv = document.getElementById(type + '-results');
    let listDiv = document.getElementById(type + '-list');

    if (type === 'drywall') {
        const structuralType = document.getElementById('drywall-type').value;
        const layers = document.getElementById('drywall-layers').value;
        const area = parseFloat(document.getElementById('drywall-area').value);
        if (isNaN(area)) return alert("Add meg a területet!");

        const norm = RIGIPS_NORMS[structuralType][layers];
        for (const [mat, rate] of Object.entries(norm)) {
            let value = rate * area;
            let finalMat = mat;
            if (mat.includes('(db)')) {
                if (mat.includes('csavar')) {
                    finalMat = mat.replace('(db)', '(doboz, 1000 db)');
                    value = Math.ceil(value / 1000);
                } else {
                    finalMat = mat.replace('(db)', '(doboz, 100 db)');
                    value = Math.ceil(value / 100);
                }
            } else {
                value = value.toFixed(2);
            }
            resultHtml += createResultItem(finalMat, value);
        }
    } 
    else if (type === 'tiling') {
        const area = parseFloat(document.getElementById('tiling-area').value);
        const w = parseFloat(document.getElementById('tile-w').value);
        const h = parseFloat(document.getElementById('tile-h').value);
        const wastage = parseFloat(document.getElementById('tiling-wastage').value) || 0;
        const boxSize = parseFloat(document.getElementById('tile-box').value);
        
        if (isNaN(area)) return alert("Add meg a területet!");

        // Ragasztó becslés méret alapján
        const maxDim = Math.max(w, h);
        let glueRate = 4.0;
        let fugaRate = 0.5;

        if (maxDim <= 20) { glueRate = 2.5; fugaRate = 0.8; }
        else if (maxDim > 45) { glueRate = 5.5; fugaRate = 0.3; }

        const totalArea = area * (1 + (wastage / 100));
        const tileAreaM2 = (w * h) / 10000;
        const tileCount = Math.ceil(totalArea / tileAreaM2);

        resultHtml += createResultItem("Burkolólap (m2)", totalArea.toFixed(2));
        resultHtml += createResultItem("Lapok darabszáma (db)", tileCount);
        if (!isNaN(boxSize) && boxSize > 0) {
            resultHtml += createResultItem("Szükséges doboz (db)", Math.ceil(totalArea / boxSize));
        }
        resultHtml += createResultItem("Csemperagasztó (kg)", (area * glueRate).toFixed(2));
        resultHtml += createResultItem("Fugázóanyag (kg)", (area * fugaRate).toFixed(2));
    }
    else if (type === 'concrete') {
        const strength = document.getElementById('concrete-strength').value;
        const l = parseFloat(document.getElementById('conc-l').value);
        const w = parseFloat(document.getElementById('conc-w').value);
        const t = parseFloat(document.getElementById('conc-t').value);

        if (isNaN(l) || isNaN(w) || isNaN(t)) return alert("Minden méretet adj meg!");

        const volume = l * w * (t / 100);
        const norm = CONCRETE_NORMS[strength];

        resultHtml += createResultItem("Összköbméter (m3)", volume.toFixed(2));
        resultHtml += createResultItem("Cement (kg)", (volume * norm.cement).toFixed(2));
        resultHtml += createResultItem("Cement (25kg zsák)", Math.ceil((volume * norm.cement) / 25));
        resultHtml += createResultItem("Sóder (m3)", (volume * norm.gravel).toFixed(2));
        resultHtml += createResultItem("Víz (liter)", (volume * norm.water).toFixed(2));
    }

    listDiv.innerHTML = resultHtml;
    resultsDiv.classList.add('visible');
}

function createResultItem(label, value, isAnalysis = false) {
    if (!isAnalysis) {
        return `<div class="result-item">
                    <span class="result-label">${label}</span>
                    <span class="result-value">${value}</span>
                </div>`;
    }

    // --- Okos előválasztás a "label" alapján ---
    let defaultType = 'drywall';
    let defaultDwType = 'Válaszfal';
    let defaultDwLayer = '1';
    let defaultTileW = '';
    let defaultTileH = '';
    let showTiling = 'none';
    let showDrywall = 'flex';
    let showConcrete = 'none';

    // Normalizing string somewhat to handle encoding issues
    const lbl = label.toLowerCase();
    
    // Típus eldöntése
    if (lbl.includes('burkol') || lbl.includes('csempe') || lbl.includes('járólap')) {
        defaultType = 'tiling';
        showTiling = 'flex';
        showDrywall = 'none';
        
        // Csempe méret kinyerése regex segítségével (pl. 30x60 vagy 30*60)
        const dimMatch = lbl.match(/(\d+)\s*[xX\*]\s*(\d+)/);
        if (dimMatch) {
            defaultTileW = dimMatch[1];
            defaultTileH = dimMatch[2];
        }
    } else if (lbl.includes('beton') || lbl.includes('aljzat') || lbl.includes('sóder')) {
        defaultType = 'concrete';
        showConcrete = 'block';
        showDrywall = 'none';
    }
    
    // Gipszkarton részletek
    if (lbl.includes('mennyezet')) defaultDwType = 'Álmennyezet';
    else if (lbl.includes('tétfal') || lbl.includes('előtét')) defaultDwType = 'Előtétfal';
    
    if (lbl.includes('2 r') || lbl.includes('kétréteg') || lbl.includes('dupla')) {
        defaultDwLayer = '2';
    }

    const uniqueId = 'calc-' + Math.random().toString(36).substr(2, 9);
    
    return `<div class="result-item" style="flex-wrap: wrap;">
                <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                    <span class="result-label">${label}</span>
                    <div style="display: flex; gap: 1rem; align-items: center;">
                        <span class="result-value" id="val-${uniqueId}">${value}</span>
                        <button class="btn-primary" style="padding: 0.3rem 0.8rem; font-size: 0.8rem; width: auto;" onclick="toggleInlineCalc('${uniqueId}')">Kalkulálom</button>
                    </div>
                </div>
                <div id="panel-${uniqueId}" class="inline-calc-panel" style="display: none; width: 100%; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1);">
                    <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                        <select id="type-${uniqueId}" style="flex: 1; padding: 0.5rem; background: rgba(0,0,0,0.2); border: 1px solid var(--primary); color: white; border-radius: 5px;">
                            <option value="drywall" ${defaultType === 'drywall' ? 'selected' : ''}>Gipszkarton</option>
                            <option value="tiling" ${defaultType === 'tiling' ? 'selected' : ''}>Burkolás</option>
                            <option value="concrete" ${defaultType === 'concrete' ? 'selected' : ''}>Betonozás (m3 számítás)</option>
                        </select>
                        <button class="btn-secondary" style="padding: 0.5rem; width: auto;" onclick="runInlineCalc('${uniqueId}')">Számol</button>
                    </div>
                    <!-- Extra opciók (dinamikusan mutatjuk) -->
                    <div id="opts-drywall-${uniqueId}" style="display: ${showDrywall}; gap: 1rem; margin-bottom: 1rem;">
                        <select id="dw-type-${uniqueId}" style="background: rgba(0,0,0,0.2); border: 1px solid var(--primary); color: white; border-radius: 5px; padding: 0.3rem;">
                            <option value="Válaszfal" ${defaultDwType === 'Válaszfal' ? 'selected' : ''}>Válaszfal</option>
                            <option value="Előtétfal" ${defaultDwType === 'Előtétfal' ? 'selected' : ''}>Előtétfal</option>
                            <option value="Álmennyezet" ${defaultDwType === 'Álmennyezet' ? 'selected' : ''}>Álmennyezet</option>
                        </select>
                        <select id="dw-layer-${uniqueId}" style="background: rgba(0,0,0,0.2); border: 1px solid var(--primary); color: white; border-radius: 5px; padding: 0.3rem;">
                            <option value="1" ${defaultDwLayer === '1' ? 'selected' : ''}>1 réteg</option>
                            <option value="2" ${defaultDwLayer === '2' ? 'selected' : ''}>2 réteg</option>
                        </select>
                    </div>
                    <div id="opts-tiling-${uniqueId}" style="display: ${showTiling}; gap: 0.5rem; margin-bottom: 1rem;">
                        <input type="number" id="t-w-${uniqueId}" placeholder="Szél (cm)" value="${defaultTileW}" style="width: 60px; padding: 0.3rem;">
                        <input type="number" id="t-h-${uniqueId}" placeholder="Mag (cm)" value="${defaultTileH}" style="width: 60px; padding: 0.3rem;">
                        <input type="number" id="t-waste-${uniqueId}" value="10" title="Ráhagyás %" style="width: 60px; padding: 0.3rem;">
                    </div>
                    <div id="opts-concrete-${uniqueId}" style="display: ${showConcrete}; gap: 0.5rem; margin-bottom: 1rem;">
                        <select id="c-str-${uniqueId}" style="background: rgba(0,0,0,0.2); border: 1px solid var(--primary); color: white; border-radius: 5px; padding: 0.3rem;">
                            <option value="C12">C12/15 - Alap</option>
                            <option value="C16" selected>C16/20 - Aljzat</option>
                            <option value="C20">C20/25 - Vasbeton</option>
                        </select>
                        <input type="number" id="c-t-${uniqueId}" placeholder="Vtg (cm)" value="5" title="Betonvastagság" style="width: 70px; padding: 0.3rem;">
                    </div>
                    
                    <div id="res-${uniqueId}" style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px;">Még nincs kiszámolva...</div>
                </div>
            </div>`;
}

function toggleInlineCalc(id) {
    const panel = document.getElementById('panel-' + id);
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    
    // Select change esemény bekötése a panelek váltásához
    const typeSelect = document.getElementById('type-' + id);
    typeSelect.onchange = function() {
        document.getElementById('opts-drywall-' + id).style.display = this.value === 'drywall' ? 'flex' : 'none';
        document.getElementById('opts-tiling-' + id).style.display = this.value === 'tiling' ? 'flex' : 'none';
        document.getElementById('opts-concrete-' + id).style.display = this.value === 'concrete' ? 'flex' : 'none';
    };
}

function runInlineCalc(id) {
    const type = document.getElementById('type-' + id).value;
    const valueText = document.getElementById('val-' + id).innerText;
    // Megpróbáljuk kinyerni az első számot a szövegből (pl. "15 m2" -> 15)
    const match = valueText.match(/[\d\.]+/);
    if (!match) return alert("Nem található érvényes mennyiség!");
    const area = parseFloat(match[0]);
    
    let resHtml = "";
    
    if (type === 'drywall') {
        const structuralType = document.getElementById('dw-type-' + id).value;
        const layers = document.getElementById('dw-layer-' + id).value;
        const norm = RIGIPS_NORMS[structuralType][layers];
        for (const [mat, rate] of Object.entries(norm)) {
            let value = rate * area;
            let finalMat = mat;
            if (mat.includes('(db)')) {
                if (mat.includes('csavar')) {
                    finalMat = mat.replace('(db)', '(doboz, 1000 db)');
                    value = Math.ceil(value / 1000);
                } else {
                    finalMat = mat.replace('(db)', '(doboz, 100 db)');
                    value = Math.ceil(value / 100);
                }
            } else {
                value = value.toFixed(2);
            }
            resHtml += `<div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 0.2rem 0; border-bottom: 1px dotted rgba(255,255,255,0.2);"><span>${finalMat}</span> <b>${value}</b></div>`;
        }
    } else if (type === 'tiling') {
        const w = parseFloat(document.getElementById('t-w-' + id).value) || 60;
        const h = parseFloat(document.getElementById('t-h-' + id).value) || 60;
        const wastage = parseFloat(document.getElementById('t-waste-' + id).value) || 0;
        
        const maxDim = Math.max(w, h);
        let glueRate = 4.0; let fugaRate = 0.5;
        if (maxDim <= 20) { glueRate = 2.5; fugaRate = 0.8; }
        else if (maxDim > 45) { glueRate = 5.5; fugaRate = 0.3; }
        
        const totalArea = area * (1 + (wastage / 100));
        const tileAreaM2 = (w * h) / 10000;
        const tileCount = Math.ceil(totalArea / tileAreaM2);
        
        resHtml += `<div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 0.2rem 0; border-bottom: 1px dotted rgba(255,255,255,0.2);"><span>Burkolólap (m2)</span> <b>${totalArea.toFixed(2)}</b></div>`;
        resHtml += `<div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 0.2rem 0; border-bottom: 1px dotted rgba(255,255,255,0.2);"><span>Lapok (db)</span> <b>${tileCount}</b></div>`;
        resHtml += `<div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 0.2rem 0; border-bottom: 1px dotted rgba(255,255,255,0.2);"><span>Ragasztó (kg)</span> <b>${(area * glueRate).toFixed(2)}</b></div>`;
        resHtml += `<div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 0.2rem 0; border-bottom: 1px dotted rgba(255,255,255,0.2);"><span>Fugázó (kg)</span> <b>${(area * fugaRate).toFixed(2)}</b></div>`;
    } else if (type === 'concrete') {
        const strength = document.getElementById('c-str-' + id).value;
        const t = parseFloat(document.getElementById('c-t-' + id).value) || 5;
        
        // A kinyert adat lehet darabszám (pl. 2 db lépcsőfok) vagy m2 vagy folyóméter, 
        // egyelőre "area"-ként kezeljük, de felülírjuk egy vastagsággal (t cm). 
        // Ha darabról van szó (pl. Ajzat betonozás: 2 db -> ezt a prompt javítása talán m2-re módosítja).
        // Ebben az inline kalkulátorban a megadott számot megszorozzuk a vastagság/100-zal köbméterhez.
        const volume = area * (t / 100);
        const norm = CONCRETE_NORMS[strength];
        
        resHtml += `<div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 0.2rem 0; border-bottom: 1px dotted rgba(255,255,255,0.2);"><span>Összköbméter (m3)</span> <b>${volume.toFixed(2)}</b></div>`;
        resHtml += `<div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 0.2rem 0; border-bottom: 1px dotted rgba(255,255,255,0.2);"><span>Cement (kg)</span> <b>${(volume * norm.cement).toFixed(2)}</b></div>`;
        resHtml += `<div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 0.2rem 0; border-bottom: 1px dotted rgba(255,255,255,0.2);"><span>Cement (25kg zsák)</span> <b>${Math.ceil((volume * norm.cement) / 25)}</b></div>`;
        resHtml += `<div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 0.2rem 0; border-bottom: 1px dotted rgba(255,255,255,0.2);"><span>Sóder (m3)</span> <b>${(volume * norm.gravel).toFixed(2)}</b></div>`;
        resHtml += `<div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 0.2rem 0; border-bottom: 1px dotted rgba(255,255,255,0.2);"><span>Víz (liter)</span> <b>${(volume * norm.water).toFixed(2)}</b></div>`;
    }
    
    // Gomb hozzáadása a Kosárhoz (inline)
    resHtml += `<button class="btn-secondary" onclick="addToProject('res-${id}')" style="margin-top: 1rem; width: 100%; background: rgba(197, 155, 39, 0.2); border-color: rgba(197, 155, 39, 0.5); color: #c59b27; padding: 0.4rem;">➕ Kosárba</button>`;
    
    document.getElementById('res-' + id).innerHTML = resHtml;
}

async function aiExtract() {
    const url = document.getElementById('ai-url').value;
    const status = document.getElementById('ai-status');
    
    if (!url) return alert("Másolj be egy linket!");
    
    status.innerText = "AI elemzés folyamatban... (Link olvasása a szerveren)";
    status.style.color = "var(--primary)";

    try {
        const response = await fetch('http://127.0.0.1:5000/extract', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url })
        });
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }

        if (data.width) document.getElementById('tile-w').value = data.width;
        if (data.height) document.getElementById('tile-h').value = data.height;
        if (data.m2_per_box) {
            document.getElementById('tile-box').value = data.m2_per_box;
            document.getElementById('box-info-group').style.display = 'block';
        }

        status.innerText = `Sikeres AI kinyerés: ${data.product_name || 'Termék'} (${data.width}x${data.height} cm)`;
        status.style.color = "#4CAF50";
        
    } catch (e) {
        status.innerText = "Hiba: A szerver nem válaszol. Indítsd el a server.py-t!";
        status.style.color = "#f44336";
        console.error(e);
    }
}

// --- PROJEKT KOSÁR LOGIKA ---
let projectCartItems = {};

function extractItemsFromContainer(container) {
    let items = [];
    
    // Fő kalkulátorok kivezetése (result-item osztály alapján)
    const mainItems = container.querySelectorAll('.result-item');
    mainItems.forEach(item => {
        const labelEl = item.querySelector('.result-label');
        const valueEl = item.querySelector('.result-value');
        if (labelEl && valueEl && !item.querySelector('select')) { 
            items.push({ name: labelEl.innerText.trim(), amount: valueEl.innerText.trim() });
        }
    });

    // Inline kalkulátorok kivezetése (ahol sima div > span + b pár van, pl. resHtml)
    if (mainItems.length === 0) {
        const inlineRows = container.querySelectorAll('div[style*="justify-content: space-between"]');
        inlineRows.forEach(row => {
            const spans = row.querySelectorAll('span, b');
            if (spans.length >= 2) {
                const label = spans[0].innerText.trim();
                const val = spans[1].innerText.trim();
                items.push({ name: label, amount: val });
            }
        });
    }
    
    return items;
}

function addToProject(containerId) {
    const listDiv = document.getElementById(containerId);
    if (!listDiv) return;
    
    let items = extractItemsFromContainer(listDiv);
    
    if (items.length === 0) return alert("Nincs hozzáadható anyag! Számolj ki előbb valamit.");

    let addedCount = 0;
    items.forEach(item => {
        // Alapértelmezett match a szám megszerzésére a szövegből (pl. "25.00", "12")
        const numMatch = item.amount.match(/[\d\.]+/);
        if (numMatch) {
            const val = parseFloat(numMatch[0]);
            
            // Ha már volt, hozzáadjuk az értékhez
            if (!projectCartItems[item.name]) {
                projectCartItems[item.name] = 0;
            }
            projectCartItems[item.name] += val;
            addedCount++;
        }
    });
    
    if (addedCount > 0) {
        updateCartIcon();
        renderCart();
        alert(`Sikeresen hozzáadva a Projekt Kosárhoz! 🛒`);
    }
}

function updateCartIcon() {
    const countSpan = document.getElementById('cart-count');
    if (countSpan) {
        const keys = Object.keys(projectCartItems);
        // Válaszuk ki, hogy a darabszámot jelenítsük meg
        countSpan.innerText = keys.length;
        if (keys.length > 0) {
            countSpan.parentElement.style.color = '#FF9800';
            countSpan.parentElement.style.fontWeight = 'bold';
        } else {
            countSpan.parentElement.style.color = 'inherit';
            countSpan.parentElement.style.fontWeight = 'normal';
        }
    }
}

function renderCart() {
    const cartList = document.getElementById('project-list');
    const actions = document.getElementById('project-actions');
    const emptyMsg = document.getElementById('empty-cart-msg');
    
    const keys = Object.keys(projectCartItems);
    
    // Ha üres kosár
    if (keys.length === 0) {
        if (emptyMsg) emptyMsg.style.display = 'block';
        if (actions) actions.style.display = 'none';
        
        cartList.innerHTML = '';
        if (emptyMsg) cartList.appendChild(emptyMsg);
        return;
    }
    
    if (emptyMsg) emptyMsg.style.display = 'none';
    if (actions) actions.style.display = 'block';
    
    let html = '';
    keys.forEach(name => {
        let valStr = projectCartItems[name];
        // Kerekítés felesleg elkerülésére (ha int, nem kell tizedesjegy)
        if (!Number.isInteger(valStr)) valStr = valStr.toFixed(2);
        
        html += `<div class="result-item" style="border-left: 3px solid rgba(212, 175, 55, 0.5); padding-left: 10px;">
                    <span class="result-label">${name}</span>
                    <span class="result-value">${valStr}</span>
                 </div>`;
    });
    
    cartList.innerHTML = html;
}

function clearProjectCart() {
    if (confirm("Biztosan törlöd a kosár tartalmát?")) {
        projectCartItems = {};
        updateCartIcon();
        renderCart();
        
        // Összegző banner és AI árak törlése a UI-ról
        const cartList = document.getElementById('project-list');
        const banners = cartList.querySelectorAll('.total-banner');
        banners.forEach(b => b.remove());
        
        const status = document.getElementById('project-status');
        if (status) status.innerText = '';
    }
}

function getPricesForProject() {
    const listDiv = document.getElementById('project-list');
    const items = listDiv.querySelectorAll('.result-item');
    if (!items.length) return alert("A kosár üres!");

    const materials = [];
    items.forEach(item => {
        const label = item.querySelector('.result-label').innerText;
        // Ne árazzuk a burkolólap darabszámát és a dobozt a projektkosárban sem
        if (label.toLowerCase().includes('lapok') || label.toLowerCase().includes('doboz')) {
            return;
        }
        materials.push(label);
    });

    fetchPrices(materials, 'project');
}

// PDF Exportálás API (Backend)
async function exportToPDF() {
    const listDiv = document.getElementById('project-list');
    const items = listDiv.querySelectorAll('.result-item');
    if (!items.length) {
        alert("A kosár üres, nincs mit exportálni!");
        return;
    }

    // Gomb vizuális letiltása töltés alatt
    const btn = document.querySelector('button[onclick="exportToPDF()"]');
    const origText = btn.innerText;
    btn.innerText = "⏳ Generálás folyamatban...";
    btn.disabled = true;

    try {
        let exportData = [];
        let grandTotal = 0;
        
        items.forEach(item => {
            const name = item.querySelector('.result-label').innerText;
            const amount = item.querySelector('.result-value').innerText;
            
            let priceText = "-";
            let totalText = "-";
            
            const priceTag = item.querySelector('.price-tag');
            if (priceTag) {
                const spanText = priceTag.querySelector('span').innerText;
                const bText = priceTag.querySelector('b').innerText;
                priceText = spanText;
                totalText = bText;
                
                const numPart = bText.replace(/[^\d]/g, '');
                if (numPart) {
                    grandTotal += parseInt(numPart);
                }
            }
            
            exportData.push({
                name: name,
                amount: amount,
                price: priceText,
                total: totalText
            });
        });

        const response = await fetch('http://127.0.0.1:5000/api/generate-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: exportData, total_cost: grandTotal })
        });

        if (!response.ok) {
            throw new Error(`Szerver hiba: ${response.statusText}`);
        }

        // Fájl letöltése blobból
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'Epitoipari_Arajanlat_Projekt.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
    } catch (error) {
        console.error("PDF Export hiba:", error);
        alert("Hiba történt a PDF generálása során: " + error.message);
    } finally {
        btn.innerText = origText;
        btn.disabled = false;
    }
}
