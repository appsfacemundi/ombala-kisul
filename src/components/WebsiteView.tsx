'use client';

import React, { useState } from 'react';
import { 
  Shield, CheckCircle2, MapPin, Phone, Mail, Award, ArrowRight, 
  Sparkles, Users, Truck, Shovel, Trees, Droplets, Calendar, FileText, Send 
} from 'lucide-react';
import { BeforeAfterSlider } from './BeforeAfterSlider';

interface WebsiteViewProps {
  onGoToPlatform: () => void;
  onOpenCitizenModal: () => void;
}

export const WebsiteView: React.FC<WebsiteViewProps> = ({
  onGoToPlatform,
  onOpenCitizenModal
}) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    entidade: '',
    telefone: '',
    email: '',
    mensagem: '',
    honeypot: '' // Anti-spam hidden field
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) return; // Spam detected
    setFormSubmitted(true);
  };

  return (
    <div className="flex-1">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-20 pb-28 overflow-hidden">
        {/* Subtle background red accent glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-primary/20 blur-[140px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading and CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur border border-white/20 rounded-full text-xs font-semibold tracking-wide text-brand-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Ondjiva • Município de Cuanhama, Província do Cunene</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                Saneamento Básico, Limpeza Urbana e <span className="text-brand-400">Gestão de Resíduos</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                A <strong>OMBALA KISUL — LDA</strong> assegura a varredura contínua, recolha e desassoreamento de valas no casco urbano de Ondjiva, combinando equipa local dedicada, equipamento de proteção integral e rigor ambiental.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3">
                <button
                  onClick={onGoToPlatform}
                  className="px-6 py-3.5 bg-brand-primary hover:bg-brand-hover text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-brand-primary/30 transition-all flex items-center gap-2"
                >
                  <span>Entrar na Plataforma de Gestão</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onOpenCitizenModal}
                  className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/25 backdrop-blur transition-all flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>Comunicar Ocorrência em Ondjiva</span>
                </button>
              </div>

              {/* Credential highlights */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800 text-left">
                <div>
                  <p className="text-2xl font-black text-white">NIF 5000597244</p>
                  <p className="text-xs text-slate-400">Sociedade Comercial Legalizada</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-brand-400">33 Postos</p>
                  <p className="text-xs text-slate-400">Equipa e Operação Local</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-emerald-400">Ondjiva</p>
                  <p className="text-xs text-slate-400">Expansão: Ombadja e Namacunde</p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual with Real Kit Render */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-gradient-to-tr from-brand-primary/40 to-slate-800 p-3 rounded-3xl border border-white/20 shadow-2xl">
                <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[4/5] flex items-center justify-center">
                  <img
                    src="/uniform-polo.png"
                    alt="Uniforme Oficial OMBALA KISUL Polo e Calça Vermelha"
                    className="w-full h-full object-contain p-2"
                  />
                  <div className="absolute bottom-3 inset-x-3 bg-slate-900/90 backdrop-blur p-3 rounded-xl border border-slate-700 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand-primary"></span>
                        Identidade Vermelho & Branco
                      </span>
                      <span className="text-[10px] bg-brand-primary/30 text-brand-300 font-bold px-2 py-0.5 rounded">
                        Símbolo OK Oficial
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Fato-macaco vermelho e colete refletor com tecido resistente ao clima do Cunene.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CEO PRESENTATION SECTION */}
      <section id="empresa" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* CEO Portrait */}
              <div className="lg:col-span-4 flex justify-center">
                <div className="relative w-64 sm:w-72 aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-slate-900">
                  <img
                    src="/ceo.jpg"
                    alt="Edir Jorge Muluta Pacelli - Gerente Executivo e CEO"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 block">
                      Liderança Executiva
                    </span>
                    <strong className="text-sm font-bold block">Edir Jorge Muluta Pacelli</strong>
                    <span className="text-xs text-slate-300">Gerente / CEO</span>
                  </div>
                </div>
              </div>

              {/* CEO Message & Governance */}
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 border border-brand-200 rounded-full text-brand-primary text-xs font-bold uppercase tracking-wider">
                  <Shield className="w-4 h-4" />
                  Mensagem da Gerência Executiva
                </div>

                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
                  &quot;O nosso compromisso é com a dignidade e a saúde pública do Cuanhama.&quot;
                </h2>

                <div className="text-sm text-slate-600 space-y-3 leading-relaxed">
                  <p>
                    A <strong>OMBALA KISUL — LDA</strong> nasceu em Ondjiva com um propósito claro: garantir que cada rua, cada praça, cada mercado e cada vala de escoamento receba a manutenção diária rigorosa que as famílias do Cunene merecem.
                  </p>
                  <p>
                    Não atuamos à distância. Acompanhamos pessoalmente a saída das equipas às 06h00 da manhã, a pesagem das cargas de resíduos encaminhadas para a lixeira oficial municipal e a fiscalização dos equipamentos de proteção individual dos nossos 33 trabalhadores.
                  </p>
                  <p className="font-medium text-slate-800">
                    O saneamento não é apenas recolher lixo — é prevenir inundações nas épocas de chuva através da limpeza preventiva de valas, erradicar focos de transmissão de malária e devolver o orgulho aos munícipes de Ondjiva.
                  </p>
                </div>

                <div className="pt-3 flex flex-wrap items-center gap-6 text-xs text-slate-500 border-t border-slate-200">
                  <div>
                    <span className="text-slate-400 block">Registo Comercial & NIF:</span>
                    <strong className="text-slate-800 font-mono">5000597244</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Sede da Empresa:</span>
                    <strong className="text-slate-800">Ondjiva, Bairro Cunhama, Cunene</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Licenciamento Operacional:</span>
                    <strong className="text-amber-700">Pedido Formal Submetido à ANR</strong>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 3. OPERATIONAL SERVICES */}
      <section id="servicos" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-brand-primary uppercase tracking-wider bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
              Capacidade Operacional Comprovada
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Serviços Integrados de Saneamento Urbano
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Metodologia de trabalho descrita no Plano de Gestão de Resíduos e na Proposta Técnica de Cuanhama.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Service 1 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
              <div className="w-12 h-12 bg-red-50 text-brand-primary rounded-xl flex items-center justify-center">
                <Shovel className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Varredura Diária de Ruas e Mercados</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Varredura intensiva das 06h00 às 12h00 nas vias asfaltadas, passeios, praças públicas, Mercado da Alemanha e Mercado Oshatotwa com vassouras industriais e pás.
              </p>
              <span className="inline-block text-[11px] font-semibold text-brand-dark bg-brand-50 px-2 py-0.5 rounded">
                18 Varredores Dedicados
              </span>
            </div>

            {/* Service 2 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
              <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Recolha e Transporte de Resíduos</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Recolha porta-a-porta e remoção de montes organizados com camião basculante fechado/coberto com lona, evitando dispersão nas estradas até à lixeira oficial.
              </p>
              <span className="inline-block text-[11px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                6 Dias por Semana
              </span>
            </div>

            {/* Service 3 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Valas de Drenagem e Sarjetas</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Desobstrução e desassoreamento de valas mestras (Naipalala) e sumidouros duas vezes por semana, com reforço de emergência durante a estação das chuvas.
              </p>
              <span className="inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                Prevenção de Inundações
              </span>
            </div>

            {/* Service 4 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
              <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Remoção de Lamas e Entulhos</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Raspagem de bermas e eixos viários após enxurradas, impedindo a formação de lodaçais e garantindo a circulação segura de veículos ligeiros e peões.
              </p>
              <span className="inline-block text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                Intervenção Rápida Pós-Chuva
              </span>
            </div>

            {/* Service 5 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
              <div className="w-12 h-12 bg-purple-50 text-purple-700 rounded-xl flex items-center justify-center">
                <Trees className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Poda Técnica de Árvores e Capim</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Corte de capim alto em bermas e poda com motosserras homologadas para desobstrução de cabos de iluminação pública e sinalização rodoviária.
              </p>
              <span className="inline-block text-[11px] font-semibold text-purple-800 bg-purple-50 px-2 py-0.5 rounded">
                Aproveitamento para Composto
              </span>
            </div>

            {/* Service 6 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
              <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Sensibilização e Atendimento Comunitário</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Campanhas mensais de conscientização ambiental com as comissões de moradores e canal direto de atendimento por QR Code e SMS para todos os munícipes.
              </p>
              <span className="inline-block text-[11px] font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                Munícipe Participativo
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* 4. INTERACTIVE BEFORE & AFTER SLIDER COMPONENT */}
      <BeforeAfterSlider />

      {/* 4.1 DEMONSTRAÇÃO PRÁTICA: QR CODE NOS CONTENTORES E MERCADOS */}
      <section className="py-20 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider bg-brand-primary/20 border border-brand-primary/40 px-3 py-1 rounded-full">
              Inovação Urbana em Ondjiva
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Sinalética Inteligente nos Contentores e Praças Públicas
            </h2>
            <p className="mt-3 text-sm text-slate-300">
              A OMBALA KISUL instala placas em vinil reforçado e alumínio nos contentores de lixo, paragens e mercados municipais do Cunene, permitindo a qualquer munícipe alertar sobre contentores cheios ou lamas em segundos.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Foto 1: Contentor em Ondjiva */}
            <div className="lg:col-span-6 space-y-3">
              <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl aspect-[16/11] bg-slate-950 group">
                <img 
                  src="/qr-mockup-contentor.jpg" 
                  alt="Contentor Urbano da OMBALA KISUL com Placa de QR Code em Ondjiva" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5">
                  <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Contentores Urbanos Padronizados</span>
                  <h4 className="text-lg font-bold text-white">Placa ÔK de Alta Visibilidade</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Fixação com parafusos anti-furto em contentores metálicos ao longo do casco urbano de Ondjiva e Cuanhama.
                  </p>
                </div>
              </div>
            </div>

            {/* Foto 2: Munícipe no Mercado */}
            <div className="lg:col-span-6 space-y-3">
              <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl aspect-[16/11] bg-slate-950 group">
                <img 
                  src="/qr-mockup-municipe.jpg" 
                  alt="Munícipe no Mercado da Alemanha a ler o QR Code da OMBALA KISUL" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Mercado Central & Alemanha</span>
                  <h4 className="text-lg font-bold text-white">Participação Cidadã em Tempo Real</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Sem necessidade de instalar aplicações: basta apontar a câmara do telemóvel para registar a ocorrência e obter protocolo.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Action Row */}
          <div className="mt-10 p-5 bg-slate-800/80 rounded-2xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/placa-qr-oficial.svg" alt="Miniatura da Placa" className="w-12 h-12 object-contain bg-white rounded-lg p-1" />
              <div>
                <p className="font-bold text-sm text-white">Gostaria de experimentar a leitura agora?</p>
                <p className="text-xs text-slate-400">Abra o portal de ocorrências interativo ou envie uma simulação de SMS.</p>
              </div>
            </div>
            <button
              onClick={onOpenCitizenModal}
              className="px-5 py-2.5 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl shadow-lg transition-colors whitespace-nowrap"
            >
              Testar Portal do Munícipe
            </button>
          </div>

        </div>
      </section>

      {/* 5. EQUIPMENT, FLEET & UNIFORMS SHOWCASE */}
      <section id="equipamentos" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-brand-primary uppercase tracking-wider bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
              Ficha Técnica de Produção e Meios
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Equipamentos e Segurança dos Trabalhadores
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Padronização rigorosa em vermelho institucional com o símbolo OK em branco, garantindo alta visibilidade, dignidade e proteção em Ondjiva.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Item 1: Uniformes */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-white p-2 border border-slate-200 flex items-center justify-center">
                <img src="/uniform-polo.png" alt="Conjunto Polo e Calça Vermelha" className="h-full object-contain" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">58 Conjuntos de Uniforme</h4>
              <p className="text-xs text-slate-500">
                2 por trabalhador (29 operacionais). Tecido grosso resistente a água, sol forte e lama com faixa refletora prateada.
              </p>
            </div>

            {/* Item 2: Coletes */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-white p-2 border border-slate-200 flex items-center justify-center">
                <img src="/uniform-vest.png" alt="Colete Refletor Vermelho" className="h-full object-contain" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">35 Coletes Refletores</h4>
              <p className="text-xs text-slate-500">
                Rede respirável ventilada para o calor de Ondjiva com fecho éclair frontal e 2 faixas refletoras de segurança.
              </p>
            </div>

            {/* Item 3: Bonés */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-white p-2 border border-slate-200 flex items-center justify-center">
                <img src="/uniform-cap.png" alt="Boné Vermelho Bordado" className="h-full object-contain" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">35 Bonés Bordados OK</h4>
              <p className="text-xs text-slate-500">
                Algodão reforçado para proteção solar dos varredores, bordado com logótipo OK em branco sobre vermelho vivo.
              </p>
            </div>

            {/* Item 4: Carros de Mão */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-white p-2 border border-slate-200 flex items-center justify-center">
                <img src="/wheelbarrow.png" alt="Carro de Mão Vermelho Personalizado" className="h-full object-contain" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">15 Carros de Mão OK</h4>
              <p className="text-xs text-slate-500">
                Caçamba em vermelho anti-ferrugem com vinil &quot;OMBALA KISUL - ONDJIVA LIMPA&quot; e pneu cheio de alta resistência.
              </p>
            </div>

          </div>

          {/* Future Mechanization Banner */}
          <div className="mt-10 bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">
                Plano de Modernização e Crescimento
              </span>
              <h3 className="text-lg font-bold">
                Pretensão de Mecanização Gradual da Empreitada
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl">
                Conforme detalhado na Proposta Técnica, a empresa prevê a aquisição progressiva de meios mecânicos compactos (Varredora HOWO 4x2 e mini-varredoras de passeio), complementando o trabalho manual sem dispensar postos de trabalho.
              </p>
            </div>
            <button
              onClick={onGoToPlatform}
              className="px-5 py-2.5 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-lg shadow whitespace-nowrap transition-colors"
            >
              Consultar Ficha no CRM
            </button>
          </div>

        </div>
      </section>

      {/* 6. GEOGRAPHIC COVERAGE */}
      <section id="atuacao" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold text-brand-primary uppercase tracking-wider bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
                Cunene • Angola
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Área de Intervenção e Expansão Territorial
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                A nossa base operacional cobre integralmente o Casco Urbano da cidade de Ondjiva, no Município de Cuanhama, com rotas diárias de recolha e resposta a emergências.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-sm text-slate-900 block">Sede e Operação Principal: Ondjiva (Cuanhama)</strong>
                    <span className="text-xs text-slate-500">
                      Bairros: Naipalala, Castilhos, Kafitu, Bangula, Centro Urbano / Praça da Paz, Mercado Central da Alemanha e Mercado Oshatotwa.
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-sm text-slate-900 block">Expansão Prevista: Ombadja e Namacunde</strong>
                    <span className="text-xs text-slate-500">
                      Plano de extensão estratégica para os polos urbanos vizinhos na Província do Cunene, mediante aprovação das respetivas Administrações.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-900 p-6 rounded-3xl text-white border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                  <span className="font-bold text-sm">Destino Oficial dos Resíduos</span>
                </div>
                <span className="text-xs text-slate-400">Regulamento n.º 190/12</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                É política inegociável da OMBALA KISUL depositar resíduos <strong>exclusivamente na Lixeira Oficial indicada pela Administração Municipal de Cuanhama</strong>.
              </p>
              <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-xl text-xs text-red-200">
                ⛔ Proibição Estrita: É expressamente vedado depositar qualquer resíduo em rios, valas abertas, terrenos baldios ou áreas habitacionais do município.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. PROTECTED CONTACT FORM */}
      <section id="contactos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Contact info column */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold text-brand-primary uppercase tracking-wider bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
                  Fale Connosco
                </span>
                <h2 className="mt-3 text-3xl font-extrabold text-slate-900 tracking-tight">
                  Contactos Institucionais e Propostas
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Para contratos institucionais, esclarecimentos ou orçamentos empresariais no Cunene.
                </p>
              </div>

              <div className="space-y-4 text-xs text-slate-700">
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <MapPin className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Sede da Empresa</strong>
                    <span>Ondjiva, Bairro Cunhama, Município de Cuanhama, Província do Cunene, Angola</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <Phone className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Telefone Operacional</strong>
                    <span className="font-mono text-sm font-semibold">+244 927 855 626</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <Mail className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Correio Eletrónico Institucional</strong>
                    <span className="font-mono font-semibold text-brand-dark">geral@ombalakisul.com</span>
                    <span className="text-slate-400 block text-[11px]">geral@ombalakisul.co.ao • ok.ombala.kisul@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Protected Form Column */}
            <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              {formSubmitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Mensagem Enviada com Sucesso</h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    Agradecemos o seu contacto. A equipa administrativa da OMBALA KISUL responderá com a maior brevidade possível.
                  </p>
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({ nome: '', entidade: '', telefone: '', email: '', mensagem: '', honeypot: '' });
                    }}
                    className="px-5 py-2 text-xs font-bold text-brand-primary bg-brand-50 hover:bg-brand-100 rounded-lg border border-brand-200"
                  >
                    Enviar Outra Mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                  <h3 className="font-bold text-base text-slate-900">Formulário Comercial & Institucional</h3>
                  
                  {/* Honeypot field for anti-spam (invisible to normal users) */}
                  <input
                    type="text"
                    name="website_url_check"
                    value={formData.honeypot}
                    onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Nome Completo *</label>
                      <input
                        type="text"
                        required
                        placeholder="Seu nome"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Empresa ou Entidade</label>
                      <input
                        type="text"
                        placeholder="Ex: Administração, Comércio, etc."
                        value={formData.entidade}
                        onChange={(e) => setFormData({ ...formData, entidade: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Telefone (+244) *</label>
                      <input
                        type="tel"
                        required
                        placeholder="Ex: 923 000 000"
                        value={formData.telefone}
                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Correio Eletrónico *</label>
                      <input
                        type="email"
                        required
                        placeholder="seuemail@exemplo.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Mensagem ou Requerimento *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Descreva o serviço de saneamento, contentorização ou proposta técnica pretendida..."
                      value={formData.mensagem}
                      onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                      className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      Protegido contra spam • Os dados não são partilhados com terceiros
                    </span>
                    <button
                      type="submit"
                      className="px-6 py-2.5 text-xs font-bold text-white bg-brand-primary hover:bg-brand-hover rounded-lg shadow transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submeter Mensagem</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
