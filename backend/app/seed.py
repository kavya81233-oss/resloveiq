from app.database import SessionLocal, Base, engine
from app.models.models import Area, User, SOPChunk, Incident
from argon2 import PasswordHasher

ph = PasswordHasher()

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    try:
        # Check if already seeded
        if db.query(Area).count() >= 5 and db.query(User).count() >= 12:
            print("Database already contains seed data.")
            return

        print("Seeding Bengaluru areas...")
        areas_data = [
            {"name": "Jayanagar", "lat": 12.9299, "lng": 77.5826, "description": "South Bengaluru Zone - Water Supply Main Sector"},
            {"name": "Koramangala", "lat": 12.9352, "lng": 77.6245, "description": "South-East Tech Corridor & High Density Zone"},
            {"name": "Indiranagar", "lat": 12.9784, "lng": 77.6408, "description": "East Zone Commercial & Transit Corridor"},
            {"name": "Malleshwaram", "lat": 13.0035, "lng": 77.5647, "description": "North-West Heritage & Heavy Residential Zone"},
            {"name": "Whitefield", "lat": 12.9698, "lng": 77.7500, "description": "East IT Sub-grid & Major Distribution Substation"},
        ]
        for a in areas_data:
            if not db.query(Area).filter_by(name=a["name"]).first():
                db.add(Area(**a))
        db.commit()

        print("Seeding 12 staff users across 7 teams...")
        teams = [
            "BWSSB Water Supply & Drainage",
            "BESCOM Electrical Operations",
            "BBMP Road Infrastructure",
            "BBMP Solid Waste Management",
            "BBMP Public Health & Sanitation",
            "BESCOM Street Lighting",
            "Civic Operations Central"
        ]
        
        staff_data = [
            {"name": "Ramesh Kumar", "email": "ramesh.admin@resolveiq.gov.in", "role": "admin", "team": "Civic Operations Central", "phone": "+91 98450 11001"},
            {"name": "Deepa Narayanan", "email": "deepa.lead@bwssb.gov.in", "role": "lead", "team": "BWSSB Water Supply & Drainage", "phone": "+91 98450 11002"},
            {"name": "Anil Gowda", "email": "anil.agent@bwssb.gov.in", "role": "agent", "team": "BWSSB Water Supply & Drainage", "phone": "+91 98450 11003"},
            {"name": "Suresh Rao", "email": "suresh.lead@bescom.gov.in", "role": "lead", "team": "BESCOM Electrical Operations", "phone": "+91 98450 11004"},
            {"name": "Manjula K", "email": "manjula.agent@bescom.gov.in", "role": "agent", "team": "BESCOM Electrical Operations", "phone": "+91 98450 11005"},
            {"name": "Prashanth M", "email": "prashanth.lead@bbmp-road.gov.in", "role": "lead", "team": "BBMP Road Infrastructure", "phone": "+91 98450 11006"},
            {"name": "Lakshmi B", "email": "lakshmi.agent@bbmp-road.gov.in", "role": "agent", "team": "BBMP Road Infrastructure", "phone": "+91 98450 11007"},
            {"name": "Venkatesh S", "email": "venkatesh.lead@bbmp-waste.gov.in", "role": "lead", "team": "BBMP Solid Waste Management", "phone": "+91 98450 11008"},
            {"name": "Pooja Hegde", "email": "pooja.agent@bbmp-waste.gov.in", "role": "agent", "team": "BBMP Solid Waste Management", "phone": "+91 98450 11009"},
            {"name": "Dr. Girish C", "email": "girish.lead@bbmp-health.gov.in", "role": "lead", "team": "BBMP Public Health & Sanitation", "phone": "+91 98450 11010"},
            {"name": "Harish Patil", "email": "harish.agent@bescom-light.gov.in", "role": "agent", "team": "BESCOM Street Lighting", "phone": "+91 98450 11011"},
            {"name": "Kavitha R", "email": "kavitha.agent@central.gov.in", "role": "agent", "team": "Civic Operations Central", "phone": "+91 98450 11012"},
        ]
        
        default_pwd_hash = ph.hash("ResolveIQ2026!Secure")
        for u in staff_data:
            if not db.query(User).filter_by(email=u["email"]).first():
                db.add(User(
                    name=u["name"],
                    email=u["email"],
                    hashed_password=default_pwd_hash,
                    role=u["role"],
                    team=u["team"],
                    phone=u["phone"]
                ))
        db.commit()

        print("Seeding 30 SOP chunks...")
        categories = ["water", "electricity", "road", "garbage", "health", "street_light"]
        sop_list = []
        for cat in categories:
            for idx in range(1, 6):
                sop_list.append(SOPChunk(
                    category=cat,
                    title=f"Standard Operating Procedure: {cat.upper()} Protocol #{idx}",
                    content=(
                        f"Step 1: Rapid incident triage and safety isolation for {cat} hazards.\n"
                        f"Step 2: Dispatch certified field technicians with automated telemetry tracking.\n"
                        f"Step 3: Conduct pressure, load, or structural clearance checks.\n"
                        f"Step 4: Notify citizen stakeholders via verified Kannada communications template #{idx}."
                    )
                ))
        for sop in sop_list:
            db.add(sop)
            
        # Seed initial open incidents for map and preview
        init_incidents = [
            {"title": "Cauvery Main Pipeline Rupture", "category": "water", "area": "Jayanagar", "lat": 12.9299, "lng": 77.5826, "affected_count": 14, "status": "OPEN", "root_cause_hypothesis": "Aged 150mm ductile iron sleeve joint fracture under peak pumping surge."},
            {"title": "11kV Feeder Breaker Trip", "category": "electricity", "area": "Whitefield", "lat": 12.9698, "lng": 77.7500, "affected_count": 28, "status": "OPEN", "root_cause_hypothesis": "Transformer insulation breakdown during monsoon humidity spike."},
            {"title": "Drinking Water Sewage Contamination", "category": "water", "area": "Koramangala", "lat": 12.9352, "lng": 77.6245, "affected_count": 19, "status": "OPEN", "root_cause_hypothesis": "Stormwater overflow seepage into secondary feeder line."},
            {"title": "Deep Transit Crater Pothole", "category": "road", "area": "Indiranagar", "lat": 12.9784, "lng": 77.6408, "affected_count": 9, "status": "OPEN", "root_cause_hypothesis": "Sub-base asphalt wash during torrential overnight rainfall."},
            {"title": "Commercial Garbage Accumulation", "category": "garbage", "area": "Malleshwaram", "lat": 13.0035, "lng": 77.5647, "affected_count": 12, "status": "OPEN", "root_cause_hypothesis": "Primary tipper compactor breakdown on Ward 45 route."}
        ]
        for inc in init_incidents:
            if not db.query(Incident).filter_by(title=inc["title"]).first():
                db.add(Incident(**inc))
                
        db.commit()
        print("Database seeded successfully with areas, staff, SOPs, and incidents.")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()

