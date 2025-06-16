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
      
      // Check if hovering over interactive elements
      const target = e.target as HTMLElement;
      let isInteractive = false;
      
      if (target && target.nodeType === Node.ELEMENT_NODE) {
        // Check direct element
        if (target.tagName === 'BUTTON' || target.tagName === 'A') {
          isInteractive = true;
        }
        // Check parent elements safely
        else {
          let parent = target.parentElement;
          while (parent && !isInteractive) {
            if (parent.tagName === 'BUTTON' || parent.tagName === 'A') {
              isInteractive = true;
              break;
            }
            parent = parent.parentElement;
          }
        }
      }
      
      setIsHovering(isInteractive);
    };

    window.addEventListener('mousemove', moveCursor);
    
    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Subtle glassmorphism cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] hidden lg:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          scale,
        }}
      >
        <div className="relative w-full h-full">
          {/* Main cursor circle */}
          <motion.div
            className="absolute inset-0 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg"
            animate={{
              scale: isHovering ? 1.5 : 1,
              backgroundColor: isHovering ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Center dot */}
            <motion.div
              className="absolute top-1/2 left-1/2 w-1 h-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60"
              animate={{
                scale: isHovering ? 0 : 1,
                opacity: isHovering ? 0 : 0.8,
              }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>
          
          {/* Subtle hover ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-white/20"
            animate={{
              scale: isHovering ? 1.8 : 0.5,
              opacity: isHovering ? 0.6 : 0,
            }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </motion.div>
      
      {/* Subtle trail effect */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 pointer-events-none z-[9998] hidden lg:block"
        style={{
          x: cursorXDelayed,
          y: cursorYDelayed,
          scale: useTransform(scale, [0, 1], [0, 0.7]),
        }}
      >
        <div className="w-full h-full rounded-full bg-white/3 backdrop-blur-sm border border-white/5" />
      </motion.div>
    </>
  );
}