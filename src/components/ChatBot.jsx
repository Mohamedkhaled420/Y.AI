import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { motion } from 'framer-motion'
import { ArrowLeft, Send, Bot, User, AlertCircle, RefreshCw } from 'lucide-react'
import { logError, trackEvent, handleApiError, measurePerformance } from '../utils/errorHandler.js'

const ChatBot = ({ onBack }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI learning and development assistant. I can help you understand your personality test results, provide career guidance, or discuss personal development strategies. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('online')
  const [retryCount, setRetryCount] = useState(0)
  const messagesEndRef = useRef(null)

  // API endpoint - will be updated to use DigitalOcean backend
  const API_ENDPOINT = '/api/gemini'

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Track chatbot page view
    trackEvent('chatbot_view', {
      page_title: 'AI Chatbot',
      timestamp: new Date().toISOString()
    })
  }, [])

  const sendMessage = async (retryAttempt = false) => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputMessage
    setInputMessage('')
    setIsLoading(true)
    setConnectionStatus('connecting')

    // Track user message
    trackEvent('chatbot_message_sent', {
      message_length: currentInput.length,
      retry_attempt: retryAttempt,
      retry_count: retryCount
    })

    try {
      // Debug: log the request body received by the worker
      const response = await measurePerformance('chatbot_api_call', async () => {
        return await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: currentInput
          })
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setConnectionStatus('online')
      setRetryCount(0)
      
      let botResponse = "I apologize, but I received an unexpected response format. Please try rephrasing your question."
      
      if (data.response) {
        botResponse = data.response
      } else if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
        botResponse = data.candidates[0].content.parts[0].text
      } else if (data.error) {
        throw new Error(data.error.message || 'API returned an error')
      }

      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])

      // Track successful response
      trackEvent('chatbot_response_received', {
        response_length: botResponse.length,
        success: true
      })

    } catch (error) {
      const { userMessage: errorMessage, errorType } = handleApiError(error, {
        component: 'ChatBot',
        action: 'sendMessage',
        input_length: currentInput.length,
        retry_count: retryCount
      })

      setConnectionStatus('error')
      setRetryCount(prev => prev + 1)

      const botErrorMessage = {
        id: messages.length + 2,
        text: errorMessage,
        sender: 'bot',
        timestamp: new Date(),
        isError: true,
        errorType,
        canRetry: errorType === 'network' || errorType === 'server'
      }

      setMessages(prev => [...prev, botErrorMessage])

      // Track error
      trackEvent('chatbot_error', {
        error_type: errorType,
        error_message: error.message,
        retry_count: retryCount
      })

    } finally {
      setIsLoading(false)
    }
  }

  const retryLastMessage = () => {
    if (messages.length >= 2) {
      const lastUserMessage = [...messages].reverse().find(msg => msg.sender === 'user')
      if (lastUserMessage) {
        setInputMessage(lastUserMessage.text)
        // Remove the last bot error message
        setMessages(prev => prev.filter(msg => !(msg.isError && msg.id === Math.max(...prev.map(m => m.id)))))
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'online': return 'bg-green-400'
      case 'connecting': return 'bg-yellow-400'
      case 'error': return 'bg-red-400'
      default: return 'bg-gray-400'
    }
  }

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'online': return 'AI Assistant Online'
      case 'connecting': return 'Connecting...'
      case 'error': return 'Connection Error'
      default: return 'Unknown Status'
    }
  }

  return (
    <div className="futuristic-bg min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full h-[80vh]"
      >
        <Card className="glass-card h-full flex flex-col">
          <CardHeader className="flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <Button 
                onClick={onBack}
                variant="ghost" 
                className="text-gray-300 hover:text-white"
                aria-label="Go back to home page"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getConnectionStatusColor()} ${connectionStatus === 'connecting' ? 'animate-pulse' : ''}`}></div>
                <span className="text-gray-300 text-sm">{getConnectionStatusText()}</span>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white text-center flex items-center justify-center">
              <Bot className="w-8 h-8 mr-3 text-purple-300" />
              AI Learning Assistant
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-6 space-y-4">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2" role="log" aria-live="polite" aria-label="Chat messages">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${
                    message.sender === 'user' 
                      ? 'glass-button-primary' 
                      : message.isError 
                        ? 'glass-button-secondary border border-red-400' 
                        : 'glass-button-secondary'
                  } p-4 rounded-lg`}>
                    <div className="flex items-start space-x-3">
                      {message.sender === 'bot' && (
                        message.isError ? (
                          <AlertCircle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                        ) : (
                          <Bot className="w-5 h-5 text-purple-300 mt-1 flex-shrink-0" />
                        )
                      )}
                      {message.sender === 'user' && (
                        <User className="w-5 h-5 text-cyan-300 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-white leading-relaxed whitespace-pre-wrap">
                          {message.text}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-gray-400 text-xs">
                            {formatTime(message.timestamp)}
                          </p>
                          {message.isError && message.canRetry && (
                            <Button
                              onClick={retryLastMessage}
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300 p-1 h-auto"
                              aria-label="Retry last message"
                            >
                              <RefreshCw className="w-3 h-3 mr-1" />
                              Retry
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                  aria-label="AI is typing"
                >
                  <div className="glass-button-secondary p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Bot className="w-5 h-5 text-purple-300" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <div className="flex-shrink-0 flex space-x-4">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="flex-1 glass-button text-white placeholder-gray-400 border-gray-600 focus:border-purple-300"
                disabled={isLoading}
                aria-label="Type your message"
                maxLength={1000}
              />
              <Button
                onClick={() => sendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="glass-button glass-button-accent text-white px-6"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Character count */}
            <div className="text-right text-xs text-gray-400">
              {inputMessage.length}/1000
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default ChatBot

