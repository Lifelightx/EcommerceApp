import React, { useState, useEffect } from 'react';
import { Terminal, Code, Coffee, Bug, AlertTriangle, ArrowLeft, Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DeveloperFallbackPage = () => {
  const [typing, setTyping] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  
  const messages = [
    "console.log('Nice try! 🕵️‍♂️')",
    "// TODO: Get a valid token first",
    "if (hasValidToken) { allowAccess(); }",
    "else { showThisPage(); }"
  ];

  useEffect(() => {
    let currentMessage = 0;
    let currentChar = 0;
    
    const typeInterval = setInterval(() => {
      if (currentMessage < messages.length) {
        if (currentChar < messages[currentMessage].length) {
          setTyping(prev => prev + messages[currentMessage][currentChar]);
          currentChar++;
        } else {
          currentMessage++;
          currentChar = 0;
          if (currentMessage < messages.length) {
            setTyping(prev => prev + '\n');
          }
        }
      } else {
        clearInterval(typeInterval);
      }
    }, 100);

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearInterval(typeInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  const navigate = useNavigate()
  const goHome = () => {
    navigate('/')
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-grey-300 flex items-center justify-center mt-12 px-4 py-12">
      <div className="max-w-6xl w-full">
        {/* Main Card */}
        <div className="bg-gray-800 rounded-lg shadow-2xl border border-gray-700 overflow-hidden">
          {/* Terminal Header */}
          <div className="bg-gray-700 px-4 py-2 flex items-center justify-between border-b border-gray-600">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <Terminal className="w-4 h-4 text-gray-400 ml-2" />
              <span className="text-gray-300 text-sm">unauthorized_access.js</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Code className="w-4 h-4" />
              <span className="text-xs">Line 403</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <AlertTriangle className="w-16 h-16 text-yellow-400 animate-pulse" />
                  <Bug className="w-6 h-6 text-red-400 absolute -top-1 -right-1 animate-bounce" />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-2">
                403: Access Denied
              </h1>
              <p className="text-gray-300 text-lg mb-6">
                Hey there, fellow developer! 👋
              </p>
            </div>

            {/* Code Block */}
            <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-gray-600">
              <div className="flex items-center mb-4">
                <Terminal className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-green-400 font-mono text-sm">developer@unauthorized:~$</span>
              </div>
              <pre className="text-green-400 font-mono text-sm leading-relaxed">
                <code>
                  {typing}
                  {showCursor && <span className="bg-green-400 text-gray-900">|</span>}
                </code>
              </pre>
            </div>

            {/* Message */}
            <div className="bg-gradient-to-r from-purple-800/50 to-pink-800/50 rounded-lg p-6 mb-8 border border-purple-500/30">
              <div className="flex items-start space-x-4">
                <Coffee className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    I know you're a developer... and I am too! 🤝
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Look, I get it. You saw a protected route and thought 
                    <span className="text-yellow-300 font-mono mx-1">"What happens if I just... try this URL?"</span>
                    We've all been there! 😅
                  </p>
                  
                  <div className="bg-gray-800/50 rounded p-3 border-l-4 border-yellow-400">
                    <p className="text-yellow-200 text-sm font-mono">
                      💡 Pro tip: Check your localStorage, grab a fresh JWT, and try again!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Details */}
            

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={goHome}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <Coffee className="w-5 h-5" />
                <span>Go Get Some Coffee (& Login)</span>
              </button>

            </div>

            {/* Footer Message */}
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                Remember: With great power comes great responsibility... and proper authentication! 🕷️
              </p>
              <p className="text-gray-500 text-xs mt-2 font-mono">
                // Keep coding, keep learning, keep being awesome! 🚀
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperFallbackPage;