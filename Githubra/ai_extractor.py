import os
import sys
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

def extract_product_data(url: str):
    """
    Kinyeri a csempe adatait egy linkről a Gemini AI segítségével.
    Használja a Google Search eszközt a pontos adatokhoz.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {"error": "Hiányzó API kulcs a .env fájlból."}

    genai.configure(api_key=api_key)
    
    prompt = f"""
    Feladatod egy építőipari termékoldal elemzése: {url}
    
    Kérlek keresd meg a következő technikai paramétereket a termékről:
    1. Lap szélessége (cm)
    2. Lap magassága (cm)
    3. Csomag tartalma / kiszerelés (m2/doboz)
    
    FONTOS: 
    - Csak számokat adj meg!
    - Ha a terméknévben benne van a méret (pl. 30x60), használd azt.
    - Ha nem találod a m2/doboz adatot, próbáld meg kikövetkeztetni a specifikációból.
    
    Válaszolj kizárólag egy tiszta JSON formátumban:
    {{
        "width": float_vagy_null,
        "height": float_vagy_null,
        "m2_per_box": float_vagy_null,
        "product_name": "termék neve"
    }}
    """
    
    try:
        # Modell inicializálása kereső eszközzel (ha támogatja a környezet)
        model = genai.GenerativeModel(
            model_name="gemini-3.1-flash-lite-preview",
            tools=[{'google_search_retrieval': {}}]
        )
        
        response = model.generate_content(prompt)
        
        # Tisztítás
        text = response.text
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0]
        elif "```" in text:
            text = text.split("```")[1].split("```")[0]
            
        data = json.loads(text.strip())
        return data
    except Exception as e:
        # Ha a kereső eszköz nem elérhető, próbáljuk meg anélkül
        try:
            model_basic = genai.GenerativeModel(model_name="gemini-3.1-flash-lite-preview")
            response = model_basic.generate_content(prompt)
            text = response.text
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0]
            data = json.loads(text.strip())
            return data
        except Exception as e2:
            return {"error": f"AI hiba: {str(e2)}"}

if __name__ == "__main__":
    if len(sys.argv) > 1:
        url = sys.argv[1]
        result = extract_product_data(url)
        print(json.dumps(result))
