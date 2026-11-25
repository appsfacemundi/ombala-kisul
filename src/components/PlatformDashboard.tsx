'use client';

import React, { useState } from 'react';
import { 
  Worker, ZoneOperation, FinancialTransaction, CitizenComplaint, Vehicle,
  WORKFORCE_RECONCILIATION, FINANCIAL_OVERVIEW
} from '@/data/mockData';
import { OndjivaMap } from './OndjivaMap';
import { 
  LayoutDashboard, Map, Users, DollarSign, FileText, Briefcase, 
  MessageSquare, Truck, BarChart3, Bot, ShieldCheck, CheckCircle2, 
  AlertCircle, Clock, Search, Plus, Filter, Download, ArrowUpRight, 
  ArrowDownRight, Check, X, Printer, Lock, RefreshCw, Key, Shield
} from 'lucide-react';

export type ModuleKey = 
  | 'painel' 
  | 'operacoes' 
  | 'rh' 
  | 'financas' 
  | 'documentos' 
  | 'contratos' 
  | 'municipes' 
  | 'frota' 
  | 'relatorios' 
  | 'ia' 
  | 'admin';

interface PlatformDashboardProps {
  workers: Worker[];
  operations: ZoneOperation[];
  transactions: FinancialTransaction[];
  complaints: CitizenComplaint[];
  vehicles: Vehicle[];
  onValidateOperation: (opId: string) => void;
  onAddTransaction: (tx: FinancialTransaction) => void;
  onUpdateComplaintStatus: (id: string, status: CitizenComplaint['status'], team?: string) => void;
  onOpenAIModal: () => void;
  activeModule?: ModuleKey;
  onModuleChange?: (mod: ModuleKey) => void;
  isOffline?: boolean;
  pendingSyncCount?: number;
  onManualSync?: () => void;
}

type UserRole = 'admin_maximo' | 'direcao' | 'rh' | 'financas' | 'supervisor' | 'campo' | 'auditor';

