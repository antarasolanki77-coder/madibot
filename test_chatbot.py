import unittest
from chatbot import sanitize_input, find_matches, MEDICINE_DATABASE, SYMPTOM_MAP


class TestMedicalChatbot(unittest.TestCase):
    
    def test_sanitize_input(self):
        """
        Verify that user input is correctly lowercased, stripped,
        and multiple spaces or basic punctuation are removed.
        """
        self.assertEqual(sanitize_input("  Hello World!  "), "hello world")
        self.assertEqual(sanitize_input("paracetamol?"), "paracetamol")
        self.assertEqual(sanitize_input("Do you have Dolo 650???"), "do you have dolo 650")
        self.assertEqual(sanitize_input("  cough, fever; cold  "), "cough fever cold")
        self.assertEqual(sanitize_input(""), "")
        self.assertEqual(sanitize_input(None), "")

    def test_greeting_match(self):
        """
        Verify that greetings are matched correctly.
        """
        response = find_matches("hello")
        self.assertIn("Welcome to the Medical Shop Chatbot", response)
        
        response_hi = find_matches("hi there")
        self.assertIn("Welcome to the Medical Shop Chatbot", response_hi)

    def test_list_medicines_command(self):
        """
        Verify that helper commands display list of medicines and symptoms.
        """
        response = find_matches("list")
        self.assertIn("OTC Medicines", response)
        self.assertIn("Prescription (Rx) Medicines", response)
        self.assertIn("Recognized Symptoms", response)

    def test_otc_medicine_lookup(self):
        """
        Verify that querying an OTC medicine returns the correct medicine details.
        """
        response = find_matches("do you have paracetamol")
        self.assertIn("Paracetamol", response)
        self.assertIn("OVER-THE-COUNTER - OTC", response)
        self.assertIn("In Stock", response)
        self.assertIn("₹15.00 per strip", response)

    def test_prescription_medicine_lookup(self):
        """
        Verify that querying a prescription medicine flags that prescription is required
        and prompts the user to confirm.
        """
        response = find_matches("i need amoxicillin")
        self.assertIn("Amoxicillin", response)
        self.assertIn("PRESCRIPTION REQUIRED - Rx", response)
        self.assertIn("Do you have a valid prescription for this medicine", response)

    def test_prescription_confirmation_yes(self):
        """
        Verify the flow when the user answers "yes" to prescription question.
        """
        response = find_matches("yes")
        self.assertIn("Please show the prescription at the counter", response)

    def test_prescription_confirmation_no(self):
        """
        Verify the flow when the user answers "no" to prescription question.
        """
        response = find_matches("no")
        self.assertIn("cannot dispense prescription-only (Rx) medicines without a valid doctor's prescription", response)

    def test_symptom_matching(self):
        """
        Verify that entering a symptom returns matches.
        """
        # "fever" should map to Paracetamol and Dolo 650
        response = find_matches("i have a fever")
        self.assertIn("Paracetamol", response)
        self.assertIn("Dolo 650", response)
        
        # "cough" should map to Benadryl and Corex
        response_cough = find_matches("cough")
        self.assertIn("Benadryl", response_cough)
        self.assertIn("Corex", response_cough)

    def test_fuzzy_medicine_lookup(self):
        """
        Verify that misspelling a medicine name matches fuzzily.
        """
        response = find_matches("do you have paracetaml")
        self.assertIn("Did you mean", response)
        self.assertIn("Paracetamol", response)

    def test_fuzzy_symptom_lookup(self):
        """
        Verify that misspelling a symptom matches fuzzily.
        """
        response = find_matches("i have a feverr")
        self.assertIn("Did you mean", response)
        self.assertIn("fever", response)
        self.assertIn("Paracetamol", response)

    def test_default_unknown_response(self):
        """
        Verify that unknown inputs trigger the default fallback response.
        """
        response = find_matches("what is the weather like today")
        self.assertIn("I'm sorry, I couldn't find a direct match", response)
        self.assertIn("Disclaimer: I am an automated assistant", response)


if __name__ == "__main__":
    unittest.main()
