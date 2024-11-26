'use client';

import Image from 'next/image';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Logo() {
  const { theme } = useTheme();
  const router = useRouter();
  
  return (
    <motion.div 
      className="h-8 relative group cursor-pointer z-50"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => router.push('https://theiconmuse.com')}
    >
      {/* Enchanted Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-1000">
        <div className="absolute inset-0 bg-primary/3 blur-3xl animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/2 to-white/3" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/2 to-white/3" />
      </div>
      
      {/* Magical Particles */}
      <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            initial={{ opacity: 0, scale: 0 }}
            animate={i % 3 === 0 ? {
              opacity: [0, 0.3, 0],
              scale: [0, 1, 0],
              x: [0, Math.random() * 40 - 20],
              y: [0, Math.random() * -25 - 15],
            } : i % 3 === 1 ? {
              opacity: [0, 0.3, 0],
              scale: [0, 1, 0],
              x: [0, Math.random() * -40 + 20],
              y: [0, Math.random() * 25 + 15],
            } : {
              opacity: [0, 0.3, 0],
              scale: [0, 1, 0],
              x: [0, 0],
              y: [0, Math.random() * -30],
            }}
            transition={{
              duration: 2.5,
              delay: i * 0.15,
              repeat: Infinity,
              repeatDelay: 0.5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `linear-gradient(135deg, ${theme === 'dark' ? '#ffffff' : '#4169E1'} 0%, transparent 95%)`,
            }}
          />
        ))}
      </div>

      {/* Enchanted Logo Animation */}
      <motion.div
        className="relative z-[1]"
        initial={false}
        animate={{ 
          filter: ['brightness(1)', 'brightness(1.05)', 'brightness(1)'],
          rotate: [0, 0.3, -0.3, 0],
          y: [0, -1, 0]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      >
        <Image
          src={theme === 'dark' ? '/logos/logo-dark.png' : '/logos/logo-light.png'}
          alt="ICON muse"
          width={120}
          height={32}
          className="object-contain relative z-10 group-hover:drop-shadow-[0_0_8px_rgba(65,105,225,0.1)]
                     transition-all duration-700"
          priority
        />
      </motion.div>

      {/* Ethereal Highlights */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 
                      opacity-0 group-hover:opacity-100 
                      transition-opacity duration-1000 ease-out
                      blur-3xl" />
        
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/2 to-white/0
                      opacity-0 group-hover:opacity-100 
                      transition-opacity duration-1200 ease-out
                      blur-2xl" />
      </div>
    </motion.div>
  );
} 