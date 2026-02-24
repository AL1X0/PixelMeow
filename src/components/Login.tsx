import React from 'react';
import { LogIn, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

export const Login: React.FC = () => {
    const { login } = useAuth();

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#030712] z-50 p-4">
            {/* Background Decorative Elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-lg"
            >
                <div className="glass-panel p-10 rounded-[2.5rem] flex flex-col items-center text-center relative overflow-hidden">
                    {/* Animated Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />

                    <motion.div
                        initial={{ scale: 0.8, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                        className="w-20 h-20 bg-gradient-to-br from-[#00D1FF] to-[#A855F7] rounded-3xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,209,255,0.3)]"
                    >
                        <Sparkles className="w-10 h-10 text-white" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-5xl font-black mb-4 tracking-tight"
                    >
                        <span className="text-white">Pixel</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D1FF] to-[#A855F7]"> Meow</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-gray-400 text-lg mb-10 max-w-sm leading-relaxed"
                    >
                        Rejoignez des milliers de créateurs sur le canevas collaboratif le plus fluide au monde.
                    </motion.p>

                    <motion.div
                        className="w-full"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <button
                            onClick={login}
                            className="btn-premium w-full flex items-center justify-center gap-4 group"
                        >
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                            </div>
                            <span className="text-lg">Commencer à dessiner</span>
                            <LogIn className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-8 flex gap-8 items-center"
                    >
                        <div className="flex flex-col items-center">
                            <span className="text-white font-bold text-xl">500x500</span>
                            <span className="text-gray-500 text-xs uppercase tracking-widest">Grille</span>
                        </div>
                        <div className="w-[1px] h-8 bg-white/10" />
                        <div className="flex flex-col items-center">
                            <span className="text-white font-bold text-xl">10s</span>
                            <span className="text-gray-500 text-xs uppercase tracking-widest">Délai</span>
                        </div>
                        <div className="w-[1px] h-8 bg-white/10" />
                        <div className="flex flex-col items-center">
                            <span className="text-white font-bold text-xl">∞</span>
                            <span className="text-gray-500 text-xs uppercase tracking-widest">Liberté</span>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Footer Subtle Text */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-8 text-gray-600 text-sm font-medium tracking-wide"
            >
                Fièrement propulsé par Supabase & Firebase
            </motion.p>
        </div>
    );
};
