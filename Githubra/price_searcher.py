import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

def search_material_prices(materials):
    """
    Az új Google GenAI SDK segítségével megkeresi a megadott anyagok piaci árát.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {"error": "Hiányzó API kulcs."}

    client = genai.Client(api_key=api_key)
    
    materials_str = ", ".join(materials) if isinstance(materials, list) else materials
    prompt = f"""
    Feladatod az aktuális magyarországi építőanyag árak kiderítése.
    Kérlek keresd meg a következő anyagok átlagos bruttó kiskereskedelmi árát (pl. OBI, Bauhaus, Praktiker árak alapján):
    {materials_str}
    
    FONTOS: 
    - Csak valós, 2024-2025-ös árakat használj.
    - Ha intervallumot találsz, add meg az átlagot.
    - A gipszkarton profilok (UW, CW, UD, CD profilok) fém tartószerkezetek, ezek árát általában szálban (pl. 3 méteres vagy 4 méteres szál) vagy folyóméterben (fm) adják meg. Próbáld meg az 1 folyóméterre (fm) vagy az 1 darab (szál) árára vonatkozó adatot megkeresni.
    - Add meg a mértékegységet (pl. "Ft/m2", "Ft/zsák", "Ft/darab", "Ft/fm").
    - A gipszkarton csavarokat és dűbeleket általában 100-1000 darabos dobozban árulják, úgy állapítsd meg a darabárat, vagy tüntesd fel a teljes doboz árat "Ft/doboz" egységgel.
    - KRITIKUS: A JSON kulcsokban (anyagnév) SZÓ SZERINT AZT A NEVET HASZNÁLD, ahogy én a listában megadtam! Ne írd át, ne bővítsd ki!
    
    A VÁLASZOD KIZÁRÓLAG EGY ÉRVÉNYES JSON LEGYEN, SEMMIKÉPP NE ÍRJ HOZZÁ FOLYÓSZÖVEGET:
    {{
        "IDE JÖN AZ EREDETI ANYAGNÉV PONTOSAN": {{
            "price": szám,
            "unit": "mértékegység",
            "source": "forrás megnevezése"
        }},
        ...
    }}
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-3.1-flash-lite-preview',
            contents=prompt,
            config=types.GenerateContentConfig(
                tools=[types.Tool(google_search=types.GoogleSearch())]
            )
        )
        
        # Tisztítás
        text = response.text
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0]
        elif "```" in text:
            text = text.split("```")[1].split("```")[0]
            
        return json.loads(text.strip())
    except Exception as e:
        return {"error": f"Árkeresési hiba (GenAI): {str(e)}"}

if __name__ == "__main__":
    # Teszt futtatás
    test_materials = ["normál gipszkarton m2", "csemperagasztó 25kg"]
    print(json.dumps(search_material_prices(test_materials), indent=4, ensure_ascii=False))
