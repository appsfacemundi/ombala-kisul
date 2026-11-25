// Dados Oficiais e Reconciliados da OMBALA KISUL — LDA
// Ondjiva, Cuanhama, Cunene, Angola
// NIF: 5000597244 | Responsável: Edir Jorge Muluta Pacelli (Gerente / CEO)

export interface Worker {
  id: string;
  name: string;
  role: string;
  category: 'operacional' | 'administrativo' | 'direcao';
  zone: string;
  shift: string;
  status: 'presente' | 'ausente' | 'em_campo' | 'ferias' | 'justificado';
  phone: string;
  attendanceToday: boolean;
  checkIn?: string;
  ppeDelivered: boolean;
  notes?: string;
}

export interface ZoneOperation {
  id: string;
  code: string;
  title: string;
  bairro: string;
  serviceType: 'varredura' | 'recolha' | 'valas' | 'poda' | 'lama';
  status: 'planeado' | 'atribuido' | 'em_execucao' | 'aguardar_validacao' | 'concluido' | 'suspenso' | 'reaberto';
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  supervisor: string;
  assignedWorkersCount: number;
  scheduledDate: string;
  completionDate?: string;
  areaCoordinates: { x: number; y: number }[]; // Coordinates on Ondjiva Vector Map
  lat: number;
  lng: number;
  beforePhoto: string;
  afterPhoto?: string;
  tonnageEstimated: number; // toneladas
  tonnageMeasured?: number; // toneladas após báscula / descarga
  tripsCount: number;
  dumpDestination: string; // "Lixeira Oficial Municipal de Cuanhama"
  supervisorNotes?: string;
  validatedBy?: string;
}

export interface FinancialTransaction {
  id: string;
  code: string;
  type: 'receita' | 'despesa';
  category: 'contrato' | 'salarios' | 'combustivel' | 'viaturas' | 'epi' | 'manutencao' | 'administrativo' | 'imprevisto';
  classification: 'previsto' | 'realizado';
  amount: number; // Kwanzas (AOA)
  date: string;
  dueDate?: string;
  status: 'pendente' | 'aprovado' | 'pago' | 'revertido';
  description: string;
  costCenter: 'Cuanhama - Casco Urbano' | 'Logística e Frota' | 'Sede Ondjiva' | 'Geral';
  account: 'BFA Ondjiva' | 'BAI Cunene' | 'Caixa Operacional Ondjiva';
  receiptAttached: boolean;
  approvedBy?: string;
  invoiceNumber?: string;
}

export interface CitizenComplaint {
  id: string;
  protocol: string;
  source: 'qrcode' | 'sms' | 'portal';
  bairro: string;
  address: string;
  category: 'acumulacao_lixo' | 'vala_obstruida' | 'lama_inundacao' | 'ramos_arvore' | 'contentor_cheio';
  description: string;
  photoUrl?: string;
  citizenPhone?: string;
  citizenName?: string;
  status: 'recebida' | 'em_triagem' | 'atribuida' | 'em_resolucao' | 'resolvida' | 'validada_encerrada';
  priority: 'normal' | 'alta' | 'urgente';
  createdAt: string;
  resolvedAt?: string;
  resolutionPhoto?: string;
  assignedTeam?: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  type: 'camiao_basculante' | 'carrinha_apoio' | 'trator' | 'carro_mao';
  ownership: 'alugada' | 'propria' | 'pretensao_mecanizacao';
  status: 'operacional' | 'em_rota' | 'manutencao' | 'parada';
  fuelLevelPercent: number;
  assignedDriver: string;
  odometerKm: number;
  lastMaintenance: string;
}

// 1. Reconciliação dos 33 Trabalhadores da Folha de Salários vs 32 Linhas Detalhadas
export const WORKFORCE_RECONCILIATION = {
  totalDocumentalFolha: 33,
  totalLinhasListadas: 32,
  discrepanciaEncontrada: -1,
  motivoAuditoria: "A folha salarial totaliza 33 pessoas no cabeçalho e rodapé (29 operacionais + 4 apoio), porém a listagem descritiva discrimina 32 postos: Varredores (18), Valas/Sarjetas/Poda (6), Motoristas (2), Encarregado (1), Auxiliar de Logística (1), Assistente Administrativa (1), Consultor (1), Director Administrativo (1), CEO (1). Falta 1 vaga operacional não discriminada ou omitida na soma de ajudantes de recolha.",
  distribuicao: {
    varredores: 18,
    valasSarjetasPoda: 6,
    motoristas: 2,
    encarregadoSupervisor: 1,
    auxiliarLogistica: 1,
    subtotalOperacionalListado: 28, // Documentos anteriores referiam 29 operacionais
    vagasOperacionaisEmAberto: 1, // Vaga a confirmar com Gerência
    assistenteAdministrativa: 1,
    consultor: 1,
    directorAdministrativo: 1,
    ceoGerente: 1,
    totalGeralFinal: 33
  }
};

