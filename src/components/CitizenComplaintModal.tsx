'use client';

import React, { useState } from 'react';
import { CitizenComplaint } from '@/data/mockData';
import { 
  X, QrCode, Smartphone, Send, CheckCircle2, Search, 
  MapPin, AlertCircle, Camera, Shield, Clock, ArrowRight 
} from 'lucide-react';

interface CitizenComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaints: CitizenComplaint[];
  onSubmitComplaint: (complaint: Omit<CitizenComplaint, 'id' | 'protocol' | 'createdAt' | 'status'>) => void;
}

export const CitizenComplaintModal: React.FC<CitizenComplaintModalProps> = ({
  isOpen,
  onClose,
  complaints,
  onSubmitComplaint
}) => {
  const [activeTab, setActiveTab] = useState<'nova' | 'consultar' | 'sms'>('nova');
  const [bairro, setBairro] = useState('Bairro Naipalala');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState<CitizenComplaint['category']>('acumulacao_lixo');
  const [description, setDescription] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [submittedProtocol, setSubmittedProtocol] = useState<string | null>(null);

  // Search protocol state
  const [searchProtocolInput, setSearchProtocolInput] = useState('');
  const [searchedResult, setSearchedResult] = useState<CitizenComplaint | null>(null);
  const [searchError, setSearchError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !address) return;

    onSubmitComplaint({
      source: 'portal',
      bairro,
      address,
      category,
      description,
      citizenName: citizenName || 'Munícipe Anónimo',
      citizenPhone: citizenPhone || undefined,
      priority: 'alta',
      photoUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80'
    });

    // Generate random protocol for feedback
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newProt = `OK-CND-2026-${randomNum}`;
    setSubmittedProtocol(newProt);
  };

  const handleSearchProtocol = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSearch = searchProtocolInput.trim().toUpperCase();
    const found = complaints.find(c => c.protocol.toUpperCase() === cleanSearch);
    if (found) {
      setSearchedResult(found);
      setSearchError(false);
    } else {
      setSearchedResult(null);
      setSearchError(true);
    }
  };

  const getStatusBadge = (status: CitizenComplaint['status']) => {
    switch (status) {
      case 'recebida': return { text: 'Recebida no Sistema', bg: 'bg-slate-100 text-slate-800 border-slate-300' };
      case 'em_triagem': return { text: 'Em Triagem Operacional', bg: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'atribuida': return { text: 'Equipa de Campo Atribuída', bg: 'bg-purple-100 text-purple-800 border-purple-300' };
      case 'em_resolucao': return { text: 'Limpeza em Andamento', bg: 'bg-blue-100 text-blue-800 border-blue-300' };
      case 'resolvida': return { text: 'Resolvida / Limpeza Efetuada', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'validada_encerrada': return { text: 'Validada e Arquivada', bg: 'bg-emerald-200 text-emerald-900 border-emerald-400' };
      default: return { text: status, bg: 'bg-slate-100 text-slate-800 border-slate-300' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="p-5 bg-brand-primary text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Portal do Munícipe de Ondjiva</h3>
              <p className="text-xs text-brand-100">Comunicação e Rastreamento de Ocorrências Urbanas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
          <button
            onClick={() => { setActiveTab('nova'); setSubmittedProtocol(null); }}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'nova' ? 'border-brand-primary text-brand-primary bg-white' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Comunicar Ocorrência</span>
          </button>
          <button
            onClick={() => setActiveTab('consultar')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'consultar' ? 'border-brand-primary text-brand-primary bg-white' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Consultar Protocolo</span>
          </button>
          <button
            onClick={() => setActiveTab('sms')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'sms' ? 'border-brand-primary text-brand-primary bg-white' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>QR Code & SMS</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          
          {/* TAB 1: NOVA OCORRÊNCIA */}
          {activeTab === 'nova' && (
            submittedProtocol ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">Ocorrência Registada com Sucesso!</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  A sua comunicação foi encaminhada para a equipa de triagem da OMBALA KISUL em Ondjiva.
                </p>
                <div className="bg-slate-100 p-4 rounded-xl max-w-sm mx-auto border border-slate-300">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold">
                    O Seu Número de Protocolo Oficial
                  </span>
                  <span className="font-mono text-xl font-extrabold text-brand-primary tracking-wider">
                    {submittedProtocol}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Guarda este código para acompanhar o estado da limpeza sem divulgar dados pessoais.
                </p>
                <button
                  onClick={() => {
                    setSubmittedProtocol(null);
                    setAddress('');
                    setDescription('');
                  }}
                  className="px-5 py-2 text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
                >
                  Registar Nova Ocorrência
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Bairro em Ondjiva *</label>
                    <select
                      value={bairro}
                      onChange={(e) => setBairro(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    >
                      <option value="Bairro Naipalala">Bairro Naipalala</option>
                      <option value="Bairro Castilhos">Bairro Castilhos</option>
                      <option value="Bairro Kafitu">Bairro Kafitu</option>
                      <option value="Bairro Bangula">Bairro Bangula</option>
                      <option value="Centro Urbano / Praça da Paz">Centro Urbano / Praça da Paz</option>
                      <option value="Mercado Central (Alemanha)">Mercado Central (Alemanha)</option>
                      <option value="Mercado Oshatotwa">Mercado Oshatotwa</option>
                      <option value="Outro Bairro de Cuanhama">Outro Bairro de Cuanhama</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tipo de Ocorrência *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as CitizenComplaint['category'])}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    >
                      <option value="acumulacao_lixo">Acúmulo de Lixo / Entulho na Rua</option>
                      <option value="vala_obstruida">Vala de Drenagem ou Sarjeta Entupida</option>
                      <option value="lama_inundacao">Lama / Inundação pós-chuva</option>
                      <option value="ramos_arvore">Queda de Ramos de Árvore / Capim Alto</option>
                      <option value="contentor_cheio">Contentor Cheio a Transbordar</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Rua / Ponto de Referência *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Próximo à Escola Primária n.º 14, Rua Principal"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Descrição do Problema *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Descreve detalhadamente o volume de resíduos, água estagnada ou se há impedimento do trânsito..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">O Seu Nome (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Pode deixar em branco para anonimato"
                      value={citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Contacto Telefónico (Opcional)</label>
                    <input
                      type="tel"
                      placeholder="Ex: 923 000 000 (para receber SMS)"
                      value={citizenPhone}
                      onChange={(e) => setCitizenPhone(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-slate-600">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-slate-500" />
                    <span>Fotografia do Local anexada automaticamente para georreferenciação.</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Evidência GPS ativa
                  </span>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-bold text-white bg-brand-primary hover:bg-brand-hover rounded-lg shadow-md transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar Ocorrência</span>
                  </button>
                </div>
              </form>
            )
          )}

          {/* TAB 2: CONSULTAR PROTOCOLO */}
          {activeTab === 'consultar' && (
            <div className="space-y-5 text-xs">
              <form onSubmit={handleSearchProtocol} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Digita o número do protocolo (Ex: OK-CND-2026-0841)"
                  value={searchProtocolInput}
                  onChange={(e) => setSearchProtocolInput(e.target.value)}
                  className="flex-1 p-2.5 border border-slate-300 rounded-lg text-slate-900 font-mono uppercase focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-hover transition-colors flex items-center gap-1.5"
                >
                  <Search className="w-4 h-4" />
                  <span>Consultar</span>
                </button>
              </form>

              {searchError && (
                <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Nenhuma ocorrência encontrada com este número de protocolo. Verifica se digitaste corretamente.</span>
                </div>
              )}

              {searchedResult && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <span className="font-mono text-sm font-extrabold text-brand-primary block">
                        {searchedResult.protocol}
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        Registada em: {searchedResult.createdAt}
                      </span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(searchedResult.status).bg}`}>
                      {getStatusBadge(searchedResult.status).text}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block">Bairro:</span>
                      <strong className="text-slate-900">{searchedResult.bairro}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Endereço:</span>
                      <strong className="text-slate-900">{searchedResult.address}</strong>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-1">Descrição:</span>
                    <p className="text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                      {searchedResult.description}
                    </p>
                  </div>

                  {searchedResult.assignedTeam && (
                    <div className="text-[11px] text-purple-900 bg-purple-50 p-2.5 rounded-lg border border-purple-200">
                      <strong>Equipa Responsável:</strong> {searchedResult.assignedTeam}
                    </div>
                  )}

                  {searchedResult.resolvedAt && (
                    <div className="text-[11px] text-emerald-900 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Trabalho concluído em <strong>{searchedResult.resolvedAt}</strong> com validação do supervisor.</span>
                    </div>
                  )}

                  <div className="pt-2 text-[10px] text-slate-400 flex items-center gap-1.5 border-t border-slate-200">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Os dados pessoais do munícipe são salvaguardados em conformidade com as regras de privacidade.</span>
                  </div>
                </div>
              )}

              {/* Sample protocols hint */}
              {!searchedResult && (
                <div className="p-3 bg-blue-50 text-blue-900 rounded-lg border border-blue-200 text-[11px]">
                  <strong>Protocolos de Exemplo para Teste Rápido:</strong>
                  <div className="flex flex-wrap gap-2 mt-1.5 font-mono">
                    {complaints.map(c => (
                      <button
                        key={c.protocol}
                        type="button"
                        onClick={() => {
                          setSearchProtocolInput(c.protocol);
                          setSearchedResult(c);
                          setSearchError(false);
                        }}
                        className="bg-white px-2 py-0.5 rounded border border-blue-300 hover:bg-blue-100 text-blue-800"
                      >
                        {c.protocol}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: QR CODE & SMS */}
          {activeTab === 'sms' && (
            <div className="space-y-5 text-xs">
              {/* Photo Showcase of Real Field Mockups */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 flex flex-col">
                  <div className="aspect-[4/3] relative overflow-hidden bg-slate-900">
                    <img 
                      src="/qr-mockup-contentor.jpg" 
                      alt="Demonstração do QR Code nos contentores de Ondjiva" 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      Contentores Urbanos • Ondjiva
                    </span>
                  </div>
                  <div className="p-3 bg-white space-y-1">
                    <h5 className="font-bold text-slate-900 text-xs">Placas Aparafusadas nos Contentores</h5>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Placas de alta durabilidade com o símbolo ÔK e QR Code direto para reporte de contentor cheio ou entulho.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 flex flex-col">
                  <div className="aspect-[4/3] relative overflow-hidden bg-slate-900">
                    <img 
                      src="/qr-mockup-municipe.jpg" 
                      alt="Munícipe a usar o QR Code num mercado de Ondjiva" 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 bg-brand-primary text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      Mercados e Praças • Cuanhama
                    </span>
                  </div>
                  <div className="p-3 bg-white space-y-1">
                    <h5 className="font-bold text-slate-900 text-xs">Leitura Instantânea por Smartphone</h5>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      O munícipe aponta a câmara no Mercado da Alemanha ou Praça da Paz e abre o formulário sem instalar nenhuma app.
                    </p>
                  </div>
                </div>
              </div>

              {/* Official Signboard Download / Vector Preview */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-24 h-24 bg-white p-1.5 rounded-xl border border-slate-300 shadow-sm flex-shrink-0 flex items-center justify-center">
                  <img src="/placa-qr-oficial.svg" alt="Placa Oficial OMBALA KISUL" className="w-full h-full object-contain" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-xs">
                      Placa Sinalética Oficial Homologada (A4 / Vinil Resistente)
                    </h4>
                    <a
                      href="/placa-qr-oficial.svg"
                      target="_blank"
                      download="Placa-QR-Ombala-Kisul.svg"
                      className="text-[11px] font-bold text-brand-primary hover:underline bg-white px-2.5 py-1 rounded border border-slate-300 shadow-sm"
                    >
                      Descarregar Placa (SVG)
                    </a>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Norma técnica para impressão em vinil laminado anti-UV e anti-lama, preparada para afixação em postes de mercados, contentores metálicos e paragens de táxi de Ondjiva.
                  </p>
                </div>
              </div>

              {/* Alternative SMS Info */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Smartphone className="w-4 h-4 text-brand-primary" />
                  <h4>Canal SMS para Telemóveis Simples (Sem Internet)</h4>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-300 font-mono text-xs text-slate-800">
                  <span className="text-slate-400 block text-[10px]">Formato do SMS:</span>
                  <strong>ONDJIVA [Bairro] [Descrição do Problema]</strong>
                  <span className="text-emerald-700 block text-[10px] mt-1">Exemplo: ONDJIVA NAIPALALA Vala de agua entupida na rua 4</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Destinatário: <strong>+244 927 855 626</strong> (Terminal de Atendimento da Ombala Kisul). O munícipe recebe de volta o número de protocolo por SMS automático.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
