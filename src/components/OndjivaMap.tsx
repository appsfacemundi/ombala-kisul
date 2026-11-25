'use client';

import React, { useState } from 'react';
import { ZoneOperation } from '@/data/mockData';
import { 
  Search, Filter, MapPin, CheckCircle2, Clock, AlertTriangle, 
  Layers, Eye, UserCheck, Scale, Truck, X, ArrowRight, List, Map as MapIcon, Image as ImageIcon
} from 'lucide-react';

interface OndjivaMapProps {
  operations: ZoneOperation[];
  onValidateOperation?: (opId: string) => void;
  isSupervisorOrAdmin?: boolean;
}

export const OndjivaMap: React.FC<OndjivaMapProps> = ({
  operations,
  onValidateOperation,
  isSupervisorOrAdmin = true
}) => {
  const [selectedOperation, setSelectedOperation] = useState<ZoneOperation | null>(operations[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [serviceFilter, setServiceFilter] = useState<string>('todos');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  // Filter operations based on search and dropdowns
  const filteredOperations = operations.filter(op => {
    const matchesSearch = 
      op.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.bairro.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || op.status === statusFilter;
    const matchesService = serviceFilter === 'todos' || op.serviceType === serviceFilter;
    return matchesSearch && matchesStatus && matchesService;
  });

  const getStatusColor = (status: ZoneOperation['status']) => {
    switch (status) {
      case 'concluido': return { fill: '#10B981', stroke: '#059669', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300', text: 'Concluído' };
      case 'em_execucao': return { fill: '#3B82F6', stroke: '#1D4ED8', badge: 'bg-blue-100 text-blue-800 border-blue-300', text: 'Em Execução' };
      case 'aguardar_validacao': return { fill: '#F59E0B', stroke: '#D97706', badge: 'bg-amber-100 text-amber-800 border-amber-300', text: 'Aguardar Validação' };
      case 'atribuido': return { fill: '#8B5CF6', stroke: '#6D28D9', badge: 'bg-purple-100 text-purple-800 border-purple-300', text: 'Atribuído' };
      case 'planeado': return { fill: '#64748B', stroke: '#475569', badge: 'bg-slate-100 text-slate-800 border-slate-300', text: 'Planeado' };
      case 'suspenso': return { fill: '#EF4444', stroke: '#B91C1C', badge: 'bg-red-100 text-red-800 border-red-300', text: 'Suspenso' };
      default: return { fill: '#64748B', stroke: '#334155', badge: 'bg-slate-100 text-slate-700 border-slate-300', text: status };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Map Control Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-lg">
              Mapa Operacional de Ondjiva
            </h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 bg-brand-50 text-brand-primary border border-brand-200 rounded-full">
              Sede do Município de Cuanhama
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Zonas de varredura, desassoreamento de valas, recolha e rota para a Lixeira Oficial
          </p>
        </div>

        {/* View Switcher: Map vs Accessible List */}
        <div className="flex items-center gap-2">
          <div className="flex bg-white rounded-lg border border-slate-300 p-1 shadow-sm">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                viewMode === 'map' ? 'bg-brand-primary text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Mapa Vetorial</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                viewMode === 'list' ? 'bg-brand-primary text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Tabela Acessível</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 border-b border-slate-200 bg-white grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar bairro, rua ou código..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-slate-800"
          />
        </div>

        {/* Filter by Status */}
        <div className="flex items-center gap-2">
          <label className="text-slate-500 font-medium whitespace-nowrap">Estado:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2 px-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-slate-800"
          >
            <option value="todos">Todos os Estados</option>
            <option value="em_execucao">Em Execução</option>
            <option value="aguardar_validacao">Aguardar Validação</option>
            <option value="concluido">Concluído</option>
            <option value="planeado">Planeado</option>
            <option value="suspenso">Suspenso</option>
          </select>
        </div>

        {/* Filter by Service */}
        <div className="flex items-center gap-2">
          <label className="text-slate-500 font-medium whitespace-nowrap">Serviço:</label>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="w-full py-2 px-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-slate-800"
          >
            <option value="todos">Todos os Serviços</option>
            <option value="varredura">Varredura de Ruas</option>
            <option value="recolha">Recolha e Transporte</option>
            <option value="valas">Limpeza de Valas</option>
            <option value="poda">Poda de Árvores</option>
            <option value="lama">Remoção de Lamas</option>
          </select>
        </div>
      </div>

      {/* Main Content Area: Map View or List View */}
      {viewMode === 'map' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[520px]">
          
          {/* Interactive SVG Map of Ondjiva */}
          <div className="lg:col-span-8 p-4 sm:p-6 bg-slate-900 relative overflow-hidden flex flex-col justify-between select-none">
            
            {/* Compass and Coordinates Watermark */}
            <div className="absolute top-4 left-4 z-10 bg-slate-800/80 backdrop-blur text-slate-300 text-[11px] p-2 rounded-lg border border-slate-700 space-y-1">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                Casco Urbano de Ondjiva (17°04′S 15°44′E)
              </p>
              <p className="text-slate-400">Escala: Casco Urbano • 6 Frentes de Trabalho Ativas</p>
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 z-10 bg-slate-800/90 backdrop-blur text-slate-300 text-[10px] p-2.5 rounded-lg border border-slate-700 flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Concluído</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>Em Execução</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>Aguardar Validação</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                <span>Atribuído</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                <span>Planeado</span>
              </div>
            </div>

            {/* SVG Visual Map Engine */}
            <div className="w-full h-[440px] flex items-center justify-center">
              <svg 
                viewBox="0 0 600 420" 
                className="w-full h-full max-h-[420px] drop-shadow-lg"
              >
                {/* Background Grid & Streets Network */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                  </pattern>
                </defs>
                <rect width="600" height="420" fill="url(#grid)" />

                {/* Major Arterial Roads of Ondjiva */}
                {/* Estrada Circular / Eixo Namacunde */}
                <path d="M 50 200 Q 250 80 550 180" fill="none" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
                <path d="M 50 200 Q 250 80 550 180" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="6 6" />
                <text x="70" y="170" fill="#64748b" fontSize="9" fontWeight="bold">Estrada para Namacunde / Fronteira de Santa Clara</text>

                {/* Avenida 11 de Novembro */}
                <path d="M 300 50 L 300 380" fill="none" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
                <text x="310" y="70" fill="#64748b" fontSize="8">Av. 11 de Novembro</text>

                {/* Vala Principal de Drenagem Hidráulica (Linha Azul) */}
                <path d="M 120 100 Q 220 180 280 250 T 400 370" fill="none" stroke="#0284c7" strokeWidth="3.5" strokeDasharray="8 4" opacity="0.8" />
                <text x="130" y="115" fill="#38bdf8" fontSize="8" fontWeight="bold">Vala Principal de Drenagem (Naipalala)</text>

                {/* Destination: Lixeira Oficial Municipal de Cuanhama */}
                <g transform="translate(510, 330)">
                  <circle r="16" fill="#78350f" stroke="#b45309" strokeWidth="2" />
                  <path d="M -6 -4 L 6 -4 L 4 8 L -4 8 Z" fill="#fde68a" />
                  <text x="0" y="26" fill="#fde68a" fontSize="8" fontWeight="bold" textAnchor="middle">Lixeira Oficial Cuanhama</text>
                  <text x="0" y="36" fill="#94a3b8" fontSize="7" textAnchor="middle">(Destino Final Autorizado)</text>
                </g>

                {/* Operation Polygons and Markers */}
                {filteredOperations.map((op) => {
                  const style = getStatusColor(op.status);
                  const isSelected = selectedOperation?.id === op.id;
                  const polyPoints = op.areaCoordinates.map(p => `${p.x},${p.y}`).join(' ');

                  // Center point for marker
                  const centerX = op.areaCoordinates.reduce((acc, p) => acc + p.x, 0) / op.areaCoordinates.length;
                  const centerY = op.areaCoordinates.reduce((acc, p) => acc + p.y, 0) / op.areaCoordinates.length;

                  return (
                    <g 
                      key={op.id} 
                      className="cursor-pointer transition-all duration-200"
                      onClick={() => setSelectedOperation(op)}
                    >
                      {/* Operational Zone Polygon */}
                      <polygon
                        points={polyPoints}
                        fill={style.fill}
                        fillOpacity={isSelected ? 0.45 : 0.25}
                        stroke={isSelected ? '#ffffff' : style.stroke}
                        strokeWidth={isSelected ? 3 : 1.8}
                        strokeDasharray={op.status === 'em_execucao' ? '4 2' : 'none'}
                        className="transition-all hover:fill-opacity-50"
                      />

                      {/* Center Marker with Ping if in progress */}
                      {op.status === 'em_execucao' && (
                        <circle cx={centerX} cy={centerY} r="14" fill="#3b82f6" opacity="0.3" className="animate-ping" />
                      )}
                      <circle
                        cx={centerX}
                        cy={centerY}
                        r={isSelected ? 9 : 7}
                        fill={isSelected ? '#ffffff' : style.fill}
                        stroke={isSelected ? style.fill : '#ffffff'}
                        strokeWidth="2"
                        className="transition-all"
                      />

                      {/* Zone Label */}
                      <text
                        x={centerX}
                        y={centerY - 12}
                        fill="#f8fafc"
                        fontSize={isSelected ? '10' : '9'}
                        fontWeight={isSelected ? 'bold' : 'normal'}
                        textAnchor="middle"
                        filter="drop-shadow(0px 1px 2px rgba(0,0,0,0.8))"
                      >
                        {op.bairro}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Operation Inspector Drawer (Right Column) */}
          <div className="lg:col-span-4 p-5 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between">
            {selectedOperation ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-slate-500">
                      {selectedOperation.code}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-base leading-snug">
                      {selectedOperation.title}
                    </h4>
                    <p className="text-xs text-brand-primary font-semibold flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {selectedOperation.bairro}
                    </p>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getStatusColor(selectedOperation.status).badge}`}>
                    {getStatusColor(selectedOperation.status).text}
                  </span>
                </div>

                {/* Evidence Photos (Before & After) */}
                <div>
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                    <ImageIcon className="w-4 h-4 text-slate-500" />
                    Fotografias de Campo (Antes & Depois)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative rounded-lg overflow-hidden border border-slate-200 aspect-[4/3] bg-slate-100">
                      <img 
                        src={selectedOperation.beforePhoto} 
                        alt="Antes da intervenção" 
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1.5 left-1.5 bg-slate-900/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        ANTES
                      </span>
                    </div>

                    <div className="relative rounded-lg overflow-hidden border border-slate-200 aspect-[4/3] bg-slate-100 flex items-center justify-center">
                      {selectedOperation.afterPhoto ? (
                        <>
                          <img 
                            src={selectedOperation.afterPhoto} 
                            alt="Depois da intervenção" 
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1.5 right-1.5 bg-emerald-600/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                            DEPOIS
                          </span>
                        </>
                      ) : (
                        <div className="text-center p-2 text-slate-400">
                          <Clock className="w-6 h-6 mx-auto mb-1 opacity-50" />
                          <span className="text-[10px] font-medium leading-tight block">
                            Aguardando conclusão para envio do DEPOIS
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantitative Data */}
                <div className="grid grid-cols-2 gap-2.5 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-500 text-[11px] block">Tonelagem Estimada:</span>
                    <strong className="text-slate-900 font-bold">{selectedOperation.tonnageEstimated} Toneladas</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Tonelagem Báscula:</span>
                    <strong className="text-emerald-700 font-bold">
                      {selectedOperation.tonnageMeasured ? `${selectedOperation.tonnageMeasured} Toneladas` : 'Em medição'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Equipa em Campo:</span>
                    <strong className="text-slate-900 font-bold">{selectedOperation.assignedWorkersCount} Trabalhadores</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Viagens Feitas:</span>
                    <strong className="text-slate-900 font-bold">{selectedOperation.tripsCount} Descargas</strong>
                  </div>
                </div>

                {/* Supervisor Notes & Destination */}
                <div className="text-xs space-y-1.5">
                  <p className="text-slate-600">
                    <strong className="text-slate-900">Destino de Deposição:</strong> {selectedOperation.dumpDestination}
                  </p>
                  <p className="text-slate-600">
                    <strong className="text-slate-900">Supervisão:</strong> {selectedOperation.supervisor}
                  </p>
                  {selectedOperation.supervisorNotes && (
                    <div className="bg-amber-50 text-amber-900 p-2.5 rounded-lg border border-amber-200 text-[11px] italic">
                      &quot;{selectedOperation.supervisorNotes}&quot;
                    </div>
                  )}
                </div>

                {/* Supervisor Validation Action */}
                {isSupervisorOrAdmin && selectedOperation.status === 'aguardar_validacao' && (
                  <div className="pt-2">
                    <button
                      onClick={() => onValidateOperation && onValidateOperation(selectedOperation.id)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-md transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Validar e Aprovar Conclusão da Limpeza</span>
                    </button>
                    <p className="text-[10px] text-slate-500 text-center mt-1">
                      Exige verificação das fotos de antes/depois e pesagem de descarga.
                    </p>
                  </div>
                )}

                {selectedOperation.status === 'concluido' && (
                  <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-lg border border-emerald-200 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Trabalho validado por: <strong>{selectedOperation.validatedBy || 'Edir Jorge Muluta Pacelli'}</strong></span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">Clica num polígono ou ponto do mapa para inspecionar os detalhes da operação.</p>
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Accessible List View */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200 uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Bairro / Local</th>
                <th className="py-3 px-4">Serviço</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Equipa</th>
                <th className="py-3 px-4">Toneladas</th>
                <th className="py-3 px-4">Supervisor</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredOperations.map((op) => {
                const style = getStatusColor(op.status);
                return (
                  <tr key={op.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{op.code}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{op.bairro}</td>
                    <td className="py-3 px-4 capitalize">{op.serviceType}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${style.badge}`}>
                        {style.text}
                      </span>
                    </td>
                    <td className="py-3 px-4">{op.assignedWorkersCount} trabalhadores</td>
                    <td className="py-3 px-4 font-medium">
                      {op.tonnageMeasured ? `${op.tonnageMeasured} t (real)` : `${op.tonnageEstimated} t (est.)`}
                    </td>
                    <td className="py-3 px-4">{op.supervisor}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedOperation(op);
                          setViewMode('map');
                        }}
                        className="text-brand-primary font-bold hover:underline"
                      >
                        Ver no Mapa
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
