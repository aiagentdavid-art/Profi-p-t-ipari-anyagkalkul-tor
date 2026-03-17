from drywall_logic import calculate_drywall, RIGIPS_NORMS
import json

def get_drywall_report(structure_type, area):
    data = calculate_drywall(structure_type, area)
    if not data:
        return "Ismeretlen szerkezet típus."
    
    report = f"### {data['megnevezés']} ({area} m2) ###\n"
    report += "-" * 40 + "\n"
    for mat, total in data["számított_anyagok"].items():
        report += f"{mat}: {total}\n"
    report += "-" * 40 + "\n"
    return report

if __name__ == "__main__":
    # Teszt
    print(get_drywall_report("W111", 20))
