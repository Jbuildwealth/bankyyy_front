import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaChartLine, FaMobileAlt, FaGlobe, FaArrowRight, FaCheck } from 'react-icons/fa';
import { MdSecurity, MdSpeed, MdSupport, MdAccountBalance, MdTrendingUp } from 'react-icons/md';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative h-screen">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-500 to-blue-600 animate-gradient"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnptMC0yYzguODM3IDAgMTYgNy4xNjMgMTYgMTZzLTcuMTYzIDE2LTE2IDE2LTE2LTcuMTYzLTE2LTE2IDcuMTYzLTE2IDE2LTE2eiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        
        <div className="relative container mx-auto px-6 h-full flex items-center">
          <div className="max-w-2xl">
            <div className="mb-8 inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg px-4 py-2 rounded-full text-emerald-100">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              New: Enhanced Security Features
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight animate-fade-in">
              Smart Banking for a 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200 block mt-2">
                Digital World
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-emerald-100 leading-relaxed max-w-xl">
              Experience seamless banking with cutting-edge security and intuitive features designed for modern life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/login"
                className="group bg-white text-emerald-700 px-8 py-4 rounded-full font-semibold hover:bg-emerald-50 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                Get Started Now
                <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to="/about"
                className="bg-emerald-700/20 backdrop-blur-lg border-2 border-emerald-500/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-emerald-700/30 transition duration-300 flex items-center justify-center gap-2"
              >
                See How It Works
                <MdTrendingUp className="text-xl" />
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-12 flex items-center gap-8 text-emerald-100">
              <div className="flex items-center gap-2">
                <FaCheck className="text-emerald-400" />
                <span>256-bit Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheck className="text-emerald-400" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheck className="text-emerald-400" />
                <span>FDIC Insured</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Cards */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-transparent"></div>
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Why Choose Our Bank?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience banking excellence with our comprehensive suite of modern services
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FaShieldAlt className="w-8 h-8" />,
                title: "Advanced Security",
                description: "Multi-layer protection for your peace of mind"
              },
              {
                icon: <MdSpeed className="w-8 h-8" />,
                title: "Instant Transfers",
                description: "Send money globally in seconds"
              },
              {
                icon: <MdSupport className="w-8 h-8" />,
                title: "24/7 Support",
                description: "Expert assistance whenever you need it"
              },
              {
                icon: <FaMobileAlt className="w-8 h-8" />,
                title: "Smart Banking",
                description: "Full control from your mobile device"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="text-emerald-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section with Modern Cards */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Banking Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tailored services to meet your financial goals
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <MdAccountBalance />,
                title: "Personal Banking",
                description: "Manage your daily finances with ease",
                gradient: "from-emerald-500 to-teal-500"
              },
              {
                icon: <FaChartLine />,
                title: "Investment Planning",
                description: "Grow your wealth with expert guidance",
                gradient: "from-teal-500 to-cyan-500"
              },
              {
                icon: <FaGlobe />,
                title: "Global Banking",
                description: "Borderless banking for modern life",
                gradient: "from-cyan-500 to-blue-500"
              }
            ].map((service, index) => (
              <div 
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className={`absolute top-0 left-0 h-2 w-full bg-gradient-to-r ${service.gradient} rounded-t-2xl`}></div>
                <div className="text-emerald-600 text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>
                <Link 
                  to="/services" 
                  className="inline-flex items-center text-emerald-600 font-semibold group-hover:gap-3 transition-all duration-300"
                >
                  Learn More 
                  <FaArrowRight className="ml-2 text-sm group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 via-teal-500 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnptMC0yYzguODM3IDAgMTYgNy4xNjMgMTYgMTZzLTcuMTYzIDE2LTE2IDE2LTE2LTcuMTYzLTE2LTE2IDcuMTYzLTE2IDE2LTE2eiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Experience Modern Banking?
            </h2>
            <p className="text-xl text-emerald-100 mb-8">
              Join thousands of satisfied customers who have already made the switch to smart banking.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-emerald-700 px-8 py-4 rounded-full font-semibold hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Open Your Account
              <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 