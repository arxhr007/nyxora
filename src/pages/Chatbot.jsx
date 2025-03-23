import React, { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaRobot, FaUser, FaMoon, FaSpinner, FaSignOutAlt, FaChartLine, FaBed } from "react-icons/fa";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

const Chatbot = () => {

  const getRandomColor = () => {
    const colors = [
      '#a78bfa', '#4c1d95', 
      '#60a5fa', '#1e3a8a', 
      '#f472b6', '#831843', 
      '#fb7185', '#881337', 
      '#34d399', '#065f46'  
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const [messages, setMessages] = useState([
    { sender: "bot", text: "Welcome to Dream Interpreter! Share your dream, and I'll help interpret its meaning." }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;
  const MODEL = "llama-3.3-70b-versatile";

  const [stars] = useState(() => {
    return [...Array(100)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      width: `${Math.random() * 3 + 1}px`,
      height: `${Math.random() * 3 + 1}px`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay: `${Math.random() * 5}s`
    }));
  });

  const [planets] = useState(() => {
    const planetCount = Math.floor(Math.random() * 3) + 3; 
    const newPlanets = [];

    for (let i = 0; i < planetCount; i++) {
      const size = Math.floor(Math.random() * 100) + 40; 

      const color1 = getRandomColor();
      const color2 = getRandomColor();

      newPlanets.push({
        id: i,
        top: `${Math.random() * 80 + 5}%`, 
        left: `${Math.random() * 80 + 10}%`, 
        size: size,
        background: `radial-gradient(circle at ${Math.random() * 50 + 20}% ${Math.random() * 50 + 20}%, ${color1}, ${color2})`,
        animationDuration: `${Math.random() * 10 + 10}s`, 
        zIndex: Math.floor(Math.random() * 3)
      });
    }

    return newPlanets;
  });

  const [shootingStars] = useState(() => {
    return [...Array(3)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 40}%`,
      left: `${Math.random() * 30 + 70}%`,
      animationDuration: `${Math.random() * 3 + 3}s`,
      animationDelay: `${Math.random() * 10 + i * 5}s`
    }));
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim()) return;

    const userMessage = { sender: "user", text: inputMessage };
    setMessages(prev => [...prev, userMessage]);

    setInputMessage("");

    setIsLoading(true);

    try {

      const response = await interpretDream(inputMessage);

      const botMessage = { sender: "bot", text: response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error interpreting dream:", error);

      const errorMessage = { 
        sender: "bot", 
        text: "I encountered an issue interpreting your dream. Please try again later." 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const interpretDream = async (dreamText) => {
    try {
      const prompt = `You are a mystical dream interpreter using psychological and symbolic analysis to interpret dreams. 

      Analyze this dream in a mystical yet insightful tone:
      "${dreamText}"

      Your interpretation should include:
      1. The key symbols and their potential meanings
      2. Emotional undertones and their significance
      3. Possible connections to the dreamer's waking life
      4. Psychological insights drawing from archetypes and the collective unconscious
      5. Potential messages or guidance the dream might be offering

      Keep your interpretation mystical, introspective, yet grounded in psychological understanding.`;

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: "You are a mystical dream interpreter with expertise in Jungian psychology, symbolism, and subconscious meaning." },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 800
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API request failed: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0526] via-[#1a0f33] to-[#2e124d] text-gray-100 overflow-hidden relative">
      {}
      <div className="fixed inset-0 z-0">
        <div className="stars-container absolute inset-0">
          <div className="star-field">
            {stars.map((star) => (
              <div 
                key={star.id} 
                className="star"
                style={{
                  top: star.top,
                  left: star.left,
                  width: star.width,
                  height: star.height,
                  animationDuration: star.animationDuration,
                  animationDelay: star.animationDelay
                }}
              />
            ))}
          </div>

          {planets.map(planet => (
            <div 
              key={planet.id} 
              className="planet"
              style={{
                top: planet.top,
                left: planet.left,
                width: `${planet.size}px`,
                height: `${planet.size}px`,
                background: planet.background,
                animationDuration: planet.animationDuration,
                zIndex: planet.zIndex
              }}
            />
          ))}

          {shootingStars.map((star) => (
            <div 
              key={star.id}
              className="shooting-star"
              style={{
                top: star.top,
                left: star.left,
                animationDuration: star.animationDuration,
                animationDelay: star.animationDelay
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {}
        <nav className="sticky top-0 backdrop-blur-md bg-purple-900/20 border-b border-purple-500/30 p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center">
            <FaMoon className="text-purple-300 mr-2 text-xl" />
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent tracking-widest">NYXORA</div>
          </div>
          <div className="flex space-x-6 items-center">
            <button 
              onClick={() => navigate("/home")} 
              className="flex items-center text-gray-300 hover:text-purple-300 transition group"
            >
              <FaMoon className="mr-2 group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline">Dream Journal</span>
            </button>

            <button 
              onClick={() => navigate("/sleepanalysis")} 
              className="flex items-center text-gray-300 hover:text-purple-300 transition group"
            >
              <FaChartLine className="mr-2 group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline">Sleep Analysis</span>
            </button>

            <button 
              onClick={handleLogout} 
              className="flex items-center text-gray-300 hover:text-red-400 transition group"
            >
              <FaSignOutAlt className="mr-2 group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </nav>

        {}
        <div className="flex-grow flex flex-col px-4 py-8 md:py-12 max-w-4xl mx-auto w-full">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent mb-8 text-center">Dream Interpreter</h2>

          {}
          <div className="flex-grow bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-t-xl backdrop-blur-md border border-purple-500/30 p-4 overflow-y-auto max-h-[60vh] shadow-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300">
            <div className="flex flex-col space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === "user" 
                        ? "bg-purple-600/70 text-white" 
                        : "bg-blue-900/70 text-gray-100"
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      {message.sender === "bot" ? (
                        <FaRobot className="text-blue-300 mr-2" />
                      ) : (
                        <FaUser className="text-purple-300 mr-2" />
                      )}
                      <span className="text-xs opacity-70">
                        {message.sender === "bot" ? "Dream Interpreter" : "You"}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg bg-blue-900/70 text-gray-100">
                    <div className="flex items-center mb-1">
                      <FaRobot className="text-blue-300 mr-2" />
                      <span className="text-xs opacity-70">Dream Interpreter</span>
                    </div>
                    <div className="flex items-center">
                      <FaSpinner className="animate-spin text-blue-300 mr-2" />
                      <span className="text-sm">Interpreting your dream...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {}
          <form 
            onSubmit={handleSubmit}
            className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-b-xl border-t-0 border border-purple-500/30 p-4 flex items-center shadow-lg"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Share your dream..."
              className="flex-grow p-3 rounded-lg bg-blue-950/70 border border-blue-700/70 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-blue-400/70"
              disabled={isLoading}
            />
            <button
              type="submit"
              className={`ml-3 p-3 rounded-full ${
                isLoading || !inputMessage.trim()
                  ? "bg-purple-900/50 text-purple-300/50 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-500 transform hover:translate-y-0.5 transition-all shadow-lg hover:shadow-purple-500/50"
              }`}
              disabled={isLoading || !inputMessage.trim()}
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>

        {}
        <footer className="relative p-6 text-center">
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 blur-xl"></div>
          <div className="relative z-10">
            <div className="text-purple-300 font-medium mb-1">Nyxora</div>
            <div className="text-gray-400 text-sm">Explore your dream consciousness © 2025</div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0% { opacity: 0.2; }
          50% { opacity: 1; }
          100% { opacity: 0.2; }
        }

        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }

        @keyframes shooting {
          0% { 
            transform: translateX(0) translateY(0) rotate(-45deg);
            opacity: 1;
          }
          100% { 
            transform: translateX(-100vw) translateY(100vh) rotate(-45deg);
            opacity: 0;
          }
        }

        .star {
          position: absolute;
          background-color: white;
          border-radius: 50%;
          opacity: 0.8;
          animation: twinkle linear infinite;
        }

        .planet {
          position: absolute;
          border-radius: 50%;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
          animation: float ease-in-out infinite;
        }

        .shooting-star {
          position: absolute;
          width: 100px;
          height: 2px;
          background: linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,1));
          animation: shooting linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;