#!/usr/bin/env python3
"""
Simple test script to verify the GenAI Career Copilot API is working
"""

import requests
import json
import os
from pathlib import Path

API_BASE_URL = "http://localhost:8000"

def test_api_health():
    """Test if the API is running"""
    try:
        response = requests.get(f"{API_BASE_URL}/")
        if response.status_code == 200:
            print("✅ API is running successfully")
            print(f"Response: {response.json()}")
            return True
        else:
            print(f"❌ API health check failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to API. Make sure the backend is running on port 8000")
        return False

def test_interview_roles():
    """Test interview roles endpoint"""
    try:
        response = requests.get(f"{API_BASE_URL}/interview/roles")
        if response.status_code == 200:
            data = response.json()
            print("✅ Interview roles endpoint working")
            print(f"Available roles: {len(data['roles'])}")
            for role in data['roles']:
                print(f"  - {role['title']}: {role['behavioral_count']} behavioral + {role['technical_count']} technical questions")
            return True
        else:
            print(f"❌ Interview roles test failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Interview roles test error: {e}")
        return False

def test_interview_question():
    """Test getting an interview question"""
    try:
        response = requests.get(f"{API_BASE_URL}/interview/software_engineer/question?question_type=behavioral&question_number=0")
        if response.status_code == 200:
            data = response.json()
            print("✅ Interview question endpoint working")
            print(f"Sample question: {data['question']}")
            return True
        else:
            print(f"❌ Interview question test failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Interview question test error: {e}")
        return False

def test_jobs_endpoint():
    """Test jobs endpoint"""
    try:
        response = requests.get(f"{API_BASE_URL}/jobs")
        if response.status_code == 200:
            data = response.json()
            print("✅ Jobs endpoint working")
            print(f"Available jobs: {len(data['jobs'])}")
            return True
        else:
            print(f"❌ Jobs test failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Jobs test error: {e}")
        return False

def main():
    print("🧪 Testing GenAI Career Copilot API...")
    print("=" * 50)
    
    tests = [
        test_api_health,
        test_interview_roles,
        test_interview_question,
        test_jobs_endpoint
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
        print()
    
    print("=" * 50)
    print(f"Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! The API is working correctly.")
    else:
        print("⚠️  Some tests failed. Check the error messages above.")
        
    print("\nNext steps:")
    print("1. Make sure you have set OPENAI_API_KEY in backend/.env")
    print("2. Test file upload endpoints with actual resume files")
    print("3. Start the frontend with 'npm start' in the frontend directory")

if __name__ == "__main__":
    main()