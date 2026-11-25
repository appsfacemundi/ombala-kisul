'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, X, Navigation, CheckCircle2, AlertCircle, Radio, MousePointerClick } from 'lucide-react';
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

const normalizeText = (str: string) =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

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
  const [wakeWordMode, setWakeWordMode] = useState(false);
  const [wakeWord, setWakeWord] = useState('Cajambinha');
  const [isAwake, setIsAwake] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [voiceFeedbackEnabled, setVoiceFeedbackEnabled] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const wakeWordModeRef = useRef(wakeWordMode);
  const wakeWordRef = useRef(wakeWord);
  const isAwakeRef = useRef(isAwake);

  useEffect(() => {
    wakeWordModeRef.current = wakeWordMode;
  }, [wakeWordMode]);

  useEffect(() => {
    wakeWordRef.current = wakeWord;
  }, [wakeWord]);

  useEffect(() => {
    isAwakeRef.current = isAwake;
  }, [isAwake]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSpeechSupported(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-PT';
      recognition.continuous = true;
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

        // Deteta a palavra de ativação imediatamente (mesmo antes de terminar a frase)
        if (wakeWordModeRef.current && !isAwakeRef.current && interimTranscript) {
          const normInterim = normalizeText(interimTranscript);
          const activeWake = normalizeText(wakeWordRef.current || 'cajambinha');
          const aliases = activeWake === 'cajambinha'
            ? ['cajambinha', 'caixambinha', 'cajamba', 'cajambina', 'jambinha', 'caixa minha', 'casa minha']
            : [activeWake];
          if (aliases.some((a) => normInterim.includes(a)) && normInterim.length <= activeWake.length + 12) {
            setIsAwake(true);
            const readyMsg = 'Estou pronto, diga o que queres.';
            setLastAction(readyMsg);
            speak(readyMsg);
          }
        }

        if (finalTranscript) {
          handleSpeechSegment(finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          setIsListening(false);
          setWakeWordMode(false);
          setErrorMsg('Permissão de microfone negada. Ative o microfone no navegador ou use os comandos rápidos.');
        } else if (event.error === 'no-speech') {
          if (!wakeWordModeRef.current) {
            setIsListening(false);
            setErrorMsg('Não detetei voz. Tente falar novamente.');
          }
        } else if (event.error !== 'aborted') {
          setIsListening(false);
          setErrorMsg(`Erro de reconhecimento: ${event.error}`);
        }
      };

      recognition.onend = () => {
        if (wakeWordModeRef.current) {
          // Reinicia automaticamente em modo de escuta contínua para a palavra de ativação
          try {
            recognition.start();
          } catch (e) {
            setIsListening(false);
          }
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;

      return () => {
        try {
          recognition.stop();
        } catch (e) {
          // ignore
        }
      };
    }
  }, []);

  const speak = (text: string) => {
    if (!voiceFeedbackEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-PT';
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  const handleSpeechSegment = (rawText: string) => {
    const normalized = normalizeText(rawText);
    const activeWake = normalizeText(wakeWordRef.current || 'cajambinha');

    if (wakeWordModeRef.current && !isAwakeRef.current) {
      // Verifica se a palavra de ativação foi dita (inclui variações fonéticas para Cajambinha)
      const aliases = activeWake === 'cajambinha'
        ? ['cajambinha', 'caixambinha', 'cajamba', 'cajambina', 'jambinha', 'caixa minha', 'casa minha']
        : [activeWake];

      let matchedAlias = '';
      let idx = -1;
      for (const alias of aliases) {
        const foundIdx = normalized.indexOf(alias);
        if (foundIdx !== -1) {
          idx = foundIdx;
          matchedAlias = alias;
          break;
        }
      }

      if (idx === -1) {
        return; // Ignora conversa paralela enquanto não disser a palavra de ativação
      }

      // Extrai o comando que veio logo após a palavra de ativação na mesma frase
      const afterWake = rawText
        .slice(idx + matchedAlias.length)
        .replace(/^[,.\s]+/, '')
        .trim();

      if (afterWake.length > 2) {
        executeVoiceCommand(afterWake);
      } else {
        setIsAwake(true);
        const readyMsg = 'Estou pronto, diga o que queres.';
        setLastAction(readyMsg);
        speak(readyMsg);
      }
      return;
    }

    // Se já estava desperto ou em modo clique único, executa o comando
    if (isAwakeRef.current) {
      setIsAwake(false);
    }

    executeVoiceCommand(rawText);

    if (!wakeWordModeRef.current && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
  };

  // Clica automaticamente em qualquer botão ou link visível no ecrã pelo nome falado
  const clickElementBySpokenText = (targetQuery: string): boolean => {
    if (typeof document === 'undefined') return false;
    const cleanTarget = normalizeText(
      targetQuery
        .replace(/^(no |na |o |a |em |para )?bot[aã]o\s+/i, '')
        .replace(/^(no |na |o |a |em )\s*/i, '')
    );

    if (!cleanTarget || cleanTarget.length < 2) return false;

    const candidates = Array.from(
      document.querySelectorAll<HTMLElement>('button, a, [role="button"], input[type="submit"]')
    ).filter((el) => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && !el.closest('[data-voice-panel="true"]');
    });

    // Procura correspondência exata ou parcial no texto visível ou aria-label
    let bestMatch: HTMLElement | null = null;
    let bestScore = 0;

    for (const el of candidates) {
      const text = normalizeText(el.innerText || el.getAttribute('aria-label') || '');
      if (!text) continue;

      if (text === cleanTarget) {
        bestMatch = el;
        bestScore = 100;
        break;
      }
      if (text.includes(cleanTarget) || cleanTarget.includes(text)) {
        const score = Math.min(text.length, cleanTarget.length) / Math.max(text.length, cleanTarget.length);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = el;
        }
      }
    }

    if (bestMatch) {
      bestMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const prevOutline = bestMatch.style.outline;
      bestMatch.style.outline = '3px solid #A61413';
      setTimeout(() => {
        if (bestMatch) bestMatch.style.outline = prevOutline;
      }, 900);
      bestMatch.click();
      const label = (bestMatch.innerText || bestMatch.getAttribute('aria-label') || cleanTarget).trim();
      const msg = `Carreguei em "${label}".`;
      setLastAction(msg);
      speak(msg);
      return true;
    }

    return false;
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
    const q = normalizeText(rawText);
    setErrorMsg(null);

    // 0. Comandos explícitos de clique em qualquer botão do ecrã: "carrega em ...", "clica em ...", "carregar no ..."
    const clickMatch = q.match(/(?:carrega|carregar|clica|clicar|pressiona|prime|abre o botao|carrega no botao)\s+(.+)/);
    if (clickMatch && clickMatch[1]) {
      const clicked = clickElementBySpokenText(clickMatch[1]);
      if (clicked) return;
    }

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
    if (q.includes('painel') || q.includes('direcao') || q.includes('visao geral') || q.includes('dashboard') || q.includes('entrar na plataforma') || q.includes('plataforma')) {
      if (!q.includes('funcionario') && !q.includes('financa') && !q.includes('mapa') && !q.includes('documento')) {
        goToPlatformModule('painel', 'Painel da Direção');
        return;
      }
    }

    if (q.includes('operac') || q.includes('mapa') || q.includes('ondjiva') || q.includes('zonas') || q.includes('bairros')) {
      if (q.includes('ainda nao limpas') || q.includes('pendentes')) {
        onOpenAIModal(rawText);
        setLastAction('A consultar zonas pendentes no Assistente de IA.');
        speak('A consultar as zonas pendentes.');
        return;
      }
      goToPlatformModule('operacoes', 'Operações e Mapa de Ondjiva');
      return;
    }

    if (q.includes('funcionario') || q.includes('rh') || q.includes('recursos humanos') || q.includes('presenca') || q.includes('equipa') || q.includes('trabalhador')) {
      if (q.includes('quantos') || q.includes('nao vieram') || q.includes('faltaram')) {
        onOpenAIModal(rawText);
        setLastAction('A consultar presenças de hoje no Assistente de IA.');
        speak('A verificar o registo de presenças de hoje.');
        return;
      }
      goToPlatformModule('rh', 'Funcionários, Presenças e RH');
      return;
    }

    if (q.includes('financa') || q.includes('dinheiro') || q.includes('caixa') || q.includes('despesa') || q.includes('receita') || q.includes('salario') || q.includes('quanto recebemos')) {
      if (q.includes('regista') || q.includes('quanto recebemos') || q.includes('kwanzas')) {
        onOpenAIModal(rawText);
        setLastAction('A encaminhar pedido financeiro para o Assistente de IA.');
        speak('A abrir o assistente financeiro.');
        return;
      }
      goToPlatformModule('financas', 'Finanças e Fluxo de Caixa');
      return;
    }

    if (q.includes('documento') || q.includes('oficio') || q.includes('carta') || q.includes('modelo') || q.includes('anr')) {
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

    if (q.includes('municipe') || q.includes('reclamac') || q.includes('ocorrencia') || q.includes('sms') || q.includes('qr')) {
      if (q.includes('comunicar') || q.includes('portal') || q.includes('protocolo') || q.includes('registar ocorrencia')) {
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

    if (q.includes('frota') || q.includes('viatura') || q.includes('camiao') || q.includes('equipamento') || q.includes('epi') || q.includes('uniforme')) {
      if (currentView === 'website' && (q.includes('ver') || q.includes('mostrar')) && !q.includes('frota')) {
        scrollToWebsiteSection('equipamentos', 'Equipamentos e EPI');
        return;
      }
      goToPlatformModule('frota', 'Frota, Equipamentos e EPI');
      return;
    }

    if (q.includes('relatorio') || q.includes('imprimir') || q.includes('pdf')) {
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
    if (q.includes('antes e depois') || q.includes('comparacao') || q.includes('resultados') || q.includes('fotos')) {
      scrollToWebsiteSection('antes-depois', 'Antes e Depois');
      return;
    }

    if (q.includes('servico') || q.includes('varredura') || q.includes('valas')) {
      scrollToWebsiteSection('servicos', 'Serviços');
      return;
    }

    if (q.includes('ceo') || q.includes('edir') || q.includes('empresa') || q.includes('gerente')) {
      scrollToWebsiteSection('empresa', 'Apresentação da Empresa e CEO');
      return;
    }

    if (q.includes('atuacao') || q.includes('cobertura')) {
      scrollToWebsiteSection('atuacao', 'Área de Atuação');
      return;
    }

    if (q.includes('contacto') || q.includes('telefone') || q.includes('email') || q.includes('formulario')) {
      scrollToWebsiteSection('contactos', 'Contactos');
      return;
    }

    if (q.includes('website') || q.includes('site') || q.includes('inicio') || q.includes('pagina principal')) {
      onCloseCitizenModal();
      onCloseAIModal();
      onViewChange('website');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const msg = 'A voltar ao Website Institucional.';
      setLastAction(msg);
      speak(msg);
      return;
    }

    // 4. Tenta clicar num botão cujo nome corresponda diretamente ao que foi dito
    if (clickElementBySpokenText(q)) {
      return;
    }

    // 5. Fallback: Se for uma pergunta ou comando complexo, enviar para o Assistente de IA
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
      setWakeWordMode(false);
      wakeWordModeRef.current = false;
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

  const toggleWakeWordMode = () => {
    const next = !wakeWordMode;
    setWakeWordMode(next);
    wakeWordModeRef.current = next;
    setIsAwake(false);

    if (next) {
      setLastAction(`Modo de ativação ligado. Diga "${wakeWord}" seguido da sua ordem.`);
      speak(`Modo mãos-livres ligado. Diga ${wakeWord} para começar.`);
      if (!isListening && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // ignore
        }
      }
    } else {
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setLastAction('Modo de ativação contínua desligado.');
    }
  };

  const sampleCommands = [
    'Carrega em Entrar na Plataforma',
    'Abre Operações e Mapa',
    'Abre Finanças',
    'Carrega em Lançar Nova Despesa',
    'Abre o Portal do Munícipe',
    'Quantos funcionários não vieram hoje?'
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => onToggleOpen(true)}
        data-voice-panel="true"
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-4 py-3 bg-slate-900 hover:bg-brand-primary text-white rounded-full shadow-2xl border border-slate-700 transition-all hover:scale-105 group no-print"
        title="Ativar Controlo por Voz com IA"
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
          isListening ? 'bg-red-600 animate-pulse' : 'bg-brand-primary group-hover:bg-white group-hover:text-brand-primary'
        }`}>
          <Mic className="w-4 h-4" />
        </div>
        <div className="text-left pr-1">
          <span className="text-xs font-bold block leading-none">
            {wakeWordMode ? `A aguardar "${wakeWord}"` : 'Navegação por Voz'}
          </span>
          <span className="text-[10px] text-slate-300 group-hover:text-white/90">
            Falar ou clicar por voz
          </span>
        </div>
      </button>
    );
  }

  return (
    <div
      data-voice-panel="true"
      className="fixed bottom-5 right-5 z-40 w-[92vw] max-w-sm bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 overflow-hidden no-print"
    >
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
            onClick={() => onToggleOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Minimizar (continua a ouvir se o modo mãos-livres estiver ligado)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Microphone & Wake Word Area */}
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
              {wakeWordMode
                ? isAwake
                  ? 'Desperto! Diga o comando...'
                  : `A aguardar palavra "${wakeWord}"...`
                : isListening
                ? 'A ouvir a sua instrução...'
                : 'Clique no microfone e dê uma ordem'}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {transcript ? `"${transcript}"` : 'Ex: "Cajambinha, carrega em Finanças"'}
            </p>
          </div>
        </div>

        {/* Wake Word Configuration Box */}
        <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Radio className={`w-4 h-4 flex-shrink-0 ${wakeWordMode ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <span className="text-[11px] text-slate-400 whitespace-nowrap">Ativar com:</span>
              <input
                type="text"
                value={wakeWord}
                onChange={(e) => setWakeWord(e.target.value)}
                className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-[11px] font-bold text-white focus:outline-none focus:border-brand-primary"
                aria-label="Palavra de ativação personalizada"
              />
            </div>
          </div>

          <button
            onClick={toggleWakeWordMode}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap ${
              wakeWordMode
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {wakeWordMode ? 'Mãos-Livres ON' : 'Ligar Mãos-Livres'}
          </button>
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
            Reconhecimento de voz não detetado neste navegador. Use Chrome, Edge ou Safari, ou clique nos comandos abaixo:
          </div>
        )}

        {/* Quick Voice Simulation Chips */}
        <div className="pt-2 border-t border-slate-800">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-2">
            <MousePointerClick className="w-3 h-3 text-brand-400" />
            <span>Comandos de Voz e Clique Automático:</span>
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