export const INITIAL_WORKERS: Worker[] = [
  // Direção e Gestão
  {
    id: "EMP-001",
    name: "Edir Jorge Muluta Pacelli",
    role: "CEO / Gerente Executivo",
    category: "direcao",
    zone: "Sede Ondjiva / Coordenação Geral",
    shift: "Administrativo (07h30 - 16h30)",
    status: "presente",
    phone: "+244 927 855 626",
    attendanceToday: true,
    checkIn: "07:15",
    ppeDelivered: true,
    notes: "Responsável legal e acompanhamento pessoal em campo"
  },
  {
    id: "EMP-002",
    name: "Director Administrativo (A Confirmar)",
    role: "Director Administrativo",
    category: "administrativo",
    zone: "Sede Ondjiva",
    shift: "Administrativo (07h30 - 16h30)",
    status: "presente",
    phone: "+244 923 000 101",
    attendanceToday: true,
    checkIn: "07:30",
    ppeDelivered: true,
    notes: "Gestão documental, contratação e conformidade"
  },
  {
    id: "EMP-003",
    name: "Filomena Tchivangulula",
    role: "Assistente Administrativa",
    category: "administrativo",
    zone: "Sede Ondjiva",
    shift: "Administrativo (07h30 - 16h30)",
    status: "presente",
    phone: "+244 923 000 102",
    attendanceToday: true,
    checkIn: "07:22",
    ppeDelivered: true,
    notes: "Atendimento, presenças, apoio a pagamentos e SMS"
  },
  {
    id: "EMP-004",
    name: "Consultor Técnico Especialista",
    role: "Consultor de Engenharia Sanitária",
    category: "administrativo",
    zone: "Ondjiva e Cuanhama",
    shift: "Consultoria / Vistorias Técnicas",
    status: "presente",
    phone: "+244 923 000 103",
    attendanceToday: true,
    checkIn: "08:00",
    ppeDelivered: true,
    notes: "Acompanhamento do Plano de Gestão de Resíduos e ANR"
  },
  // Chefia Operacional e Logística
  {
    id: "EMP-005",
    name: "Helmer Lisboa",
    role: "Encarregado / Supervisor Operacional Geral",
    category: "operacional",
    zone: "Casco Urbano de Ondjiva (Todas as Zonas)",
    shift: "Manhã (05h30 - 13h30)",
    status: "em_campo",
    phone: "+244 923 000 104",
    attendanceToday: true,
    checkIn: "05:40",
    ppeDelivered: true,
    notes: "Fiscalização direta das equipas e validação com fotos"
  },
  {
    id: "EMP-006",
    name: "Edmilson Satyahamba",
    role: "Auxiliar de Logística e Armazém",
    category: "operacional",
    zone: "Armazém Ondjiva / Parque de Viaturas",
    shift: "Geral (06h00 - 14h00)",
    status: "presente",
    phone: "+244 923 000 105",
    attendanceToday: true,
    checkIn: "05:45",
    ppeDelivered: true,
    notes: "Controlo de ferramentas, sacos, combustível e EPI"
  },
  // Motoristas
  {
    id: "EMP-007",
    name: "José Catata",
    role: "Motorista Principal (Camião de Recolha)",
    category: "operacional",
    zone: "Rotas Centrais e Aterro Municipal",
    shift: "Turno Manhã (06h00 - 12h30)",
    status: "em_campo",
    phone: "+244 923 000 106",
    attendanceToday: true,
    checkIn: "05:50",
    ppeDelivered: true,
    notes: "Camião Basculante LD-84-21-HK"
  },
  {
    id: "EMP-008",
    name: "Dione Cristóvão",
    role: "Motorista Auxiliar (Carrinha de Apoio)",
    category: "operacional",
    zone: "Bairros Periféricos e Apoio a Valas",
    shift: "Turno Manhã (06h00 - 12h30)",
    status: "em_campo",
    phone: "+244 923 000 107",
    attendanceToday: true,
    checkIn: "05:55",
    ppeDelivered: true,
    notes: "Carrinha de Transporte Rápido LD-12-90-CZ"
  },
  // Equipa de Valas, Sarjetas e Poda (6 trabalhadores)
  {
    id: "EMP-009",
    name: "Mateus Ndalilavali",
    role: "Técnico de Valas e Desassoreamento",
    category: "operacional",
    zone: "Vala Principal Naipalala",
    shift: "06h00 - 12h00",
    status: "em_campo",
    phone: "+244 940 100 001",
    attendanceToday: true,
    checkIn: "05:55",
    ppeDelivered: true,
    notes: "EPI especial: botas altas, máscara FFP2 e luvas grossas"
  },
  {
    id: "EMP-010",
    name: "Lucas Haimbili",
    role: "Técnico de Valas e Desassoreamento",
    category: "operacional",
    zone: "Vala Principal Naipalala",
    shift: "06h00 - 12h00",
    status: "em_campo",
    phone: "+244 940 100 002",
    attendanceToday: true,
    checkIn: "05:58",
    ppeDelivered: true
  },
  {
    id: "EMP-011",
    name: "Tito Ndahambelela",
    role: "Técnico de Valas e Sarjetas",
    category: "operacional",
    zone: "Sarjetas Av. 11 de Novembro",
    shift: "06h00 - 12h00",
    status: "em_campo",
    phone: "+244 940 100 003",
    attendanceToday: true,
    checkIn: "06:00",
    ppeDelivered: true
  },
  {
    id: "EMP-012",
    name: "Abel Mukwamangwe",
    role: "Técnico de Valas e Sarjetas",
    category: "operacional",
    zone: "Sarjetas Av. 11 de Novembro",
    shift: "06h00 - 12h00",
    status: "em_campo",
    phone: "+244 940 100 004",
    attendanceToday: true,
    checkIn: "06:02",
    ppeDelivered: true
  },
  {
    id: "EMP-013",
    name: "Salomão Shikongo",
    role: "Operador de Poda e Motosserra",
    category: "operacional",
    zone: "Rotunda dos Castilhos",
    shift: "06h00 - 12h00",
    status: "em_campo",
    phone: "+244 940 100 005",
    attendanceToday: true,
    checkIn: "06:00",
    ppeDelivered: true,
    notes: "Capacete de proteção, viseira e óculos"
  },
  {
    id: "EMP-014",
    name: "Bernardo Valipopi",
    role: "Operador de Poda e Recolha de Ramos",
    category: "operacional",
    zone: "Rotunda dos Castilhos",
    shift: "06h00 - 12h00",
    status: "em_campo",
    phone: "+244 940 100 006",
    attendanceToday: true,
    checkIn: "06:03",
    ppeDelivered: true
  },
  // Varredores e Varredoras (Amostra de 18 colaboradores das frentes urbanas)
  {
    id: "EMP-015",
    name: "Maria Ndahafa Ndeitunga",
    role: "Varredora Urbana",
    category: "operacional",
    zone: "Mercado Central de Ondjiva (Alemanha)",
    shift: "06h00 - 12h00",
    status: "em_campo",
    phone: "+244 941 200 001",
    attendanceToday: true,
    checkIn: "05:52",
    ppeDelivered: true
  },
  {
    id: "EMP-016",
    name: "Esperança Mweshininga",
    role: "Varredora Urbana",
    category: "operacional",
    zone: "Mercado Central de Ondjiva (Alemanha)",
    shift: "06h00 - 12h00",
    status: "em_campo",
    phone: "+244 941 200 002",
    attendanceToday: true,
    checkIn: "05:55",
    ppeDelivered: true
  },
  {
    id: "EMP-017",
    name: "Teresa Haipinge",
    role: "Varredora Urbana",
    category: "operacional",
    zone: "Mercado Central de Ondjiva (Alemanha)",
    shift: "06h00 - 12h00",
    status: "em_campo",
    phone: "+244 941 200 003",
    attendanceToday: true,
    checkIn: "05:58",
    ppeDelivered: true
  },
  {
    id: "EMP-018",
    name: "Joana Kalundungo",
    role: "Varredora Urbana",
    category: "operacional",
    zone: "Bairro Naipalala - Eixo Principal",
    shift: "06h00 - 12h00",
    status: "em_campo",
    phone: "+244 941 200 004",
    attendanceToday: true,
    checkIn: "06:00",
    ppeDelivered: true
  },
  {
    id: "EMP-019",
    name: "Paulina Weyulu",
    role: "Varredora Urbana",
    category: "operacional",
    zone: "Bairro Naipalala - Eixo Principal",
    shift: "06h00 - 12h00",
    status: "em_campo",
    phone: "+244 941 200 005",
    attendanceToday: true,
    checkIn: "06:01",
    ppeDelivered: true
  },
  {
    id: "EMP-020",
    name: "Catarina Haufiku",
    role: "Varredora Urbana",
    category: "operacional",
    zone: "Bairro Castilhos - Rua do Hospital",
    shift: "06h00 - 12h00",
    status: "presente",
    phone: "+244 941 200 006",
    attendanceToday: true,
    checkIn: "06:05",
    ppeDelivered: true
  },
  {
    id: "EMP-021",
    name: "Marta Kambinda",
    role: "Varredora Urbana",
    category: "operacional",
    zone: "Bairro Castilhos - Rua do Hospital",
    shift: "06h00 - 12h00",
    status: "ausente",
    phone: "+244 941 200 007",
    attendanceToday: false,
    ppeDelivered: true,
    notes: "Falta de marcação inicial (Aviso prévio de consulta médica - aguarda comprovativo)"
  },
  {
    id: "EMP-022",
    name: "Helena Shipingana",
    role: "Varredora Urbana",
    category: "operacional",
    zone: "Bairro Kafitu",
    shift: "06h00 - 12h00",
    status: "em_campo",
    phone: "+244 941 200 008",
    attendanceToday: true,
    checkIn: "05:50",
    ppeDelivered: true
  },
  {
    id: "EMP-023",
    name: "Domingas Hamutenya",
    role: "Varredora Urbana",
    category: "operacional",
    zone: "Bairro Kafitu",
    shift: "06h00 - 12h00",
    status: "em_campo",
    phone: "+244 941 200 009",
    attendanceToday: true,
    checkIn: "05:54",
    ppeDelivered: true
  },
  {
    id: "EMP-024",
    name: "Adélia Kativa",
    role: "Varredora Urbana",
    category: "operacional",
    zone: "Bairro Bangula",
    shift: "06h00 - 12h00",
    status: "em_campo",
    phone: "+244 941 200 010",
    attendanceToday: true,
    checkIn: "05:59",
    ppeDelivered: true
  },
  {
    id: "EMP-025",
    name: "Gabriel Nghipondoka",
    role: "Varredor Urbano",
    category: "operacional",
    zone: "Bairro Bangula",
    shift: "06h00 - 12h00",
    status: "em_campo",
    phone: "+244 941 200 011",
    attendanceToday: true,
    checkIn: "06:02",
    ppeDelivered: true
  },
  {
    id: "EMP-026",
    name: "Tomas Hidinwa",
    role: "Varredor Urbano",
    category: "operacional",
    zone: "Praça da Paz / Centro Administrativo",
    shift: "06h00 - 12h00",
    status: "em_campo",
    phone: "+244 941 200 012",
    attendanceToday: true,
    checkIn: "05:48",
    ppeDelivered: true
  },
  {
    id: "EMP-027",
    name: "Inês Namweya",
    role: "Varredora Urbana",
    category: "operacional",
    zone: "Praça da Paz / Centro Administrativo",
    shift: "06h00 - 12h00",
    status: "em_campo",
    phone: "+244 941 200 013",
    attendanceToday: true,
    checkIn: "05:50",
    ppeDelivered: true
  },
  {
    id: "EMP-028",
    name: "Ester Ndafudhitilwa",
    role: "Varredora Urbana",
    category: "operacional",
    zone: "Avenida Comandante Kwenha",
    shift: "06h00 - 12h00",
    status: "em_campo",
    phone: "+244 941 200 014",
    attendanceToday: true,
    checkIn: "05:55",
    ppeDelivered: true
  },
  {
    id: "EMP-029",
    name: "Lucas Nghilundilwa",
    role: "Varredor Urbano",
    category: "operacional",
    zone: "Avenida Comandante Kwenha",
    shift: "06h00 - 12h00",
    status: "em_campo",
    phone: "+244 941 200 015",
    attendanceToday: true,
    checkIn: "05:58",
    ppeDelivered: true
  },
  {
    id: "EMP-030",
    name: "Clara Nangombe",
    role: "Varredora Urbana",
    category: "operacional",
    zone: "Mercado Oshatotwa",
    shift: "06h00 - 12h00",
    status: "em_campo",
    phone: "+244 941 200 016",
    attendanceToday: true,
    checkIn: "05:45",
    ppeDelivered: true
  },
  {
    id: "EMP-031",
    name: "Rosa Kakongo",
    role: "Varredora Urbana",
    category: "operacional",
    zone: "Mercado Oshatotwa",
    shift: "06h00 - 12h00",
    status: "em_campo",
    phone: "+244 941 200 017",
    attendanceToday: true,
    checkIn: "05:49",
    ppeDelivered: true
  },
  {
    id: "EMP-032",
    name: "Fernando Kashilula",
    role: "Varredor Urbano",
    category: "operacional",
    zone: "Avenida 4 de Fevereiro / Circular",
    shift: "06h00 - 12h00",
    status: "ferias",
    phone: "+244 941 200 018",
    attendanceToday: false,
    ppeDelivered: true,
    notes: "Férias aprovadas de 15 a 30 de Novembro"
  },
  // Vaga Reconciliada (Vaga 33 da Folha Salarial)
  {
    id: "EMP-033",
    name: "[Vaga Operacional 33 - Em Reconciliação]",
    role: "Ajudante de Recolha / Operador Reserva",
    category: "operacional",
    zone: "A definir pelo Supervisor",
    shift: "06h00 - 12h00",
    status: "ausente",
    phone: "--",
    attendanceToday: false,
    ppeDelivered: false,
    notes: "Identificada pela auditoria: folha prevê 33 trabalhadores, linha omitida na listagem inicial."
  }
];

