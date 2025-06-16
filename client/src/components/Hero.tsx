import { motion } from 'framer-motion';
import { Search, Upload, BookOpen, Users } from 'lucide-react';

const actionTiles = [
  {
    id: 'directory',
    title: 'Directory',
    description: 'Find clinics and specialists',
    icon: Search,
    href: '#directory'
  },
  {
    id: 'upload',
    title: 'Upload',
    description: 'Share resources',
    icon: Upload,
    href: '#upload'
  },
  {
    id: 'learn',
    title: 'Learn',
    description: 'Educational materials',
    icon: BookOpen,
    href: '#learn'
  },
  {
    id: 'join',
    title: 'Join',
    description: 'Connect with us',
    icon: Users,
    href: '#join'
  }
];

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-white flex items-center pt-16">
      {/* Subtle abstract background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute top-20 left-10 w-32 h-32 text-gray-100" fill="currentColor" opacity="0.3">
          <circle cx="64" cy="64" r="32" />
        </svg>
        <svg className="absolute top-40 right-20 w-24 h-24 text-blue-50" fill="currentColor" opacity="0.4">
          <circle cx="48" cy="48" r="24" />
        </svg>
        <svg className="absolute bottom-32 left-1/4 w-20 h-20 text-green-50" fill="currentColor" opacity="0.3">
          <circle cx="40" cy="40" r="20" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 w-full">
        {/* Hero Content */}
        <div className="text-center mb-24">
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-light text-gray-900 mb-8 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
          >
            Canadian Amyloidosis Society
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl text-gray-600 font-light max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.6, -0.05, 0.01, 0.99] }}
          >
            Accelerating awareness, diagnosis, and care
          </motion.p>
        </div>

        {/* Action Tiles - Crawford style cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {actionTiles.map((tile, index) => {
            const IconComponent = tile.icon;
            return (
              <motion.a
                key={tile.id}
                href={tile.href}
                className="group bg-white rounded-2xl p-8 border border-gray-100 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.4 + (index * 0.1),
                  ease: [0.6, -0.05, 0.01, 0.99]
                }}
              >
                <div className="mb-6">
                  <div className="w-12 h-12 mx-auto bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-[#00AFE6] transition-colors duration-300">
                    <IconComponent className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {tile.title}
                </h3>
                
                <p className="text-sm text-gray-600">
                  {tile.description}
                </p>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}