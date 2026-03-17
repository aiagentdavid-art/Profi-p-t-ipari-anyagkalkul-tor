import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

def test_simple():
    api_key = os.getenv("GEMINI_API_KEY")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-3.1-flash-lite-preview")
    try:
        response = model.generate_content("Mondd azt hogy: SZIA")
        print(f"Válasz: {response.text}")
    except Exception as e:
        print(f"Hiba: {e}")

if __name__ == "__main__":
    test_simple()