// 2. Operações em Ondjiva com Coordenadas e Bairros
export const INITIAL_OPERATIONS: ZoneOperation[] = [
  {
    id: "OP-2026-001",
    code: "OND-NAIP-01",
    title: "Desobstrução e Desassoreamento da Vala Principal de Naipalala",
    bairro: "Bairro Naipalala",
    serviceType: "valas",
    status: "em_execucao",
    priority: "urgente",
    supervisor: "Helmer Lisboa",
    assignedWorkersCount: 6,
    scheduledDate: "2026-11-25",
    areaCoordinates: [
      { x: 180, y: 140 },
      { x: 260, y: 155 },
      { x: 250, y: 195 },
      { x: 170, y: 180 }
    ],
    lat: -17.0665,
    lng: 15.7312,
    beforePhoto: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80",
    tonnageEstimated: 4.5,
    tripsCount: 2,
    dumpDestination: "Lixeira Oficial Municipal de Cuanhama",
    supervisorNotes: "Remoção de lama espessa após primeiras chuvas. Equipa com pás e botas de borracha."
  },
  {
    id: "OP-2026-002",
    code: "OND-MERC-02",
    title: "Varredura Manual Intensiva e Contentorização - Mercado da Alemanha",
    bairro: "Mercado Central (Alemanha)",
    serviceType: "varredura",
    status: "aguardar_validacao",
    priority: "alta",
    supervisor: "Helmer Lisboa",
    assignedWorkersCount: 8,
    scheduledDate: "2026-11-25",
    completionDate: "2026-11-25 11:30",
    areaCoordinates: [
      { x: 380, y: 220 },
      { x: 460, y: 215 },
      { x: 450, y: 270 },
      { x: 375, y: 265 }
    ],
    lat: -17.0630,
    lng: 15.7375,
    beforePhoto: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    afterPhoto: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80",
    tonnageEstimated: 6.2,
    tonnageMeasured: 6.4,
    tripsCount: 3,
    dumpDestination: "Lixeira Oficial Municipal de Cuanhama",
    supervisorNotes: "Concluído às 11:30. Sacos recolhidos pelo camião basculante. Fotos prontas para validação."
  },
  {
    id: "OP-2026-003",
    code: "OND-CAST-03",
    title: "Poda Preventiva de Árvores e Desobstrução da Rede Elétrica",
    bairro: "Bairro Castilhos",
    serviceType: "poda",
    status: "concluido",
    priority: "media",
    supervisor: "Helmer Lisboa",
    assignedWorkersCount: 4,
    scheduledDate: "2026-11-24",
    completionDate: "2026-11-24 14:00",
    areaCoordinates: [
      { x: 290, y: 310 },
      { x: 370, y: 320 },
      { x: 360, y: 375 },
      { x: 280, y: 360 }
    ],
    lat: -17.0712,
    lng: 15.7420,
    beforePhoto: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80",
    afterPhoto: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
    tonnageEstimated: 2.1,
    tonnageMeasured: 2.0,
    tripsCount: 1,
    dumpDestination: "Lixeira Oficial / Ponto de Compostagem Municipal",
    supervisorNotes: "Trabalho validado pela Direção. Ramos triturados e encaminhados.",
    validatedBy: "Edir Jorge Muluta Pacelli"
  },
  {
    id: "OP-2026-004",
    code: "OND-PRAC-04",
    title: "Varredura e Manutenção Paisagística da Praça da Paz",
    bairro: "Centro Urbano / Praça da Paz",
    serviceType: "varredura",
    status: "planeado",
    priority: "media",
    supervisor: "Helmer Lisboa",
    assignedWorkersCount: 5,
    scheduledDate: "2026-11-26",
    areaCoordinates: [
      { x: 420, y: 120 },
      { x: 510, y: 130 },
      { x: 495, y: 190 },
      { x: 410, y: 180 }
    ],
    lat: -17.0601,
    lng: 15.7345,
    beforePhoto: "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=800&q=80",
    tonnageEstimated: 1.8,
    tripsCount: 1,
    dumpDestination: "Lixeira Oficial Municipal de Cuanhama",
    supervisorNotes: "Programado para amanhã às 06h00 com 5 varredores e 2 carros de mão."
  },
  {
    id: "OP-2026-005",
    code: "OND-BANG-05",
    title: "Recolha Porta-a-Porta e Limpeza de Bermas",
    bairro: "Bairro Bangula",
    serviceType: "recolha",
    status: "em_execucao",
    priority: "alta",
    supervisor: "Helmer Lisboa",
    assignedWorkersCount: 7,
    scheduledDate: "2026-11-25",
    areaCoordinates: [
      { x: 120, y: 260 },
      { x: 210, y: 275 },
      { x: 195, y: 340 },
      { x: 110, y: 320 }
    ],
    lat: -17.0750,
    lng: 15.7280,
    beforePhoto: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
    tonnageEstimated: 5.0,
    tripsCount: 2,
    dumpDestination: "Lixeira Oficial Municipal de Cuanhama",
    supervisorNotes: "Camião basculante a circular pelas ruas secundárias de Bangula."
  }
];

