import csv
import os

complaints = []

# Base templates per category and language
water_samples = [
    ("kn", "ನಮ್ಮ ರಸ್ತೆಯಲ್ಲಿ ಕಾವೇರಿ ನೀರಿನ ಪೈಪ್ ಒಡೆದಿದೆ", "water", "Jayanagar", False),
    ("kn", "ಕುಡಿಯುವ ನೀರಿನಲ್ಲಿ ಕೊಳಚೆ ನೀರು ಸೇರುತ್ತಿದೆ ತಕ್ಷಣ ಪರಿಶೀಲಿಸಿ", "water", "Koramangala", True),
    ("kanglish", "Namma street alli water pipe odeede, neeru waste aaguthide", "water", "Jayanagar", False),
    ("kanglish", "Drinking water alli sewage mix aagide, makkalige tondare aagide", "water", "Koramangala", True),
    ("en", "Water pipe burst near 4th Block, road is flooding", "water", "Jayanagar", False),
    ("en", "Severe sewage contamination in municipal drinking water line", "water", "Koramangala", True),
    ("hi", "Hamare yahan paani ki pipe phat gayi hai aur paani beh raha hai", "water", "Jayanagar", False),
    ("hi", "Peene ke paani mein ganda naale ka paani mil raha hai bache bimaar ho rahe hain", "water", "Koramangala", True),
]

power_samples = [
    ("kn", "ಕರೆಂಟ್ ಹೋಗಿ 5 ಗಂಟೆಗಳಾಯಿತು, ಯಾರೂ ಫೋನ್ ಎತ್ತುತ್ತಿಲ್ಲ", "electricity", "Whitefield", False),
    ("kn", "ಟ್ರಾನ್ಸ್‌ಫಾರ್ಮರ್ ಶಾರ್ಟ್ ಸರ್ಕ್ಯೂಟ್ ಆಗಿ ಬೆಂಕಿ ಕಾಣಿಸಿಕೊಂಡಿದೆ", "electricity", "Whitefield", True),
    ("kanglish", "Current hogi 5 hours aaytu, yaaru phone ettalla", "electricity", "Whitefield", False),
    ("kanglish", "Transformer spark aagi live wire road mele biddide urgent help beku", "electricity", "Whitefield", True),
    ("en", "Power outage ongoing for 5 hours without restoration in Whitefield", "electricity", "Whitefield", False),
    ("en", "High voltage sparking wire hanging on school entrance road", "electricity", "Whitefield", True),
    ("hi", "Pichle 5 ghante se bijli nahi hai helpline phone nahi utha raha", "electricity", "Whitefield", False),
    ("hi", "Transformer mein aag lag gayi hai live wire sadak par gir gaya hai", "electricity", "Whitefield", True),
]

road_samples = [
    ("kn", "ರಸ್ತೆಯಲ್ಲಿ ಆಳವಾದ ಗುಂಡಿ ಬಿದ್ದಿದ್ದು ವಾಹನ ಸವಾರರು ಬೀಳುತ್ತಿದ್ದಾರೆ", "road", "Indiranagar", True),
    ("kn", "ಫುಟ್‌ಪಾತ್ ಸ್ಲ್ಯಾಬ್ ಒಡೆದು ಪಾದಚಾರಿಗಳಿಗೆ ನಡೆಯಲು ಕಷ್ಟವಾಗಿದೆ", "road", "Indiranagar", False),
    ("kanglish", "Road alli dodda pothole aagide two wheeler skid aagide", "road", "Indiranagar", True),
    ("kanglish", "Footpath paving stones kithu hogive walk madoke aagalla", "road", "Indiranagar", False),
    ("en", "Dangerous deep pothole on main transit corridor risking commuter safety", "road", "Indiranagar", True),
    ("en", "Broken pavement slab causing obstruction for pedestrians", "road", "Indiranagar", False),
    ("hi", "Sadak par bohot bada gaddha hai accident ka khatra hai", "road", "Indiranagar", True),
    ("hi", "Footpath tut gaya hai pedal chalne walon ko pareshaani ho rahi hai", "road", "Indiranagar", False),
]

