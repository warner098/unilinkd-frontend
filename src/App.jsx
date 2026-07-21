import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import ContentSection from './components/ContentSection';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <ContentSection />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}

export default App;