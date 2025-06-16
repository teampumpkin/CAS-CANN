import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect } from 'react';

export default function AdvancedMouseFollower() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full mix-blend-difference pointer-events-none z-[9999] hidden lg:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      />
      
      {/* Trail effect */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full mix-blend-difference pointer-events-none z-[9998] hidden lg:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        transition={{ delay: 0.1 }}
      />
    </>
  );
}