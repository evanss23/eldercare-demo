import requests
import json

API_URL = "https://[YourUsername]-eldercare-api.hf.space/run/predict" # Note: the endpoint is /run/predict for Gradio interfaces

def test_api(message):
    response = requests.post(API_URL, json={"data": [message]})
    print(f"Status Code: {response.status_code}")
    # The actual data is nested under a 'data' key
    print(json.dumps(response.json()['data'][0], indent=2))

if __name__ == "__main__":
    test_api("Hello, how are you?")
    test_api("I am feeling a little sad today.")