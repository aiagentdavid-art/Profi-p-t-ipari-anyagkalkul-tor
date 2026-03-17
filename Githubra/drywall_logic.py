# Rigips anyagnormák (per 1 m2)
# Forrás: Rigips Kivitelezői Kézikönyv és rigipskalkulator.hu alapján

DRYWALL_NORMS = {
    "Válaszfal": {
        "1": {
            "megnevezés": "Válaszfal - 1 réteg burkolattal",
            "anyagok": {
                "Gipszkarton lap (m2)": 2.1,
                "UW profil (fm)": 0.8,
                "CW profil (fm)": 2.0,
                "Gipszkarton csavar 25mm (db)": 26,
                "Beütő dűbel 6/40 (db)": 1.6,
                "Hézagoló gipsz (kg)": 0.8,
                "Hézagoló szalag (fm)": 1.6,
                "Rezgéscsillapító szalag (fm)": 1.2,
                "Szigetelő ásványgyapot (m2)": 1.0
            }
        },
        "2": {
            "megnevezés": "Válaszfal - 2 réteg burkolattal",
            "anyagok": {
                "Gipszkarton lap (m2)": 4.1,
                "UW profil (fm)": 0.8,
                "CW profil (fm)": 2.0,
                "Gipszkarton csavar 25mm (db)": 12,
                "Gipszkarton csavar 35mm (db)": 26,
                "Beütő dűbel 6/40 (db)": 1.6,
                "Hézagoló gipsz (kg)": 1.3,
                "Hézagoló szalag (fm)": 1.6,
                "Rezgéscsillapító szalag (fm)": 1.2,
                "Szigetelő ásványgyapot (m2)": 1.0
            }
        }
    },
    "Előtétfal": {
        "1": {
            "megnevezés": "Előtétfal - 1 réteg burkolattal",
            "anyagok": {
                "Gipszkarton lap (m2)": 1.05,
                "UD profil (fm)": 0.8,
                "CD profil (fm)": 2.1,
                "Gipszkarton csavar 25mm (db)": 22,
                "Beütő dűbel 6/40 (db)": 1.6,
                "Hézagoló gipsz (kg)": 0.5,
                "Hézagoló szalag (fm)": 1.6,
                "Rezgéscsillapító szalag (fm)": 1.2,
                "Direkt függesztő (db)": 1.8
            }
        },
        "2": {
            "megnevezés": "Előtétfal - 2 réteg burkolattal",
            "anyagok": {
                "Gipszkarton lap (m2)": 2.1,
                "UD profil (fm)": 0.8,
                "CD profil (fm)": 2.1,
                "Gipszkarton csavar 25mm (db)": 6,
                "Gipszkarton csavar 35mm (db)": 22,
                "Beütő dűbel 6/40 (db)": 1.6,
                "Hézagoló gipsz (kg)": 0.8,
                "Hézagoló szalag (fm)": 1.6,
                "Rezgéscsillapító szalag (fm)": 1.2,
                "Direkt függesztő (db)": 1.8
            }
        }
    },
    "Álmennyezet": {
        "1": {
            "megnevezés": "Álmennyezet - 1 réteg burkolattal",
            "anyagok": {
                "Gipszkarton lap (m2)": 1.05,
                "CD profil (fm)": 3.2,
                "UD profil (fm)": 0.8,
                "Direkt függesztő (db)": 1.8,
                "CD toldó (db)": 0.6,
                "Gipszkarton csavar 25mm (db)": 18,
                "Beütő dűbel 6/40 (db)": 1.5,
                "Hézagoló gipsz (kg)": 0.4,
                "Hézagoló szalag (fm)": 0.8
            }
        },
        "2": {
            "megnevezés": "Álmennyezet - 2 réteg burkolattal",
            "anyagok": {
                "Gipszkarton lap (m2)": 2.1,
                "CD profil (fm)": 3.2,
                "UD profil (fm)": 0.8,
                "Direkt függesztő (db)": 1.8,
                "CD toldó (db)": 0.6,
                "Gipszkarton csavar 25mm (db)": 6,
                "Gipszkarton csavar 35mm (db)": 18,
                "Beütő dűbel 6/40 (db)": 1.5,
                "Hézagoló gipsz (kg)": 0.7,
                "Hézagoló szalag (fm)": 1.6
            }
        }
    }
}

def calculate_drywall(structure_type, layers, area):
    if structure_type not in DRYWALL_NORMS:
        return None
    
    layers = str(layers)
    if layers not in DRYWALL_NORMS[structure_type]:
        layers = "1"
        
    norm = DRYWALL_NORMS[structure_type][layers]
    results = {
        "megnevezés": norm["megnevezés"],
        "terület": area,
        "számított_anyagok": {}
    }
    
    for mat, rate in norm["anyagok"].items():
        results["számított_anyagok"][mat] = round(float(rate) * float(area), 2)
        
    return results