garbage_samples = [
    ("kn", "ಬೀದಿಯಲ್ಲಿ ತ್ಯಾಜ್ಯ ವಿಲೇವಾರಿ ಮಾಡದೆ 3 ದಿನಗಳಾಗಿವೆ ತೀವ್ರ ದುರ್ನಾತ ಬರುತ್ತಿದೆ", "garbage", "Malleshwaram", False),
    ("kn", "ಕಸದ ರಾಶಿಗೆ ಯಾರೋ ಬೆಂಕಿ ಹಚ್ಚಿದ್ದು ಹೊಗೆಯಿಂದ ಉಸಿರಾಟದ ತೊಂದರೆಯಾಗಿದೆ", "garbage", "Malleshwaram", True),
    ("kanglish", "Kachra vehicle barilla 3 days inda road full waste biddide", "garbage", "Malleshwaram", False),
    ("kanglish", "Garbage pile ge fire hacchidaare full toxic smoke banthide", "garbage", "Malleshwaram", True),
    ("en", "Solid waste not collected for 3 days leading to foul stench", "garbage", "Malleshwaram", False),
    ("en", "Illegal garbage burning creating thick smoke hazard near clinic", "garbage", "Malleshwaram", True),
    ("hi", "Teen din se kachra gaadi nahi aayi hai sadak par kachra phel raha hai", "garbage", "Malleshwaram", False),
    ("hi", "Kachre ke dher mein aag laga di gayi hai dhuaan se saans lena mushkil hai", "garbage", "Malleshwaram", True),
]

health_samples = [
    ("kn", "ಸೊಳ್ಳೆಗಳ ಕಾಟ ಹೆಚ್ಚಾಗಿದ್ದು ಡೆಂಗ್ಯೂ ಹರಡುವ ಭೀತಿ ಇದೆ ಔಷಧಿ ಸಿಂಪಡಿಸಿ", "health", "Koramangala", True),
    ("kn", "ಸಾರ್ವಜನಿಕ ಉದ್ಯಾನವನದಲ್ಲಿ ಸ್ವಚ್ಛತೆ ಇಲ್ಲದೆ ಅನೈರ್ಮಲ್ಯ ಉಂಟಾಗಿದೆ", "health", "Jayanagar", False),
    ("kanglish", "Mosquitoes jasthi aagide fogging madsbeku urgent dengue risk ide", "health", "Koramangala", True),
    ("kanglish", "Public park alli sanitation illa dirty water nintukondide", "health", "Jayanagar", False),
    ("en", "Stagnant water breeding mosquitoes creating dengue outbreak hazard", "health", "Koramangala", True),
    ("en", "Public health sanitation inspection required in municipal market area", "health", "Jayanagar", False),
    ("hi", "Machhar bohot badh gaye hain dengue ka darr hai fogging karwaiye", "health", "Koramangala", True),
    ("hi", "Park mein gandagi faili hui hai bimaari failne ka khatra hai", "health", "Jayanagar", False),
]

all_pools = water_samples + power_samples + road_samples + garbage_samples + health_samples

# Repeat and diversify to 120 items
dataset = []
idx = 1
for pool_round in range(3):
    for lang, text, cat, loc, safety in all_pools:
        variation_text = text
        if pool_round == 1:
            variation_text = f"Urgent update: {text} - please resolve soon."
        elif pool_round == 2:
            variation_text = f"Notice: {text} (Ward report #{idx})."
        dataset.append({
            "id": idx,
            "language": lang,
            "text": variation_text,
            "expected_category": cat,
            "expected_location": loc,
            "expected_safety": safety
        })
        idx += 1

csv_path = "/home/gopikrishna/Documents/resolveiq/backend/eval/dataset.csv"
with open(csv_path, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["id", "language", "text", "expected_category", "expected_location", "expected_safety"])
    writer.writeheader()
    writer.writerows(dataset[:120])

print(f"Generated {len(dataset[:120])} labelled complaints in {csv_path}")

