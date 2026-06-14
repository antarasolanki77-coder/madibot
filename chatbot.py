import re
import sys
import difflib

# Predefined Medicine Database using Python Dictionaries
# Contains: Symptoms, Diseases, Medicines, Availability, Prices, OTC/Rx Status, Dosages, Warnings
MEDICINE_DATABASE = {
    "paracetamol": {
        "name": "Paracetamol",
        "category": "Antipyretic / Analgesic",
        "type": "OTC",
        "availability": "In Stock",
        "price": "₹15.00 per strip",
        "description": "Used for relieving fever and mild to moderate pain (e.g., headache, muscle aches).",
        "dosage": "500mg to 650mg every 4-6 hours as needed. Do not exceed 4000mg (4g) in a 24-hour period.",
        "warnings": "Avoid alcohol. Severe liver damage may occur if you take more than the maximum daily amount.",
        "symptoms": ["fever", "headache", "body pain", "toothache"]
    },
    "dolo 650": {
        "name": "Dolo 650",
        "category": "Antipyretic / Analgesic",
        "type": "OTC",
        "availability": "In Stock",
        "price": "₹30.00 per strip",
        "description": "High-strength paracetamol formulation widely used to treat high fever and body aches.",
        "dosage": "1 tablet every 6 hours as needed. Maximum 4 tablets in 24 hours.",
        "warnings": "Do not take along with other paracetamol-containing products to avoid accidental overdose.",
        "symptoms": ["fever", "headache", "body pain"]
    },
    "crocin": {
        "name": "Crocin",
        "category": "Analgesic / Antipyretic",
        "type": "OTC",
        "availability": "In Stock",
        "price": "₹25.00 per strip",
        "description": "Provides fast relief from headaches, toothaches, cold symptoms, and fever.",
        "dosage": "1-2 tablets every 4-6 hours. Do not exceed 8 tablets in 24 hours.",
        "warnings": "Consult a doctor if symptoms persist for more than 3 days.",
        "symptoms": ["headache", "fever", "body pain"]
    },
    "cetirizine": {
        "name": "Cetirizine",
        "category": "Antihistamine",
        "type": "OTC",
        "availability": "In Stock",
        "price": "₹40.00 per strip",
        "description": "Used to treat cold symptoms, runny nose, sneezing, watery eyes, and allergic reactions.",
        "dosage": "10mg once daily (usually in the evening).",
        "warnings": "May cause drowsiness. Avoid driving or operating machinery after consumption.",
        "symptoms": ["cold", "runny nose", "sneezing", "allergy"]
    },
    "sinarest": {
        "name": "Sinarest",
        "category": "Decongestant / Antihistamine / Analgesic",
        "type": "OTC",
        "availability": "In Stock",
        "price": "₹45.00 per strip",
        "description": "Multi-symptom relief for common cold, nasal congestion, runny nose, and associated headache or fever.",
        "dosage": "1 tablet 3-4 times a day or as directed by a healthcare professional.",
        "warnings": "May cause mild drowsiness. Avoid other decongestants or paracetamol products while taking Sinarest.",
        "symptoms": ["cold", "cough", "nasal congestion", "runny nose", "fever"]
    },
    "benadryl": {
        "name": "Benadryl (Cough Syrup)",
        "category": "Antitussive / Cough Suppressant",
        "type": "OTC",
        "availability": "In Stock",
        "price": "₹120.00 per bottle",
        "description": "Soothes throat irritation and relieves cough and cold symptoms.",
        "dosage": "10ml every 4 hours for adults. Do not exceed 60ml in 24 hours.",
        "warnings": "Causes significant drowsiness. Do not consume alcohol or operate machinery.",
        "symptoms": ["cough", "throat irritation", "dry cough"]
    },
    "corex": {
        "name": "Corex (Cough Syrup)",
        "category": "Mucolytic / Expectorant",
        "type": "OTC",
        "availability": "Out of Stock",
        "price": "₹135.00 per bottle",
        "description": "Relieves chest congestion and wet cough by thinning mucus.",
        "dosage": "5ml to 10ml twice daily.",
        "warnings": "Currently out of stock. Please check alternatives like Benadryl. Use under medical supervision.",
        "symptoms": ["cough", "wet cough", "chest congestion"]
    },
    "digene": {
        "name": "Digene",
        "category": "Antacid & Antigas",
        "type": "OTC",
        "availability": "In Stock",
        "price": "₹60.00 per pack/bottle",
        "description": "Provides quick relief from acidity, heartburn, gas, and stomach upset.",
        "dosage": "Chew 2 to 4 tablets after meals or take 10ml of liquid antacid. Do not swallow whole.",
        "warnings": "Do not exceed 10 tablets per day. Avoid long-term continuous use without a doctor's advice.",
        "symptoms": ["stomach pain", "acidity", "heartburn", "indigestion", "gas"]
    },
    "gelusil": {
        "name": "Gelusil",
        "category": "Antacid & Antiflatulent",
        "type": "OTC",
        "availability": "In Stock",
        "price": "₹75.00 per pack",
        "description": "Relieves stomach pain, acid indigestion, bloating, and gas.",
        "dosage": "1-2 tablets chewed thoroughly between meals and at bedtime, or as prescribed.",
        "warnings": "Keep out of reach of children. Consult a doctor if symptoms persist.",
        "symptoms": ["stomach pain", "acidity", "indigestion", "bloating", "gas"]
    },
    "pantoprazole": {
        "name": "Pantoprazole",
        "category": "Proton Pump Inhibitor (PPI)",
        "type": "OTC",
        "availability": "In Stock",
        "price": "₹80.00 per strip",
        "description": "Reduces the amount of acid produced in your stomach, treating acid reflux and gastroesophageal reflux disease (GERD).",
        "dosage": "40mg tablet once daily, preferably 30-60 minutes before breakfast.",
        "warnings": "Do not crush or chew the tablet; swallow it whole with water.",
        "symptoms": ["acidity", "heartburn", "acid reflux", "stomach pain"]
    },

    # --- Common Prescription (Rx) Medicines ---
    "amoxicillin": {
        "name": "Amoxicillin",
        "category": "Antibiotic (Penicillin class)",
        "type": "Prescription",
        "availability": "In Stock",
        "price": "₹150.00 per strip",
        "description": "Antibiotic used to treat a wide variety of bacterial infections.",
        "dosage": "250mg to 500mg every 8 hours, or 500mg to 875mg every 12 hours as prescribed by a physician.",
        "warnings": "CRITICAL: Complete the full prescribed course even if symptoms disappear. Requires a valid doctor's prescription.",
        "symptoms": ["infection", "bacterial infection", "strep throat", "ear infection"]
    },
    "metformin": {
        "name": "Metformin",
        "category": "Anti-diabetic (Biguanide class)",
        "type": "Prescription",
        "availability": "In Stock",
        "price": "₹90.00 per strip",
        "description": "First-line medication for the treatment of type 2 diabetes, helping control blood sugar levels.",
        "dosage": "500mg to 1000mg twice daily with meals, or as directed by an endocrinologist.",
        "warnings": "Requires a valid prescription. Monitor blood sugar levels regularly. Do not take on an empty stomach.",
        "symptoms": ["diabetes", "high blood sugar", "type 2 diabetes"]
    },
    "atorvastatin": {
        "name": "Atorvastatin",
        "category": "Lipid-lowering agent (Statin)",
        "type": "Prescription",
        "availability": "In Stock",
        "price": "₹220.00 per strip",
        "description": "Used along with diet to lower 'bad' cholesterol (LDL) and triglycerides, and raise 'good' cholesterol (HDL).",
        "dosage": "10mg to 80mg once daily, usually at the same time each day (evening is preferred).",
        "warnings": "Requires a valid prescription. Avoid grapefruit or grapefruit juice, as it increases the risk of side effects.",
        "symptoms": ["cholesterol", "high cholesterol", "heart health"]
    },
    "albuterol": {
        "name": "Albuterol (Inhaler)",
        "category": "Bronchodilator (Beta-2 agonist)",
        "type": "Prescription",
        "availability": "In Stock",
        "price": "₹350.00 per inhaler",
        "description": "Relieves bronchospasm in patients with asthma, bronchitis, or other obstructive airway diseases.",
        "dosage": "1 to 2 puffs inhaled every 4 to 6 hours as needed for wheezing or asthma attacks.",
        "warnings": "Requires a valid prescription. May cause a temporary increase in heart rate or jitteriness. Seek immediate help if breathing worsens.",
        "symptoms": ["asthma", "wheezing", "shortness of breath", "bronchitis"]
    },
    "azithromycin": {
        "name": "Azithromycin",
        "category": "Antibiotic (Macrolide class)",
        "type": "Prescription",
        "availability": "Out of Stock",
        "price": "₹180.00 per strip",
        "description": "Broad-spectrum antibiotic used to treat respiratory, ear, skin, and sexually transmitted infections.",
        "dosage": "500mg once daily for 3 days, or 500mg on day 1 followed by 250mg once daily for days 2 to 5.",
        "warnings": "Currently out of stock. Requires a valid prescription. Do not take with antacids containing aluminum or magnesium.",
        "symptoms": ["infection", "respiratory infection", "pneumonia", "bronchitis", "tonsillitis"]
    }
}

