import sys
print(sys.executable)
try:
    from google import genai
    print("google.genai imported successfully")
except ImportError as e:
    print(f"ImportError: {e}")
