import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function CANNMemberLogin() {
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement authentication logic
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 border border-[#00AFE6]/20 rounded-full px-6 py-2 mb-8">
              <LogIn className="w-4 h-4 text-[#00AFE6]" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                CANN Member Portal
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                Member
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Login
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed">
              Access your CANN member dashboard, resources, and connect with the nursing network community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Login Form Section */}
      <section className="pb-20">
        <div className="max-w-md mx-auto px-6">
          <motion.div
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Sign in to your CANN member account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00AFE6] focus:border-transparent transition-all duration-300"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00AFE6] focus:border-transparent transition-all duration-300"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-[#00AFE6] border-gray-300 dark:border-gray-600 rounded focus:ring-[#00AFE6]"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-sm text-[#00AFE6] hover:text-[#00DD89] transition-colors duration-300"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white py-3 px-6 rounded-2xl font-medium hover:shadow-2xl hover:shadow-[#00AFE6]/25 transition-all duration-300 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogIn className="w-5 h-5" />
                Sign In
              </motion.button>
            </form>

            {/* Additional Options */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                Not a CANN member yet?
              </p>
              <a
                href="/join-nursing-network"
                className="block w-full text-center py-3 px-6 border border-[#00AFE6] text-[#00AFE6] rounded-2xl font-medium hover:bg-[#00AFE6] hover:text-white transition-all duration-300"
              >
                Join CANN Today
              </a>
            </div>

            {/* Support */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Need help? Contact{' '}
                <a 
                  href="mailto:support@canadianamyloidosis.ca"
                  className="text-[#00AFE6] hover:text-[#00DD89] transition-colors duration-300"
                >
                  support@canadianamyloidosis.ca
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}