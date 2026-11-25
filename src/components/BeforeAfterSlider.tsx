'use client';

import React, { useState } from 'react';
import { ArrowLeftRight, CheckCircle2, MapPin, Calendar, Scale, Truck, UserCheck } from 'lucide-react';

interface CaseStudy {
  id: string;
  title: string;
  location: string;
  bairro: string;
  date: string;
  serviceType: string;
  beforeImg: string;
  afterImg: string;
  beforeDesc: string;
  afterDesc: string;
  tonnage: string;
  trips: number;
  supervisor: string;
  validator: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'case-1',
    title: 'Desassoreamento Crítico da Vala Principal',
    location: 'Vala Principal de Drenagem',
    bairro: 'Bairro Naipalala, Ondjiva',
    date: '24 de Novembro de 2026',
    serviceType: 'Limpeza de Valas e Sarjetas',
    beforeImg: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1000&q=80',
    afterImg: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80',
    beforeDesc: 'Obstrução severa com lamas espessas, resíduos plásticos e retenção de água da chuva que ameaçava inundações nas habitações vizinhas.',
    afterDesc: 'Remoção total de 4,5 toneladas de sedimentos, restabelecimento do fluxo hidráulico e aplicação de cal viva para higienização.',
    tonnage: '4,5 Toneladas (Medidas)',
    trips: 2,
    supervisor: 'Helmer Lisboa',
    validator: 'Edir Jorge Muluta Pacelli (CEO)'
  },
  {
    id: 'case-2',
    title: 'Varredura e Contentorização Intensiva',
    location: 'Perímetro Comercial do Mercado Alemanha',
    bairro: 'Mercado Central, Ondjiva',
    date: '25 de Novembro de 2026',
    serviceType: 'Varredura Urbana & Recolha',
    beforeImg: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1000&q=80',
    afterImg: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1000&q=80',
    beforeDesc: 'Dispersão de caixas de cartão, plásticos e resíduos orgânicos ao longo das bancadas e bermas de acesso pedonal.',
    afterDesc: 'Varredura manual por 8 operacionais com carros de mão OK, ensacamento imediato e transporte direto para a lixeira municipal.',
    tonnage: '6,4 Toneladas (Medidas na Báscula)',
    trips: 3,
    supervisor: 'Helmer Lisboa',
    validator: 'Gabinete Técnico Municipal'
  },
  {
    id: 'case-3',
    title: 'Poda Preventiva e Desobstrução de Passeios',
    location: 'Eixo Viário dos Castilhos',
    bairro: 'Bairro Castilhos, Ondjiva',
    date: '23 de Novembro de 2026',
    serviceType: 'Poda Técnica & Corte de Capim',
    beforeImg: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1000&q=80',
    afterImg: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80',
    beforeDesc: 'Ramos com risco de queda sobre cabos elétricos e passeios obstruídos por capim denso pós-primeiras chuvas.',
    afterDesc: 'Poda técnica com motosserra homologada, desbaste de copas, trituração de ramos e libertação completa do trânsito de peões.',
    tonnage: '2,0 Toneladas (Aproveitamento para Composto)',
    trips: 1,
    supervisor: 'Helmer Lisboa',
    validator: 'Edir Jorge Muluta Pacelli (CEO)'
  }
];

export const BeforeAfterSlider: React.FC = () => {
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0-100
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');
  const [isDragging, setIsDragging] = useState(false);

  const activeCase = CASE_STUDIES[activeCaseIndex];

  const handleSliderMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    handleSliderMove(e.touches[0].clientX, rect);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleSliderMove(e.clientX, rect);
  };

  return (
    <section id="antes-depois" className="py-20 bg-slate-100 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 border border-brand-200 rounded-full text-brand-primary text-xs font-bold uppercase tracking-wider mb-3">
            <CheckCircle2 className="w-4 h-4" />
            Evidências Verificadas em Campo
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Resultados Transparentes: Antes e Depois
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Cada ordem de serviço da OMBALA KISUL é documentada com fotografias georreferenciadas, registo de tonelagem e validação direta pelo supervisor e gerência executiva.
          </p>
        </div>

        {/* Case Study Switcher Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CASE_STUDIES.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveCaseIndex(idx);
                setSliderPosition(50);
              }}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 border ${
                activeCaseIndex === idx
                  ? 'bg-brand-primary text-white border-brand-primary shadow-md'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{item.bairro}</span>
            </button>
          ))}
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center justify-between mb-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">{activeCase.title}</span>
            <span className="text-slate-400">•</span>
            <span className="bg-slate-200 px-2 py-0.5 rounded text-[11px] font-medium text-slate-700">
              {activeCase.serviceType}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-300 shadow-sm">
            <button
              onClick={() => setViewMode('slider')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                viewMode === 'slider' ? 'bg-brand-primary text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Deslizador
            </button>
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                viewMode === 'side-by-side' ? 'bg-brand-primary text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Lado a Lado
            </button>
          </div>
        </div>

        {/* Image Display Container */}
        {viewMode === 'slider' ? (
          <div 
            className="relative w-full aspect-[16/9] md:aspect-[21/9] max-h-[550px] rounded-2xl overflow-hidden shadow-2xl border border-slate-300 select-none cursor-ew-resize bg-slate-900"
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
          >
            {/* Background Image: AFTER */}
            <img 
              src={activeCase.afterImg} 
              alt="Depois da intervenção" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-emerald-600/90 backdrop-blur text-white px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase shadow">
              DEPOIS (Validado)
            </div>

            {/* Foreground Image: BEFORE (clipped) */}
            <div 
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img 
                src={activeCase.beforeImg} 
                alt="Antes da intervenção" 
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: '100%', minWidth: '100%' }}
              />
              <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur text-white px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase shadow">
                ANTES (Ocorrência Inicial)
              </div>
            </div>

            {/* Draggable Divider Line */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-20 cursor-ew-resize"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-lg border-2 border-white">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
            </div>

            {/* Hint overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-3.5 py-1 rounded-full text-xs pointer-events-none">
              Arrasta para comparar o resultado da limpeza
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-300 aspect-[16/10]">
              <img src={activeCase.beforeImg} alt="Antes da intervenção" className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 bg-slate-900/90 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase">
                ANTES
              </div>
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white text-xs">
                {activeCase.beforeDesc}
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-300 aspect-[16/10]">
              <img src={activeCase.afterImg} alt="Depois da intervenção" className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 bg-emerald-600/90 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase">
                DEPOIS
              </div>
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white text-xs">
                {activeCase.afterDesc}
              </div>
            </div>
          </div>
        )}

        {/* Technical Data Card */}
        <div className="mt-6 bg-white rounded-xl p-5 border border-slate-200 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-50 text-brand-primary flex items-center justify-center flex-shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 font-medium">Resíduos Retirados</p>
              <p className="font-bold text-slate-900 text-sm">{activeCase.tonnage}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 font-medium">Viagens ao Aterro</p>
              <p className="font-bold text-slate-900 text-sm">{activeCase.trips} Cargas Completas</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 font-medium">Supervisão de Campo</p>
              <p className="font-bold text-slate-900 text-sm">{activeCase.supervisor}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 font-medium">Data & Validação</p>
              <p className="font-bold text-slate-900 text-sm">{activeCase.date}</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
