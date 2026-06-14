/* =================================================================
   🩺 MEDASSIST - APP CORE LOGIC
   Includes Medicine Database, Sanitization, Fuzzy Pattern Matching,
   and Interactive UI State Management
   ================================================================= */

// 1. Medicine Knowledge Base (Indian Currency)
const MEDICINE_DATABASE = {
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

    // --- Prescription (Rx) Medicines ---
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
};

// 2. Generate Symptom Map dynamically
const SYMPTOM_MAP = {};
for (const [medKey, medInfo] of Object.entries(MEDICINE_DATABASE)) {
    if (medInfo.symptoms) {
        for (const symptom of medInfo.symptoms) {
            if (!SYMPTOM_MAP[symptom]) {
                SYMPTOM_MAP[symptom] = [];
            }
            SYMPTOM_MAP[symptom].push(medInfo);
        }
    }
}

// 3. String Sanitization
function sanitizeInput(text) {
    if (!text) return "";
    return text
        .toLowerCase()
        // Remove basic punctuation ?, !, ., ,, ;, :, etc.
        .replace(/[?!.,;:#'"()\[\]]/g, "")
        // Collapse multiple whitespaces
        .replace(/\s+/g, " ")
        .trim();
}

// 4. Fuzzy Matching Helper (Levenshtein Distance)
function levenshteinDistance(s1, s2) {
    const track = Array(s2.length + 1).fill(null).map(() => Array(s1.length + 1).fill(null));
    for (let i = 0; i <= s1.length; i += 1) track[0][i] = i;
    for (let j = 0; j <= s2.length; j += 1) track[j][0] = j;
    for (let j = 1; j <= s2.length; j += 1) {
        for (let i = 1; i <= s1.length; i += 1) {
            const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
            track[j][i] = Math.min(
                track[j][i - 1] + 1, // deletion
                track[j - 1][i] + 1, // insertion
                track[j - 1][i - 1] + indicator // substitution
            );
        }
    }
    return track[s2.length][s1.length];
}

// Get close matches using Levenshtein distance ratio
function getCloseMatches(word, possibilities, cutoff = 0.6) {
    const results = [];
    for (const poss of possibilities) {
        const distance = levenshteinDistance(word, poss);
        const maxLen = Math.max(word.length, poss.length);
        const similarity = 1 - distance / maxLen;
        if (similarity >= cutoff) {
            results.push({ value: poss, score: similarity });
        }
    }
    // Sort descending by score
    results.sort((a, b) => b.score - a.score);
    return results.map(r => r.value);
}

// Helper to check if a word is bounded inside the query string
function hasWord(query, targetWord) {
    const regex = new RegExp(`\\b${escapeRegExp(targetWord)}\\b`, "i");
    return regex.test(query);
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 5. Build Medicine UI Card
function createMedicineCardHTML(med) {
    const statusEmoji = med.availability === "In Stock" ? "🟢" : "🔴";
    const typeBadgeClass = med.type === "Prescription" ? "badge-rx" : "badge-otc";
    const typeBadgeText = med.type === "Prescription" ? "Rx Required" : "OTC Drug";
    
    let card = `
        <div class="medicine-card">
            <div class="med-card-header">
                <div class="med-title-group">
                    <h3>💊 ${med.name}</h3>
                    <div class="category">${med.category}</div>
                </div>
                <span class="badge ${typeBadgeClass}">${typeBadgeText}</span>
            </div>
            <div class="med-card-body">
                <div class="med-row">
                    <div class="label">Availability:</div>
                    <div class="value stock-badge">${statusEmoji} ${med.availability}</div>
                </div>
                <div class="med-row">
                    <div class="label">Price:</div>
                    <div class="value"><strong>${med.price}</strong></div>
                </div>
                <div class="med-row">
                    <div class="label">Description:</div>
                    <div class="value">${med.description}</div>
                </div>
                <div class="med-row">
                    <div class="label">Dosage:</div>
                    <div class="value">${med.dosage}</div>
                </div>
                <div class="med-row warning-row">
                    <div class="label">⚠️ Warning:</div>
                    <div class="value">${med.warnings}</div>
                </div>
            </div>
        </div>
    `;
    return card;
}

// 6. Main Pattern Matching Engine (Frontend Port)
function findMatches(query) {
    // 1. Check for greetings
    const greetings = ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening"];
    if (greetings.some(g => query.includes(g))) {
        return {
            text: `👋 Welcome to the **MedAssist** Chatbot!<br><br>
                   I can help you find medicines or check stock details. You can type a symptom (e.g., *fever*, *acidity*), look up a medicine, or click one of the quick symptom pills below.`
        };
    }

    // 2. Check for helper lists
    if (["list", "medicines", "show all", "help", "menu"].includes(query)) {
        const otc = Object.values(MEDICINE_DATABASE).filter(m => m.type === "OTC").map(m => m.name);
        const rx = Object.values(MEDICINE_DATABASE).filter(m => m.type === "Prescription").map(m => m.name);
        const symptoms = Object.keys(SYMPTOM_MAP).sort();
        
        return {
            text: `📋 **Available Options in Our Shop:**<br><br>
                   🔹 **OTC Medicines:** ${otc.join(", ")}<br>
                   🔹 **Prescription (Rx) Medicines:** ${rx.join(", ")}<br>
                   🔹 **Recognized Symptoms:** ${symptoms.join(", ")}`
        };
    }

    // 3. Direct Medicine Lookup
    const matchedMeds = [];
    for (const [medKey, medInfo] of Object.entries(MEDICINE_DATABASE)) {
        if (hasWord(query, medKey) || hasWord(query, medInfo.name.toLowerCase())) {
            matchedMeds.push(medInfo);
        }
    }

    if (matchedMeds.length > 0) {
        let text = "";
        let requiresRx = false;
        matchedMeds.forEach(med => {
            text += createMedicineCardHTML(med);
            if (med.type === "Prescription") {
                requiresRx = true;
            }
        });
        
        if (requiresRx) {
            text += `
                <div class="rx-confirmation" style="margin-top: 10px;">
                    <p style="color: var(--text-rx); font-weight: 500;">🚨 Note: This requires a doctor's prescription (Rx).</p>
                    <p><strong>Do you have a valid doctor's prescription for this?</strong></p>
                    <div class="confirmation-actions">
                        <button class="confirm-btn btn-yes" onclick="handlePrescriptionAnswer('yes')">Yes, I do</button>
                        <button class="confirm-btn btn-no" onclick="handlePrescriptionAnswer('no')">No, I don't</button>
                    </div>
                </div>
            `;
        }
        return { text };
    }

    // 4. Direct Symptom Lookup
    const matchedSymptoms = [];
    for (const symptom of Object.keys(SYMPTOM_MAP)) {
        if (hasWord(query, symptom)) {
            matchedSymptoms.push(symptom);
        }
    }

    if (matchedSymptoms.length > 0) {
        let text = `🔍 Found matching results for symptom(s): **${matchedSymptoms.join(", ")}**<br>`;
        const seenMeds = new Set();
        matchedSymptoms.forEach(symptom => {
            SYMPTOM_MAP[symptom].forEach(med => {
                if (!seenMeds.has(med.name)) {
                    seenMeds.add(med.name);
                    text += createMedicineCardHTML(med);
                }
            });
        });
        return { text };
    }

    // 5. Check prescription replies
    if (["yes", "yep", "yeah", "i have one", "i have prescription", "have prescription"].includes(query)) {
        return { text: "✅ Perfect! Please show the prescription at the counter or upload it when finalizing your order. We are preparing your medicine." };
    }
    if (["no", "nope", "i dont", "i do not", "dont have"].includes(query)) {
        return { text: "❌ Sorry, we cannot dispense prescription-only (Rx) medicines without a valid doctor's prescription. Please consult your physician to obtain one." };
    }

    // 6. Fuzzy / Similar Keyword Matching
    const stopWords = new Set(["do", "you", "have", "need", "want", "find", "get", "for", "with", "from", "that", "this", "some", "medicine", "pill", "pills", "syrup"]);
    const tokens = query.split(" ").filter(t => t.length > 2 && !stopWords.has(t));

    const fuzzyMedKeys = new Set();
    const fuzzySymptomKeys = new Set();

    // Check whole query first
    const wholeMedMatch = getCloseMatches(query, Object.keys(MEDICINE_DATABASE), 0.6);
    if (wholeMedMatch.length > 0) fuzzyMedKeys.add(wholeMedMatch[0]);

    const wholeSymptomMatch = getCloseMatches(query, Object.keys(SYMPTOM_MAP), 0.6);
    if (wholeSymptomMatch.length > 0) fuzzySymptomKeys.add(wholeSymptomMatch[0]);

    // Check tokens
    tokens.forEach(token => {
        const medMatch = getCloseMatches(token, Object.keys(MEDICINE_DATABASE), 0.7);
        if (medMatch.length > 0) fuzzyMedKeys.add(medMatch[0]);
        
        const symMatch = getCloseMatches(token, Object.keys(SYMPTOM_MAP), 0.7);
        if (symMatch.length > 0) fuzzySymptomKeys.add(symMatch[0]);
    });

    if (fuzzyMedKeys.size > 0 || fuzzySymptomKeys.size > 0) {
        const suggestions = [];
        fuzzyMedKeys.forEach(k => suggestions.push(MEDICINE_DATABASE[k].name));
        fuzzySymptomKeys.forEach(s => suggestions.push(s));
        
        let text = `❓ Did you mean **${suggestions.join(", ")}**? Here is what I found:<br><br>`;
        const seenMeds = new Set();
        let requiresRx = false;
        
        fuzzyMedKeys.forEach(medKey => {
            const med = MEDICINE_DATABASE[medKey];
            if (!seenMeds.has(med.name)) {
                seenMeds.add(med.name);
                text += createMedicineCardHTML(med);
                if (med.type === "Prescription") requiresRx = true;
            }
        });

        fuzzySymptomKeys.forEach(symptom => {
            SYMPTOM_MAP[symptom].forEach(med => {
                if (!seenMeds.has(med.name)) {
                    seenMeds.add(med.name);
                    text += createMedicineCardHTML(med);
                }
            });
        });

        if (requiresRx) {
            text += `
                <div class="rx-confirmation" style="margin-top: 10px;">
                    <p style="color: var(--text-rx); font-weight: 500;">🚨 Note: This requires a doctor's prescription (Rx).</p>
                    <p><strong>Do you have a valid doctor's prescription for this?</strong></p>
                    <div class="confirmation-actions">
                        <button class="confirm-btn btn-yes" onclick="handlePrescriptionAnswer('yes')">Yes, I do</button>
                        <button class="confirm-btn btn-no" onclick="handlePrescriptionAnswer('no')">No, I don't</button>
                    </div>
                </div>
            `;
        }
        return { text };
    }

    // 7. Default Unknown Response
    return {
        text: `❓ I'm sorry, I couldn't find a match for your query in our local database.<br><br>
               - Try searching by symptoms: *fever*, *headache*, *cold*, *cough*, *stomach pain*, or *acidity*.<br>
               - Or search for a specific medicine like *Paracetamol*, *Dolo 650*, or *Amoxicillin*.<br>
               - Click **List All** to see all recognized categories.<br><br>
               🛑 *Disclaimer: If you are experiencing severe symptoms, please seek professional medical treatment immediately.*`
    };
}

// 7. Interactive UI Management
const chatMessages = document.getElementById("chat-messages");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const typingIndicator = document.getElementById("typing-indicator");
const clearChatBtn = document.getElementById("clear-chat");

function appendMessage(sender, text, isHTML = true) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender === "user" ? "user-message" : "bot-message");
    
    const bubble = document.createElement("div");
    bubble.classList.add("message-bubble");
    if (isHTML) {
        bubble.innerHTML = text;
    } else {
        bubble.textContent = text;
    }
    
    messageDiv.appendChild(bubble);
    chatMessages.appendChild(messageDiv);
    
    // Auto Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
    typingIndicator.style.display = "flex";
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTyping() {
    typingIndicator.style.display = "none";
}

function processUserMessage(msgText) {
    const sanitized = sanitizeInput(msgText);
    if (!sanitized) return;

    // Append user bubble
    appendMessage("user", msgText, false);
    chatInput.value = "";

    // Show Typing indicator
    showTyping();

    // Answer with delay
    setTimeout(() => {
        hideTyping();
        const response = findMatches(sanitized);
        appendMessage("bot", response.text, true);
    }, 450);
}

// Form submit handler
chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = chatInput.value;
    processUserMessage(val);
});

// Clear Chat handler
clearChatBtn.addEventListener("click", () => {
    chatMessages.innerHTML = `
        <div class="message bot-message">
            <div class="message-bubble">
                🧹 Conversation cleared!<br><br>
                👋 Welcome to **MedAssist**!<br><br>
                I can help you find medicines, check prices, availability, and verify doctor prescriptions.
            </div>
        </div>
    `;
});

// Quick Action Pills handler (supporting symptoms and medicines)
document.querySelectorAll(".pill-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        const target = e.currentTarget;
        if (target.id === "list-all-btn") {
            processUserMessage("list");
        } else if (target.hasAttribute("data-symptom")) {
            const symptom = target.getAttribute("data-symptom");
            processUserMessage(symptom);
        } else if (target.hasAttribute("data-med")) {
            const med = target.getAttribute("data-med");
            processUserMessage(med);
        }
    });
});

// Global functions for prescription confirm buttons inside chat logs
window.handlePrescriptionAnswer = function(answer) {
    // Append answer as user
    processUserMessage(answer);
};
