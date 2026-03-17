import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

class BaseAgent:
    def __init__(self, name, role, expertise, system_instruction):
        self.name = name
        self.role = role
        self.expertise = expertise
        self.api_key = os.getenv("GEMINI_API_KEY")
        
        if not self.api_key:
            raise ValueError(f"API kulcs nem található {self.name} számára!")
            
        genai.configure(api_key=self.api_key)
        
        self.model = genai.GenerativeModel(
            model_name="gemini-3.1-flash-lite-preview",
        )
        self.chat = self.model.start_chat(history=[])
        self.system_instruction = f"Te vagy {self.name}, egy {self.role}. Szakterületed: {self.expertise}. {system_instruction}"

    def think(self, prompt):
        print(f"[{self.name}] Gondolkodik...")
        # A system instruction-t az első üzenetben adjuk át vagy konfigurációban, 
        # mivel a régi SDK verzió-specifikus lehet. A legbiztosabb a prompt elejére tenni.
        full_prompt = f"{self.system_instruction}\n\nKérés: {prompt}"
        response = self.chat.send_message(full_prompt)
        return response.text

    def get_history(self):
        return self.chat.history
