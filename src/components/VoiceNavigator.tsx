'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, X, Navigation, CheckCircle2, AlertCircle } from 'lucide-react';
import type { ModuleKey } from './PlatformDashboard';

interface VoiceNavigatorProps {
  currentView: 'website' | 'platform';
  onViewChange: (view: 'website' | 'platform') => void;
  onModuleChange: (mod: ModuleKey) => void;
  onOpenCitizenModal: () => void;
  onCloseCitizenModal: () => void;
  onOpenAIModal: (query?: string) => void;
  onCloseAIModal: () => void;
  isOpen: boolean;
  onToggleOpen: (open: boolean) => void;
}

export const VoiceNavigator: React.FC<VoiceNavigatorProps> = ({
  currentView,
  onViewChange,
  onModuleChange,
  onOpenCitizenModal,
  onCloseCitizenModal,
  onOpenAIModal,
  onCloseAIModal,
  isOpen,
  onToggleOpen
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [voiceFeedbackEnabled, setVoiceFeedbackEnabled] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSpeechSupported(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-PT';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg(null);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const textToShow = finalTranscript || interimTranscript;
        setTranscript(textToShow);

        if (finalTranscript) {
          executeVoiceCommand(finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMsg('Permissão de microfone negada. Ative o microfone no navegador ou use os comandos rápidos abaixo.');
        } else if (event.error === 'no-speech') {
          setErrorMsg('Não detetei voz. Tente falar novamente mais perto do microfone.');
        } else {
          setErrorMsg(`Erro de reconhecimento: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [currentView]);

  const speak = (text: string) => {
    if (!voiceFeedbackEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-PT';
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  const scrollToWebsiteSection = (sectionId: string, label: string) => {
    onCloseCitizenModal();
    onCloseAIModal();
    onViewChange('website');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
    const msg = `A navegar para ${label} no website.`;
    setLastAction(msg);
    speak(msg);
  };

  const goToPlatformModule = (mod: ModuleKey, label: string) => {
    onCloseCitizenModal();
    onCloseAIModal();
    onViewChange('platform');
    onModuleChange(mod);
    const msg = `A abrir o módulo ${label}.`;
    setLastAction(msg);
    speak(msg);
  };

  const executeVoiceCommand = (rawText: string) => {
    const q = rawText.toLowerCase().trim();
    setErrorMsg(null);

    // 1. Fechar modais
    if (q.includes('fechar') || q.includes('sair do') || q.includes('cancelar')) {
      onCloseCitizenModal();
      onCloseAIModal();
      const msg = 'Janelas fechadas.';
      setLastAction(msg);
      speak(msg);
      return;
    }

    // 2. Comandos específicos dos 11 Módulos da Plataforma
    if (q.includes('painel') || q.includes('direção') || q.includes('direcao') || q.includes('visão geral') || q.includes('dashboard') || q.includes('plataforma')) {
      if (!q.includes('funcionário') && !q.includes('finança') && !q.includes('mapa') && !q.includes('documento')) {
        goToPlatformModule('painel', 'Painel da Direção');
        return;
      }
    }

    if (q.includes('operaç') || q.includes('mapa') || q.includes('ondjiva') || q.includes('zonas') || q.includes('bairros')) {
      if (q.includes('ainda não limpas') || q.includes('pendentes')) {
        onOpenAIModal(rawText);
        setLastAction('A consultar zonas pendentes no Assistente de IA.');
        speak('A consultar as zonas pendentes.');
        return;
      }
      goToPlatformModule('operacoes', 'Operações e Mapa de Ondjiva');
      return;
    }

    if (q.includes('funcionário') || q.includes('rh') || q.includes('recursos humanos') || q.includes('presença') || q.includes('equipa') || q.includes('trabalhador')) {
      if (q.includes('quantos') || q.includes('não vieram') || q.includes('faltaram')) {
        onOpenAIModal(rawText);
        setLastAction('A consultar presenças de hoje no Assistente de IA.');
        speak('A verificar o registo de presenças de hoje.');
        return;
      }
      goToPlatformModule('rh', 'Funcionários, Presenças e RH');
      return;
    }

    if (q.includes('finança') || q.includes('dinheiro') || q.includes('caixa') || q.includes('despesa') || q.includes('receita') || q.includes('salário') || q.includes('quanto recebemos')) {
      if (q.includes('regista') || q.includes('quanto recebemos') || q.includes('kwanzas')) {
        onOpenAIModal(rawText);
        setLastAction('A encaminhar pedido financeiro para o Assistente de IA.');
        speak('A abrir o assistente financeiro.');
        return;
      }
      goToPlatformModule('financas', 'Finanças e Fluxo de Caixa');
      return;
    }

    if (q.includes('documento') || q.includes('ofício') || q.includes('carta') || q.includes('modelo') || q.includes('anr')) {
      if (q.includes('prepara') || q.includes('escreve') || q.includes('gera')) {
        onOpenAIModal(rawText);
        setLastAction('A preparar minuta no Assistente de IA.');
        speak('A preparar o rascunho do documento.');
        return;
      }
      goToPlatformModule('documentos', 'Documentos e Modelos Institucionais');
      return;
    }

    if (q.includes('contrato') || q.includes('cliente') || q.includes('cuanhama') || q.includes('proposta')) {
      goToPlatformModule('contratos', 'Clientes e Contratos');
      return;
    }

    if (q.includes('munícipe') || q.includes('reclamaç') || q.includes('ocorrência') || q.includes('sms') || q.includes('qr')) {
      if (q.includes('comunicar') || q.includes('portal') || q.includes('protocolo') || q.includes('registar ocorrência')) {
        onCloseAIModal();
        onOpenCitizenModal();
        const msg = 'A abrir o Portal do Munícipe e QR Code.';
        setLastAction(msg);
        speak(msg);
        return;
      }
      goToPlatformModule('municipes', 'Munícipes, QR Code e SMS');
      return;
    }

    if (q.includes('frota') || q.includes('viatura') || q.includes('camião') || q.includes('equipamento') || q.includes('epi') || q.includes('uniforme')) {
      if (currentView === 'website' && (q.includes('ver') || q.includes('mostrar')) && !q.includes('frota')) {
        scrollToWebsiteSection('equipamentos', 'Equipamentos e EPI');
        return;
      }
      goToPlatformModule('frota', 'Frota, Equipamentos e EPI');
      return;
    }

    if (q.includes('relatório') || q.includes('relatorio') || q.includes('imprimir') || q.includes('pdf')) {
      goToPlatformModule('relatorios', 'Relatórios Mensais');
      if (q.includes('imprimir')) {
        setTimeout(() => window.print(), 500);
      }
      return;
    }

    if (q.includes('permiss') || q.includes('auditoria') || q.includes('administra') || q.includes('google') || q.includes('perfil')) {
      goToPlatformModule('admin', 'Administração, Permissões e Auditoria');
      return;
    }

    // 3. Navegação no Website Institucional
    if (q.includes('antes e depois') || q.includes('comparação') || q.includes('resultados') || q.includes('fotos')) {
      scrollToWebsiteSection('antes-depois', 'Antes e Depois');
      return;
    }

    if (q.includes('serviço') || q.includes('varredura') || q.includes('valas')) {
      scrollToWebsiteSection('servicos', 'Serviços');
      return;
    }

    if (q.includes('ceo') || q.includes('edir') || q.includes('empresa') || q.includes('gerente')) {
      scrollToWebsiteSection('empresa', 'Apresentação da Empresa e CEO');
      return;
    }

    if (q.includes('atuação') || q.includes('atuacao') || q.includes('cobertura')) {
      scrollToWebsiteSection('atuacao', 'Área de Atuação');
      return;
    }

    if (q.includes('contacto') || q.includes('telefone') || q.includes('email') || q.includes('formulário')) {
      scrollToWebsiteSection('contactos', 'Contactos');
      return;
    }

    if (q.includes('website') || q.includes('site') || q.includes('início') || q.includes('inicio') || q.includes('página principal')) {
      onCloseCitizenModal();
      onCloseAIModal();
      onViewChange('website');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const msg = 'A voltar ao Website Institucional.';
      setLastAction(msg);
      speak(msg);
      return;
    }

    // 4. Fallback: Se for uma pergunta ou comando complexo, enviar para o Assistente de IA
    onOpenAIModal(rawText);
    const msg = 'Comando encaminhado para o Assistente de IA.';
    setLastAction(msg);
    speak('A consultar o assistente.');
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setErrorMsg('O seu navegador não suporta reconhecimento de voz nativo. Use Chrome, Edge ou Safari, ou clique nos comandos de demonstração.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTranscript('');
      setErrorMsg(null);
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Ignore if already started
      }
    }
  };

  const sampleCommands = [
    'Abre Operações e Mapa',
    'Abre Finanças',
    'Abre Funcionários e RH',
    'Abre Relatórios',
    'Abre o Portal do Munícipe',
    'Mostra o Antes e Depois',
    'Quantos funcionários não vieram hoje?'
  ];

  // Floating Minimized Button when closed
  if (!isOpen) {
    return (
      <button
        onClick={() => onToggleOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-4 py-3 bg-slate-900 hover:bg-brand-primary text-white rounded-full shadow-2xl border border-slate-700 transition-all hover:scale-105 group no-print"
        title="Ativar Controlo por Voz com IA"
      >
        <div className="w-8 h-8 rounded-full bg-brand-primary group-hover:bg-white group-hover:text-brand-primary flex items-center justify-center transition-colors">
          <Mic className="w-4 h-4" />
        </div>
        <div className="text-left pr-1">
          <span className="text-xs font-bold block leading-none">Navegação por Voz</span>
          <span className="text-[10px] text-slate-300 group-hover:text-white/90">Falar com a Plataforma</span>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 w-[92vw] max-w-sm bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 overflow-hidden no-print">
      
      {/* Header */}
      <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isListening ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`}></span>
          <span className="text-xs font-bold tracking-wide">Controlo por Voz — OMBALA KISUL</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setVoiceFeedbackEnabled(!voiceFeedbackEnabled)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title={voiceFeedbackEnabled ? 'Silenciar resposta falada' : 'Ativar resposta falada'}
          >
            {voiceFeedbackEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={() => {
              if (isListening && recognitionRef.current) recognitionRef.current.stop();
              onToggleOpen(false);
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Minimizar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Microphone Area */}
      <div className="p-4 space-y-3">
        
        <div className="flex items-center gap-3">
          <button
            onClick={toggleListening}
            className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all shadow-lg ${
              isListening 
                ? 'bg-red-600 hover:bg-red-700 ring-4 ring-red-500/30 animate-pulse' 
                : 'bg-brand-primary hover:bg-brand-hover'
            }`}
            aria-label={isListening ? 'Parar de ouvir' : 'Começar a falar'}
          >
            {isListening ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
          </button>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white">
              {isListening ? 'A ouvir a sua instrução...' : 'Clique no microfone e dê uma ordem'}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {transcript ? `"${transcript}"` : 'Ex: "Abre Finanças" ou "Mostra o mapa"'}
            </p>
          </div>
        </div>

        {/* Action Feedback */}
        {lastAction && (
          <div className="p-2.5 bg-emerald-950/60 border border-emerald-700/50 rounded-xl text-[11px] text-emerald-300 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>{lastAction}</span>
          </div>
        )}

        {/* Error Message */}
        {errorMsg && (
          <div className="p-2.5 bg-amber-950/60 border border-amber-700/50 rounded-xl text-[11px] text-amber-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {!speechSupported && (
          <div className="p-2 bg-slate-800 rounded-lg text-[10px] text-slate-300">
            Reconhecimento de voz não detetado neste navegador. Use os comandos rápidos abaixo para testar a navegação automática:
          </div>
        )}

        {/* Quick Voice Simulation Chips */}
        <div className="pt-2 border-t border-slate-800">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Comandos Rápidos (Clique ou Fale):
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
            {sampleCommands.map((cmd, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTranscript(cmd);
                  executeVoiceCommand(cmd);
                }}
                className="text-[10px] px-2.5 py-1 bg-slate-800 hover:bg-brand-primary text-slate-200 hover:text-white rounded-full border border-slate-700 transition-colors flex items-center gap-1"
              >
                <Navigation className="w-2.5 h-2.5" />
                <span>{cmd}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
