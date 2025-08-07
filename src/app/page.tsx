import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          ElderCare AI Demo
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Powered by Gemma 3n Multimodal AI
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Link href="/elder" className="block">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-2 border-blue-100 hover:border-blue-300">
              <div className="text-6xl mb-4">👵</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Elder Interface
              </h2>
              <p className="text-gray-600">
                Chat with your AI companion, share memories, and get gentle reminders
              </p>
            </div>
          </Link>
          
          <Link href="/caregiver" className="block">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-2 border-green-100 hover:border-green-300">
              <div className="text-6xl mb-4">👨‍⚕️</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Caregiver Dashboard
              </h2>
              <p className="text-gray-600">
                Monitor wellness, view alerts, and manage medication schedules
              </p>
            </div>
          </Link>
        </div>
        
        <div className="mt-12 text-sm text-gray-500">
          <p>Demo Features:</p>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <span className="bg-blue-100 px-3 py-1 rounded-full">Validation Therapy</span>
            <span className="bg-green-100 px-3 py-1 rounded-full">Safety Monitoring</span>
            <span className="bg-purple-100 px-3 py-1 rounded-full">Photo Memories</span>
            <span className="bg-yellow-100 px-3 py-1 rounded-full">Wellness Tracking</span>
          </div>
        </div>
      </div>
    </div>
  );
}
