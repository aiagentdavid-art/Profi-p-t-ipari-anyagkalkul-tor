import json
from agents import DirectorAgent, ResearcherAgent, CreatorAgent, TesterAgent
import drywall_logic, tiling_logic, concrete_logic # Importok a biztonság kedvéért

class Orchestrator:
    def __init__(self):
        self.director = DirectorAgent()
        self.researcher = ResearcherAgent()
        self.creator = CreatorAgent()
        self.tester = TesterAgent()

    def run_task(self, user_request):
        print(f"\n--- Új feladat indítása: {user_request} ---\n")
        
        # 1. Director tervezi a folyamatot
        plan = self.director.think(f"Tervezd meg a munkafolyamatot a következő felhasználói kéréshez: '{user_request}'. Határozd meg mit kell kutatni.")
        
        # 2. Researcher kutat
        research_data = self.researcher.think(f"A feladat a következő: '{user_request}'. A terv alapján gyűjtsd össze a szükséges adatokat és anyaghányadokat.")
        
        # 3. Creator elkészíti a kalkulációt
        calculation = self.creator.think(f"Itt vannak a kutatási adatok: {research_data}. Készítsd el a részletes anyagkalkulációt a felhasználó kérésére: '{user_request}'.")
        
        # 4. Tester ellenőriz
        is_valid = False
        iteration = 0
        current_calculation = calculation
        
        while not is_valid and iteration < 3:
            iteration += 1
            test_result = self.tester.think(f"Ellenőrizd ezt a kalkulációt: {current_calculation}. Megfelel a szakmai elvárásoknak és a kérésnek ({user_request})? Ha nem, sorold fel a hibákat. Ha igen, írd: 'RENDBEN'.")
            
            if "RENDBEN" in test_result.upper():
                is_valid = True
                print(f"[Tesztelő] Kalkuláció jóváhagyva a(z) {iteration}. körben.")
            else:
                print(f"[Tesztelő] Hiba talalva, javítás kérése... (Kör: {iteration})")
                current_calculation = self.creator.think(f"A tesztelő hibákat talált: {test_result}. Kérlek javítsd a kalkulációt!")

        # 5. Director összesít
        final_result = self.director.think(f"A folyamat lezárult. A tesztelt kalkuláció: {current_calculation}. Foglald össze a végfelhasználónak profi módon a végeredményt.")
        
        return final_result

if __name__ == "__main__":
    orchestrator = Orchestrator()
    # Példa futtatás
    # result = orchestrator.run_task("Számítsd ki egy 50m2-es kisméretű téglából épült fal anyagszükségletét 25cm vastagságban.")
    # print("\n--- VÉGEREDMÉNY ---\n")
    # print(result)
