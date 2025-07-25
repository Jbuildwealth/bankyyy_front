import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaChartLine, FaMobileAlt, FaGlobe, FaArrowRight } from 'react-icons/fa';
import { MdSecurity, MdSpeed, MdSupport, MdAccountBalance } from 'react-icons/md';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500"></div>
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,rgba(0,0,0,0.3)_100%)]"></div>
        <div className="relative container mx-auto px-6 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight animate-fade-in">
              Banking Made <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">Simple</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-100 leading-relaxed">
              Experience the future of banking with our secure, fast, and intuitive platform.
            </p>
            <div className="flex gap-4">
              <Link
                to="/login"
                className="group bg-white text-purple-700 px-8 py-4 rounded-full font-semibold hover:bg-purple-50 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                Get Started
                <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to="/about"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Why Choose Us?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience banking excellence with our comprehensive suite of services
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FaShieldAlt className="w-8 h-8" />,
                title: "Bank-Grade Security",
                description: "Your finances protected by military-grade encryption"
              },
              {
                icon: <MdSpeed className="w-8 h-8" />,
                title: "Lightning Fast",
                description: "Instant transfers and real-time updates"
              },
              {
                icon: <MdSupport className="w-8 h-8" />,
                title: "24/7 Support",
                description: "Round-the-clock assistance whenever you need it"
              },
              {
                icon: <FaMobileAlt className="w-8 h-8" />,
                title: "Mobile First",
                description: "Seamless banking experience on any device"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="text-purple-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive financial solutions tailored to your needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-t-2xl"></div>
              <div className="text-purple-600 text-4xl mb-6">
                <MdAccountBalance />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Personal Banking</h3>
              <p className="text-gray-600 mb-6">
                Tailored banking solutions to help you manage and grow your personal finances.
              </p>
              <Link to="/services" className="text-purple-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                Learn More <FaArrowRight className="text-sm" />
              </Link>
            </div>
            
            <div className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-t-2xl"></div>
              <div className="text-purple-600 text-4xl mb-6">
                <FaChartLine />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Investment Solutions</h3>
              <p className="text-gray-600 mb-6">
                Expert guidance and tools to help you grow your wealth effectively.
              </p>
              <Link to="/services" className="text-purple-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                Learn More <FaArrowRight className="text-sm" />
              </Link>
            </div>

            <div className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-green-500 rounded-t-2xl"></div>
              <div className="text-purple-600 text-4xl mb-6">
                <FaGlobe />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Global Banking</h3>
              <p className="text-gray-600 mb-6">
                International banking services for your global financial needs.
              </p>
              <Link to="/services" className="text-purple-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                Learn More <FaArrowRight className="text-sm" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,rgba(0,0,0,0.3)_100%)]"></div>
        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Banking Experience?</h2>
            <p className="text-xl text-gray-100 mb-8">
              Join thousands of satisfied customers who have already made the switch.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-purple-700 px-8 py-4 rounded-full font-semibold hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Open an Account
              <FaArrowRight className="text-sm" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 