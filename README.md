# OMBALA KISUL — Website Institucional e Plataforma de Gestão

Plataforma modular e website institucional desenvolvidos para a **OMBALA KISUL — LDA**, empresa de saneamento básico, limpeza urbana e gestão de resíduos sólidos sediada em **Ondjiva, Município de Cuanhama, Província do Cunene, Angola**.

---

## 1. Dados Institucionais e Reconciliação Documental

| Parâmetro | Detalhe Oficial | Estado / Nota de Governança |
| :--- | :--- | :--- |
| **Denominação Jurídica** | OMBALA KISUL — LDA | NIF: **5000597244** |
| **Gerente / CEO** | Edir Jorge Muluta Pacelli | Acompanhamento diário em campo |
| **Sede Operacional** | Ondjiva, Bairro Cunhama, Cunene | Casco Urbano de Ondjiva |
| **Expansão Prevista** | Municípios de Ombadja e Namacunde | Sujeito a aprovação das respetivas Administrações |
| **Domínio Oficial** | `www.ombalakisul.com` (com alias `ombalakisul.co.ao`) | Em fase de ativação e registo |
| **Contactos Oficiais** | Tel: `+244 927 855 626`<br>Email: `geral@ombalakisul.com` | Contacto institucional verificado |
| **Licenciamento ANR** | Pedido formal remetido em Luanda a 19/11/2026 | **Pedido em Análise** (não anunciado como emitido) |
| **Reconciliação do Efetivo** | Folha indica 33; linhas descritas somam 32 | **1 Vaga em Reconciliação** (EMP-033) auditada pelo sistema |
| **Cenário Financeiro** | 174.500.000 Kz/ano (14.541.667 Kz/mês) | **Classificado como Previsão Orçamental** |
| **Reserva Recomendada** | 6.525.000 Kz (1 mês de salários e encargos) | Proteção de tesouraria contra atrasos de pagamento |

---

## 2. Identidade Visual e Ativos Gráficos

- **Cores Principais:** Vermelho Institucional (`#A61413` / `#7D0E0D`) e Branco puro.
- **Símbolo «OK»:** Extraído fielmente e preservado em alta resolução a partir dos documentos oficiais (`public/logo.png`), integrando o desenho tradicional do telhado (Ombala) com o símbolo de aprovação e qualidade urbana.
- **Fotografia do CEO:** Retrato de Edir Jorge Muluta Pacelli devidamente enquadrado e tratado (`public/ceo.jpg`) em destaque na página institucional.
- **Uniformes e Meios:** Representação visual dos 58 conjuntos polo/calça vermelha, 35 coletes refletores respiráveis, 35 bonés bordados e 15 carros de mão personalizados «OMBALA KISUL - ONDJIVA LIMPA».

---

## 3. Arquitetura da Solução

O projeto foi construído com uma arquitetura moderna, responsiva e acessível (WCAG 2.2 AA):
- **Framework:** Next.js 14+ (App Router)
- **Linguagem:** TypeScript com tipagem estrita
- **Estilos:** Tailwind CSS com sistema de tokens de cor e modo de movimento reduzido
- **Ícones:** Lucide React
- **PWA / Offline:** Fila de sincronização local resiliente com suporte a identificadores únicos (UUID) e recuperação automática de ligação
- **Mapa:** Mapa vetorial interativo de Ondjiva focado nos bairros de intervenção (Naipalala, Castilhos, Kafitu, Bangula, Centro Urbano / Praça da Paz, Mercados da Alemanha e Oshatotwa).

---

## 4. Os 11 Módulos da Plataforma de Gestão

1. **Painel da Direção:** Métricas executivas em tempo real (frentes ativas, trabalhos aguardando validação, presenças, saldos e alertas).
2. **Operações e Mapa:** Ciclo de vida completo (`planeado` → `atribuido` → `em_execucao` → `aguardar_validacao` → `concluido` → `suspenso` → `reaberto`), fotografias georreferenciadas antes/depois, registo de viagens e descargas exclusivas na Lixeira Oficial Municipal de Cuanhama.
3. **Funcionários, Presenças e RH:** Reconciliação auditada de 33 vs 32 trabalhadores, marcação de presenças, controlo de turnos (06h00–12h00), entrega de EPIs e política transparente de atividade em computador (sem invasão de privacidade ou keyloggers).
4. **Finanças e Fluxo de Caixa:** Separação entre Contratado, Faturado e Recebido Efetivo; provisão salarial, centros de custo, aprovação de despesas e comprovativos de abastecimento Sonangol Ondjiva.
5. **Documentos e Modelos Institucionais:** Emissão de ofícios à Administração Municipal do Cuanhama, propostas e modelos com carimbos inequívocos de «RASCUNHO» ou «PRÓ-FORMA».
6. **Clientes e Contratos:** Acompanhamento do contrato de saneamento de Cuanhama, níveis de serviço (SLA) e metas de resíduos.
7. **Munícipes, QR Code e SMS:** Triagem de reclamações com geração de protocolo público de consulta (ex: `OK-CND-2026-0841`) sem expor dados pessoais.
8. **Frota, Equipamentos e Meios:** Gestão do camião basculante, carrinha de apoio, ferramentas manuais e plano de mecanização futura (Varredora compacta HOWO 4x2 e mini-varredoras).
9. **Relatórios:** Gerador de relatórios mensais municipais com gráficos, fotos de antes/depois e tonelagens recolhidas pronto para exportação/impressão.
10. **Assistente de IA:** Assistente em língua portuguesa com comandos naturais auditados, validação de permissões e solicitação de confirmação explícita antes de qualquer alteração de dados.
11. **Permissões e Auditoria:** RBAC granular por módulo + ação + âmbito, suporte a autenticação Google Workspace com validação de domínio no servidor (`hd=ombalakisul.co.ao`) e histórico de auditoria imutável.

---

## 5. Como Executar Localmente

```bash
# 1. Instalar dependências (já instaladas)
npm install

# 2. Executar em modo de desenvolvimento
npm run dev
# Abrir http://localhost:3000 no navegador

# 3. Compilar para produção
npm run build

# 4. Iniciar servidor de produção
npm start
```

---

## 6. Publicação no Render («Ligação Prevista»)

Para publicar no **Render** (Web Service):
1. Conectar o repositório GitHub da OMBALA KISUL ao Render.
2. Definir:
   - **Environment:** `Node`
   - **Build Command:** `export BROWSERSLIST_CONFIG=".browserslistrc" && npm run build`
   - **Start Command:** `npm start`
3. Variáveis de ambiente:
   - `NODE_ENV=production`
   - `TZ=Africa/Luanda`
   - `NEXT_PUBLIC_APP_DOMAIN=ombalakisul.co.ao`
4. Configurar armazenamento de objetos persistente (Render Disks ou bucket S3/R2 compatível) para salvaguarda de fotografias e comprovativos fora do sistema de ficheiros efémero.
