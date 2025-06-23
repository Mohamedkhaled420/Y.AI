import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const MBTITest = ({ onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)

  const questions = [
    {
      id: 1,
      text: "You regularly make new friends.",
      dimension: "E/I",
      category: "Extraversion vs Introversion"
    },
    {
      id: 2,
      text: "Complex and novel ideas excite you more than simple and straightforward ones.",
      dimension: "S/N",
      category: "Sensing vs Intuition"
    },
    {
      id: 3,
      text: "You usually feel more persuaded by what resonates emotionally with you than by factual arguments.",
      dimension: "T/F",
      category: "Thinking vs Feeling"
    },
    {
      id: 4,
      text: "Your living and working spaces are clean and organized.",
      dimension: "J/P",
      category: "Judging vs Perceiving"
    },
    {
      id: 5,
      text: "You usually stay calm, even under a lot of pressure.",
      dimension: "T/F",
      category: "Thinking vs Feeling"
    },
    {
      id: 6,
      text: "You find the idea of networking or promoting yourself to strangers very daunting.",
      dimension: "E/I",
      category: "Extraversion vs Introversion"
    },
    {
      id: 7,
      text: "You prefer to stick with things you know work rather than try new approaches.",
      dimension: "S/N",
      category: "Sensing vs Intuition"
    },
    {
      id: 8,
      text: "You often get so lost in thoughts that you ignore or forget your surroundings.",
      dimension: "S/N",
      category: "Sensing vs Intuition"
    },
    {
      id: 9,
      text: "You prefer to completely finish one project before starting another.",
      dimension: "J/P",
      category: "Judging vs Perceiving"
    },
    {
      id: 10,
      text: "You are very sentimental and emotional.",
      dimension: "T/F",
      category: "Thinking vs Feeling"
    },
    {
      id: 11,
      text: "You enjoy having a wide circle of acquaintances.",
      dimension: "E/I",
      category: "Extraversion vs Introversion"
    },
    {
      id: 12,
      text: "You often rely on your gut feeling when making decisions.",
      dimension: "T/F",
      category: "Thinking vs Feeling"
    }
  ]

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [currentQuestion]: value }
    setAnswers(newAnswers)
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResults(newAnswers)
    }
  }

  const calculateResults = (finalAnswers) => {
    const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }
    
    questions.forEach((question, index) => {
      const answer = finalAnswers[index]
      if (answer !== undefined) {
        const [first, second] = question.dimension.split('/')
        
        if (answer <= 3) {
          // Disagree - favor second letter
          scores[second] += (4 - answer)
        } else if (answer >= 5) {
          // Agree - favor first letter
          scores[first] += (answer - 3)
        }
      }
    })
    
    const personality = 
      (scores.E > scores.I ? 'E' : 'I') +
      (scores.S > scores.N ? 'S' : 'N') +
      (scores.T > scores.F ? 'T' : 'F') +
      (scores.J > scores.P ? 'J' : 'P')
    
    setShowResults({ personality, scores })
  }

  const getPersonalityDescription = (type) => {
    const descriptions = {
      'INTJ': 'The Architect - Strategic and independent thinker',
      'INTP': 'The Thinker - Innovative and curious problem-solver',
      'ENTJ': 'The Commander - Bold and imaginative leader',
      'ENTP': 'The Debater - Smart and curious innovator',
      'INFJ': 'The Advocate - Creative and insightful idealist',
      'INFP': 'The Mediator - Poetic and kind altruist',
      'ENFJ': 'The Protagonist - Charismatic and inspiring leader',
      'ENFP': 'The Campaigner - Enthusiastic and creative free spirit',
      'ISTJ': 'The Logistician - Practical and fact-minded reliable person',
      'ISFJ': 'The Protector - Warm-hearted and dedicated protector',
      'ESTJ': 'The Executive - Excellent administrator and natural leader',
      'ESFJ': 'The Consul - Extraordinarily caring and popular person',
      'ISTP': 'The Virtuoso - Bold and practical experimenter',
      'ISFP': 'The Adventurer - Flexible and charming artist',
      'ESTP': 'The Entrepreneur - Smart and energetic perceiver',
      'ESFP': 'The Entertainer - Spontaneous and enthusiastic performer'
    }
    return descriptions[type] || 'Unique personality type'
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (showResults) {
    return (
      <div className="futuristic-bg min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full"
        >
          <Card className="glass-card">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl font-bold text-white mb-4 futuristic-text">
                Your MBTI Result
              </CardTitle>
              <div className="text-6xl font-bold text-cyan-300 mb-2">
                {showResults.personality}
              </div>
              <p className="text-xl text-gray-300">
                {getPersonalityDescription(showResults.personality)}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-button-primary p-4 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">Energy Direction</h4>
                  <p className="text-gray-300">
                    {showResults.scores.E > showResults.scores.I ? 'Extraversion (E)' : 'Introversion (I)'}
                  </p>
                </div>
                <div className="glass-button-secondary p-4 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">Information Processing</h4>
                  <p className="text-gray-300">
                    {showResults.scores.S > showResults.scores.N ? 'Sensing (S)' : 'Intuition (N)'}
                  </p>
                </div>
                <div className="glass-button-accent p-4 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">Decision Making</h4>
                  <p className="text-gray-300">
                    {showResults.scores.T > showResults.scores.F ? 'Thinking (T)' : 'Feeling (F)'}
                  </p>
                </div>
                <div className="glass-button-primary p-4 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">Lifestyle</h4>
                  <p className="text-gray-300">
                    {showResults.scores.J > showResults.scores.P ? 'Judging (J)' : 'Perceiving (P)'}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Button 
                  onClick={onBack}
                  className="glass-button glass-button-primary flex-1 text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
                <Button 
                  onClick={() => {
                    setCurrentQuestion(0)
                    setAnswers({})
                    setShowResults(false)
                  }}
                  className="glass-button glass-button-secondary flex-1 text-white"
                >
                  Retake Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="futuristic-bg min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Button 
                onClick={onBack}
                variant="ghost" 
                className="text-gray-300 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <span className="text-gray-300">
                Question {currentQuestion + 1} of {questions.length}
              </span>
            </div>
            <Progress value={progress} className="mb-4" />
            <CardTitle className="text-2xl font-bold text-white text-center">
              MBTI Personality Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <h3 className="text-xl text-gray-300 mb-8 leading-relaxed">
                {questions[currentQuestion].text}
              </h3>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-400">Strongly Disagree</span>
                <span className="text-sm text-gray-400">Strongly Agree</span>
              </div>
              
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleAnswer(value)}
                    className={`w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                      value <= 3 
                        ? 'border-red-400 hover:bg-red-400/20' 
                        : value === 4 
                        ? 'border-gray-400 hover:bg-gray-400/20'
                        : 'border-green-400 hover:bg-green-400/20'
                    } hover:scale-110`}
                  >
                    <span className="text-white font-semibold">{value}</span>
                  </button>
                ))}
              </div>
              
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span className="text-gray-400">4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default MBTITest

