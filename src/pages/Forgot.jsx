import React, { useState, useEffect } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { FaMoon, FaEnvelope, FaArrowLeft } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [planets, setPlanets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

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

    setPlanets(newPlanets);
  }, []);

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

  const dreamQuotes = [
    "Dreams are the guiding words of the soul.",
    "The dream is the small hidden door in the deepest depths of the soul.",
    "Dreams are illustrations from the book your soul is writing about you.",
    "Dreams are today's answers to tomorrow's questions.",
    "Dreams are the touchstones of our character.",
    "In dreams, we enter a world that's entirely our own.",
    "Dreams are whispers from our subconscious mind.",
    "The best way to make your dreams come true is to wake up.",
    "Dreams are the seedlings of reality."
  ];

  const randomQuote = dreamQuotes[Math.floor(Math.random() * dreamQuotes.length)];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setIsLoading(false);
    } catch (err) {
      setError("We couldn't find an account with that email address.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0526] via-[#1a0f33] to-[#2e124d] text-gray-100 overflow-hidden relative">
      <div className="fixed inset-0 z-0">
        <div className="stars-container absolute inset-0">
          <div className="star-field">
            {[...Array(100)].map((_, i) => (
              <div 
                key={i} 
                className="star"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 3 + 1}px`,
                  height: `${Math.random() * 3 + 1}px`,
                  animationDuration: `${Math.random() * 3 + 2}s`,
                  animationDelay: `${Math.random() * 5}s`
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

          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              className="shooting-star"
              style={{
                top: `${Math.random() * 40}%`,
                left: `${Math.random() * 30 + 70}%`,
                animationDuration: `${Math.random() * 3 + 3}s`,
                animationDelay: `${Math.random() * 10 + i * 5}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <nav className="backdrop-blur-md bg-purple-900/20 border-b border-purple-500/30 p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center">
            <FaMoon className="text-purple-300 mr-2 text-xl" />
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent tracking-widest">NYXORA</div>
          </div>

        </nav>

        <div className="flex-grow flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full">
            <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-xl p-8 backdrop-blur-md border border-purple-500/30 shadow-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300">
              <button 
                onClick={() => navigate("/")}
                className="flex items-center text-purple-400 hover:text-purple-300 transition mb-4"
              >
                <FaArrowLeft className="mr-2" />
                <span>Back to login</span>
              </button>

              <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">Recover Your Dreamscape</h2>

              {error && (
                <div className="bg-red-900/40 border border-red-500/50 rounded-lg p-3 mb-6">
                  <p className="text-red-300 text-sm text-center">{error}</p>
                </div>
              )}

              {success ? (
                <div className="bg-emerald-900/40 border border-emerald-500/50 rounded-lg p-5 mb-6">
                  <p className="text-emerald-300 text-center">
                    Recovery link sent! Check your email to reset your password.
                  </p>
                  <div className="mt-4 flex justify-center">
                    <button 
                      onClick={() => navigate("/")}
                      className="py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg font-medium transition-all duration-300 text-white shadow-lg hover:shadow-purple-500/50 transform hover:translate-y-0.5"
                    >
                      Return to Login
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-300 mb-2">Enter your email address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-purple-400" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-blue-950/70 border border-blue-700/70 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="youremail@example.com"
                        required
                      />
                    </div>
                    <p className="text-gray-400 text-xs mt-2">We'll send you a link to reset your password.</p>
                  </div>

                  <div>
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className={`w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg font-medium transition-all duration-300 text-white shadow-lg hover:shadow-purple-500/50 transform hover:translate-y-0.5 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isLoading ? 'Sending...' : 'Send Recovery Link'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="mt-6 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 backdrop-blur-md border border-blue-500/30 shadow-lg hover:shadow-[0_0_15px_rgba(96,165,250,0.3)] transition-all duration-300">
              <div className="flex items-center mb-3">
                <div className="h-4 w-4 rounded-full bg-blue-400 mr-2"></div>
                <h3 className="text-lg font-medium text-blue-300">Dreamer's Wisdom</h3>
              </div>
              <p className="text-gray-200 italic">{randomQuote}</p>
            </div>
          </div>
        </div>

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

export default ForgotPassword;