export const PlatformDashboard: React.FC<PlatformDashboardProps> = ({
  workers,
  operations,
  transactions,
  complaints,
  vehicles,
  onValidateOperation,
  onAddTransaction,
  onUpdateComplaintStatus,
  onOpenAIModal,
  activeModule: controlledModule,
  onModuleChange,
  isOffline = false,
  pendingSyncCount = 0,
  onManualSync
}) => {
  const [internalModule, setInternalModule] = useState<ModuleKey>('painel');
  const activeModule = controlledModule || internalModule;
  const setActiveModule = (mod: ModuleKey) => {
    setInternalModule(mod);
    if (onModuleChange) onModuleChange(mod);
  };
  const [currentRole, setCurrentRole] = useState<UserRole>('direcao');
  
  // Local states for transactions
  const [showNewExpenseModal, setShowNewExpenseModal] = useState(false);
  const [newExpenseDesc, setNewExpenseDesc] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseCategory, setNewExpenseCategory] = useState<FinancialTransaction['category']>('combustivel');
  const [newExpenseAccount, setNewExpenseAccount] = useState<FinancialTransaction['account']>('Caixa Operacional Ondjiva');

  // Local state for letter preview
  const [selectedDocTemplate, setSelectedDocTemplate] = useState<'oficio_cuanhama' | 'proforma_mensal' | 'pedido_anr'>('oficio_cuanhama');

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState([
    { id: '1', time: '11:32', user: 'Helmer Lisboa (Supervisor)', action: 'Submissão de fotos de conclusão', target: 'OND-MERC-02 (Mercado Alemanha)' },
    { id: '2', time: '10:15', user: 'Edir Jorge Muluta Pacelli (CEO)', action: 'Validação de ordem de serviço', target: 'OND-CAST-03 (Poda Castilhos)' },
    { id: '3', time: '09:00', user: 'Filomena Tchivangulula (RH)', action: 'Registo de justificação médica', target: 'Marta Kambinda (Varredora)' },
    { id: '4', time: '08:45', user: 'Sistema IA', action: 'Auditoria de discrepância de efetivo', target: 'Folha de 33 vs 32 listados' },
  ]);

  // Handle adding expense
  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseDesc || !newExpenseAmount) return;

    const amountNum = parseFloat(newExpenseAmount);
    const newTx: FinancialTransaction = {
      id: `TX-${Date.now()}`,
      code: `DESP-2026/${Math.floor(100 + Math.random() * 900)}`,
      type: 'despesa',
      category: newExpenseCategory,
      classification: 'realizado',
      amount: amountNum,
      date: new Date().toISOString().split('T')[0],
      status: 'pago',
      description: newExpenseDesc,
      costCenter: 'Logística e Frota',
      account: newExpenseAccount,
      receiptAttached: true,
      approvedBy: currentRole === 'direcao' || currentRole === 'admin_maximo' ? 'Edir Jorge Muluta Pacelli' : undefined
    };

    onAddTransaction(newTx);
    setAuditLogs(prev => [
      { id: String(Date.now()), time: new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' }), user: `${currentRole.toUpperCase()}`, action: 'Lançamento de despesa', target: `${amountNum.toLocaleString()} Kz - ${newExpenseDesc}` },
      ...prev
    ]);

    setShowNewExpenseModal(false);
    setNewExpenseDesc('');
    setNewExpenseAmount('');
  };

  // Quick stats
  const totalOperations = operations.length;
  const inProgressOps = operations.filter(o => o.status === 'em_execucao').length;
  const pendingValidationOps = operations.filter(o => o.status === 'aguardar_validacao').length;
  const completedOps = operations.filter(o => o.status === 'concluido').length;

  const totalWorkers = workers.length;
  const presentWorkers = workers.filter(w => w.attendanceToday).length;

  const totalRealizedExpenses = transactions
    .filter(t => t.type === 'despesa' && t.classification === 'realizado')
    .reduce((acc, t) => acc + t.amount, 0);

  const pendingComplaintsCount = complaints.filter(c => c.status === 'recebida' || c.status === 'em_triagem').length;

  return (
    <div className="flex-1 bg-slate-100 flex flex-col min-h-screen">
      
      {/* Platform Sub-Header / Control Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        
        {/* Left: Role Switcher & Context */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Perfil Ativo:</span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className="text-xs font-bold bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:ring-2 focus:ring-brand-primary/20"
            >
              <option value="direcao">Direção Geral (Edir Pacelli - CEO)</option>
              <option value="admin_maximo">Administrador Máximo (Sistemas)</option>
              <option value="rh">Administração / RH (Filomena T.)</option>
              <option value="financas">Finanças & Contabilidade</option>
              <option value="supervisor">Supervisor de Campo (Helmer Lisboa)</option>
              <option value="campo">Funcionário de Campo / Motorista</option>
              <option value="auditor">Auditor / Administração Municipal</option>
            </select>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500">
            <span>•</span>
            <span>Identificador Google: <strong className="font-mono text-slate-700">edir.pacelli@ombalakisul.com</strong></span>
            <span>•</span>
            <span className="font-semibold text-brand-primary">app.ombalakisul.com</span>
          </div>
        </div>

        {/* Right: Quick Operational Badges */}
        <div className="flex items-center gap-3">
          {pendingValidationOps > 0 && (
            <button
              onClick={() => setActiveModule('operacoes')}
              className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>{pendingValidationOps} por validar</span>
            </button>
          )}

          {pendingComplaintsCount > 0 && (
            <button
              onClick={() => setActiveModule('municipes')}
              className="flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 border border-purple-300 text-purple-900 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
              <span>{pendingComplaintsCount} ocorrências munícipes</span>
            </button>
          )}

          <button
            onClick={onOpenAIModal}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-brand-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
          >
            <Bot className="w-3.5 h-3.5 text-brand-300" />
            <span>Assistente IA</span>
          </button>
        </div>

      </div>

      {/* Main App Layout: Sidebar + Workspace */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-2 sm:px-4 py-4 gap-4">
        
        {/* Modular Navigation Sidebar */}
        <aside className="w-full md:w-60 bg-white rounded-2xl border border-slate-200 p-3 shadow-sm flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-1 text-xs font-medium text-slate-700 flex-shrink-0">
          
          <div className="hidden md:block px-3 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Módulos Operacionais
          </div>

          <button
            onClick={() => setActiveModule('painel')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-left whitespace-nowrap ${
              activeModule === 'painel' ? 'bg-brand-primary text-white font-bold shadow' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
            <span>1. Painel da Direção</span>
          </button>

          <button
            onClick={() => setActiveModule('operacoes')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left whitespace-nowrap ${
              activeModule === 'operacoes' ? 'bg-brand-primary text-white font-bold shadow' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Map className="w-4 h-4 flex-shrink-0" />
              <span>2. Operações & Mapa</span>
            </div>
            {pendingValidationOps > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeModule === 'operacoes' ? 'bg-white text-brand-primary' : 'bg-amber-100 text-amber-800'
              }`}>
                {pendingValidationOps}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveModule('rh')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left whitespace-nowrap ${
              activeModule === 'rh' ? 'bg-brand-primary text-white font-bold shadow' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 flex-shrink-0" />
              <span>3. Funcionários & RH</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeModule === 'rh' ? 'bg-white text-brand-primary' : 'bg-red-100 text-red-800'
            }`}>
              33/32
            </span>
          </button>

          <button
            onClick={() => setActiveModule('financas')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-left whitespace-nowrap ${
              activeModule === 'financas' ? 'bg-brand-primary text-white font-bold shadow' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <DollarSign className="w-4 h-4 flex-shrink-0" />
            <span>4. Finanças & Caixa</span>
          </button>

          <button
            onClick={() => setActiveModule('documentos')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-left whitespace-nowrap ${
              activeModule === 'documentos' ? 'bg-brand-primary text-white font-bold shadow' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <FileText className="w-4 h-4 flex-shrink-0" />
            <span>5. Documentos & Modelos</span>
          </button>

          <button
            onClick={() => setActiveModule('contratos')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-left whitespace-nowrap ${
              activeModule === 'contratos' ? 'bg-brand-primary text-white font-bold shadow' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Briefcase className="w-4 h-4 flex-shrink-0" />
            <span>6. Clientes & Contratos</span>
          </button>

          <button
            onClick={() => setActiveModule('municipes')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left whitespace-nowrap ${
              activeModule === 'municipes' ? 'bg-brand-primary text-white font-bold shadow' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              <span>7. Munícipes & SMS</span>
            </div>
            {pendingComplaintsCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeModule === 'municipes' ? 'bg-white text-brand-primary' : 'bg-purple-100 text-purple-800'
              }`}>
                {pendingComplaintsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveModule('frota')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-left whitespace-nowrap ${
              activeModule === 'frota' ? 'bg-brand-primary text-white font-bold shadow' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Truck className="w-4 h-4 flex-shrink-0" />
            <span>8. Frota, Meios & EPI</span>
          </button>

          <button
            onClick={() => setActiveModule('relatorios')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-left whitespace-nowrap ${
              activeModule === 'relatorios' ? 'bg-brand-primary text-white font-bold shadow' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <BarChart3 className="w-4 h-4 flex-shrink-0" />
            <span>9. Relatórios Mensais</span>
          </button>

          <button
            onClick={() => setActiveModule('admin')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-left whitespace-nowrap ${
              activeModule === 'admin' ? 'bg-brand-primary text-white font-bold shadow' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>11. Permissões & Auditoria</span>
          </button>

          <div className="pt-3 mt-auto border-t border-slate-200 hidden md:block text-[11px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-800">OMBALA KISUL — LDA</p>
            <p>Ondjiva, Cuanhama, Cunene</p>
            <p className="text-[10px] text-emerald-700 font-medium">Fuso: Africa/Luanda</p>
          </div>
        </aside>

        {/* Dynamic Module Content View */}
        <main className="flex-1 space-y-4">
          
          {/* ======================================================== */}
          {/* MÓDULO 1: PAINEL DA DIREÇÃO (EXECUTIVE DASHBOARD) */}
          {/* ======================================================== */}
          {activeModule === 'painel' && (
            <div className="space-y-4">
              
              {/* Executive Notification Banners */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-5 sm:p-6 border border-slate-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold text-brand-400 uppercase tracking-wider block">
                    Visão Integrada de Gestão
                  </span>
                  <h3 className="text-xl font-black">
                    Centro de Controlo Executivo — Ondjiva
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">
                    Acompanhamento em tempo real das frentes de saneamento básico, presenças da equipa de 33 trabalhadores e controlo orçamental da empreitada de Cuanhama.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setActiveModule('operacoes')}
                    className="px-4 py-2 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-lg shadow transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Ver Mapa Operacional</span>
                  </button>
                  <button
                    onClick={onOpenAIModal}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg border border-white/20 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Bot className="w-3.5 h-3.5 text-brand-300" />
                    <span>Consultar IA</span>
                  </button>
                </div>
              </div>

              {/* 4 Primary Operational Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                
                {/* Metric 1 */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-semibold">Operações em Curso</span>
                    <Map className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">{inProgressOps}</span>
                    <span className="text-slate-400">de {totalOperations} zonas</span>
                  </div>
                  <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Naipalala e Mercado em atividade
                  </p>
                </div>

                {/* Metric 2 */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-semibold">Aguardam Validação</span>
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-amber-600">{pendingValidationOps}</span>
                    <span className="text-slate-400">trabalhos</span>
                  </div>
                  <button 
                    onClick={() => setActiveModule('operacoes')}
                    className="text-[11px] text-brand-primary font-bold hover:underline block text-left"
                  >
                    Ver fotos para aprovação →
                  </button>
                </div>

                {/* Metric 3 */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-semibold">Presenças Hoje</span>
                    <Users className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">{presentWorkers}</span>
                    <span className="text-slate-400">de 33 postos</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    1 justificado, 1 férias, 1 auditoria
                  </p>
                </div>

                {/* Metric 4 */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-semibold">Despesas Realizadas</span>
                    <DollarSign className="w-4 h-4 text-brand-primary" />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-slate-900">
                      {(totalRealizedExpenses / 1000).toLocaleString()} mil
                    </span>
                    <span className="text-slate-500 font-bold">Kz</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Combustível + 50% aluguer camião
                  </p>
                </div>

              </div>

              {/* Ondjiva Map Embedded in Dashboard */}
              <div>
                <OndjivaMap 
                  operations={operations} 
                  onValidateOperation={onValidateOperation}
                  isSupervisorOrAdmin={currentRole === 'direcao' || currentRole === 'supervisor' || currentRole === 'admin_maximo'}
                />
              </div>

              {/* Two Column Section: Recent Operations vs Audit Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                
                {/* Recent Complaints */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-purple-600" />
                      Ocorrências Recentes de Munícipes (QR / SMS)
                    </h4>
                    <button 
                      onClick={() => setActiveModule('municipes')}
                      className="text-brand-primary font-bold hover:underline text-xs"
                    >
                      Gerir Todas ({complaints.length})
                    </button>
                  </div>

                  <div className="space-y-2">
                    {complaints.slice(0, 3).map(c => (
                      <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-brand-primary text-[11px]">{c.protocol}</span>
                            <span className="text-slate-400">•</span>
                            <span className="font-semibold text-slate-800">{c.bairro}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] mt-0.5 line-clamp-1">{c.description}</p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 whitespace-nowrap">
                          {c.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit & Log Trail */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Registo de Auditoria Operacional
                    </h4>
                    <span className="text-[11px] text-slate-400">Registos Imutáveis</span>
                  </div>

                  <div className="space-y-2">
                    {auditLogs.map(log => (
                      <div key={log.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-[11px]">
                        <div>
                          <span className="font-bold text-slate-800">{log.action}: </span>
                          <span className="text-slate-600">{log.target}</span>
                          <span className="text-slate-400 block text-[10px]">Por: {log.user}</span>
                        </div>
                        <span className="font-mono text-slate-400 text-[10px]">{log.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* MÓDULO 2: OPERAÇÕES E MAPA DE ONDJIVA */}
          {/* ======================================================== */}
          {activeModule === 'operacoes' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Controlo Operacional de Campo</h3>
                  <p className="text-slate-500">Casco Urbano de Ondjiva • Registo de viagens, descargas na lixeira e validação de evidências</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveModule('relatorios')}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg border border-slate-300 transition-colors flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Gerar Relatório com Fotos</span>
                  </button>
                </div>
              </div>

              <OndjivaMap 
                operations={operations} 
                onValidateOperation={onValidateOperation}
                isSupervisorOrAdmin={currentRole === 'direcao' || currentRole === 'supervisor' || currentRole === 'admin_maximo'}
              />
            </div>
          )}

          {/* ======================================================== */}
          {/* MÓDULO 3: FUNCIONÁRIOS, PRESENÇAS E RH */}
          {/* ======================================================== */}
          {activeModule === 'rh' && (
            <div className="space-y-4">
              
              {/* DISCREPANCY RECONCILIATION AUDIT CARD */}
              <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 text-xs text-amber-950 space-y-2 shadow-sm">
                <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
                  <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0" />
                  <span>Auditoria e Reconciliação do Efetivo: Folha refere 33, Linhas somam 32</span>
                </div>
                <p className="leading-relaxed">
                  {WORKFORCE_RECONCILIATION.motivoAuditoria}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3 font-semibold text-[11px]">
                  <span className="bg-white px-2.5 py-1 rounded border border-amber-300">
                    Folha Salarial Oficial: <strong>33 Pessoas</strong>
                  </span>
                  <span className="bg-white px-2.5 py-1 rounded border border-amber-300">
                    Postos Discriminados: <strong>32 Linhas</strong>
                  </span>
                  <span className="bg-amber-200/80 text-amber-900 px-2.5 py-1 rounded border border-amber-400">
                    Diferença Auditada: <strong>1 Vaga em Reconciliação (EMP-033)</strong>
                  </span>
                </div>
              </div>

              {/* Workers Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Cadastro de Pessoal e Presenças Diárias</h3>
                    <p className="text-slate-500">29 Operacionais + 4 Administrativos / Direção • Turno Manhã (06h00 – 12h00)</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-[11px]">
                    {presentWorkers} Presentes / {totalWorkers} Registados
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200 uppercase text-[10px]">
                      <tr>
                        <th className="py-3 px-4">ID</th>
                        <th className="py-3 px-4">Nome do Colaborador</th>
                        <th className="py-3 px-4">Função</th>
                        <th className="py-3 px-4">Zona / Frente</th>
                        <th className="py-3 px-4">Presença Hoje</th>
                        <th className="py-3 px-4">Check-in</th>
                        <th className="py-3 px-4">EPI Entregue</th>
                        <th className="py-3 px-4">Notas & Justificação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {workers.map((w) => (
                        <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">{w.id}</td>
                          <td className="py-3 px-4 font-semibold text-slate-900">{w.name}</td>
                          <td className="py-3 px-4 text-slate-600">{w.role}</td>
                          <td className="py-3 px-4">{w.zone}</td>
                          <td className="py-3 px-4">
                            {w.attendanceToday ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                Presente
                              </span>
                            ) : w.status === 'ferias' ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                                Férias
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-300">
                                Ausente / Pendente
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono">{w.checkIn || '--'}</td>
                          <td className="py-3 px-4">
                            {w.ppeDelivered ? (
                              <span className="text-emerald-700 font-bold flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" />
                                Completo
                              </span>
                            ) : (
                              <span className="text-slate-400">Pendente</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-500 italic max-w-xs truncate">
                            {w.notes || 'Normal'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Desktop Activity Transparency Notice */}
                <div className="p-4 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block">Política de Medição de Atividade e Respeito à Privacidade:</strong>
                    A aplicação web da OMBALA KISUL mede estritamente as interações dentro da própria plataforma. Não utiliza gravação contínua de ecrã ou leitura de teclas. Períodos sem interação não são convertidos automaticamente em falta salarial sem revisão do encarregado.
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* MÓDULO 4: FINANÇAS E FLUXO DE CAIXA */}
          {/* ======================================================== */}
          {activeModule === 'financas' && (
            <div className="space-y-4">
              
              {/* Financial Scenario Header */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Cenário Orçamental</span>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-slate-300">
                      Previsão Documental
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mt-1">Gestão Financeira e Controlo de Caixa</h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Contrato Anual Cuanhama: <strong>174.500.000 Kz</strong> • Mensal Previsto: <strong>14.541.667 Kz</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowNewExpenseModal(true)}
                    className="px-4 py-2 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-lg shadow transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Lançar Nova Despesa</span>
                  </button>
                </div>
              </div>

              {/* Budget vs Actual Comparison Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                  <span className="text-slate-500 font-semibold block">Previsão Contratual Mensal</span>
                  <p className="text-2xl font-black text-slate-900">14.541.667 Kz</p>
                  <p className="text-[11px] text-amber-700 font-medium">
                    Classificação: Faturação Prevista (Aguardando liquidação)
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                  <span className="text-slate-500 font-semibold block">Custo Total Mensal Orçado</span>
                  <p className="text-2xl font-black text-slate-900">12.025.000 Kz</p>
                  <p className="text-[11px] text-slate-500">
                    Salários (6.525.000) + Viaturas (2.800.000) + Outros
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                  <span className="text-slate-500 font-semibold block">Reserva de Emergência Recomendada</span>
                  <p className="text-2xl font-black text-emerald-700">6.525.000 Kz</p>
                  <p className="text-[11px] text-slate-500">
                    Garante 1 mês de salários em caso de atraso governamental
                  </p>
                </div>

              </div>

              {/* Transactions Ledger */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                  <h4 className="font-bold text-slate-900">Razão de Movimentos e Comprovativos</h4>
                  <span className="text-slate-500">Separar Contratado ≠ Faturado ≠ Recebido Efetivo</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200 uppercase text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Código</th>
                        <th className="py-3 px-4">Data</th>
                        <th className="py-3 px-4">Descrição</th>
                        <th className="py-3 px-4">Rubrica</th>
                        <th className="py-3 px-4">Tipo</th>
                        <th className="py-3 px-4">Classificação</th>
                        <th className="py-3 px-4">Conta</th>
                        <th className="py-3 px-4 text-right">Montante</th>
                        <th className="py-3 px-4">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">{tx.code}</td>
                          <td className="py-3 px-4 text-slate-500">{tx.date}</td>
                          <td className="py-3 px-4 font-medium text-slate-900">{tx.description}</td>
                          <td className="py-3 px-4 capitalize">{tx.category}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              tx.type === 'receita' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {tx.type.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              tx.classification === 'realizado' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {tx.classification.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{tx.account}</td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                            {tx.amount.toLocaleString()} Kz
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-emerald-700 font-bold capitalize">{tx.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal for New Expense */}
              {showNewExpenseModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                  <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <h4 className="font-bold text-sm text-slate-900">Lançamento de Despesa Operacional</h4>
                      <button onClick={() => setShowNewExpenseModal(false)}>
                        <X className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>

                    <form onSubmit={handleCreateExpense} className="space-y-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Descrição do Gasto *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Abastecimento Camião LD-84-21-HK"
                          value={newExpenseDesc}
                          onChange={(e) => setNewExpenseDesc(e.target.value)}
                          className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Montante (Kz) *</label>
                          <input
                            type="number"
                            required
                            placeholder="Ex: 80000"
                            value={newExpenseAmount}
                            onChange={(e) => setNewExpenseAmount(e.target.value)}
                            className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Rubrica</label>
                          <select
                            value={newExpenseCategory}
                            onChange={(e) => setNewExpenseCategory(e.target.value as FinancialTransaction['category'])}
                            className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
                          >
                            <option value="combustivel">Combustível</option>
                            <option value="viaturas">Aluguer de Viaturas</option>
                            <option value="epi">EPI & Ferramentas</option>
                            <option value="manutencao">Manutenção</option>
                            <option value="administrativo">Administrativo</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Conta de Pagamento</label>
                        <select
                          value={newExpenseAccount}
                          onChange={(e) => setNewExpenseAccount(e.target.value as FinancialTransaction['account'])}
                          className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
                        >
                          <option value="Caixa Operacional Ondjiva">Caixa Operacional Ondjiva</option>
                          <option value="BFA Ondjiva">BFA Ondjiva</option>
                          <option value="BAI Cunene">BAI Cunene</option>
                        </select>
                      </div>

                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-500">
                        O registo exige comprovativo fiscal e ficará associado ao utilizador <strong>{currentRole}</strong> para auditoria contábil.
                      </div>

                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowNewExpenseModal(false)}
                          className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 font-bold text-white bg-brand-primary hover:bg-brand-hover rounded-lg shadow"
                        >
                          Gravar Movimento
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ======================================================== */}
          {/* MÓDULO 5: DOCUMENTOS E MODELOS INSTITUCIONAIS */}
          {/* ======================================================== */}
          {activeModule === 'documentos' && (
            <div className="space-y-4">
              
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Arquivo Digital e Gerador de Ofícios Oficiais</h3>
                  <p className="text-slate-500">Modelos institucionais timbrados para Administração de Cuanhama, ANR e Clientes</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedDocTemplate('oficio_cuanhama')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                      selectedDocTemplate === 'oficio_cuanhama' ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Ofício Municipal Cuanhama
                  </button>
                  <button
                    onClick={() => setSelectedDocTemplate('pedido_anr')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                      selectedDocTemplate === 'pedido_anr' ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Carta Licenciamento ANR
                  </button>
                </div>
              </div>

              {/* Document Paper Preview */}
              <div className="bg-white rounded-2xl border border-slate-300 p-8 sm:p-12 shadow-md max-w-3xl mx-auto font-serif text-slate-900 space-y-6 relative">
                
                {/* Watermark Stamp */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-dashed border-red-500/20 text-red-500/20 text-6xl font-black uppercase rotate-[-25deg] select-none pointer-events-none p-6">
                  RASCUNHO / PROVISÓRIO
                </div>

                {/* Letter Header */}
                <div className="flex items-center justify-between border-b-2 border-brand-primary pb-4">
                  <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="Ombala Kisul" className="w-14 h-14 object-contain" />
                    <div>
                      <h2 className="font-sans font-black text-xl text-brand-primary tracking-tight">OMBALA KISUL — LDA</h2>
                      <p className="font-sans text-xs text-slate-600">Saneamento Básico | Gestão de Resíduos | Limpeza Urbana</p>
                      <p className="font-sans text-[11px] text-slate-400">Ondjiva - Cuanhama - Cunene | NIF: 5000597244 | Tel: 927 855 626</p>
                    </div>
                  </div>
                  <div className="text-right font-sans text-xs text-slate-500">
                    <p>Ondjiva, {new Date().toLocaleDateString('pt-AO')}</p>
                    <p className="font-mono text-[10px]">Ref: OK/ADM/2026-088</p>
                  </div>
                </div>

                {/* Recipient */}
                <div className="text-xs space-y-1">
                  <p>Ao</p>
                  <p className="font-bold">Excelentíssimo Senhor Administrador Municipal do Cuanhama</p>
                  <p>Administração Municipal do Cuanhama</p>
                  <p>Ondjiva — Província do Cunene</p>
                </div>

                {/* Subject */}
                <div className="text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-50 p-2 rounded border border-slate-200">
                  Assunto: Relatório de Execução Operacional de Limpeza e Desobstrução de Valas
                </div>

                {/* Body Text */}
                <div className="text-xs leading-relaxed space-y-3 text-justify">
                  <p>Excelentíssimo Senhor Administrador Municipal,</p>
                  <p>
                    A <strong>OMBALA KISUL — LDA</strong>, empresa de direito angolano com sede em Ondjiva, NIF 5000597244, vem por este meio submeter a Vossa Excelência o ponto de situação detalhado das intervenções realizadas no Casco Urbano de Ondjiva durante o presente período.
                  </p>
                  <p>
                    No âmbito dos trabalhos diários, a nossa equipa operacional de 29 trabalhadores assegurou a varredura contínua de 18 artérias viárias, a desobstrução hidráulica da Vala Mestra do Bairro Naipalala e a recolha de mais de 12 toneladas de resíduos sólidos encaminhados para a Lixeira Oficial Municipal de Cuanhama.
                  </p>
                  <p>
                    Reafirmamos o nosso firme compromisso em colaborar estreitamente com as autoridades municipais na manutenção de uma cidade limpa, digna e saudável.
                  </p>
                  <p>Com os nossos mais elevados protestos de consideração e estima,</p>
                </div>

                {/* Signature */}
                <div className="pt-8 text-center text-xs space-y-1 font-sans">
                  <p className="w-56 border-b border-slate-400 mx-auto"></p>
                  <p className="font-bold text-slate-900 mt-2">Edir Jorge Muluta Pacelli</p>
                  <p className="text-slate-600">Gerente Executivo / CEO</p>
                  <p className="text-[10px] text-slate-400">OMBALA KISUL — LDA</p>
                </div>

              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* MÓDULO 6: CLIENTES, PROPOSTAS E CONTRATOS */}
          {/* ======================================================== */}
          {activeModule === 'contratos' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-brand-primary uppercase">Contrato Principal Ativo</span>
                    <h3 className="font-bold text-base text-slate-900">Prestação de Serviços de Saneamento Básico do Casco Urbano</h3>
                    <p className="text-slate-500">Cliente: Administração Municipal do Cuanhama • Prazo: 12 Meses</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Em Execução
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block">Valor Anual Proposto:</span>
                    <strong className="text-base text-slate-900">174.500.000 Kz</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block">Faturação Mensal (1/12):</span>
                    <strong className="text-base text-slate-900">14.541.667 Kz</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block">Equipa Dedicada:</span>
                    <strong className="text-base text-slate-900">33 Colaboradores</strong>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900">Obrigações Contratuais e Níveis de Serviço (SLA):</h4>
                  <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                    <li>Varredura das ruas principais, praças e mercados: Diária (06h00 – 12h00).</li>
                    <li>Limpeza de valas de drenagem e sarjetas: 2 vezes por semana com reforço nas chuvas.</li>
                    <li>Transporte de resíduos coberto com lona para a Lixeira Oficial Municipal de Cuanhama.</li>
                    <li>Submissão mensal de Relatório de Execução com evidências fotográficas e tonelagens.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* MÓDULO 7: MUNÍCIPES, QR CODE E SMS */}
          {/* ======================================================== */}
          {activeModule === 'municipes' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Fila de Triagem de Ocorrências dos Munícipes</h3>
                  <p className="text-slate-500">Reclamações recebidas via QR Code nos mercados e SMS direto</p>
                </div>
                <span className="bg-purple-100 text-purple-900 font-bold px-3 py-1 rounded-full">
                  {complaints.length} Ocorrências no Sistema
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {complaints.map((c) => (
                  <div key={c.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-brand-primary">{c.protocol}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 capitalize">
                          {c.source.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 mt-1">{c.bairro}</h4>
                      <p className="text-slate-500 text-[11px]">{c.address}</p>
                      <p className="text-slate-700 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        {c.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                      {c.status !== 'resolvida' && c.status !== 'validada_encerrada' ? (
                        <button
                          onClick={() => onUpdateComplaintStatus(c.id, 'resolvida', 'Equipa de Apoio Ondjiva')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px] transition-colors"
                        >
                          Concluir Resolução
                        </button>
                      ) : (
                        <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Resolvida
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* MÓDULO 8: FROTA, EQUIPAMENTOS, MATERIAIS E EPI */}
          {/* ======================================================== */}
          {activeModule === 'frota' && (
            <div className="space-y-4">
              
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs">
                <h3 className="font-bold text-slate-900 text-base">Parque de Viaturas e Ferramentas Operacionais</h3>
                <p className="text-slate-500">Alugueres, manutenção, stock de ferramentas e plano de mecanização futura</p>
              </div>

              {/* Vehicles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {vehicles.map((v) => (
                  <div key={v.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-900">{v.plate}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        v.status === 'em_rota' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {v.status.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900">{v.model}</h4>
                    <p className="text-slate-500">Motorista: {v.assignedDriver}</p>
                    <div className="pt-2 border-t border-slate-200 flex justify-between text-slate-600">
                      <span>Nível Depósito:</span>
                      <strong className="text-slate-900">{v.fuelLevelPercent}%</strong>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tools Inventory Table */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3 text-xs">
                <h4 className="font-bold text-slate-900 text-sm">Inventário do Kit Operacional OMBALA KISUL</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">Carros de Mão OK:</span>
                    <strong className="text-base text-slate-900">15 Unidades</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">Vassouras Industriais:</span>
                    <strong className="text-base text-slate-900">40 Unidades</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">Pás e Enxadas:</span>
                    <strong className="text-base text-slate-900">35 Unidades</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">Sacos de Lixo:</span>
                    <strong className="text-base text-slate-900">100 / Dia</strong>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* MÓDULO 9: RELATÓRIOS MENSAIS MUNICIPAIS */}
          {/* ======================================================== */}
          {activeModule === 'relatorios' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Relatório Mensal de Saneamento Urbano</h3>
                    <p className="text-slate-500">Dossier oficial com mapa de intervenção, fotografias antes/depois e métricas</p>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-brand-primary text-white font-bold rounded-lg flex items-center gap-2 hover:bg-brand-hover shadow"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimir / Exportar PDF</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 text-xs block">Volume Total Recolhido</span>
                    <strong className="text-2xl font-black text-slate-900">12,9 Toneladas</strong>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 text-xs block">Viagens à Lixeira Cuanhama</span>
                    <strong className="text-2xl font-black text-slate-900">6 Viagens</strong>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 text-xs block">Frentes de Trabalho</span>
                    <strong className="text-2xl font-black text-emerald-700">5 Zonas Concluídas</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* MÓDULO 11: PERMISSÕES E AUDITORIA */}
          {/* ======================================================== */}
          {activeModule === 'admin' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="font-bold text-slate-900 text-base">Matriz de Permissões e Acessos Google Workspace</h3>
                  <p className="text-slate-500">Validação de tokens no servidor restrita ao domínio empresarial <strong>ombalakisul.com</strong> (e alias <strong>ombalakisul.co.ao</strong>)</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <Key className="w-4 h-4 text-brand-primary" />
                    <span>Regra de Segurança de Autenticação</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    O domínio de email não concede privilégios automaticamente. Cada utilizador deve ter conta interna prévia no CRM associada ao identificador estável do Google e com permissões definidas por módulo + ação + âmbito.
                  </p>
                </div>

                {/* Audit Log Table */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900">Histórico de Auditoria do Sistema:</h4>
                  <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                    {auditLogs.map(log => (
                      <div key={log.id} className="p-3 bg-white flex items-center justify-between text-xs">
                        <div>
                          <strong className="text-slate-900">{log.action}: </strong>
                          <span className="text-slate-600">{log.target}</span>
                          <span className="text-slate-400 block text-[11px]">Utilizador: {log.user}</span>
                        </div>
                        <span className="font-mono text-slate-400 text-xs">{log.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};
