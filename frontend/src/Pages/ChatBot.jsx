import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X } from 'lucide-react';

const ChatBot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your healthcare assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const getBotResponse = async (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Medical responses
    const medicalKeywords = {
      'fever': "For fever, rest and stay hydrated. Take paracetamol if needed. If fever persists over 3 days or exceeds 103°F, consult a doctor.",
      'headache': "For headaches, try rest in a dark room, stay hydrated, and consider over-the-counter pain relief. If severe or persistent, see a doctor.",
      'cough': "For cough, stay hydrated, use honey, and avoid irritants. If persistent for over 2 weeks or with blood, consult a doctor.",
      'appointment': "To book an appointment, go to your dashboard and click 'Book Appointment'. Choose your preferred doctor and time slot.",
      'emergency': "For medical emergencies, call emergency services immediately or visit the nearest emergency room."
    };
    
    // Check medical keywords first
    for (const [keyword, response] of Object.entries(medicalKeywords)) {
      if (message.includes(keyword)) {
        return response;
      }
    }
    
    // General conversation patterns
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! I'm your AI healthcare assistant. I can help with medical questions, general inquiries, or guide you through our services. What would you like to know?";
    }
    
    if (message.includes('how are you') || message.includes('how do you do')) {
      return "I'm doing great, thank you for asking! I'm here to assist you with any questions you might have. How can I help you today?";
    }
    
    if (message.includes('what is') || message.includes('define') || message.includes('explain')) {
      return generateExplanation(message);
    }
    
    if (message.includes('how to') || message.includes('how do i') || message.includes('how can i')) {
      return generateHowToResponse(message);
    }
    
    if (message.includes('weather') || message.includes('temperature outside')) {
      return "I don't have access to current weather data, but I recommend checking a weather app or website for accurate local weather information.";
    }
    
    if (message.includes('time') || message.includes('date') || message.includes('day')) {
      const now = new Date();
      return `Current time is ${now.toLocaleTimeString()} and today's date is ${now.toLocaleDateString()}.`;
    }
    
    if (message.includes('thank') || message.includes('thanks')) {
      return "You're very welcome! I'm glad I could help. Is there anything else you'd like to know?";
    }
    
    if (message.includes('bye') || message.includes('goodbye') || message.includes('see you')) {
      return "Goodbye! Take care of your health, and don't hesitate to reach out if you need any assistance. Have a great day!";
    }
    
    // Try to generate a contextual response
    return generateContextualResponse(message);
  };
  
  const generateExplanation = (message) => {
    if (message.includes('diabetes')) return "Diabetes is a condition where blood sugar levels are too high. It requires proper diet, exercise, and often medication management.";
    if (message.includes('blood pressure')) return "Blood pressure is the force of blood against artery walls. Normal is usually around 120/80 mmHg.";
    if (message.includes('cholesterol')) return "Cholesterol is a waxy substance in blood. High levels can increase heart disease risk.";
    if (message.includes('bmi')) return "BMI (Body Mass Index) measures body fat based on height and weight. Normal range is 18.5-24.9.";
    return "I'd be happy to explain that topic! For detailed medical information, I recommend consulting with our healthcare professionals.";
  };
  
  const generateHowToResponse = (message) => {
    if (message.includes('lose weight')) return "To lose weight: eat balanced meals, exercise regularly, stay hydrated, get enough sleep, and consult a healthcare provider for personalized advice.";
    if (message.includes('reduce stress')) return "To reduce stress: practice deep breathing, exercise, get adequate sleep, maintain social connections, and consider meditation or yoga.";
    if (message.includes('improve sleep')) return "To improve sleep: maintain a regular schedule, avoid screens before bed, keep your room cool and dark, and limit caffeine intake.";
    if (message.includes('book appointment')) return "To book an appointment: go to your dashboard, click 'Book Appointment', select your preferred doctor and specialty, choose a date and time.";
    return "That's a great question! For specific guidance, I recommend speaking with one of our healthcare professionals who can provide personalized advice.";
  };
  
  const generateContextualResponse = (message) => {
    // Health-related general responses
    if (message.includes('pain') || message.includes('hurt') || message.includes('ache')) {
      return "I understand you're experiencing discomfort. For persistent or severe pain, it's important to consult with a healthcare provider for proper evaluation and treatment.";
    }
    
    if (message.includes('diet') || message.includes('nutrition') || message.includes('food')) {
      return "Good nutrition is essential for health! A balanced diet with fruits, vegetables, whole grains, and lean proteins is generally recommended. For personalized dietary advice, consider consulting our nutritionists.";
    }
    
    if (message.includes('exercise') || message.includes('workout') || message.includes('fitness')) {
      return "Regular exercise is great for overall health! Aim for at least 150 minutes of moderate activity per week. Always consult with a healthcare provider before starting a new exercise program.";
    }
    
    if (message.includes('mental health') || message.includes('anxiety') || message.includes('depression') || message.includes('stress')) {
      return "Mental health is just as important as physical health. If you're struggling, please reach out to a mental health professional. Our platform can connect you with qualified therapists and counselors.";
    }
    
    // Technology/general questions
    if (message.includes('computer') || message.includes('technology') || message.includes('internet')) {
      return "I can help with basic tech questions! For complex technical issues, you might want to consult with a tech support specialist.";
    }
    
    // Default intelligent response
    const responses = [
      "That's an interesting question! While I try to be helpful, for specific or complex matters, consulting with a relevant professional would be best.",
      "I understand what you're asking about. For detailed information on this topic, I'd recommend speaking with one of our specialists.",
      "Thank you for your question! I'm here to help with general guidance, but for specialized advice, our professional team would be better suited to assist you.",
      "I appreciate you reaching out! While I can provide general information, for comprehensive answers, connecting with our expert team would be most beneficial."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    setTimeout(async () => {
      const botResponse = await getBotResponse(currentInput);
      const botMessage = { id: Date.now() + 1, text: botResponse, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 animate-slideIn backdrop-blur-sm" style={{ background: 'rgba(255, 255, 255, 0.98)', animation: 'slideIn 0.3s ease-out' }}>
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .message-bubble {
          animation: messageSlide 0.3s ease-out;
        }
        
        @keyframes messageSlide {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .chat-input {
          transition: all 0.3s ease;
        }
        
        .chat-input:focus {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.15);
        }
        
        .send-btn {
          transition: all 0.3s ease;
        }
        
        .send-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
        }
      `}</style>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 rounded-t-2xl" style={{ backgroundColor: '#059669' }}>
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-white" />
          <h3 className="text-white font-semibold">Health Assistant</h3>
        </div>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} message-bubble`}>
            <div className={`flex items-start gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.sender === 'user' ? 'bg-blue-500' : 'bg-green-500'} shadow-md`}>
                {message.sender === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className={`p-3 rounded-xl shadow-sm ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about symptoms, appointments..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm chat-input"
          />
          <button
            onClick={handleSendMessage}
            className="px-3 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors send-btn"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;