// 3. Finanças Operacionais: Previsões do Contrato vs Execução Realizada
export const FINANCIAL_OVERVIEW = {
  moeda: "Kz (AOA)",
  contratoAnualPrevisao: 174500000,
  contratoMensalPrevisao: 14541667,
  custoTotalMensalOrcado: 12025000,
  margemMensalEstimada: 2516667,
  reservaEmergenciaRecomendada: 6525000, // 1 mês de salários
  orcamentoMensal: {
    salariosINSS: 6525000,
    aluguerViaturas: 2800000,
    combustivel: 1200000,
    epiFerramentas: 550000,
    manutencao: 350000,
    comunicacaoAdmin: 300000,
    imprevistos: 300000
  }
};

export const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: "TX-2026-101",
    code: "FAT-2026/001",
    type: "receita",
    category: "contrato",
    classification: "previsto",
    amount: 14541667,
    date: "2026-11-01",
    dueDate: "2026-11-30",
    status: "pendente",
    description: "Proposta/Previsão de Faturação Mensal - Contrato Casco Urbano Ondjiva (1/12)",
    costCenter: "Cuanhama - Casco Urbano",
    account: "BFA Ondjiva",
    receiptAttached: true,
    invoiceNumber: "FAT-PROFORMA-2026/01"
  },
  {
    id: "TX-2026-102",
    code: "SAL-2026/11",
    type: "despesa",
    category: "salarios",
    classification: "previsto",
    amount: 6525000,
    date: "2026-11-28",
    status: "pendente",
    description: "Provisão da Folha de Salários e INSS Patronal (33 trabalhadores previstos)",
    costCenter: "Sede Ondjiva",
    account: "BAI Cunene",
    receiptAttached: false
  },
  {
    id: "TX-2026-103",
    code: "COMB-2026/11A",
    type: "despesa",
    category: "combustivel",
    classification: "realizado",
    amount: 80000,
    date: "2026-11-23",
    status: "pago",
    description: "Abastecimento de Gasóleo para Camião de Recolha (Posto Sonangol Ondjiva)",
    costCenter: "Logística e Frota",
    account: "Caixa Operacional Ondjiva",
    receiptAttached: true,
    approvedBy: "Edir Jorge Muluta Pacelli"
  },
  {
    id: "TX-2026-104",
    code: "EPI-2026/01",
    type: "despesa",
    category: "epi",
    classification: "realizado",
    amount: 485000,
    date: "2026-11-18",
    status: "pago",
    description: "Pagamento do 1º lote de EPIs (Fatos-macaco, coletes, luvas e bonés bordados)",
    costCenter: "Logística e Frota",
    account: "BFA Ondjiva",
    receiptAttached: true,
    approvedBy: "Edir Jorge Muluta Pacelli"
  },
  {
    id: "TX-2026-105",
    code: "VIAT-2026/11A",
    type: "despesa",
    category: "viaturas",
    classification: "realizado",
    amount: 1400000,
    date: "2026-11-15",
    status: "pago",
    description: "Adiantamento 50% do Aluguer Mensal do Camião Basculante de Recolha",
    costCenter: "Logística e Frota",
    account: "BFA Ondjiva",
    receiptAttached: true,
    approvedBy: "Edir Jorge Muluta Pacelli"
  }
];

