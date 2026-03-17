from orchestrator import Orchestrator
import sys

def main():
    if sys.stdout.encoding != 'utf-8':
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    
    print("====================================================")
    print("   ÉPÍTŐIPARI ANYAGKALKULÁTOR MULTI-AGENT SYSTEM   ")
    print("====================================================\n")
    
    orchestrator = Orchestrator()
    
    if len(sys.argv) > 1:
        user_input = " ".join(sys.argv[1:])
    else:
        user_input = input("Milyen anyagszámításban segíthetek? (pl. 20m2 térkövezés): ")
    
    if not user_input.strip():
        print("Hiba: Nem adtál meg feladatot.")
        return

    try:
        result = orchestrator.run_task(user_input)
        print("\n\n" + "="*50)
        print("AZ IGAZGATÓ VÉGSŐ JELENTÉSE:")
        print("="*50)
        print(result)
        print("="*50)
    except Exception as e:
        print(f"\n[!] Hiba történt a futtatás során: {e}")

if __name__ == "__main__":
    main()
