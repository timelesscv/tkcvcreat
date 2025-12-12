
import React from 'react';
import { ViewState } from '../types';
import { Globe, HelpCircle, Phone } from 'lucide-react';

interface Props {
  onNavigate: (view: ViewState) => void;
  greeting: string;
}

const Dashboard: React.FC<Props> = ({ onNavigate, greeting }) => {
  const Card = ({ 
    title, 
    flag, 
    stats, 
    list, 
    onClick, 
    accentColor, 
    shadowColor 
  }: { 
    title: string; 
    flag: React.ReactNode; 
    stats: string; 
    list: string; 
    onClick: () => void; 
    accentColor: string; 
    shadowColor: string; 
  }) => (
    <div 
      onClick={onClick}
      className={`
        bg-surface p-8 rounded-3xl border-2 border-${accentColor} 
        cursor-pointer transition-all duration-300 
        hover:-translate-y-2 hover:shadow-2xl hover:${shadowColor}
        group relative overflow-hidden
      `}
    >
      <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-all duration-700 group-hover:left-[100%]" />
      
      <div className="text-5xl mb-6 filter drop-shadow-lg">{flag}</div>
      <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3>
      <div className="text-slate-400 font-medium mb-2">{stats}</div>
      <div className="text-slate-500 text-sm font-light">{list}</div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 animate-fade-in">
      <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-center bg-gradient-to-r from-accentKuwait via-accentSaudi to-accentJordan bg-clip-text text-transparent">
        {greeting}
      </h1>
      <p className="text-slate-400 text-lg md:text-xl mb-16 text-center">
        Professional CV Generator for International Recruitment
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        <Card 
          title="KUWAIT" 
          flag="🇰🇼"
          stats="2 Offices • Fast Processing"
          list="ALNOOR • FAHAD"
          onClick={() => onNavigate('kuwait')}
          accentColor="accentKuwait"
          shadowColor="shadow-accentKuwait/30"
        />
        <Card 
          title="SAUDI ARABIA" 
          flag="🇸🇦"
          stats="1 Office • Premium Service"
          list="ALDHAHRAN"
          onClick={() => onNavigate('saudi')}
          accentColor="accentSaudi"
          shadowColor="shadow-accentSaudi/30"
        />
        <Card 
          title="JORDAN" 
          flag="🇯🇴"
          stats="3 Offices • Quick Turnaround"
          list="EWAN • OPTION • INJAZ"
          onClick={() => onNavigate('jordan')}
          accentColor="accentJordan"
          shadowColor="shadow-accentJordan/30"
        />
        <Card 
          title="GENERATE ALL" 
          flag={<Globe className="w-12 h-12 text-accentAll" />}
          stats="6 Offices • Complete Package"
          list="All 6 Templates in One Click"
          onClick={() => onNavigate('all')}
          accentColor="accentAll"
          shadowColor="shadow-accentAll/30"
        />
        <Card 
          title="HELP" 
          flag={<HelpCircle className="w-12 h-12 text-accentHelp" />}
          stats="Guides • FAQ • Support"
          list="Get Started & Troubleshooting"
          onClick={() => onNavigate('help')}
          accentColor="accentHelp"
          shadowColor="shadow-accentHelp/30"
        />
        <Card 
          title="CONTACT" 
          flag={<Phone className="w-12 h-12 text-accentContact" />}
          stats="Support • Technical Help"
          list="Email • Phone • Telegram"
          onClick={() => onNavigate('contact')}
          accentColor="accentContact"
          shadowColor="shadow-accentContact/30"
        />
      </div>
      
      <footer className="mt-20 text-center text-slate-600">
        <div>TK International CV Generator © {new Date().getFullYear()}</div>
        <div className="text-sm mt-1">Professional Recruitment Solutions</div>
      </footer>
    </div>
  );
};

export default Dashboard;