// 4. Munícipes e Ocorrências
export const INITIAL_COMPLAINTS: CitizenComplaint[] = [
  {
    id: "OC-001",
    protocol: "OK-CND-2026-0841",
    source: "qrcode",
    bairro: "Bairro Naipalala",
    address: "Rua do Mercado Antigo, próximo ao chafariz",
    category: "acumulacao_lixo",
    description: "Acúmulo de resíduos domésticos e caixas de cartão junto ao chafariz comunitário após o fim de semana.",
    photoUrl: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80",
    citizenName: "Munícipe Residente",
    citizenPhone: "+244 923 *** 412",
    status: "atribuida",
    priority: "alta",
    createdAt: "2026-11-24 16:30",
    assignedTeam: "Equipa de Recolha 2 (José Catata)"
  },
  {
    id: "OC-002",
    protocol: "OK-CND-2026-0842",
    source: "sms",
    bairro: "Bairro Castilhos",
    address: "Travessa da Escola Secundária",
    category: "vala_obstruida",
    description: "Vala de escoamento entupida com garrafas plásticas e areia. Água parada a transbordar.",
    status: "em_triagem",
    priority: "urgente",
    createdAt: "2026-11-25 07:15"
  },
  {
    id: "OC-003",
    protocol: "OK-CND-2026-0839",
    source: "portal",
    bairro: "Centro Urbano",
    address: "Avenida 11 de Novembro, defronte ao edifício bancário",
    category: "ramos_arvore",
    description: "Ramos secos que caíram sobre o passeio pedonal e impedem a circulação.",
    status: "resolvida",
    priority: "normal",
    createdAt: "2026-11-23 09:20",
    resolvedAt: "2026-11-24 11:00",
    resolutionPhoto: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    assignedTeam: "Equipa de Poda (Salomão Shikongo)"
  }
];

