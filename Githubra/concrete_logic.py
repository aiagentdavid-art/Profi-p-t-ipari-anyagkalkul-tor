# Betonozási anyagnormák (per 1 m3 friss beton)
# Forrás: Beton Booster, DDC és Lakásgenerál kalkulátorok alapján

CONCRETE_NORMS = {
    "C12": {
        "megnevezés": "C12/15 - Alapozáshoz, járdákhoz",
        "cement_kg": 250,
        "sóder_m3": 1.1, # Tömörödéssel számolva
        "víz_liter": 130
    },
    "C16": {
        "megnevezés": "C16/20 - Teherhordó aljzatokhoz",
        "cement_kg": 300,
        "sóder_m3": 1.1,
        "víz_liter": 160
    },
    "C20": {
        "megnevezés": "C20/25 - Vasbeton szerkezetekhez, pillérekhez",
        "cement_kg": 350,
        "sóder_m3": 1.1,
        "víz_liter": 180
    }
}

def calculate_concrete(strength_class, volume_m3):
    if strength_class not in CONCRETE_NORMS:
        strength_class = "C16"
        
    norm = CONCRETE_NORMS[strength_class]
    
    results = {
        "megnevezés": norm["megnevezés"],
        "térfogat": float(volume_m3),
        "számított_anyagok": {
            "Cement (kg)": round(float(norm["cement_kg"]) * float(volume_m3), 2),
            "Cement (25kg zsák)": int(((float(norm["cement_kg"]) * float(volume_m3)) / 25) + 0.99),
            "Sóder (m3 - 0-24mm)": round(float(norm["sóder_m3"]) * float(volume_m3), 2),
            "Víz (liter)": round(float(norm["víz_liter"]) * float(volume_m3), 2)
        }
    }
    
    return results

def calculate_volume(length, width, thickness_cm):
    return (length * width * (thickness_cm / 100))
