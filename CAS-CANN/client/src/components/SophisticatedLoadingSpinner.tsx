import { motion } from 'framer-motion';

interface SophisticatedLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function SophisticatedLoadingSpinner({ 
  size = 'md', 
  className = "" 
}: SophisticatedLoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-20 h-20'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 border-4 border-transparent border-t-[#00AFE6] border-r-[#00DD89] rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
      />
      
      {/* Inner ring */}
      <motion.div
        className="absolute inset-2 border-2 border-transparent border-b-[#00DD89] border-l-[#00AFE6] rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 1, ease: "linear", repeat: Infinity }}
      />
      
      {/* Center dot */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full transform -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
    </div>
  );
}