# Mapping of symptoms to make lookup rapid
SYMPTOM_MAP = {}
for med_key, data in MEDICINE_DATABASE.items():
    for symptom in data.get("symptoms", []):
        if symptom not in SYMPTOM_MAP:
            SYMPTOM_MAP[symptom] = []
        SYMPTOM_MAP[symptom].append(data)


def sanitize_input(text: str) -> str:
    """
    Cleans user input by lowercasing, stripping leading/trailing whitespace,
    collapsing multiple consecutive internal whitespaces, and removing basic punctuation.
    """
    if not text:
        return ""
    # Lowercase
    cleaned = text.lower()
    # Remove basic punctuation like ?, !, ., ,, ;, :, etc.
    cleaned = re.sub(r'[?!.,;:#\'"()\[\]]', '', cleaned)
    # Collapse multiple whitespaces and strip boundaries
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned


def format_medicine_card(med_info: dict) -> str:
    """
    Returns a beautifully formatted block containing medicine details.
    """
    status_emoji = "🟢" if med_info["availability"] == "In Stock" else "🔴"
    type_badge = "🚨 [PRESCRIPTION REQUIRED - Rx]" if med_info["type"] == "Prescription" else "✅ [OVER-THE-COUNTER - OTC]"
    
    card = (
        f"\n==================================================\n"
        f"💊 **{med_info['name']}** ({med_info['category']})\n"
        f"--------------------------------------------------\n"
        f"  Type:         {type_badge}\n"
        f"  Availability: {status_emoji} {med_info['availability']}\n"
        f"  Price:        {med_info['price']}\n"
        f"  Description:  {med_info['description']}\n"
        f"  Dosage:       {med_info['dosage']}\n"
        f"  Warnings:     {med_info['warnings']}\n"
        f"=================================================="
    )
    return card


