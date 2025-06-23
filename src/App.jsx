import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Brain, MessageCircle, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import minimalObject from './assets/minimal_3d_object.png'
import MBTITest from './components/MBTITest.jsx'
import TKITest from './components/TKITest.jsx'
import ChatBot from './components/ChatBot.jsx'
import { trackEvent } from './utils/errorHandler.js'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('home')

  const handleNavigation = (view) => {
    // Track navigation events
    trackEvent('navigation', {
      from: currentView,
      to: view,
      timestamp: new Date().toISOString()
    })
    setCurrentView(view)
  }

  const HomeView = () => (
    <main className="futuristic-bg min-h-screen flex items-center justify-center relative">
      {/* Floating 3D Objects */}
      <motion.img 
        src={minimalObject} 
        alt="Decorative 3D geometric object" 
        className="floating-3d w-32 h-32 opacity-30"
        style={{ top: '10%', left: '10%' }}
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.img 
        src={minimalObject} 
        alt="Decorative 3D geometric object" 
        className="floating-3d w-24 h-24 opacity-20"
        style={{ top: '70%', right: '15%' }}
        animate={{ 
          y: [0, -15, 0],
          rotate: [360, 180, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      <div className="container mx-auto px-6 z-10 relative">
        <motion.header 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 futuristic-text">
            Y.AI
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-200">
            Learning & Development Platform
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Discover your potential through advanced psychometric assessments and AI-powered guidance. 
            Transform your professional development with scientifically-backed personality insights and conflict resolution strategies.
          </p>
        </motion.header>

        <section className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto" aria-label="Assessment and guidance tools">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="glass-card hover:scale-105 transition-transform duration-300 cursor-pointer focus-within:ring-2 focus-within:ring-cyan-300"
                  onClick={() => handleNavigation('mbti')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleNavigation('mbti')}
                  aria-label="Take MBTI personality assessment">
              <CardContent className="p-8 text-center">
                <div className="glass-button-primary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 glow-effect">
                  <Brain className="w-10 h-10 text-cyan-300" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">MBTI Assessment</h3>
                <p className="text-gray-300 mb-6">
                  Discover your personality type through the Myers-Briggs Type Indicator. 
                  Understand your preferences in how you perceive the world and make decisions.
                </p>
                <Button className="glass-button glass-button-primary w-full text-white hover:text-cyan-300">
                  Take MBTI Test
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="glass-card hover:scale-105 transition-transform duration-300 cursor-pointer focus-within:ring-2 focus-within:ring-pink-300"
                  onClick={() => handleNavigation('tki')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleNavigation('tki')}
                  aria-label="Take TKI conflict resolution assessment">
              <CardContent className="p-8 text-center">
                <div className="glass-button-secondary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 glow-effect">
                  <Users className="w-10 h-10 text-pink-300" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">TKI Conflict Resolution</h3>
                <p className="text-gray-300 mb-6">
                  Learn your conflict management style with the Thomas-Kilmann Instrument. 
                  Develop better strategies for handling workplace and personal conflicts.
                </p>
                <Button className="glass-button glass-button-secondary w-full text-white hover:text-pink-300">
                  Take TKI Test
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Card className="glass-card hover:scale-105 transition-transform duration-300 cursor-pointer focus-within:ring-2 focus-within:ring-purple-300"
                  onClick={() => handleNavigation('chat')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleNavigation('chat')}
                  aria-label="Chat with AI assistant">
              <CardContent className="p-8 text-center">
                <div className="glass-button-accent w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 glow-effect">
                  <MessageCircle className="w-10 h-10 text-purple-300" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">AI Chatbot</h3>
                <p className="text-gray-300 mb-6">
                  Get personalized guidance and insights from our AI-powered assistant. 
                  Receive tailored advice for your professional development journey.
                </p>
                <Button className="glass-button glass-button-accent w-full text-white hover:text-purple-300">
                  Chat with AI
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        <motion.footer 
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <p className="text-gray-400 text-lg">
            Powered by advanced AI and psychological research
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Scientifically validated assessments for professional growth
          </p>
        </motion.footer>
      </div>
    </main>
  )

  const renderCurrentView = () => {
    switch(currentView) {
      case 'mbti':
        return <MBTITest onBack={() => handleNavigation('home')} />
      case 'tki':
        return <TKITest onBack={() => handleNavigation('home')} />
      case 'chat':
        return <ChatBot onBack={() => handleNavigation('home')} />
      default:
        return <HomeView />
    }
  }

  return renderCurrentView()
}

export default App

