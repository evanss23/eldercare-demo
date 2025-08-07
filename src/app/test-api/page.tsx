"use client";

import { useState } from "react";
import { elderCareAPI } from "@/lib/api";
import { FaSpinner } from "react-icons/fa";

export default function TestAPIPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const runTests = async () => {
    setTesting(true);
    setTestResults([]);

    // Test 1: Normal message
    addResult("Test 1: Sending normal message...");
    try {
      const response = await elderCareAPI.sendMessage("Hello, how are you today?");
      addResult(`✅ Success: ${response.ai_response}`);
      addResult(`Wellness Score: ${response.wellness_score}`);
      addResult(`Emotion: ${response.emotion}`);
    } catch (error) {
      addResult(`❌ Error: ${error}`);
    }

    // Test 2: Empty message
    addResult("\nTest 2: Sending empty message...");
    try {
      const response = await elderCareAPI.sendMessage("");
      addResult(`✅ Response: ${response.ai_response}`);
    } catch (error) {
      addResult(`❌ Error: ${error}`);
    }

    // Test 3: Long message
    addResult("\nTest 3: Sending long message...");
    try {
      const longMessage = "This is a very long message that simulates what happens when an elderly person tells a detailed story about their day, including what they had for breakfast, who they talked to, what they watched on TV, and how they're feeling. ".repeat(3);
      const response = await elderCareAPI.sendMessage(longMessage);
      addResult(`✅ Success: ${response.ai_response.substring(0, 100)}...`);
    } catch (error) {
      addResult(`❌ Error: ${error}`);
    }

    // Test 4: Special characters
    addResult("\nTest 4: Sending special characters...");
    try {
      const response = await elderCareAPI.sendMessage("Hello! 😊 How are you? ñ é ü");
      addResult(`✅ Success: ${response.ai_response}`);
    } catch (error) {
      addResult(`❌ Error: ${error}`);
    }

    // Test 5: Cache test
    addResult("\nTest 5: Testing cache (sending same message twice)...");
    try {
      const start1 = Date.now();
      await elderCareAPI.sendMessage("Test cache message");
      const time1 = Date.now() - start1;
      addResult(`First call took: ${time1}ms`);

      const start2 = Date.now();
      await elderCareAPI.sendMessage("Test cache message");
      const time2 = Date.now() - start2;
      addResult(`Second call took: ${time2}ms (should be faster due to cache)`);
    } catch (error) {
      addResult(`❌ Error: ${error}`);
    }

    // Test 6: Clear cache and retry
    addResult("\nTest 6: Clear cache and retry...");
    try {
      elderCareAPI.clearCache();
      addResult("Cache cleared");
      const response = await elderCareAPI.sendMessage("Message after cache clear");
      addResult(`✅ Success: ${response.ai_response}`);
    } catch (error) {
      addResult(`❌ Error: ${error}`);
    }

    setTesting(false);
    addResult("\n🏁 All tests completed!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API Configuration</h2>
          <p className="text-gray-600 mb-2">
            Current API URL: <code className="bg-gray-100 px-2 py-1 rounded">
              {process.env.NEXT_PUBLIC_API_URL || '/api/chat'}
            </code>
          </p>
          <p className="text-sm text-gray-500">
            To test different scenarios, update NEXT_PUBLIC_API_URL in .env.local
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Suite</h2>
          <button
            onClick={runTests}
            disabled={testing}
            className={`px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 ${
              testing 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {testing ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Running Tests...</span>
              </>
            ) : (
              <span>Run All Tests</span>
            )}
          </button>
        </div>

        {testResults.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm font-mono whitespace-pre-wrap">
                {testResults.join('\n')}
              </pre>
            </div>
          </div>
        )}

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Testing Scenarios:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• <strong>API Down:</strong> Change URL to /api/chat in .env.local</li>
            <li>• <strong>Invalid URL:</strong> Use a non-existent URL</li>
            <li>• <strong>Slow Network:</strong> API has 3 retries with exponential backoff</li>
            <li>• <strong>Cache:</strong> Responses are cached for 5 minutes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}