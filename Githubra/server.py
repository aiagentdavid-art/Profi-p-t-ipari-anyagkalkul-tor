rom flask import Flask, request, jsonify, send_file, render_template
from flask_cors import CORS
from ai_extractor import extract_product_data
from file_analyzer import analyze_file
from price_searcher import search_material_prices
from pdf_generator import generate_quote_pdf
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
CORS(app)
@app.route('/')
def home():
    return render_template('index.html')
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/get-prices', methods=['POST'])
def get_prices():
    data = request.json
    materials = data.get('materials')
    if not materials:
        return jsonify({"error": "Anyaglista szükséges"}), 400
    
    print(f"Árkeresés indítása: {materials}")
    result = search_material_prices(materials)
    return jsonify(result)

@app.route('/extract', methods=['POST'])
def extract():
    # ... (marad a régi)
    data = request.json
    url = data.get('url')
    if not url:
        return jsonify({"error": "URL szükséges"}), 400
    
    print(f"Elemzés indítása: {url}")
    result = extract_product_data(url)
    return jsonify(result)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "Nincs fájl"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Nincs kiválasztott fájl"}), 400
    
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    
    print(f"Fájl fogadva: {filename}")
    result = analyze_file(filepath, file.content_type)
    
    
    # Opcionális: fájl törlése elemzés után
    # os.remove(filepath)
    
    return jsonify({"extracted_data": result})

@app.route('/api/generate-pdf', methods=['POST'])
def generate_pdf():
    data = request.json
    if not data or 'items' not in data:
        return jsonify({"error": "Hiányzó vagy üres kosár adatok"}), 400
        
    items = data.get('items', [])
    total_cost = data.get('total_cost', 0.0)
    
    pdf_buffer = generate_quote_pdf(items, total_cost)
    
    return send_file(
        pdf_buffer,
        download_name='Epitoipari_Arajanlat_Projekt.pdf',
        mimetype='application/pdf',
        as_attachment=True
    )

if __name__ == '__main__':
    print("Építőipari Kalkulátor AI Szerver elindul...")
    print("Cím: http://127.0.0.1:5000")
    app.run(port=5000, debug=True)