def find_matches(query: str) -> str:
    """
    Analyzes the sanitized query using pattern matching rules.
    Returns the appropriate response.
    """
    # 1. Check for greeting patterns
    greetings = ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening"]
    if any(g in query for g in greetings):
        return (
            "👋 Welcome to the Medical Shop Chatbot!\n"
            "I can help you find medicines or check details based on your symptoms, requirements, or prescriptions.\n"
            "How can I help you today? (e.g., 'I have a headache', 'Do you have Dolo 650?', 'Amoxicillin prescription')"
        )

    # 2. Check for helper lists
    if query in ["list", "medicines", "show all", "help", "menu"]:
        otc_meds = [m["name"] for m in MEDICINE_DATABASE.values() if m["type"] == "OTC"]
        rx_meds = [m["name"] for m in MEDICINE_DATABASE.values() if m["type"] == "Prescription"]
        symptoms_avail = sorted(list(SYMPTOM_MAP.keys()))
        
        return (
            "📋 **Available Options in Our Shop:**\n\n"
            f"🔹 **OTC Medicines:** {', '.join(otc_meds)}\n"
            f"🔹 **Prescription (Rx) Medicines:** {', '.join(rx_meds)}\n"
            f"🔹 **Recognized Symptoms:** {', '.join(symptoms_avail)}\n\n"
            "You can type a symptom (e.g., 'cough'), ask for a medicine (e.g., 'paracetamol'), or say 'exit' to quit."
        )

    # 3. Direct Medicine Lookup
    # We check if the query contains any medicine key
    matched_meds = []
    for med_key, med_data in MEDICINE_DATABASE.items():
        pattern_key = r'\b' + re.escape(med_key) + r'\b'
        pattern_name = r'\b' + re.escape(med_data["name"].lower()) + r'\b'
        if re.search(pattern_key, query) or re.search(pattern_name, query):
            matched_meds.append(med_data)

    if matched_meds:
        response_parts = []
        for med in matched_meds:
            response_parts.append(format_medicine_card(med))
            if med["type"] == "Prescription":
                response_parts.append(
                    "\n⚠️ Note: This medicine requires a doctor's prescription (Rx).\n"
                    "Please confirm: Do you have a valid prescription for this medicine? (yes/no)"
                )
        return "\n".join(response_parts)

    # 4. Symptom Lookup
    # We check if any symptom keyword is present in the user query
    matched_symptoms = []
    for symptom in SYMPTOM_MAP:
        # Check if symptom is a separate word or part of sentence
        pattern = r'\b' + re.escape(symptom) + r'\b'
        if re.search(pattern, query):
            matched_symptoms.append(symptom)

    if matched_symptoms:
        response_parts = []
        response_parts.append(f"🔍 Found matching results for symptom(s): {', '.join(matched_symptoms)}")
        seen_meds = set()
        for symptom in matched_symptoms:
            for med in SYMPTOM_MAP[symptom]:
                if med["name"] not in seen_meds:
                    seen_meds.add(med["name"])
                    response_parts.append(format_medicine_card(med))
        return "\n".join(response_parts)

    # 5. Check if user is answering the prescription confirmation question
    if query in ["yes", "yep", "yeah", "i have one", "i have prescription", "have prescription"]:
        return "✅ Perfect! Please show the prescription at the counter or upload it when finalizing your order. We are preparing your medicine."
    if query in ["no", "nope", "i dont", "i do not", "dont have"]:
        return "❌ Sorry, we cannot dispense prescription-only (Rx) medicines without a valid doctor's prescription. Please consult your physician to obtain one."

    # 6. Fuzzy / Similar Keyword Matching (using standard library difflib)
    # We check if direct lookups failed, then search for close matches for either the whole query or individual words.
    stop_words = {"do", "you", "have", "need", "want", "find", "get", "for", "with", "from", "that", "this", "some", "medicine", "pill", "pills", "syrup"}
    tokens = [t for t in re.findall(r'\b\w+\b', query) if len(t) > 2 and t not in stop_words]

    fuzzy_med_keys = set()
    fuzzy_symptom_keys = set()

    # Check whole query first (for single word misspelled inputs)
    whole_med_match = difflib.get_close_matches(query, list(MEDICINE_DATABASE.keys()), n=1, cutoff=0.6)
    if whole_med_match:
        fuzzy_med_keys.add(whole_med_match[0])

    whole_symptom_match = difflib.get_close_matches(query, list(SYMPTOM_MAP.keys()), n=1, cutoff=0.6)
    if whole_symptom_match:
        fuzzy_symptom_keys.add(whole_symptom_match[0])

    # Check individual tokens
    for token in tokens:
        med_match = difflib.get_close_matches(token, list(MEDICINE_DATABASE.keys()), n=1, cutoff=0.7)
        if med_match:
            fuzzy_med_keys.add(med_match[0])
        symptom_match = difflib.get_close_matches(token, list(SYMPTOM_MAP.keys()), n=1, cutoff=0.7)
        if symptom_match:
            fuzzy_symptom_keys.add(symptom_match[0])

    # If any fuzzy match is found, present it clearly to the user
    if fuzzy_med_keys or fuzzy_symptom_keys:
        response_parts = []
        suggestions = []
        if fuzzy_med_keys:
            suggestions.extend([MEDICINE_DATABASE[k]["name"] for k in fuzzy_med_keys])
        if fuzzy_symptom_keys:
            suggestions.extend(list(fuzzy_symptom_keys))
        
        response_parts.append(f"❓ Did you mean **{', '.join(suggestions)}**? Here is what I found:\n")

        seen_meds = set()
        # Display matching medicines
        for med_key in fuzzy_med_keys:
            med = MEDICINE_DATABASE[med_key]
            if med["name"] not in seen_meds:
                seen_meds.add(med["name"])
                response_parts.append(format_medicine_card(med))
                if med["type"] == "Prescription":
                    response_parts.append(
                        "\n⚠️ Note: This medicine requires a doctor's prescription (Rx).\n"
                        "Please confirm: Do you have a valid prescription for this medicine? (yes/no)"
                    )
        
        # Display medicines matching fuzzy symptoms
        for symptom in fuzzy_symptom_keys:
            for med in SYMPTOM_MAP[symptom]:
                if med["name"] not in seen_meds:
                    seen_meds.add(med["name"])
                    response_parts.append(format_medicine_card(med))
                    
        return "\n".join(response_parts)

    # 7. Default response for unknowns
    return (
        "❓ I'm sorry, I couldn't find a direct match for your query.\n"
        "- For common symptoms, try typing: 'fever', 'headache', 'cold', 'cough', 'stomach pain', or 'acidity'.\n"
        "- Or ask about a specific medicine: e.g., 'Paracetamol', 'Amoxicillin', 'Dolo 650'.\n"
        "- Type 'list' to see all recognized medicines and symptoms.\n"
        "🛑 Disclaimer: I am an automated assistant. If you are experiencing severe symptoms, please seek professional medical treatment immediately."
    )


def main():
    print("=================================================================")
    print("🩺        WELCOME TO THE MEDICAL SHOP CHATBOT (CLI)        🩺")
    print("=================================================================")
    print("Search by symptoms, medicine names, or check prescription rules.")
    print("Type 'list' to see all available options.")
    print("Type 'exit', 'quit', or 'bye' to end the session.")
    print("-----------------------------------------------------------------")
    print("⚠️  DISCLAIMER: This chatbot provides information only.")
    print("   It does NOT replace professional medical diagnosis or advice.")
    print("=================================================================\n")

    while True:
        try:
            # Capture user input
            user_input = input("You: ")
            
            # Sanitization
            sanitized = sanitize_input(user_input)
            
            # Exit strategy: clean break commands
            if sanitized in ["exit", "quit", "bye", "close", "end"]:
                print("\n👋 Thank you for visiting our Medical Shop! Take care and stay healthy!")
                break
                
            # Skip empty inputs
            if not sanitized:
                continue

            # Process query and get response
            response = find_matches(sanitized)
            print(f"Bot: {response}\n")

        except (KeyboardInterrupt, EOFError):
            print("\n\n👋 Session ended. Stay healthy!")
            break


if __name__ == "__main__":
    main()
