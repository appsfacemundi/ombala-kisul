import React from 'react';
import Image from 'next/image';
import { Shield, AlertCircle, LogIn, Menu, X, Radio, ArrowLeft, RefreshCw, Smartphone } from 'lucide-react';

interface HeaderProps {
  currentView: 'website' | 'platform';
  onViewChange: (view: 'website' | 'platform') => void;
  onOpenCitizenModal: () => void;
  onOpenAIModal: () => void;
  isOffline?: boolean;
  pendingSyncCount?: number;
  onManualSync?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  onOpenCitizenModal,
  onOpenAIModal,
  isOffline = false,
  pendingSyncCount = 0,
  onManualSync
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      {/* Top Notification Bar for Institutional Environment Status */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 font-medium flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Ondjiva • Cuanhama, Cunene (UTC+1)
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300">NIF: <strong className="text-white">5000597244</strong></span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-amber-300 text-[11px] hidden md:inline">
            Licenciamento ANR: Pedido em Análise (Proc. 19/11/2026)
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-[11px] hidden sm:inline">
            Domínio Oficial: <strong className="text-white underline decoration-brand-primary">www.ombalakisul.com</strong>
          </span>
          <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] border border-slate-700">
            Ambiente de Demonstração
          </span>
          {pendingSyncCount > 0 && (
            <button 
              onClick={onManualSync}
              className="bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 px-2 py-0.5 rounded text-[11px] flex items-center gap-1 transition-colors"
              title="Sincronizar dados pendentes"
            >
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>{pendingSyncCount} offline</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onViewChange('website')}>
            <div className="relative w-12 h-12 flex-shrink-0 bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
              <img 
                src="/logo.png" 
                alt="Logótipo Oficial OMBALA KISUL" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-brand-primary">
                  OMBALA KISUL
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.5 bg-brand-50 text-brand-dark rounded border border-brand-200">
                  LDA
                </span>
              </div>
              <p className="text-[11px] text-slate-500 tracking-wider uppercase font-medium">
                Saneamento Básico & Gestão de Resíduos
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          {currentView === 'website' ? (
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700">
              <a href="#empresa" className="hover:text-brand-primary transition-colors">A Empresa</a>
              <a href="#servicos" className="hover:text-brand-primary transition-colors">Serviços</a>
              <a href="#equipamentos" className="hover:text-brand-primary transition-colors">Equipamentos & EPI</a>
              <a href="#antes-depois" className="hover:text-brand-primary transition-colors">Antes & Depois</a>
              <a href="#atuacao" className="hover:text-brand-primary transition-colors">Área de Atuação</a>
              <a href="#contactos" className="hover:text-brand-primary transition-colors">Contactos</a>
            </nav>
          ) : (
            <div className="hidden lg:flex items-center gap-3 text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <Shield className="w-4 h-4 text-brand-primary" />
              <span>Ambiente Operacional Seguro</span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                Modo Demonstração
              </span>
            </div>
          )}

          {/* Actions & Platform Switcher */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenCitizenModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-brand-primary bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-lg transition-colors shadow-sm"
            >
              <Smartphone className="w-4 h-4" />
              <span>Comunicar Ocorrência</span>
            </button>

            {currentView === 'website' ? (
              <button
                onClick={() => onViewChange('platform')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-brand-primary hover:bg-brand-hover rounded-lg transition-all shadow-md hover:shadow-lg focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Entrar na Plataforma</span>
              </button>
            ) : (
              <button
                onClick={() => onViewChange('website')}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Ver Website</span>
              </button>
            )}

            <button
              onClick={onOpenAIModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors"
              title="Assistente de IA Operacional"
            >
              <Radio className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>Assistente IA</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => onOpenCitizenModal()}
              className="p-2 text-brand-primary bg-brand-50 rounded-lg border border-brand-200"
              aria-label="Comunicar Ocorrência"
            >
              <Smartphone className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-brand-primary rounded-lg"
              aria-label="Abrir Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          {currentView === 'website' ? (
            <div className="grid grid-cols-2 gap-2 text-sm font-medium text-slate-700 pt-2">
              <a href="#empresa" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded bg-slate-50">A Empresa</a>
              <a href="#servicos" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded bg-slate-50">Serviços</a>
              <a href="#equipamentos" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded bg-slate-50">Equipamentos</a>
              <a href="#antes-depois" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded bg-slate-50">Antes & Depois</a>
              <a href="#atuacao" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded bg-slate-50">Área de Atuação</a>
              <a href="#contactos" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded bg-slate-50">Contactos</a>
            </div>
          ) : null}

          <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
            {currentView === 'website' ? (
              <button
                onClick={() => {
                  onViewChange('platform');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold text-white bg-brand-primary rounded-lg shadow"
              >
                <LogIn className="w-4 h-4" />
                <span>Entrar na Plataforma de Gestão</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onViewChange('website');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar ao Website Institucional</span>
              </button>
            )}

            <button
              onClick={() => {
                onOpenAIModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold text-amber-900 bg-amber-100 rounded-lg"
            >
              <Radio className="w-4 h-4 text-amber-700" />
              <span>Abrir Assistente de IA</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
