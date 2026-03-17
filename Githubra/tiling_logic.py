# Burkolási anyagnormák (per 1 m2) - Dinamikus méret alapú számítás
# Forrás: Otthondepó, Lakáskultúra és Sopro kalkulátorok alapján

def calculate_tiling(area, tile_w_cm, tile_h_cm, wastage_percent):
    # Ragasztó igény becslése a lapméret alapján (kg/m2)
    # 20x20 alatt: 2.5kg, 45x45-ig: 4kg, felette: 5.5kg
    tile_max_dim = max(tile_w_cm, tile_h_cm)
    
    if tile_max_dim <= 20:
        glue_rate = 2.5
        fuga_rate = 0.8
    elif tile_max_dim <= 45:
        glue_rate = 4.0
        fuga_rate = 0.5
    else:
        glue_rate = 5.5
        fuga_rate = 0.3
    
    # Felület számítás ráhagyással
    total_area = area * (1 + (wastage_percent / 100))
    
    # Lapok darabszáma
    tile_area_m2 = (tile_w_cm * tile_h_cm) / 10000
    tile_count = int(total_area / tile_area_m2) + 1
    
    results = {
        "terület": area,
        "számított_anyagok": {
            "Burkolólap (m2)": round(total_area, 2),
            "Burkolólap (db)": tile_count,
            "Csemperagasztó (kg)": round(area * glue_rate, 2),
            "Fugázóanyag (kg)": round(area * fuga_rate, 2),
            "Vágási veszteség (%)": wastage_percent
        }
    }
    
    return results
