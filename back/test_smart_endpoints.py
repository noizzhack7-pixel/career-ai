"""
Test script demonstrating the smart matching endpoints
Run this after starting the FastAPI server
"""

import requests
import json

BASE_URL = "http://localhost:8000/api/v1/smart"


def create_sample_candidate():
    """Create a sample candidate"""
    return {
        "name": "Alice Johnson",
        "candidate_id": "alice-123",
        "current_position": {
            "name": "Software Engineer",
            "category": "Tech",
            "profiles": [],
            "id": "pos-current-123"
        },
        "past_positions": [
            {
                "name": "Junior Developer",
                "category": "Tech",
                "profiles": [],
                "id": "pos-past-123"
            }
        ],
        "hard_skills": [
            {"skill": "Python Programming", "level": 4.5, "id": "hs1"},
            {"skill": "SQL and Database Design", "level": 4.0, "id": "hs2"},
            {"skill": "REST API Development", "level": 3.5, "id": "hs3"}
        ],
        "soft_skills": [
            {"skill": "Communication", "level": 4.0, "id": "ss1"},
            {"skill": "Problem Solving", "level": 4.5, "id": "ss2"},
            {"skill": "Teamwork", "level": 4.0, "id": "ss3"}
        ]
    }


def create_sample_position():
    """Create a sample position"""
    return {
        "name": "Senior Backend Developer",
        "category": "Tech",
        "id": "position-backend-456",
        "profiles": [
            {
                "name": "Backend Engineer Profile",
                "hard_skills": [
                    {"skill": "Python Programming", "level": 4.0, "id": "phs1"},
                    {"skill": "SQL and Database Design", "level": 3.5, "id": "phs2"},
                    {"skill": "REST API Development", "level": 4.0, "id": "phs3"},
                    {"skill": "Cloud Services (e.g., AWS, GCP, Azure)", "level": 3.0, "id": "phs4"}
                ],
                "soft_skills": [
                    {"skill": "Communication", "level": 3.5, "id": "pss1"},
                    {"skill": "Problem Solving", "level": 4.0, "id": "pss2"},
                    {"skill": "Leadership", "level": 3.0, "id": "pss3"}
                ]
            }
        ]
    }


def test_ingest_candidate():
    """Test ingesting a candidate"""
    print("\n1. Testing candidate ingestion...")
    candidate = create_sample_candidate()
    response = requests.post(f"{BASE_URL}/candidates/ingest", json=candidate)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return candidate["candidate_id"]


def test_ingest_position():
    """Test ingesting a position"""
    print("\n2. Testing position ingestion...")
    position = create_sample_position()
    response = requests.post(f"{BASE_URL}/positions/ingest", json=position)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return position["id"]


def test_skill_gaps(candidate_id, position_id):
    """Test skill gap analysis"""
    print("\n3. Testing skill gap analysis...")
    response = requests.get(
        f"{BASE_URL}/gaps",
        params={"candidate_id": candidate_id, "position_id": position_id}
    )
    print(f"Status: {response.status_code}")
    result = response.json()
    
    print(f"\nReadiness Score: {result['readiness_score']}/100")
    print(f"\nSummary:")
    print(f"  - Total skills required: {result['summary']['total_skills_required']}")
    print(f"  - Skills met: {result['summary']['skills_met']}")
    print(f"  - Critical gaps: {result['summary']['critical_gaps']}")
    print(f"  - Moderate gaps: {result['summary']['moderate_gaps']}")
    print(f"  - Minor gaps: {result['summary']['minor_gaps']}")
    
    print(f"\nRecommendations:")
    for rec in result['recommendations']:
        print(f"  [{rec['priority'].upper()}] {rec['message']}")
        if rec.get('skills'):
            print(f"    Skills: {', '.join(rec['skills'])}")
    
    print(f"\nFull response: {json.dumps(result, indent=2)}")


def test_health_check():
    """Test health check endpoint"""
    print("\n4. Testing health check...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")


def main():
    print("=" * 60)
    print("Smart Matching Endpoints Test")
    print("=" * 60)
    
    try:
        # Test health first
        test_health_check()
        
        # Ingest test data
        candidate_id = test_ingest_candidate()
        position_id = test_ingest_position()
        
        # Test skill gap analysis
        test_skill_gaps(candidate_id, position_id)
        
        print("\n" + "=" * 60)
        print("All tests completed successfully!")
        print("=" * 60)
        
    except requests.exceptions.ConnectionError:
        print("\nERROR: Could not connect to the server.")
        print("Make sure FastAPI is running on http://localhost:8000")
        print("\nStart the server with:")
        print("  cd back")
        print("  uvicorn app.main:app --reload")
        
    except Exception as e:
        print(f"\nERROR: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
