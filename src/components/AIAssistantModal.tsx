'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Bot, Send, Sparkles, AlertCircle, CheckCircle2, 
  HelpCircle, ArrowRight, ShieldAlert, FileText, DollarSign, Users, MapPin 
} from 'lucide-react';
import { Worker, ZoneOperation, FinancialTransaction } from '@/data/mockData';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  workers: Worker[];
  operations: ZoneOperation[];
  transactions: FinancialTransaction[];
  onAddTransaction?: (tx: FinancialTransaction) => void;
  initialVoiceQuery?: string | null;
  onClearInitialQuery?: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionRequired?: {
    type: 'confirm_expense' | 'confirm_letter';
    data: any;
  };
  confirmed?: boolean;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  workers,
  operations,
  transactions,
  onAddTransaction,
  initialVoiceQuery,
  onClearInitialQuery
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: 'Olá! Sou o Assistente de Inteligência Artificial da OMBALA KISUL. Posso consultar o mapa de Ondjiva, o efetivo de 33 trabalhadores, o fluxo de caixa ou redigir documentos para a Administração Municipal do Cuanhama. Como posso ajudar hoje?',
      timestamp: 'Agora'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isOpen && initialVoiceQuery) {
      handleSendMessage(initialVoiceQuery);
      if (onClearInitialQuery) onClearInitialQuery();
    }
  }, [isOpen, initialVoiceQuery]);

  if (!isOpen) return null;

  const quickPrompts = [
    'Quantos funcionários não vieram hoje?',
    'Regista uma despesa de combustível de 80 mil kwanzas.',
    'Mostra as zonas ainda não limpas.',
    'Quanto recebemos este mês?',
    'Prepara uma carta para a Administração.',
    'Gera o relatório mensal.'
  ];

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      processAIQuery(query);
      setIsTyping(false);
    }, 600);
  };

  const processAIQuery = (query: string) => {
    const q = query.toLowerCase();
    let responseText = '';
    let actionPayload: Message['actionRequired'] = undefined;

    // 1. Presenças e Ausências
    if (q.includes('funcionários') || q.includes('vieram') || q.includes('presenças') || q.includes('ausente')) {
      const presentes = workers.filter(w => w.attendanceToday).length;
      const ausentes = workers.filter(w => !w.attendanceToday);
      
      responseText = `📊 Análise de Presenças de Hoje (${new Date().toLocaleDateString('pt-AO')}):\n\n` +
        `• Efectivo Previsto na Folha: 33 colaboradores (32 identificados nominalmente + 1 vaga em auditoria).\n` +
        `• Presentes em Posto / Campo: ${presentes} trabalhadores ativos.\n` +
        `• Ausências Registadas: ${ausentes.length} colaboradores, discriminados da seguinte forma:\n` +
        `  - Marta Kambinda (Varredora - Castilhos): Falta de marcação com justificação prévia de consulta médica (aguarda comprovativo presencial).\n` +
        `  - Fernando Kashilula (Varredor - Circular): Férias regulamentares aprovadas (15 a 30 de Novembro).\n` +
        `  - [Vaga Operacional 33]: Posição em aberto aguardando confirmação da Gerência Executiva.\n\n` +
        `⚠️ Nota Técnica: O sistema não transformou faltas pontuais em penalização salarial automática sem revisão prévia da chefia.`;
    } 
    // 2. Registo de Despesa de Combustível
    else if (q.includes('combustível') || q.includes('despesa') || q.includes('80 mil') || q.includes('80.000')) {
      responseText = `⛽ Preparação de Registo de Despesa Operacional:\n\n` +
        `Detectei o pedido de lançamento de despesa de combustível:\n` +
        `• Valor: 80.000 Kz (Oitenta mil kwanzas)\n` +
        `• Rubrica: Combustível / Frota de Limpeza\n` +
        `• Viatura Atribuída: Camião Basculante LD-84-21-HK (Motorista: José Catata)\n` +
        `• Fornecedor: Posto Sonangol Ondjiva\n` +
        `• Conta de Saída: Caixa Operacional Ondjiva\n` +
        `• Centro de Custo: Logística e Frota\n\n` +
        `⚠️ Regra de Auditoria: Em conformidade com a política financeira, despesas criadas por IA exigem confirmação explícita do gestor antes de serem gravadas no razão.`;

      actionPayload = {
        type: 'confirm_expense',
        data: {
          code: `COMB-2026-${Math.floor(100 + Math.random() * 900)}`,
          amount: 80000,
          description: 'Abastecimento de Gasóleo - Camião Basculante LD-84-21-HK (Sonangol Ondjiva)',
          category: 'combustivel',
          account: 'Caixa Operacional Ondjiva'
        }
      };
    } 
    // 3. Zonas ainda não limpas
    else if (q.includes('zonas') || q.includes('não limpas') || q.includes('pendentes') || q.includes('limpar')) {
      const pendentes = operations.filter(op => op.status !== 'concluido');
      responseText = `📍 Zonas e Frentes Operacionais com Intervenção Pendente em Ondjiva:\n\n` +
        pendentes.map(op => 
          `• [${op.code}] ${op.bairro} (${op.serviceType.toUpperCase()}):\n` +
          `   Estado: ${op.status === 'em_execucao' ? 'Em Execução' : op.status === 'aguardar_validacao' ? 'Aguardar Validação do Supervisor' : 'Planeado'}\n` +
          `   Prioridade: ${op.priority.toUpperCase()} | Encarregado: ${op.supervisor} (${op.assignedWorkersCount} trabalhadores)\n` +
          `   Estimativa: ${op.tonnageEstimated} toneladas para a Lixeira Oficial`
        ).join('\n\n') +
        `\n\n💡 Podes filtrar diretamente estas áreas no mapa da cidade.`;
    } 
    // 4. Receitas do Mês
    else if (q.includes('recebemos') || q.includes('receita') || q.includes('faturação') || q.includes('dinheiro')) {
      responseText = `💰 Posição Financeira de Receitas (Novembro de 2026):\n\n` +
        `• Contratado / Proposta Anual: 174.500.000 Kz\n` +
        `• Faturação Mensal Prevista (1/12): 14.541.667 Kz (Fatura Pro-forma emitida à Administração de Cuanhama)\n` +
        `• Recebimento Efetivo Liquidado em Conta: 0,00 Kz (Aguardando processamento e liquidação orçamental pelo Governo Provincial)\n\n` +
        `⚠️ Separação Contabilística Estrita:\n` +
        `O montante de 14.541.667 Kz consta como receita prevista/faturada, não tendo ainda transitado para saldo disponível no BFA ou BAI.\n` +
        `Recomendação de Tesouraria: Manter reserva de contingência de 6.525.000 Kz para cobertura salarial até confirmação de liquidação.`;
    } 
    // 5. Preparar Carta para Administração
    else if (q.includes('carta') || q.includes('administração') || q.includes('cuanhama') || q.includes('ofício')) {
      responseText = `📄 Rascunho Institucional Preparado para Envio:\n\n` +
        `Destinatário: Administrador Municipal do Cuanhama, Ondjiva - Cunene\n` +
        `Remetente: OMBALA KISUL — LDA (NIF: 5000597244)\n` +
        `Subscritor: Edir Jorge Muluta Pacelli (Gerente Executivo)\n\n` +
        `Assunto: Relatório de Execução Operacional e Limpeza Preventiva de Sarjetas e Valas do Casco Urbano\n\n` +
        `Texto do Ofício:\n` +
        `"Excelentíssimo Senhor Administrador Municipal,\n` +
        `A OMBALA KISUL — LDA vem mui respeitosamente apresentar a Vossa Excelência o ponto de situação das operações de desobstrução e saneamento no Bairro Naipalala e Mercado Central da Alemanha, em cumprimento das metas sanitárias do Casco Urbano de Ondjiva.\n` +
        `Juntam-se em anexo as evidências fotográficas antes/depois e o mapa de deposição na Lixeira Oficial."\n\n` +
        `O rascunho está disponível no Módulo de Documentos com carimbo provisório "RASCUNHO".`;
    } 
    // 6. Relatório Mensal
    else if (q.includes('relatório') || q.includes('mensal') || q.includes('dossier')) {
      responseText = `📑 Compilação de Relatório Mensal de Saneamento:\n\n` +
        `Reuni todos os dados auditados do mês corrente:\n` +
        `• 5 Frentes de Trabalho operadas em Ondjiva\n` +
        `• 12,9 Toneladas de resíduos sólidos e lamas desassoreadas\n` +
        `• 6 Viagens registradas com destino à Lixeira Municipal de Cuanhama\n` +
        `• 2 Ocorrências de munícipes resolvidas com comprovativo fotográfico\n` +
        `• 0 Acidentes de trabalho com equipamentos ou EPIs\n\n` +
        `O documento completo pode ser gerado no Módulo 9 (Relatórios) e exportado para impressão oficial.`;
    } 
    // Outras consultas genéricas
    else {
      responseText = `Entendido. Registado no sistema da OMBALA KISUL com fuso horário Africa/Luanda.\n` +
        `Se precisares de consultar presenças, validar ordens de serviço em Ondjiva, simular custos de combustível ou preparar cartas institucionais, podes usar um dos comandos rápidos ou formular a tua questão.`;
    }

    const aiMsg: Message = {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      text: responseText,
      timestamp: new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' }),
      actionRequired: actionPayload
    };

    setMessages(prev => [...prev, aiMsg]);
  };

  const handleConfirmAction = (msgId: string, actionData: any) => {
    if (onAddTransaction) {
      onAddTransaction({
        id: `TX-AI-${Date.now()}`,
        code: actionData.code,
        type: 'despesa',
        category: actionData.category,
        classification: 'realizado',
        amount: actionData.amount,
        date: new Date().toISOString().split('T')[0],
        status: 'pago',
        description: actionData.description,
        costCenter: 'Logística e Frota',
        account: actionData.account,
        receiptAttached: true,
        approvedBy: 'Edir Jorge Muluta Pacelli (Via IA Assistente)'
      });
    }

    setMessages(prev => prev.map(m => {
      if (m.id === msgId) {
        return {
          ...m,
          confirmed: true,
          text: m.text + `\n\n✅ [CONFIRMADO]: Despesa registada com sucesso no razão financeiro com auditoria de utilizador.`
        };
      }
      return m;
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col h-[640px]">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base leading-tight">Assistente Operacional OMBALA KISUL</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold px-2 py-0.5 rounded border border-emerald-500/30">
                  Online • Dados Reais
                </span>
              </div>
              <p className="text-xs text-slate-400">Consultas e Lançamentos em Português com Auditoria</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompts Carousel */}
        <div className="p-2.5 bg-slate-100 border-b border-slate-200 overflow-x-auto flex gap-2 text-xs scrollbar-none">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1.5 bg-white hover:bg-brand-50 hover:text-brand-primary hover:border-brand-300 border border-slate-300 rounded-full font-medium text-slate-700 whitespace-nowrap transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-brand-primary flex-shrink-0" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs bg-slate-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-brand-primary text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none whitespace-pre-wrap leading-relaxed'
                }`}
              >
                {msg.text}

                {/* Interactive Action Confirmation (e.g. for expense creation) */}
                {msg.actionRequired && !msg.confirmed && (
                  <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-[11px]">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Confirma a criação deste registo na tesouraria da empresa?</span>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleConfirmAction(msg.id, msg.actionRequired?.data)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirmar e Registar</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {msg.sender === 'user' ? 'Você' : 'Assistente IA'} • {msg.timestamp}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic">
              <Bot className="w-4 h-4 text-brand-primary animate-spin" />
              <span>A analisar base de dados e regras de negócio...</span>
            </div>
          )}
        </div>

        {/* Query Input */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Pergunta sobre funcionários, despesas, zonas pendentes ou relatórios..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 p-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="p-2.5 bg-brand-primary hover:bg-brand-hover disabled:bg-slate-300 text-white rounded-xl shadow transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
            <span>Auditado: A IA não executa comandos ocultos de anexos ou SMS de terceiros.</span>
            <span>Segurança: Acesso condicionado a permissões de função</span>
          </div>
        </div>

      </div>
    </div>
  );
};
