// src/pages/LandingPage.jsx
import React, { useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BookOpen, ClipboardList, BarChart2, Rocket, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthDialog from '@/components/AuthDialog';
import Footer from '@/components/Footer';

export default function LandingPage() {
  const navigate = useNavigate();

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const phrases = [
    'Створюй курси миттєво',
    'Перевіряй знання автоматично',
    'Аналізуй прогрес детально',
    'Розвивай свої навички щодня'
  ];

  const [phraseIndex, setPhraseIndex] = useState(0);

  const features = [
    {
      icon: <BookOpen className="w-8 h-8 text-indigo-600" />,
      title: 'Курси',
      description: 'Створюйте та проходьте курси з будь-якої тематики.',
    },
    {
      icon: <ClipboardList className="w-8 h-8 text-indigo-600" />,
      title: 'Тести й завдання',
      description: 'Перевіряйте знання студентів і отримуйте миттєвий фідбек.',
    },
    {
      icon: <BarChart2 className="w-8 h-8 text-indigo-600" />,
      title: 'Аналітика',
      description: 'Слідкуйте за прогресом і оцінками в зручних звітах.',
    },
  ];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-300 text-sm mb-6">
            <Rocket className="w-4 h-4" />
            <span>Нова версія платформи</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">DeepDiveStudy</span> — <br />Ваш шлях до знань
          </h1>


          <div className="mt-6 h-8 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={phraseIndex}
                initial={{ opacity: 0, x: -50, y: 0 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 50, y: 0 }}
                transition={{ duration: 0.5 }}
                className="left-0 top-0 text-xl text-gray-600 dark:text-gray-300 whitespace-nowrap"
              >
                {phrases[phraseIndex]}
              </motion.p>
            </AnimatePresence>
          </div>


          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => { setAuthMode('register'); setAuthOpen(true); }}
              className="px-8 py-6 text-lg font-semibold gap-2"
              size="lg"
            >
              Почати безкоштовно
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              onClick={() => { setAuthMode('login'); setAuthOpen(true); }}
              className="py-6 text-lg"
              size="lg"
            >
              Увійти в акаунт
            </Button>
          </div>
          <AuthDialog
            open={authOpen}
            onOpenChange={setAuthOpen}
            initialMode={authMode}
          />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Потужні інструменти для навчання
            </h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Все, що вам потрібно для ефективного навчання та викладання
            </p>
          </motion.div>
          
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-16 grid gap-8 grid-cols-1 md:grid-cols-3"
          >
            {features.map((f, index) => (
              <motion.div key={f.title} variants={item}>
                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                  <CardHeader className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-full">
                      {f.icon}
                    </div>
                    <CardTitle className="text-xl text-black font-bold">{f.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-gray-600 dark:text-gray-300">
                    {f.description}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600 dark:bg-indigo-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Готові розпочати свою подорож?
            </h2>
            <p className="mt-4 text-lg text-indigo-100 max-w-2xl mx-auto">
              Приєднуйтесь до тисяч викладачів та студентів, які вже використовують DeepDiveStudy
            </p>
            <Button 
              onClick={() => navigate('/register')} 
              className="mt-8 px-10 py-6 text-lg font-semibold gap-2 bg-white text-indigo-600 hover:bg-gray-100 hover:text-indigo-700"
              size="lg"
            >
              Зареєструватися зараз
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}