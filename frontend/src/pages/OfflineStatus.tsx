import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { ArrowLeft, WifiOff, CheckCircle2, CloudOff, Database } from 'lucide-react'

const OfflineStatus = () => {
  const navigate = useNavigate()

  return (
    <Layout>
      <header className="p-6 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-2xl shadow-md">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Offline Status</h1>
      </header>

      <main className="p-6 space-y-6">
        <div className="card bg-white p-8 flex flex-col items-center text-center gap-4">
          <div className="p-6 bg-amber-100 text-amber-600 rounded-full">
            <WifiOff size={64} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">You are Offline</h2>
            <p className="text-gray-500 mt-2">But don't worry, AI SATHI works without internet!</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold">Ready for Offline</h3>
          
          <div className="card bg-white p-5 flex items-center gap-4">
            <div className="text-green-500"><CheckCircle2 size={32} /></div>
            <div className="flex-1">
              <p className="font-bold">App Interface</p>
              <p className="text-sm text-gray-500">All screens are cached</p>
            </div>
          </div>

          <div className="card bg-white p-5 flex items-center gap-4">
            <div className="text-green-500"><CheckCircle2 size={32} /></div>
            <div className="flex-1">
              <p className="font-bold">Local Database</p>
              <p className="text-sm text-gray-500">Your data is saved locally</p>
            </div>
          </div>

          <div className="card bg-white p-5 flex items-center gap-4 opacity-50">
            <div className="text-amber-500"><CloudOff size={32} /></div>
            <div className="flex-1">
              <p className="font-bold">Cloud Sync</p>
              <p className="text-sm text-gray-500">Paused (Waiting for connection)</p>
            </div>
          </div>
        </div>

        <section className="card bg-blue-50 border-blue-100 p-6 flex items-center gap-4">
          <Database className="text-blue-500" size={40} />
          <div>
            <h4 className="font-bold text-blue-900">Storage Usage</h4>
            <p className="text-blue-700">12.5 MB used of 50 MB</p>
          </div>
        </section>
      </main>
    </Layout>
  )
}

export default OfflineStatus

