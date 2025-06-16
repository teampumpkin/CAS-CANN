import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function AdvancedMouseFollower() {
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 30, stiffness: 200 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Delayed followers for trail effect
  const delayedSpringConfig = { damping: 20, stiffness: 150 };
  const cursorXDelayed = useSpring(cursorX, delayedSpringConfig);
  const cursorYDelayed = useSpring(cursorY, delayedSpringConfig);

  // Transform values for dynamic effects
  const scale = useTransform(cursorXSpring, [-100, 0], [0, 1]);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 32);
      cursorY.set(e.clientY - 32);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);
    
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Main glassmorphism cursor */}
      <motion.div
        className="fixed top-0 left-0 w-16 h-16 pointer-events-none z-[9999] hidden lg:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          scale,
        }}
      >
        <div className="relative w-full h-full">
          {/* Outer glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00AFE6]/30 to-[#00DD89]/30 blur-md"
            animate={{
              scale: isHovering ? 1.3 : 1,
              opacity: isHovering ? 0.8 : 0.5,
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Main glassmorphism circle */}
          <motion.div
            className="absolute inset-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl"
            animate={{
              scale: isHovering ? 1.2 : 1,
              backgroundColor: isHovering ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Inner gradient core */}
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-[#00AFE6]/40 to-[#00DD89]/40 blur-sm" />
            
            {/* Center dot */}
            <motion.div
              className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80"
              animate={{
                scale: isHovering ? 0 : 1,
                opacity: isHovering ? 0 : 0.9,
              }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>
          
          {/* Hover state ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[#00AFE6]/60"
            animate={{
              scale: isHovering ? 1.4 : 0.8,
              opacity: isHovering ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>
      
      {/* Delayed trail effect */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9998] hidden lg:block"
        style={{
          x: cursorXDelayed,
          y: cursorYDelayed,
          scale,
        }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-r from-[#00AFE6]/20 to-[#00DD89]/20 backdrop-blur-sm border border-white/10" />
      </motion.div>
      
      {/* Additional trailing particles */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 pointer-events-none z-[9997] hidden lg:block"
        style={{
          x: useTransform(cursorXDelayed, (x) => x + 8),
          y: useTransform(cursorYDelayed, (y) => y + 8),
          scale: useTransform(scale, [0, 1], [0, 0.6]),
        }}
      >
        <div className="w-full h-full rounded-full bg-white/20 backdrop-blur-sm" />
      </motion.div>
    </>
  );
}