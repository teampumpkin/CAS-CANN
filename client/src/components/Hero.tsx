import { motion } from 'framer-motion';
import { Search, Upload, BookOpen, Users } from 'lucide-react';

const actionTiles = [
  {
    id: 'directory',
    title: 'Directory',
    description: 'Find specialized clinics and healthcare providers',
    icon: Search,
    href: '#directory'
  },
  {
    id: 'upload',
    title: 'Upload',
    description: 'Share resources and clinical materials',
    icon: Upload,
    href: '#upload'
  },
  {
    id: 'learn',
    title: 'Learn',
    description: 'Access educational materials and research',
    icon: BookOpen,
    href: '#learn'
  },
  {
    id: 'join',
    title: 'Join',
    description: 'Connect with our community and mission',
    icon: Users,
    href: '#join'
  }
];

export default function Hero() {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none">
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00AFE6" />
              <stop offset="100%" stopColor="#00DD89" />
            </linearGradient>
          </defs>
          <path d="M200,150 Q300,50 450,120 T750,200 Q900,150 1100,250" stroke="url(#gradient1)" strokeWidth="2" fill="none" opacity="0.3"/>
          <circle cx="300" cy="200" r="80" fill="url(#gradient1)" opacity="0.2"/>
          <circle cx="800" cy="300" r="120" fill="url(#gradient1)" opacity="0.15"/>
          <path d="M100,400 Q400,300 700,450 T1000,500" stroke="url(#gradient1)" strokeWidth="3" fill="none" opacity="0.2"/>
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Hero Content */}
        <div className="text-center mb-20">
          <motion.h1
            className="text-5xl lg:text-7xl font-light text-gray-900 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
          >
            Canadian Amyloidosis Society
          </motion.h1>
          
          <motion.p
            className="text-xl lg:text-2xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.6, -0.05, 0.01, 0.99] }}
          >
            Accelerating awareness, diagnosis, and care
          </motion.p>
        </div>

        {/* Action Tiles */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {actionTiles.map((tile, index) => {
            const IconComponent = tile.icon;
            return (
              <motion.a
                key={tile.id}
                href={tile.href}
                className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 transition-all duration-300"
                style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)' }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.4 + (index * 0.1),
                  ease: [0.6, -0.05, 0.01, 0.99]
                }}
                whileHover={{ 
                  y: -8,
                  boxShadow: '0 8px 40px rgba(0, 0, 0, 0.08)',
                  transition: { duration: 0.2 }
                }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-[#00AFE6] transition-all duration-300">
                    <IconComponent className="w-8 h-8 text-gray-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  
                  <h3 className="text-xl font-medium text-gray-900 mb-3 group-hover:text-[#00AFE6] transition-colors duration-300">
                    {tile.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {tile.description}
                  </p>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}