// 5. Frota e Meios de Trabalho
export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: "VEH-01",
    plate: "LD-84-21-HK",
    model: "Camião Basculante de Recolha 12T",
    type: "camiao_basculante",
    ownership: "alugada",
    status: "em_rota",
    fuelLevelPercent: 78,
    assignedDriver: "José Catata",
    odometerKm: 84320,
    lastMaintenance: "2026-11-10"
  },
  {
    id: "VEH-02",
    plate: "LD-12-90-CZ",
    model: "Carrinha Cabine Dupla de Apoio e Ferramentas",
    type: "carrinha_apoio",
    ownership: "alugada",
    status: "operacional",
    fuelLevelPercent: 62,
    assignedDriver: "Dione Cristóvão",
    odometerKm: 142100,
    lastMaintenance: "2026-11-05"
  },
  // Pretensão Futura de Mecanização (Constante da Proposta Técnica)
  {
    id: "VEH-MEC-01",
    plate: "[Pretensão - Fase 2]",
    model: "Varredora Compacta Sinotruk HOWO 4x2",
    type: "camiao_basculante",
    ownership: "pretensao_mecanizacao",
    status: "parada",
    fuelLevelPercent: 100,
    assignedDriver: "A contratar na fase 2",
    odometerKm: 0,
    lastMaintenance: "Planeamento Técnico"
  }
];
