import React from 'react';
import { Mail, Phone, MapPin, FileText, CheckCircle2, ShieldCheck, Globe, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Identidade */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded p-1 flex-shrink-0">
                <img src="/logo.png" alt="Ombala Kisul" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-extrabold text-white text-lg tracking-tight">OMBALA KISUL</span>
                <span className="ml-1 text-xs px-1.5 py-0.5 bg-brand-primary text-white font-semibold rounded">LDA</span>
                <p className="text-xs text-slate-400">Ondjiva Limpa, Saudável e Digna</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Sociedade por quotas dedicada à prestação integrada de serviços de saneamento básico, limpeza urbana, varredura de ruas, desassoreamento de valas de drenagem e gestão de resíduos sólidos.
            </p>
            <div className="pt-2 text-xs space-y-1 text-slate-400">
              <p><strong className="text-slate-200">Denominação:</strong> OMBALA KISUL — LDA</p>
              <p><strong className="text-slate-200">NIF:</strong> 5000597244</p>
              <p><strong className="text-slate-200">Gerência / CEO:</strong> Edir Jorge Muluta Pacelli</p>
            </div>
          </div>

          {/* Col 2: Serviços & Operações */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase border-l-2 border-brand-primary pl-2.5">
              Serviços Operacionais
            </h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                Varredura diária de ruas, praças e mercados
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                Recolha e transporte de resíduos sólidos urbanos
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                Desassoreamento de valas de drenagem e sarjetas
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                Remoção intensiva de lamas pós-chuvas
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                Poda técnica de árvores e corte de capim
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                Sensibilização ambiental comunitária
              </li>
            </ul>
          </div>

          {/* Col 3: Localização & Âmbito */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase border-l-2 border-brand-primary pl-2.5">
              Área de Intervenção
            </h4>
            <div className="text-xs space-y-2.5 text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200">Sede Operacional:</strong><br />
                  Ondjiva, Bairro Cunhama, Município de Cuanhama, Província do Cunene, Angola
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Globe className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200">Expansão Territorial:</strong><br />
                  Previsão de cobertura estendida aos municípios de Ombadja e Namacunde.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200">Horário Operacional:</strong><br />
                  Varredura e Recolha: 06h00 – 12h00<br />
                  Atendimento: 07h30 – 16h30
                </span>
              </div>
            </div>
          </div>

          {/* Col 4: Contactos Oficiais e Governança */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase border-l-2 border-brand-primary pl-2.5">
              Contactos Oficiais
            </h4>
            <div className="text-xs space-y-2 text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200 font-mono">+244 927 855 626</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand-primary" />
                <span className="text-slate-200 font-mono font-bold">www.ombalakisul.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200 font-mono">geral@ombalakisul.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" />
                <span className="text-slate-300 font-mono text-[11px]">geral@ombalakisul.co.ao</span>
              </div>
            </div>

            <div className="mt-4 p-2.5 rounded bg-slate-800/80 border border-slate-700 text-[11px] space-y-1">
              <span className="font-semibold text-amber-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Transparência e Conformidade
              </span>
              <p className="text-slate-400 leading-tight">
                Em conformidade com o Dec. Presidencial n.º 190/12 e Dec. Executivo n.º 24/15. Pedido formal submetido à ANR em Luanda.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} OMBALA KISUL — LDA. Todos os direitos reservados.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="hover:text-slate-400">Privacidade & Proteção de Dados</span>
            <span>•</span>
            <span className="hover:text-slate-400">Termos de Serviço</span>
            <span>•</span>
            <span className="text-slate-400">Moeda: Kwanza (AOA)</span>
            <span>•</span>
            <span className="text-slate-400">Fuso: Africa/Luanda (UTC+1)</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
