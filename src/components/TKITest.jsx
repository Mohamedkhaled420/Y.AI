import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

const TKITest = ({ onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)

  const questions = [
    {
      id: 1,
      optionA: "In a dispute, one needs to show their strength and assertiveness.",
      optionB: "To maintain good relations, one can give in during an argument.",
      scoreA: { competing: 1 },
      scoreB: { accommodating: 1 }
    },
    {
      id: 2,
      optionA: "If both parties give in in terms of their demands, then any conflict can be solved.",
      optionB: "If one makes an effort, they can find a solution that completely satisfies both parties involved in the conflict.",
      scoreA: { compromising: 1 },
      scoreB: { collaborating: 1 }
    },
    {
      id: 3,
      optionA: "I try to find a compromise solution.",
      optionB: "I attempt to deal with all of his and my concerns.",
      scoreA: { compromising: 1 },
      scoreB: { collaborating: 1 }
    },
    {
      id: 4,
      optionA: "I might try to soothe the other's feelings and preserve our relationship.",
      optionB: "I try to do what is necessary to avoid useless tensions.",
      scoreA: { accommodating: 1 },
      scoreB: { avoiding: 1 }
    },
    {
      id: 5,
      optionA: "I try to find a compromise solution.",
      optionB: "I consistently try to get my way.",
      scoreA: { compromising: 1 },
      scoreB: { competing: 1 }
    },
    {
      id: 6,
      optionA: "I attempt to avoid creating unpleasantness for myself.",
      optionB: "I try to win my position.",
      scoreA: { avoiding: 1 },
      scoreB: { competing: 1 }
    },
    {
      id: 7,
      optionA: "I try to postpone the issue until I have had some time to think it over.",
      optionB: "I give up some points in exchange for others.",
      scoreA: { avoiding: 1 },
      scoreB: { compromising: 1 }
    },
    {
      id: 8,
      optionA: "I am usually firm in pursuing my goals.",
      optionB: "I might try to soothe the other's feelings and preserve our relationship.",
      scoreA: { competing: 1 },
      scoreB: { accommodating: 1 }
    },
    {
      id: 9,
      optionA: "I feel that differences are not always worth worrying about.",
      optionB: "I make some effort to get my way.",
      scoreA: { avoiding: 1 },
      scoreB: { competing: 1 }
    },
    {
      id: 10,
      optionA: "I am firm in pursuing my goals.",
      optionB: "I try to find a compromise solution.",
      scoreA: { competing: 1 },
      scoreB: { compromising: 1 }
    },
    {
      id: 11,
      optionA: "I attempt to get all concerns and issues immediately out in the open.",
      optionB: "I might try to soothe the other's feelings and preserve our relationship.",
      scoreA: { collaborating: 1 },
      scoreB: { accommodating: 1 }
    },
    {
      id: 12,
      optionA: "I sometimes sacrifice my own wishes for the wishes of the other person.",
      optionB: "I try to get the other person to settle for a compromise.",
      scoreA: { accommodating: 1 },
      scoreB: { compromising: 1 }
    }
  ]

  const handleAnswer = (option) => {
    const newAnswers = { ...answers, [currentQuestion]: option }
    setAnswers(newAnswers)
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResults(newAnswers)
    }
  }

  const calculateResults = (finalAnswers) => {
    const scores = {
      competing: 0,
      accommodating: 0,
      avoiding: 0,
      collaborating: 0,
      compromising: 0
    }
    
    questions.forEach((question, index) => {
      const answer = finalAnswers[index]
      if (answer) {
        const scoreKey = answer === 'A' ? 'scoreA' : 'scoreB'
        const scoreData = question[scoreKey]
        Object.keys(scoreData).forEach(mode => {
          scores[mode] += scoreData[mode]
        })
      }
    })
    
    // Find the dominant style
    const dominantStyle = Object.keys(scores).reduce((a, b) => 
      scores[a] > scores[b] ? a : b
    )
    
    setShowResults({ dominantStyle, scores })
  }

  const getStyleDescription = (style) => {
    const descriptions = {
      competing: {
        title: 'Competing (Assertive & Uncooperative)',
        description: 'You pursue your own concerns at the other person\'s expense. This is a power-oriented mode where you use whatever power seems appropriate to win your position.',
        characteristics: ['Firm in pursuing goals', 'Uses authority when necessary', 'Stands up for rights', 'Defends positions believed to be correct']
      },
      accommodating: {
        title: 'Accommodating (Unassertive & Cooperative)',
        description: 'You neglect your own concerns to satisfy the concerns of the other person. This mode involves self-sacrifice and yielding to another\'s point of view.',
        characteristics: ['Puts others\' needs first', 'Maintains relationships', 'Shows generosity', 'Yields to others\' wishes']
      },
      avoiding: {
        title: 'Avoiding (Unassertive & Uncooperative)',
        description: 'You neither pursue your own concerns nor those of the other person. You don\'t immediately address the conflict, instead diplomatically sidestepping or postponing.',
        characteristics: ['Sidesteps issues', 'Postpones decisions', 'Withdraws from threatening situations', 'Delegates controversial decisions']
      },
      collaborating: {
        title: 'Collaborating (Assertive & Cooperative)',
        description: 'You attempt to work with others to find solutions that fully satisfy the concerns of both parties. This involves digging into an issue to pinpoint underlying needs.',
        characteristics: ['Explores disagreements', 'Learns from others', 'Finds creative solutions', 'Merges insights from different perspectives']
      },
      compromising: {
        title: 'Compromising (Moderate Assertiveness & Cooperation)',
        description: 'You find mutually acceptable solutions that partially satisfy both parties. This mode involves splitting the difference, exchanging concessions, or seeking quick middle-ground.',
        characteristics: ['Finds middle ground', 'Makes concessions', 'Seeks fair solutions', 'Exchanges favors']
      }
    }
    return descriptions[style]
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (showResults) {
    const styleInfo = getStyleDescription(showResults.dominantStyle)
    
    return (
      <div className="futuristic-bg min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl w-full"
        >
          <Card className="glass-card">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl font-bold text-white mb-4 futuristic-text">
                Your TKI Conflict Style
              </CardTitle>
              <div className="text-3xl font-bold text-pink-300 mb-2 capitalize">
                {showResults.dominantStyle}
              </div>
              <p className="text-xl text-gray-300">
                {styleInfo.title}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="glass-button-secondary p-6 rounded-lg">
                <h4 className="text-white font-semibold mb-3 text-lg">Description</h4>
                <p className="text-gray-300 leading-relaxed">
                  {styleInfo.description}
                </p>
              </div>
              
              <div className="glass-button-primary p-6 rounded-lg">
                <h4 className="text-white font-semibold mb-3 text-lg">Key Characteristics</h4>
                <ul className="text-gray-300 space-y-2">
                  {styleInfo.characteristics.map((char, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-cyan-300 rounded-full mr-3"></span>
                      {char}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {Object.entries(showResults.scores).map(([style, score]) => (
                  <div key={style} className={`p-4 rounded-lg ${
                    style === showResults.dominantStyle 
                      ? 'glass-button-accent border-2 border-purple-300' 
                      : 'glass-button-primary'
                  }`}>
                    <h5 className="text-white font-semibold text-sm capitalize mb-1">{style}</h5>
                    <p className="text-gray-300 text-lg font-bold">{score}</p>
                  </div>
                ))}
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
        className="max-w-3xl w-full"
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
              TKI Conflict Resolution Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h3 className="text-xl text-gray-300 mb-4">
                  Select the statement that best describes your typical behavior in conflict situations:
                </h3>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={() => handleAnswer('A')}
                  className="w-full p-6 text-left glass-button glass-button-primary hover:glass-button-secondary transition-all duration-200 rounded-lg"
                >
                  <div className="flex items-start">
                    <span className="text-cyan-300 font-bold text-lg mr-4">A.</span>
                    <span className="text-white text-lg leading-relaxed">
                      {questions[currentQuestion].optionA}
                    </span>
                  </div>
                </button>
                
                <button
                  onClick={() => handleAnswer('B')}
                  className="w-full p-6 text-left glass-button glass-button-primary hover:glass-button-secondary transition-all duration-200 rounded-lg"
                >
                  <div className="flex items-start">
                    <span className="text-pink-300 font-bold text-lg mr-4">B.</span>
                    <span className="text-white text-lg leading-relaxed">
                      {questions[currentQuestion].optionB}
                    </span>
                  </div>
                </button>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default TKITest

