import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

def list_models():
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    print("Elérhető modellek:")
    for model in client.models.list():
        print(f"- {model.name} (Supported actions: {model.supported_generation_methods})")

if __name__ == "__main__":
    list_models()
