import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../context/AuthContext'
import { useLanguageStore } from '../context/LanguageContext'
import { Phone, User, Lock, ArrowRight, Leaf, Eye, EyeOff } from 'lucide-react'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const { t } = useLanguageStore()
  const [isRegister, setIsRegister] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    otp: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const users = JSON.parse(localStorage.getItem('ai_sathi_users') || '{}')

    if (isRegister) {
      // Basic validation for new accounts
      if (formData.otp.length < 4) {
        setError(t('login_error_password_length'))
        return
      }
      
      // Save user to simulated DB
      users[formData.phone] = {
        name: formData.name,
        password: formData.otp
      }
      localStorage.setItem('ai_sathi_users', JSON.stringify(users))
      
      login(formData.name, formData.phone)
      navigate('/dashboard')
    } else {
      // Login Logic
      const userData = users[formData.phone]

      if (!userData) {
        setError(t('login_error_phone_not_registered'))
        return
      }

      if (userData.password !== formData.otp) {
        setError(t('login_error_wrong_password'))
        return
      }

      login(userData.name, formData.phone)
      navigate('/dashboard')
    }
  }

  const toggleMode = () => {
    setIsRegister(!isRegister)
    setError('') // Clear any error when switching
    setFormData({ ...formData, otp: '' }) // Clear password field for security/clarity
  }

  return (
    <div className="min-h-screen bg-rural-light dark:bg-gray-900 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-rural rounded-2xl flex items-center justify-center text-white shadow-xl mb-4">
            <Leaf size={32} />
          </div>
          <h1 className="text-2xl font-bold text-rural-dark dark:text-white">AI SATHI</h1>
          <p className="text-gray-500 dark:text-gray-400">{t('login_digital_farming_companion')}</p>
        </div>

        <div className="card bg-white dark:bg-gray-800 p-8 border-none shadow-2xl rounded-[2.5rem]">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">
            {isRegister ? t('login_create_account') : t('login_welcome_back')}
          </h2>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-bold border border-red-100"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div className="relative">
                <User className="absolute left-4 top-4 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={t('login_full_name')}
                  required
                  className="w-full p-4 pl-12 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-2xl focus:ring-2 focus:ring-rural outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            )}

            <div className="relative">
              <Phone className="absolute left-4 top-4 text-gray-400" size={20} />
              <input
                type="tel"
                placeholder={t('login_phone_number')}
                required
                className="w-full p-4 pl-12 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-2xl focus:ring-2 focus:ring-rural outline-none transition-all"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
              <input
                type="password"
                placeholder={isRegister ? t('login_create_password') : t('login_password')}
                required
                className="w-full p-4 pl-12 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-2xl focus:ring-2 focus:ring-rural outline-none transition-all"
                value={formData.otp}
                onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-5 text-xl mt-4 shadow-rural/20"
            >
              {isRegister ? t('register_button') : t('login_button')}
              <ArrowRight size={24} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={toggleMode}
              className="text-rural font-bold hover:underline"
            >
              {isRegister ? t('login_already_have_account') : t('login_new_here')}
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-gray-400 text-sm">
          {t('login_secure_auth')}
        </p>
      </motion.div>
    </div>
  )
}

export default Login
