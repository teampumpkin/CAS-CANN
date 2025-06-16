import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface StatItem {
  value: number;
  label: string;
  suffix?: string;
  gradient: string;
}

interface InteractiveStatsCounterProps {
  stats: StatItem[];
}

export default function InteractiveStatsCounter({ stats }: InteractiveStatsCounterProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <AnimatedStat key={index} stat={stat} index={index} />
      ))}
    </div>
  );
}

function AnimatedStat({ stat, index }: { stat: StatItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2000 });

  useEffect(() => {
    if (isInView) {
      motionValue.set(stat.value);
    }
  }, [isInView, motionValue, stat.value]);

  useEffect(() => {
    return springValue.onChange((latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toString();
      }
    });
  }, [springValue]);

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden">
        {/* Subtle animated background effect */}
        <motion.div
          className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          animate={{
            background: [
              "radial-gradient(circle at 0% 0%, rgba(255,255,255,0.05) 0%, transparent 50%)",
              "radial-gradient(circle at 100% 100%, rgba(255,255,255,0.05) 0%, transparent 50%)",
              "radial-gradient(circle at 0% 0%, rgba(255,255,255,0.05) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        <div className="relative z-10 text-center">
          <div className="text-3xl lg:text-4xl font-bold text-white mb-2 flex items-baseline justify-center">
            <span ref={ref}>0</span>
            {stat.suffix && <span className="text-2xl ml-1">{stat.suffix}</span>}
          </div>
          <div className="text-white/70 text-sm font-medium">{stat.label}</div>
        </div>
        
        {/* Subtle pulse effect */}
        <motion.div
          className="absolute inset-0 border border-white/10 rounded-2xl"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
}