import {testGeminiAPI} from '@/lib/test-gemini';

export default async function TestPage() {
  const result = await testGeminiAPI();
  
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Gemini API Test</h1>
        
        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${result.success ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'} border`}>
            <h2 className="text-xl font-semibold mb-2">
              {result.success ? '✅ API Test Successful' : '❌ API Test Failed'}
            </h2>
            
            {result.success ? (
              <div>
                <p className="mb-4">Gemini API is working correctly! Generated subject lines:</p>
                <ul className="list-disc list-inside space-y-2">
                  {result.subjectLines?.map((line, index) => (
                    <li key={index} className="bg-white p-2 rounded">{line}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <p className="mb-2">Error details:</p>
                <p className="text-red-700">{result.error}</p>
              </div>
            )}
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Next Steps:</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>Get your API key from https://ai.google.dev/</li>
              <li>Set GEMINI_API_KEY environment variable</li>
              <li>Deploy to Vercel with environment variables</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
