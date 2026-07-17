<div align="center">

# Backlog de Entrega - Task Management System

### Teste prático - Desenvolvedor Python (Back-end)

**213 tarefas rastreáveis | 24 épicos | estimativa indicativa total: 179,25 h**

</div>

> Este backlog cobre o projeto de ponta a ponta: planejamento, backend, frontend, autenticação, banco, integração externa, mensageria, segurança, observabilidade, testes, Docker, CI/CD, AWS, documentação e entrega. As estimativas são indicativas e devem ser recalibradas conforme o progresso real.
>
> **Aviso de capacidade:** o backlog completo é maior que a janela de cinco dias e não representa um compromisso de executar tudo. Use as prioridades, o plano de corte e os quality gates para proteger primeiro a pontuação obrigatória e uma entrega estável.

> **Atualização de execução local (2026-07-17):** o núcleo obrigatório fora da AWS foi implementado e validado em Docker. A autenticação local substitui a dependência de Cognito para desenvolvimento, avaliação e testes; Cognito, deploy AWS, publicação pública, release e envio final continuam deliberadamente pendentes.

### Estado verificável desta rodada

- [x] Backend DRF com cadastro, login, logout, troca e recuperação de senha por e-mail local.
- [x] CRUD de tarefas/categorias, conclusão/reabertura, filtros de prioridade e prazo, paginação e exclusão lógica.
- [x] Compartilhamento com aceite/recusa, papéis `owner`, `editor` e `viewer`, e exclusão restrita ao proprietário.
- [x] Auditoria com valores JSON serializáveis e testes de sucesso/falha da BrasilAPI.
- [x] Interface React autenticada com permissões, filtros, CRUD e recuperação de senha.
- [x] Pytest com 13 testes e 88,56% de cobertura local.
- [x] Vitest, lint, build e Selenium com jornada de autenticação, tarefas e compartilhamento.
- [x] CI com `pip-audit`, `npm audit`, cobertura mínima de 80% e execução E2E.
- [ ] Cognito/Google, SQS/Lambda/SES, ECS, RDS, Amplify, CloudWatch e Terraform.
- [ ] URLs públicas, tag/release e e-mail de entrega.

## 1. Objetivo e estratégia de execução

A entrega deve priorizar uma solução **simples, funcional, segura e demonstrável**. O projeto usa monólito modular, serviços gerenciados da AWS e automação somente onde produz valor real. O backlog separa o trabalho em três níveis:

- **P0:** requisito obrigatório ou controle crítico da solução alvo.
- **P1:** diferencial de maturidade; executar somente após o núcleo funcional estar estável.
- **P2:** acabamento ou evolução; somente com folga real.

### Regra de corte

1. Nenhuma tarefa P1 ou P2 deve atrasar uma tarefa P0.
2. O frontend pode ser visualmente simples, mas todos os fluxos obrigatórios precisam funcionar.
3. AWS avançado, Terraform, dashboards e GIF são diferenciais; Docker, DRF, React, Pytest, Selenium, CI/CD e README são requisitos centrais.
4. A última janela de trabalho deve ser reservada para clone limpo, testes, revisão de segredos, documentação e envio.

## 2. Plano intensivo sugerido para cinco dias

| Dia | Foco principal | Saída mínima do dia |
|---|---|---|
| **Dia 1** | Planejamento, repositório, Docker, Django, models e migrations | Ambiente sobe; banco e API base funcionam |
| **Dia 2** | Cognito/JWT, categorias, tarefas, filtros e compartilhamento | Backend funcional e testável via Swagger |
| **Dia 3** | React, autenticação, CRUD, filtros, paginação e convites | Fluxo obrigatório utilizável no navegador |
| **Dia 4** | Pytest, Selenium, BrasilAPI, SQS/Lambda/SES e segurança | Testes críticos verdes e diferencial assíncrono validado |
| **Dia 5** | CI/CD, deploy AWS, observabilidade, documentação e entrega | URLs públicas, clone limpo, release e e-mail enviados |

> **Checkpoint obrigatório:** ao final de cada dia, main deve permanecer executável. Não deixe integração para o último dia.

## 3. Caminho crítico

`Escopo -> Repositório -> Docker -> Django -> Models/Migrations -> Auth local/JWT -> CRUD -> Filtros/Paginação -> Compartilhamento -> React -> Testes -> CI/CD -> README -> AWS/Entrega`

## 4. Resumo por épico

| Épico | Área | Tarefas | P0 | P1 | P2 |
|---|---|---:|---:|---:|---:|
| E00 | Planejamento, escopo e governança | 8 | 3,5 h | 1,25 h | 0 h |
| E01 | Repositório e baseline de engenharia | 8 | 3,25 h | 0,75 h | 0,5 h |
| E02 | Arquitetura, modelagem e contratos | 8 | 6,5 h | 2 h | 0 h |
| E03 | Ambiente local, Docker e experiência de desenvolvimento | 7 | 5,25 h | 1 h | 0 h |
| E04 | Fundação do backend Django REST Framework | 9 | 7,25 h | 0 h | 0 h |
| E05 | Persistência, models e migrations | 10 | 6,75 h | 1,5 h | 0 h |
| E06 | Autenticação local, Cognito opcional e OAuth/OIDC | 10 | 7,5 h | 1,75 h | 0 h |
| E07 | Categorias | 5 | 3,25 h | 0 h | 0 h |
| E08 | CRUD e ciclo de vida de tarefas | 10 | 7 h | 1 h | 1 h |
| E09 | Busca, filtros, ordenação e paginação | 7 | 3,75 h | 1 h | 0 h |
| E10 | Compartilhamento, convites e autorização por objeto | 9 | 8,25 h | 0,75 h | 0 h |
| E11 | Integração externa com BrasilAPI | 7 | 3,75 h | 1 h | 0 h |
| E12 | Mensageria, Lambda e notificações por e-mail | 11 | 7 h | 2,75 h | 0 h |
| E13 | Fundação do frontend e autenticação | 9 | 6 h | 1,75 h | 0 h |
| E14 | Frontend de tarefas e categorias | 8 | 4,75 h | 2,25 h | 0 h |
| E15 | Frontend de filtros, paginação e compartilhamento | 8 | 5,25 h | 0,5 h | 0 h |
| E16 | Testes automatizados do backend | 9 | 9,25 h | 0,5 h | 0 h |
| E17 | Testes do frontend e Selenium | 9 | 7 h | 2 h | 0 h |
| E18 | Segurança e hardening | 10 | 6 h | 1,75 h | 0 h |
| E19 | Observabilidade e operação | 8 | 2 h | 4 h | 0 h |
| E20 | CI/CD e automação de qualidade | 10 | 4,5 h | 3,5 h | 0 h |
| E21 | Infraestrutura e deploy AWS | 13 | 0 h | 10,25 h | 4 h |
| E22 | Documentação técnica e experiência da banca | 9 | 5,25 h | 1,75 h | 0 h |
| E23 | Validação final, release e entrega | 11 | 6,25 h | 0,5 h | 1 h |
| **Total** | **Projeto completo** | **213** | **129,25 h** | **43,5 h** | **6,5 h** |

<div class="page-break"></div>

## 5. Backlog detalhado

### E00 - Planejamento, escopo e governança

**Objetivo:** Transformar o enunciado da banca em um plano executável, com prioridades, critérios de aceite e risco controlado.

**Critério de saída do épico:** Escopo congelado, quadro criado, riscos conhecidos e plano de cinco dias aprovado.

- [ ] **BKL-001 - Consolidar todos os requisitos obrigatórios e opcionais da atividade**  
  `P0` `Responsável: Produto` `Estimativa: 0,5 h` `Dependências: -`  
  **Entrega:** Matriz única de requisitos funcionais, técnicos e de entrega.  
  **Aceite:** Nenhum requisito do enunciado fica sem rastreabilidade.
- [ ] **BKL-002 - Definir o escopo P0, P1 e P2**  
  `P0` `Responsável: Produto` `Estimativa: 0,5 h` `Dependências: BKL-001`  
  **Entrega:** Lista priorizada: obrigatório, diferencial e stretch.  
  **Aceite:** O núcleo obrigatório fica claramente identificado e o corte preserva a pontuação da banca.
- [ ] **BKL-003 - Definir critérios de aceite por requisito**  
  `P0` `Responsável: Produto/QA` `Estimativa: 1 h` `Dependências: BKL-001`  
  **Entrega:** Critérios objetivos para CRUD, categorias, compartilhamento, login, filtros, paginação, testes e deploy.  
  **Aceite:** Cada requisito pode ser validado por teste automatizado ou roteiro manual.
- [ ] **BKL-004 - Criar quadro Kanban com colunas Backlog, Ready, Doing, Review e Done**  
  `P0` `Responsável: Gestão` `Estimativa: 0,5 h` `Dependências: BKL-002`  
  **Entrega:** Quadro no GitHub Projects ou Issues.  
  **Aceite:** Todas as tarefas deste documento estão rastreáveis no quadro.
- [ ] **BKL-005 - Definir convenção de branches, commits e pull requests**  
  `P0` `Responsável: Gestão` `Estimativa: 0,5 h` `Dependências: BKL-004`  
  **Entrega:** Convenção documentada no repositório.  
  **Aceite:** Commits são pequenos, semânticos e revisáveis.
- [ ] **BKL-006 - Montar plano intensivo dos cinco dias**  
  `P0` `Responsável: Gestão` `Estimativa: 0,5 h` `Dependências: BKL-002`  
  **Entrega:** Agenda por dia, com checkpoints e margem de contingência.  
  **Aceite:** O último dia reserva tempo para QA, documentação e entrega.
- [ ] **BKL-007 - Registrar riscos e plano de mitigação**  
  `P1` `Responsável: Gestão` `Estimativa: 0,75 h` `Dependências: BKL-002`  
  **Entrega:** Registro de riscos: Cognito, SES sandbox, AWS, Selenium, deploy e tempo.  
  **Aceite:** Cada risco crítico possui alternativa prática.
- [ ] **BKL-008 - Definir roteiro da demonstração final**  
  `P1` `Responsável: Produto` `Estimativa: 0,5 h` `Dependências: BKL-003`  
  **Entrega:** Roteiro de 5 a 8 minutos com fluxo principal e diferenciais.  
  **Aceite:** A demo cobre todos os pontos da banca sem depender de improviso.

### E01 - Repositório e baseline de engenharia

**Objetivo:** Criar uma base organizada, reproduzível e segura antes do desenvolvimento funcional.

**Critério de saída do épico:** Monorepo público organizado, padrões de código ativos e ambiente configurável sem segredos versionados.

- [ ] **BKL-009 - Criar monorepo com backend, frontend, infra, docs e workflows**  
  `P0` `Responsável: Dev` `Estimativa: 0,5 h` `Dependências: BKL-005`  
  **Entrega:** Estrutura inicial do repositório.  
  **Aceite:** Pastas refletem as responsabilidades descritas no README.
- [ ] **BKL-010 - Configurar .gitignore, .editorconfig e arquivos de fim de linha**  
  `P0` `Responsável: Dev` `Estimativa: 0,25 h` `Dependências: BKL-009`  
  **Entrega:** Arquivos de configuração na raiz.  
  **Aceite:** Ambientes locais não geram arquivos indevidos no Git.
- [ ] **BKL-011 - Criar .env.example completo e sem credenciais reais**  
  `P0` `Responsável: DevOps` `Estimativa: 0,5 h` `Dependências: BKL-009`  
  **Entrega:** Modelo de variáveis para backend, frontend e AWS.  
  **Aceite:** Um novo colaborador entende quais variáveis precisa configurar.
- [ ] **BKL-012 - Fixar versões de Python, Node e dependências principais**  
  `P0` `Responsável: Dev` `Estimativa: 0,5 h` `Dependências: BKL-009`  
  **Entrega:** Arquivos de versão e lockfiles.  
  **Aceite:** Builds locais e do CI usam versões equivalentes.
- [ ] **BKL-013 - Configurar Ruff, formatação, lint do frontend e pre-commit**  
  `P0` `Responsável: Dev` `Estimativa: 1 h` `Dependências: BKL-012`  
  **Entrega:** Ferramentas de qualidade configuradas.  
  **Aceite:** Código fora do padrão falha localmente e no pipeline.
- [ ] **BKL-014 - Criar Makefile ou scripts para comandos recorrentes**  
  `P1` `Responsável: DevEx` `Estimativa: 0,75 h` `Dependências: BKL-009`  
  **Entrega:** Comandos como setup, up, test, lint, migrate e seed.  
  **Aceite:** Operações comuns exigem um comando curto e documentado.
- [ ] **BKL-015 - Configurar templates de issue e pull request**  
  `P2` `Responsável: Gestão` `Estimativa: 0,5 h` `Dependências: BKL-004`  
  **Entrega:** Templates com checklist de testes e segurança.  
  **Aceite:** Novas mudanças seguem o mesmo padrão de revisão.
- [ ] **BKL-016 - Validar que o repositório está público e sem segredos no histórico**  
  `P0` `Responsável: Segurança` `Estimativa: 0,5 h` `Dependências: BKL-011`  
  **Entrega:** Repositório acessível e histórico verificado.  
  **Aceite:** Ferramenta de secret scanning não encontra credenciais.

### E02 - Arquitetura, modelagem e contratos

**Objetivo:** Garantir que implementação, banco, APIs e infraestrutura estejam coerentes com uma arquitetura simples e madura.

**Critério de saída do épico:** Decisões, modelos, contratos e diagramas estão alinhados e versionados.

- [ ] **BKL-017 - Revisar a arquitetura de monólito modular e seus limites**  
  `P0` `Responsável: Arquitetura` `Estimativa: 0,75 h` `Dependências: BKL-002`  
  **Entrega:** Descrição das camadas e módulos.  
  **Aceite:** Nenhuma dependência viola o sentido das camadas definido.
- [ ] **BKL-018 - Registrar decisões arquiteturais em ADRs curtos**  
  `P1` `Responsável: Arquitetura` `Estimativa: 1 h` `Dependências: BKL-017`  
  **Entrega:** ADRs para Cognito, PostgreSQL, SQS/Lambda, CloudWatch e ausência de Redis/Kafka.  
  **Aceite:** Cada escolha possui contexto, decisão e trade-off.
- [ ] **BKL-019 - Validar C4 C1, C2 e C3**  
  `P0` `Responsável: Arquitetura` `Estimativa: 1 h` `Dependências: BKL-017`  
  **Entrega:** Diagramas C4 atualizados no README/docs.  
  **Aceite:** Todos os serviços realmente usados aparecem uma única vez e com relações corretas.
- [ ] **BKL-020 - Validar os seis diagramas de sequência**  
  `P0` `Responsável: Arquitetura` `Estimativa: 1,5 h` `Dependências: BKL-017`  
  **Entrega:** Fluxos de autenticação, tarefas, compartilhamento, convite, listagem e conclusão.  
  **Aceite:** Caminhos de sucesso e falha relevantes estão representados.
- [ ] **BKL-021 - Revisar diagrama de classes, DER/MER, MR e ORM**  
  `P0` `Responsável: Dados` `Estimativa: 1,5 h` `Dependências: BKL-017`  
  **Entrega:** Modelagem coerente com os models Django.  
  **Aceite:** Chaves, cardinalidades, constraints e nomes coincidem com a implementação.
- [ ] **BKL-022 - Definir contrato OpenAPI inicial da API v1**  
  `P0` `Responsável: Backend` `Estimativa: 1 h` `Dependências: BKL-003`  
  **Entrega:** Endpoints, schemas, códigos HTTP e erros.  
  **Aceite:** Frontend pode ser desenvolvido sem depender da implementação completa.
- [ ] **BKL-023 - Criar matriz de autorização por objeto**  
  `P0` `Responsável: Segurança` `Estimativa: 0,75 h` `Dependências: BKL-003`  
  **Entrega:** Ações permitidas para owner, editor e viewer.  
  **Aceite:** Toda operação sensível possui regra explícita.
- [ ] **BKL-024 - Criar modelo de ameaças simplificado**  
  `P1` `Responsável: Segurança` `Estimativa: 1 h` `Dependências: BKL-023`  
  **Entrega:** Ameaças principais e controles: token, IDOR, injeção, CORS, segredos e abuso.  
  **Aceite:** Controles críticos viram tarefas técnicas rastreáveis.

### E03 - Ambiente local, Docker e experiência de desenvolvimento

**Objetivo:** Permitir que a banca execute a solução com o mínimo de passos e sem configuração manual frágil.

**Critério de saída do épico:** Aplicação sobe por Docker Compose, possui health checks e funciona a partir de um clone limpo.

- [ ] **BKL-025 - Criar Dockerfile do backend**  
  `P0` `Responsável: DevOps` `Estimativa: 1 h` `Dependências: BKL-012`  
  **Entrega:** Imagem Python enxuta com usuário não root.  
  **Aceite:** Container inicia a API e não incorpora segredos.
- [ ] **BKL-026 - Criar Dockerfile do frontend**  
  `P0` `Responsável: DevOps` `Estimativa: 1 h` `Dependências: BKL-012`  
  **Entrega:** Imagem para desenvolvimento e build validado.  
  **Aceite:** Frontend compila e inicia de forma reproduzível.
- [ ] **BKL-027 - Criar docker-compose com backend, frontend e PostgreSQL**  
  `P0` `Responsável: DevOps` `Estimativa: 1,5 h` `Dependências: BKL-025,BKL-026`  
  **Entrega:** Ambiente integrado local.  
  **Aceite:** docker compose up --build inicia todos os serviços.
- [ ] **BKL-028 - Configurar volume persistente e health check do PostgreSQL**  
  `P0` `Responsável: DevOps` `Estimativa: 0,5 h` `Dependências: BKL-027`  
  **Entrega:** Banco preserva dados e expõe estado de saúde.  
  **Aceite:** Backend só inicia quando o banco estiver pronto.
- [ ] **BKL-029 - Criar script de entrypoint para migrations e inicialização segura**  
  `P0` `Responsável: DevOps` `Estimativa: 0,75 h` `Dependências: BKL-027`  
  **Entrega:** Entrypoint idempotente.  
  **Aceite:** Reiniciar o container não quebra o banco nem duplica dados.
- [ ] **BKL-030 - Criar comando de seed para dados de demonstração**  
  `P1` `Responsável: Backend` `Estimativa: 1 h` `Dependências: BKL-055`  
  **Entrega:** Usuários e dados de exemplo documentados.  
  **Aceite:** Demo pode ser preparada de forma repetível.
- [ ] **BKL-031 - Criar comandos de smoke test do ambiente local**  
  `P0` `Responsável: QA` `Estimativa: 0,5 h` `Dependências: BKL-027`  
  **Entrega:** Verificação automática de frontend, API e banco.  
  **Aceite:** Falhas básicas de inicialização são detectadas em menos de um minuto.

### E04 - Fundação do backend Django REST Framework

**Objetivo:** Estabelecer uma API versionada, observável e consistente antes dos casos de uso.

**Critério de saída do épico:** Projeto Django inicia, expõe documentação, health checks e padrão único de erros.

- [ ] **BKL-032 - Criar projeto Django e apps modulares**  
  `P0` `Responsável: Backend` `Estimativa: 1 h` `Dependências: BKL-009`  
  **Entrega:** Apps accounts, tasks, categories, sharing, audit e integrations.  
  **Aceite:** Importações entre módulos respeitam a arquitetura definida.
- [ ] **BKL-033 - Separar configurações por ambiente**  
  `P0` `Responsável: Backend` `Estimativa: 0,75 h` `Dependências: BKL-032`  
  **Entrega:** Settings base, local, test e production.  
  **Aceite:** DEBUG, hosts, CORS e banco variam sem alterar código.
- [ ] **BKL-034 - Configurar Django REST Framework e API v1**  
  `P0` `Responsável: Backend` `Estimativa: 0,75 h` `Dependências: BKL-032`  
  **Entrega:** URLs versionadas e defaults do DRF.  
  **Aceite:** Todos os endpoints ficam sob /api/v1.
- [ ] **BKL-035 - Configurar Swagger/OpenAPI**  
  `P0` `Responsável: Backend` `Estimativa: 0,75 h` `Dependências: BKL-034,BKL-022`  
  **Entrega:** Documentação navegável da API.  
  **Aceite:** Schemas e exemplos básicos aparecem corretamente.
- [ ] **BKL-036 - Implementar tratamento padronizado de erros**  
  `P0` `Responsável: Backend` `Estimativa: 1 h` `Dependências: BKL-034`  
  **Entrega:** Envelope com code, message, request_id e details.  
  **Aceite:** Erros de validação, autenticação e domínio seguem o mesmo formato.
- [ ] **BKL-037 - Implementar middleware de request_id**  
  `P0` `Responsável: Observabilidade` `Estimativa: 0,75 h` `Dependências: BKL-034`  
  **Entrega:** Identificador por requisição propagado em resposta e logs.  
  **Aceite:** Uma requisição pode ser rastreada ponta a ponta.
- [ ] **BKL-038 - Implementar endpoints health e readiness**  
  `P0` `Responsável: Backend` `Estimativa: 0,75 h` `Dependências: BKL-034`  
  **Entrega:** Health simples e readiness com banco.  
  **Aceite:** Orquestrador distingue processo ativo de dependências indisponíveis.
- [ ] **BKL-039 - Configurar paginação padrão e limites de page_size**  
  `P0` `Responsável: Backend` `Estimativa: 0,5 h` `Dependências: BKL-034`  
  **Entrega:** Paginação global do DRF.  
  **Aceite:** Cliente não consegue solicitar páginas excessivamente grandes.
- [ ] **BKL-040 - Configurar logging estruturado inicial**  
  `P0` `Responsável: Observabilidade` `Estimativa: 1 h` `Dependências: BKL-037`  
  **Entrega:** Logs JSON com request_id, nível, rota e duração.  
  **Aceite:** Logs não expõem tokens ou senhas.

### E05 - Persistência, models e migrations

**Objetivo:** Implementar um modelo relacional consistente, indexado e protegido por constraints.

**Critério de saída do épico:** Models e migrations representam o domínio e passam nos testes de integridade.

- [ ] **BKL-041 - Implementar UserAccount sincronizado ao Cognito**  
  `P0` `Responsável: Backend` `Estimativa: 0,75 h` `Dependências: BKL-032`  
  **Entrega:** Model local sem armazenamento de senha.  
  **Aceite:** cognito_sub e email são únicos.
- [ ] **BKL-042 - Implementar Category com propriedade por usuário**  
  `P0` `Responsável: Backend` `Estimativa: 0,75 h` `Dependências: BKL-041`  
  **Entrega:** Model e constraint owner+name.  
  **Aceite:** Usuário não cria categorias duplicadas para si.
- [ ] **BKL-043 - Implementar Task com status, prioridade, prazo e versionamento**  
  `P0` `Responsável: Backend` `Estimativa: 1,25 h` `Dependências: BKL-041,BKL-042`  
  **Entrega:** Model Task completo.  
  **Aceite:** Campos e choices coincidem com o contrato e o modelo relacional.
- [ ] **BKL-044 - Implementar soft delete para Task**  
  `P0` `Responsável: Backend` `Estimativa: 0,75 h` `Dependências: BKL-043`  
  **Entrega:** deleted_at e manager/queryset apropriado.  
  **Aceite:** Registros apagados não aparecem por padrão e permanecem auditáveis.
- [ ] **BKL-045 - Implementar TaskShare com permissão e status do convite**  
  `P0` `Responsável: Backend` `Estimativa: 1 h` `Dependências: BKL-041,BKL-043`  
  **Entrega:** Model e unicidade task+shared_with.  
  **Aceite:** Convites duplicados são bloqueados no banco.
- [ ] **BKL-046 - Implementar AuditLog**  
  `P1` `Responsável: Backend` `Estimativa: 0,75 h` `Dependências: BKL-041,BKL-043`  
  **Entrega:** Model de eventos de domínio relevantes.  
  **Aceite:** Criação, edição, conclusão, compartilhamento e exclusão podem ser rastreadas.
- [ ] **BKL-047 - Implementar ProcessedEvent para idempotência assíncrona**  
  `P1` `Responsável: Backend` `Estimativa: 0,75 h` `Dependências: BKL-041`  
  **Entrega:** Registro único por event_id.  
  **Aceite:** Reprocessamento não envia o mesmo e-mail duas vezes.
- [ ] **BKL-048 - Adicionar índices e constraints do modelo relacional**  
  `P0` `Responsável: Dados` `Estimativa: 1 h` `Dependências: BKL-042,BKL-043,BKL-045`  
  **Entrega:** Índices por owner, status, category, due_at e relacionamentos.  
  **Aceite:** Consultas principais usam índices e regras inválidas falham no banco.
- [ ] **BKL-049 - Gerar e revisar migrations iniciais**  
  `P0` `Responsável: Dados` `Estimativa: 0,75 h` `Dependências: BKL-041,BKL-048`  
  **Entrega:** Migrations versionadas.  
  **Aceite:** Banco vazio é criado sem intervenção manual.
- [ ] **BKL-050 - Testar upgrade de migrations em banco limpo**  
  `P0` `Responsável: QA` `Estimativa: 0,5 h` `Dependências: BKL-049`  
  **Entrega:** Teste local/CI de migrations.  
  **Aceite:** Nenhuma migration depende de estado manual.

### E06 - Autenticação Cognito, OAuth/OIDC e conta local

**Objetivo:** Delegar identidade ao Cognito e garantir validação robusta de tokens no backend.

**Critério de saída do épico:** Login por e-mail/senha e Google funciona por Authorization Code + PKCE; API rejeita tokens inválidos.

- [ ] **BKL-051 - Criar Cognito User Pool e domínio de Managed Login**  
  `P0` `Responsável: AWS/Segurança` `Estimativa: 1 h` `Dependências: BKL-018`  
  **Entrega:** User Pool e domínio configurados.  
  **Aceite:** Cadastro, confirmação e recuperação de senha são gerenciados pelo Cognito.
- [ ] **BKL-052 - Configurar App Client público com Authorization Code + PKCE**  
  `P0` `Responsável: AWS/Segurança` `Estimativa: 0,75 h` `Dependências: BKL-051`  
  **Entrega:** App Client sem client secret.  
  **Aceite:** Implicit flow está desativado e callbacks são restritos.
- [ ] **BKL-053 - Configurar provedor Google OIDC no Cognito**  
  `P1` `Responsável: AWS/Segurança` `Estimativa: 1 h` `Dependências: BKL-051`  
  **Entrega:** Google Identity integrado.  
  **Aceite:** Usuário consegue autenticar via Google no ambiente publicado.
- [ ] **BKL-054 - Implementar autenticação JWT no DRF**  
  `P0` `Responsável: Backend/Segurança` `Estimativa: 1,5 h` `Dependências: BKL-052,BKL-034`  
  **Entrega:** Classe de autenticação Cognito.  
  **Aceite:** Access Token válido cria request.user; token inválido retorna 401.
- [ ] **BKL-055 - Implementar cache seguro das chaves JWKS**  
  `P0` `Responsável: Backend/Segurança` `Estimativa: 0,75 h` `Dependências: BKL-054`  
  **Entrega:** JWKS cacheado com expiração e renovação.  
  **Aceite:** API não consulta o Cognito a cada requisição.
- [ ] **BKL-056 - Validar assinatura, exp, iss, client_id e token_use**  
  `P0` `Responsável: Backend/Segurança` `Estimativa: 1 h` `Dependências: BKL-054`  
  **Entrega:** Validações completas de claims.  
  **Aceite:** ID Token ou token de outro pool/client é rejeitado.
- [ ] **BKL-057 - Sincronizar usuário Cognito com UserAccount local**  
  `P0` `Responsável: Backend` `Estimativa: 1 h` `Dependências: BKL-041,BKL-054`  
  **Entrega:** Criação/atualização just-in-time do usuário local.  
  **Aceite:** Primeiro acesso cria a conta sem armazenar senha.
- [ ] **BKL-058 - Configurar logout e revogação/rotação de refresh token**  
  `P1` `Responsável: Frontend/Segurança` `Estimativa: 0,75 h` `Dependências: BKL-052`  
  **Entrega:** Logout do Cognito e configuração de rotação.  
  **Aceite:** Sessão renovável termina corretamente no logout.
- [ ] **BKL-059 - Testar tokens expirados, adulterados e de issuer incorreto**  
  `P0` `Responsável: QA/Segurança` `Estimativa: 1 h` `Dependências: BKL-056`  
  **Entrega:** Suíte de testes de autenticação.  
  **Aceite:** Cenários negativos retornam 401 sem detalhes sensíveis.
- [ ] **BKL-060 - Documentar callbacks locais e de produção**  
  `P0` `Responsável: Docs` `Estimativa: 0,5 h` `Dependências: BKL-052`  
  **Entrega:** URLs autorizadas no README/.env.example.  
  **Aceite:** Ambientes não usam wildcard de callback.

### E07 - Categorias

**Objetivo:** Entregar organização de tarefas por categorias com isolamento entre usuários.

**Critério de saída do épico:** CRUD de categorias funciona e nenhuma categoria de outro usuário pode ser lida ou associada.

- [ ] **BKL-061 - Criar serializers de categoria**  
  `P0` `Responsável: Backend` `Estimativa: 0,5 h` `Dependências: BKL-042,BKL-034`  
  **Entrega:** Schemas de entrada e saída.  
  **Aceite:** owner não pode ser informado ou alterado pelo cliente.
- [ ] **BKL-062 - Criar services e selectors de categoria**  
  `P0` `Responsável: Backend` `Estimativa: 0,75 h` `Dependências: BKL-061`  
  **Entrega:** Casos de uso e consultas isoladas.  
  **Aceite:** Consultas sempre aplicam o usuário autenticado.
- [ ] **BKL-063 - Criar ViewSet e rotas de categorias**  
  `P0` `Responsável: Backend` `Estimativa: 0,75 h` `Dependências: BKL-062`  
  **Entrega:** CRUD sob /api/v1/categories/.  
  **Aceite:** Respostas e códigos HTTP seguem o contrato.
- [ ] **BKL-064 - Definir comportamento ao excluir categoria usada**  
  `P0` `Responsável: Produto/Backend` `Estimativa: 0,5 h` `Dependências: BKL-043,BKL-063`  
  **Entrega:** SET_NULL ou bloqueio documentado e implementado.  
  **Aceite:** Tarefas não são apagadas acidentalmente.
- [ ] **BKL-065 - Testar isolamento, duplicidade e exclusão**  
  `P0` `Responsável: QA` `Estimativa: 0,75 h` `Dependências: BKL-063,BKL-064`  
  **Entrega:** Testes de API e domínio.  
  **Aceite:** Usuário não acessa nem referencia categoria alheia.

### E08 - CRUD e ciclo de vida de tarefas

**Objetivo:** Entregar o núcleo funcional da aplicação com regras de domínio claras.

**Critério de saída do épico:** Usuário cria, lê, altera, conclui, reabre e remove logicamente tarefas autorizadas.

- [ ] **BKL-066 - Criar serializers de criação, atualização e leitura de tarefa**  
  `P0` `Responsável: Backend` `Estimativa: 1 h` `Dependências: BKL-043,BKL-034`  
  **Entrega:** Schemas separados quando necessário.  
  **Aceite:** Campos somente leitura não podem ser alterados pelo cliente.
- [ ] **BKL-067 - Implementar TaskService para criar e atualizar tarefas**  
  `P0` `Responsável: Backend` `Estimativa: 1,25 h` `Dependências: BKL-066,BKL-062`  
  **Entrega:** Casos de uso transacionais.  
  **Aceite:** Categoria pertence ao owner e validações de domínio são aplicadas.
- [ ] **BKL-068 - Implementar selector de detalhe com escopo de acesso**  
  `P0` `Responsável: Backend` `Estimativa: 0,75 h` `Dependências: BKL-067,BKL-023`  
  **Entrega:** Consulta de tarefa própria ou compartilhada.  
  **Aceite:** IDOR retorna 404/403 conforme política sem vazar existência.
- [ ] **BKL-069 - Criar TaskViewSet e rotas CRUD**  
  `P0` `Responsável: Backend` `Estimativa: 1 h` `Dependências: BKL-067,BKL-068`  
  **Entrega:** Endpoints do contrato disponíveis.  
  **Aceite:** CRUD principal funciona via API documentada.
- [ ] **BKL-070 - Implementar ação complete**  
  `P0` `Responsável: Backend` `Estimativa: 0,5 h` `Dependências: BKL-069`  
  **Entrega:** PATCH /tasks/{id}/complete/.  
  **Aceite:** Status muda para completed e operação é idempotente.
- [ ] **BKL-071 - Implementar ação reopen**  
  `P0` `Responsável: Backend` `Estimativa: 0,5 h` `Dependências: BKL-069`  
  **Entrega:** PATCH /tasks/{id}/reopen/.  
  **Aceite:** Status volta para pending e operação é idempotente.
- [ ] **BKL-072 - Implementar exclusão lógica**  
  `P0` `Responsável: Backend` `Estimativa: 0,5 h` `Dependências: BKL-069,BKL-044`  
  **Entrega:** DELETE atualiza deleted_at.  
  **Aceite:** Tarefa deixa de aparecer sem ser removida fisicamente.
- [ ] **BKL-073 - Registrar auditoria nas alterações críticas**  
  `P1` `Responsável: Backend` `Estimativa: 1 h` `Dependências: BKL-046,BKL-067`  
  **Entrega:** AuditLog criado após operações relevantes.  
  **Aceite:** Ator, ação, alterações e timestamp são registrados.
- [ ] **BKL-074 - Implementar controle otimista por version**  
  `P2` `Responsável: Backend` `Estimativa: 1 h` `Dependências: BKL-043,BKL-067`  
  **Entrega:** Detecção de atualização concorrente.  
  **Aceite:** Atualização com versão antiga retorna conflito 409.
- [ ] **BKL-075 - Testar CRUD, estados, validações e soft delete**  
  `P0` `Responsável: QA` `Estimativa: 1,5 h` `Dependências: BKL-069,BKL-072`  
  **Entrega:** Testes completos do núcleo.  
  **Aceite:** Fluxos felizes e erros de permissão/validação passam.

### E09 - Busca, filtros, ordenação e paginação

**Objetivo:** Atender os requisitos de consulta de forma eficiente e previsível.

**Critério de saída do épico:** Listagem retorna somente tarefas acessíveis e suporta todos os parâmetros documentados.

- [ ] **BKL-076 - Implementar filtro por status e prioridade**  
  `P0` `Responsável: Backend` `Estimativa: 0,5 h` `Dependências: BKL-069`  
  **Entrega:** Filtros DRF/django-filter.  
  **Aceite:** Combinações retornam resultados corretos.
- [ ] **BKL-077 - Implementar filtro por categoria e intervalo de prazo**  
  `P0` `Responsável: Backend` `Estimativa: 0,75 h` `Dependências: BKL-069`  
  **Entrega:** category, due_before e due_after.  
  **Aceite:** Datas inválidas retornam 400 padronizado.
- [ ] **BKL-078 - Implementar busca textual em título e descrição**  
  `P0` `Responsável: Backend` `Estimativa: 0,5 h` `Dependências: BKL-069`  
  **Entrega:** Parâmetro search.  
  **Aceite:** Busca é case-insensitive e respeita o escopo do usuário.
- [ ] **BKL-079 - Implementar ordenação permitida**  
  `P0` `Responsável: Backend` `Estimativa: 0,5 h` `Dependências: BKL-069`  
  **Entrega:** created_at, updated_at, due_at e priority.  
  **Aceite:** Campos não permitidos são ignorados ou rejeitados de forma consistente.
- [ ] **BKL-080 - Aplicar paginação com count, next e previous**  
  `P0` `Responsável: Backend` `Estimativa: 0,5 h` `Dependências: BKL-039,BKL-069`  
  **Entrega:** Resposta paginada do DRF.  
  **Aceite:** page_size respeita limite máximo.
- [ ] **BKL-081 - Otimizar query de tarefas acessíveis**  
  `P1` `Responsável: Dados` `Estimativa: 1 h` `Dependências: BKL-045,BKL-068`  
  **Entrega:** select_related/prefetch e união owner/shared.  
  **Aceite:** Listagem não apresenta N+1 relevante.
- [ ] **BKL-082 - Testar filtros combinados, ordenação e páginas**  
  `P0` `Responsável: QA` `Estimativa: 1 h` `Dependências: BKL-076,BKL-080`  
  **Entrega:** Matriz de testes de listagem.  
  **Aceite:** Todos os parâmetros podem ser combinados sem vazar dados.

### E10 - Compartilhamento, convites e autorização por objeto

**Objetivo:** Permitir colaboração sem comprometer isolamento e propriedade dos dados.

**Critério de saída do épico:** Owner compartilha; destinatário aceita/recusa; viewer/editor recebem apenas as permissões previstas.

- [ ] **BKL-083 - Implementar PermissionPolicy centralizada**  
  `P0` `Responsável: Backend/Segurança` `Estimativa: 1 h` `Dependências: BKL-023,BKL-045`  
  **Entrega:** Métodos can_view, can_edit, can_share e can_delete.  
  **Aceite:** ViewSets não duplicam regras de autorização.
- [ ] **BKL-084 - Implementar criação de convite por e-mail**  
  `P0` `Responsável: Backend` `Estimativa: 1 h` `Dependências: BKL-045,BKL-057,BKL-083`  
  **Entrega:** SharingService.share_task.  
  **Aceite:** Bloqueia auto-compartilhamento, duplicidade e destinatário inexistente conforme regra definida.
- [ ] **BKL-085 - Implementar listagem de convites recebidos**  
  `P0` `Responsável: Backend` `Estimativa: 0,5 h` `Dependências: BKL-084`  
  **Entrega:** GET /shares/.  
  **Aceite:** Usuário vê somente convites destinados a ele.
- [ ] **BKL-086 - Implementar aceite e recusa de convite**  
  `P0` `Responsável: Backend` `Estimativa: 0,75 h` `Dependências: BKL-085`  
  **Entrega:** PATCH /shares/{id}/.  
  **Aceite:** Somente o destinatário altera o status e apenas convites pendentes mudam.
- [ ] **BKL-087 - Implementar remoção de compartilhamento**  
  `P0` `Responsável: Backend` `Estimativa: 0,75 h` `Dependências: BKL-084,BKL-083`  
  **Entrega:** DELETE /shares/{id}/.  
  **Aceite:** Owner remove acesso; destinatário pode sair conforme política.
- [ ] **BKL-088 - Aplicar permissões owner, editor e viewer em todos endpoints**  
  `P0` `Responsável: Backend/Segurança` `Estimativa: 1,5 h` `Dependências: BKL-083,BKL-069`  
  **Entrega:** Permissões por objeto integradas.  
  **Aceite:** Viewer não edita; editor não exclui; owner controla compartilhamento.
- [ ] **BKL-089 - Incluir tarefas compartilhadas na listagem e detalhe**  
  `P0` `Responsável: Backend` `Estimativa: 0,75 h` `Dependências: BKL-045,BKL-068`  
  **Entrega:** Query acessível unificada.  
  **Aceite:** Aceite libera acesso; recusa/remoção revoga acesso.
- [ ] **BKL-090 - Registrar auditoria de convites e permissões**  
  `P1` `Responsável: Backend` `Estimativa: 0,75 h` `Dependências: BKL-046,BKL-084`  
  **Entrega:** Eventos de share, accept, reject e revoke.  
  **Aceite:** Histórico identifica ator, destinatário e permissão.
- [ ] **BKL-091 - Testar matriz completa de autorização e IDOR**  
  `P0` `Responsável: QA/Segurança` `Estimativa: 2 h` `Dependências: BKL-088,BKL-089`  
  **Entrega:** Testes parametrizados por papel e operação.  
  **Aceite:** Nenhuma operação não autorizada retorna sucesso.

### E11 - Integração externa com BrasilAPI

**Objetivo:** Demonstrar integração resiliente sem tornar a API externa um ponto único de falha.

**Critério de saída do épico:** Prazo em feriado gera aviso; timeout/falha não impede salvar a tarefa; testes não usam internet.

- [ ] **BKL-092 - Implementar HolidayClient isolado**  
  `P0` `Responsável: Backend` `Estimativa: 0,75 h` `Dependências: BKL-017`  
  **Entrega:** Adapter HTTP configurável.  
  **Aceite:** Código de domínio não depende diretamente da biblioteca HTTP.
- [ ] **BKL-093 - Implementar consulta de feriados por ano e comparação da data**  
  `P0` `Responsável: Backend` `Estimativa: 0,75 h` `Dependências: BKL-092`  
  **Entrega:** Método is_holiday(date).  
  **Aceite:** Data de vencimento é comparada corretamente com feriados nacionais.
- [ ] **BKL-094 - Configurar timeout curto e fallback**  
  `P0` `Responsável: Backend/Resiliência` `Estimativa: 0,5 h` `Dependências: BKL-092`  
  **Entrega:** Timeout por ambiente e retorno seguro.  
  **Aceite:** Falha externa não cancela a transação da tarefa.
- [ ] **BKL-095 - Adicionar cache em memória por ano**  
  `P1` `Responsável: Backend/Performance` `Estimativa: 0,5 h` `Dependências: BKL-093`  
  **Entrega:** Cache de processo simples.  
  **Aceite:** Chamadas repetidas no mesmo processo não consultam a API novamente durante o TTL.
- [ ] **BKL-096 - Integrar aviso de feriado ao create/update de tarefa**  
  `P0` `Responsável: Backend` `Estimativa: 0,75 h` `Dependências: BKL-067,BKL-093`  
  **Entrega:** Campo/metadata de aviso na resposta.  
  **Aceite:** Frontend recebe informação sem alterar a regra principal de salvamento.
- [ ] **BKL-097 - Adicionar logs e métricas da integração**  
  `P1` `Responsável: Observabilidade` `Estimativa: 0,5 h` `Dependências: BKL-040,BKL-094`  
  **Entrega:** Latência, sucesso, timeout e fallback registrados.  
  **Aceite:** Logs não contêm dados sensíveis.
- [ ] **BKL-098 - Criar testes com mocks para sucesso, timeout e erro**  
  `P0` `Responsável: QA` `Estimativa: 1 h` `Dependências: BKL-096`  
  **Entrega:** Testes determinísticos sem rede.  
  **Aceite:** Suíte passa offline.

### E12 - Mensageria, Lambda e notificações por e-mail

**Objetivo:** Retirar envio de e-mail do tempo de resposta da API e demonstrar retry, DLQ e idempotência.

**Critério de saída do épico:** Compartilhamento publica evento; Lambda consome; SES envia; falhas são reprocessadas e terminam na DLQ.

- [ ] **BKL-099 - Definir contrato versionado do evento TaskShared**  
  `P0` `Responsável: Arquitetura/Backend` `Estimativa: 0,5 h` `Dependências: BKL-084`  
  **Entrega:** Schema com event_id, version, task_id, recipient, permission, request_id e occurred_at.  
  **Aceite:** Publisher e consumidor validam o mesmo contrato.
- [ ] **BKL-100 - Implementar EventPublisher abstrato e adapter SQS**  
  `P0` `Responsável: Backend` `Estimativa: 1 h` `Dependências: BKL-099`  
  **Entrega:** Publisher injetável/testável.  
  **Aceite:** Serviço de compartilhamento não conhece SDK AWS diretamente.
- [ ] **BKL-101 - Publicar evento somente após commit da transação**  
  `P0` `Responsável: Backend` `Estimativa: 0,75 h` `Dependências: BKL-084,BKL-100`  
  **Entrega:** Uso de transaction.on_commit.  
  **Aceite:** Evento não é emitido se a gravação falhar.
- [ ] **BKL-102 - Criar fila SQS e Dead Letter Queue**  
  `P0` `Responsável: AWS` `Estimativa: 0,75 h` `Dependências: BKL-099`  
  **Entrega:** Fila, redrive policy e retenção configuradas.  
  **Aceite:** Mensagem excedendo tentativas é movida para DLQ.
- [ ] **BKL-103 - Implementar handler Lambda para mensagens SQS**  
  `P0` `Responsável: AWS/Backend` `Estimativa: 1,25 h` `Dependências: BKL-102`  
  **Entrega:** Consumidor por lote com partial batch response.  
  **Aceite:** Falha de uma mensagem não força reprocessamento das concluídas.
- [ ] **BKL-104 - Implementar idempotência por event_id**  
  `P1` `Responsável: Backend/Resiliência` `Estimativa: 1 h` `Dependências: BKL-047,BKL-103`  
  **Entrega:** ProcessedEvent verificado em transação.  
  **Aceite:** Evento duplicado não gera e-mail duplicado.
- [ ] **BKL-105 - Criar template de convite no SES**  
  `P0` `Responsável: AWS/Produto` `Estimativa: 0,75 h` `Dependências: BKL-103`  
  **Entrega:** E-mail com remetente, tarefa, permissão e link.  
  **Aceite:** Conteúdo é legível e não expõe dados indevidos.
- [ ] **BKL-106 - Verificar identidade SES e tratar sandbox**  
  `P0` `Responsável: AWS` `Estimativa: 0,5 h` `Dependências: BKL-105`  
  **Entrega:** Remetente verificado e destinatários de demo permitidos.  
  **Aceite:** Fluxo funciona no ambiente usado pela banca.
- [ ] **BKL-107 - Configurar visibility timeout, retries e concorrência**  
  `P1` `Responsável: AWS/Resiliência` `Estimativa: 0,75 h` `Dependências: BKL-102,BKL-103`  
  **Entrega:** Parâmetros coerentes com timeout da Lambda.  
  **Aceite:** Não há loop rápido de falha nem processamento simultâneo indevido.
- [ ] **BKL-108 - Testar publisher e Lambda com eventos válidos, inválidos e duplicados**  
  `P0` `Responsável: QA` `Estimativa: 1,5 h` `Dependências: BKL-100,BKL-103`  
  **Entrega:** Testes unitários com mocks AWS.  
  **Aceite:** Sucesso, retry, DLQ e idempotência são cobertos.
- [ ] **BKL-109 - Executar teste integrado de compartilhamento até o e-mail**  
  `P1` `Responsável: QA` `Estimativa: 1 h` `Dependências: BKL-106,BKL-108`  
  **Entrega:** Evidência de execução no ambiente AWS.  
  **Aceite:** Evento percorre Django, SQS, Lambda e SES com request_id correlacionado.

### E13 - Fundação do frontend e autenticação

**Objetivo:** Criar uma interface React consistente, protegida e integrada ao fluxo Cognito Managed Login.

**Critério de saída do épico:** Usuário entra, retorna ao callback, acessa rotas protegidas, renova sessão e sai.

- [ ] **BKL-110 - Criar projeto React com TypeScript**  
  `P0` `Responsável: Frontend` `Estimativa: 0,75 h` `Dependências: BKL-009`  
  **Entrega:** Projeto Vite/React configurado.  
  **Aceite:** Build e lint executam sem erros.
- [ ] **BKL-111 - Configurar roteamento, providers e layout base**  
  `P0` `Responsável: Frontend` `Estimativa: 0,75 h` `Dependências: BKL-110`  
  **Entrega:** Rotas públicas/protegidas e shell da aplicação.  
  **Aceite:** Navegação funciona sem recarregamento indevido.
- [ ] **BKL-112 - Criar cliente HTTP com base URL, timeout e interceptor**  
  `P0` `Responsável: Frontend` `Estimativa: 0,75 h` `Dependências: BKL-110`  
  **Entrega:** Cliente centralizado.  
  **Aceite:** Token é enviado; 401 é tratado sem loops.
- [ ] **BKL-113 - Integrar Cognito Managed Login com PKCE**  
  `P0` `Responsável: Frontend/Segurança` `Estimativa: 1,5 h` `Dependências: BKL-052,BKL-110`  
  **Entrega:** Login redirect e callback.  
  **Aceite:** E-mail/senha e Google passam pelo Cognito.
- [ ] **BKL-114 - Implementar AuthProvider e estado de sessão**  
  `P0` `Responsável: Frontend` `Estimativa: 1 h` `Dependências: BKL-113`  
  **Entrega:** Context/hook de autenticação.  
  **Aceite:** Componentes sabem loading, authenticated e unauthenticated.
- [ ] **BKL-115 - Implementar rotas protegidas**  
  `P0` `Responsável: Frontend` `Estimativa: 0,5 h` `Dependências: BKL-114`  
  **Entrega:** Guard de rotas.  
  **Aceite:** Usuário não autenticado é redirecionado ao login.
- [ ] **BKL-116 - Implementar refresh e logout**  
  `P1` `Responsável: Frontend/Segurança` `Estimativa: 0,75 h` `Dependências: BKL-114,BKL-058`  
  **Entrega:** Sessão renova de forma segura e logout limpa estado.  
  **Aceite:** Token expirado não fica sendo reutilizado indefinidamente.
- [ ] **BKL-117 - Criar tratamento global de loading e erro**  
  `P0` `Responsável: Frontend` `Estimativa: 0,75 h` `Dependências: BKL-111,BKL-112`  
  **Entrega:** Estados e mensagens consistentes.  
  **Aceite:** Falhas de rede não deixam tela travada ou vazia.
- [ ] **BKL-118 - Criar componentes base acessíveis**  
  `P1` `Responsável: Frontend` `Estimativa: 1 h` `Dependências: BKL-111`  
  **Entrega:** Button, Input, Select, Modal, Toast, Table/List e Pagination.  
  **Aceite:** Componentes possuem labels, foco e navegação por teclado.

### E14 - Frontend de tarefas e categorias

**Objetivo:** Entregar os fluxos obrigatórios com uma interface limpa e demonstrável.

**Critério de saída do épico:** Usuário gerencia tarefas e categorias, altera status e vê validações e estados de carregamento.

- [ ] **BKL-119 - Criar página de listagem de tarefas**  
  `P0` `Responsável: Frontend` `Estimativa: 1,25 h` `Dependências: BKL-112,BKL-069`  
  **Entrega:** Lista responsiva com estados vazio/loading/erro.  
  **Aceite:** Dados da API são exibidos sem duplicação de lógica.
- [ ] **BKL-120 - Criar formulário de criação e edição de tarefa**  
  `P0` `Responsável: Frontend` `Estimativa: 1,5 h` `Dependências: BKL-119,BKL-066`  
  **Entrega:** Formulário com título, descrição, prioridade, prazo e categoria.  
  **Aceite:** Validação cliente complementa, mas não substitui, a validação da API.
- [ ] **BKL-121 - Implementar detalhe de tarefa**  
  `P1` `Responsável: Frontend` `Estimativa: 0,75 h` `Dependências: BKL-119`  
  **Entrega:** Tela/modal de detalhes.  
  **Aceite:** Usuário vê propriedade, status, categoria, prazo e permissão.
- [ ] **BKL-122 - Implementar concluir e reabrir**  
  `P0` `Responsável: Frontend` `Estimativa: 0,5 h` `Dependências: BKL-119,BKL-070`  
  **Entrega:** Ações integradas aos endpoints específicos.  
  **Aceite:** UI atualiza após sucesso e reverte em falha.
- [ ] **BKL-123 - Implementar exclusão com confirmação**  
  `P0` `Responsável: Frontend` `Estimativa: 0,5 h` `Dependências: BKL-119,BKL-072`  
  **Entrega:** Confirmação antes da exclusão lógica.  
  **Aceite:** Item some da lista somente após resposta bem-sucedida.
- [ ] **BKL-124 - Criar gerenciamento de categorias**  
  `P0` `Responsável: Frontend` `Estimativa: 1 h` `Dependências: BKL-063,BKL-118`  
  **Entrega:** Lista, cria, edita e remove categorias.  
  **Aceite:** Erros de duplicidade e categoria em uso são exibidos claramente.
- [ ] **BKL-125 - Exibir aviso de vencimento em feriado**  
  `P1` `Responsável: Frontend` `Estimativa: 0,5 h` `Dependências: BKL-096,BKL-120`  
  **Entrega:** Alerta não bloqueante.  
  **Aceite:** Usuário entende que a tarefa foi salva e que o prazo coincide com feriado.
- [ ] **BKL-126 - Revisar responsividade e acessibilidade dos fluxos principais**  
  `P1` `Responsável: Frontend/QA` `Estimativa: 1 h` `Dependências: BKL-119,BKL-124`  
  **Entrega:** Layout funcional em desktop e largura móvel básica.  
  **Aceite:** Formulários possuem labels e foco previsível.

### E15 - Frontend de filtros, paginação e compartilhamento

**Objetivo:** Completar a colaboração e a consulta avançada exigidas pela atividade.

**Critério de saída do épico:** Filtros/paginação funcionam; usuário compartilha e gerencia convites de acordo com sua permissão.

- [ ] **BKL-127 - Criar barra de busca e filtros combinados**  
  `P0` `Responsável: Frontend` `Estimativa: 1 h` `Dependências: BKL-076,BKL-119`  
  **Entrega:** Filtros por status, prioridade, categoria e prazo.  
  **Aceite:** Parâmetros são refletidos na chamada da API.
- [ ] **BKL-128 - Criar ordenação e paginação**  
  `P0` `Responsável: Frontend` `Estimativa: 0,75 h` `Dependências: BKL-079,BKL-080,BKL-119`  
  **Entrega:** Controles de ordenação, próxima e anterior.  
  **Aceite:** Mudança de filtro volta para a primeira página.
- [ ] **BKL-129 - Criar modal de compartilhamento**  
  `P0` `Responsável: Frontend` `Estimativa: 1 h` `Dependências: BKL-084,BKL-118`  
  **Entrega:** E-mail e permissão viewer/editor.  
  **Aceite:** Usuário sem permissão não vê ou não executa a ação.
- [ ] **BKL-130 - Criar página de convites recebidos**  
  `P0` `Responsável: Frontend` `Estimativa: 0,75 h` `Dependências: BKL-085`  
  **Entrega:** Lista de convites pendentes e respondidos.  
  **Aceite:** Somente convites do usuário são exibidos.
- [ ] **BKL-131 - Implementar aceitar e recusar convite**  
  `P0` `Responsável: Frontend` `Estimativa: 0,5 h` `Dependências: BKL-086,BKL-130`  
  **Entrega:** Ações com feedback visual.  
  **Aceite:** Aceite adiciona tarefa à lista acessível; recusa não concede acesso.
- [ ] **BKL-132 - Exibir papel e restringir ações na interface**  
  `P0` `Responsável: Frontend/Segurança` `Estimativa: 0,75 h` `Dependências: BKL-088,BKL-119`  
  **Entrega:** Badges owner/editor/viewer e botões condicionais.  
  **Aceite:** UI reduz erros, sem ser considerada a única barreira de segurança.
- [ ] **BKL-133 - Implementar remoção de compartilhamento**  
  `P1` `Responsável: Frontend` `Estimativa: 0,5 h` `Dependências: BKL-087,BKL-129`  
  **Entrega:** Ação de revogação ou saída.  
  **Aceite:** Acesso desaparece após confirmação da API.
- [ ] **BKL-134 - Adicionar identificadores estáveis para testes E2E**  
  `P0` `Responsável: Frontend/QA` `Estimativa: 0,5 h` `Dependências: BKL-119,BKL-132`  
  **Entrega:** data-testid ou seletores semânticos.  
  **Aceite:** Selenium não depende de classes visuais frágeis.

### E16 - Testes automatizados do backend

**Objetivo:** Provar as regras de negócio, o isolamento entre usuários e a resiliência das integrações.

**Critério de saída do épico:** Pytest passa com cobertura relevante e sem depender de serviços externos reais.

- [ ] **BKL-135 - Configurar pytest, pytest-django, factories e coverage**  
  `P0` `Responsável: QA/Backend` `Estimativa: 1 h` `Dependências: BKL-032,BKL-050`  
  **Entrega:** Infra de testes reproduzível.  
  **Aceite:** Testes criam dados sem depender de ordem de execução.
- [ ] **BKL-136 - Testar models, constraints e soft delete**  
  `P0` `Responsável: QA` `Estimativa: 1 h` `Dependências: BKL-050,BKL-135`  
  **Entrega:** Testes de integridade.  
  **Aceite:** Duplicidades, FKs e exclusão lógica se comportam como projetado.
- [ ] **BKL-137 - Testar CRUD de categorias e tarefas**  
  `P0` `Responsável: QA` `Estimativa: 1,5 h` `Dependências: BKL-065,BKL-075`  
  **Entrega:** Testes de API e services.  
  **Aceite:** Códigos HTTP, payloads e persistência são validados.
- [ ] **BKL-138 - Testar conclusão, reabertura e auditoria**  
  `P0` `Responsável: QA` `Estimativa: 0,75 h` `Dependências: BKL-070,BKL-071,BKL-073`  
  **Entrega:** Cenários de estado.  
  **Aceite:** Transições e registros de auditoria são consistentes.
- [ ] **BKL-139 - Testar filtros, busca, ordenação e paginação**  
  `P0` `Responsável: QA` `Estimativa: 1 h` `Dependências: BKL-082`  
  **Entrega:** Matriz de consulta.  
  **Aceite:** Combinações e limites de page_size são cobertos.
- [ ] **BKL-140 - Testar compartilhamento e matriz de autorização**  
  `P0` `Responsável: QA/Segurança` `Estimativa: 2 h` `Dependências: BKL-091`  
  **Entrega:** Testes parametrizados por papel.  
  **Aceite:** Owner/editor/viewer seguem exatamente a matriz.
- [ ] **BKL-141 - Testar autenticação JWT com JWKS mockado**  
  `P0` `Responsável: QA/Segurança` `Estimativa: 1 h` `Dependências: BKL-059,BKL-135`  
  **Entrega:** Tokens válidos e inválidos.  
  **Aceite:** Testes não acessam Cognito real.
- [ ] **BKL-142 - Testar BrasilAPI e SQS com mocks**  
  `P0` `Responsável: QA` `Estimativa: 1 h` `Dependências: BKL-098,BKL-108`  
  **Entrega:** Cenários externos determinísticos.  
  **Aceite:** Suíte passa sem internet nem credenciais AWS.
- [ ] **BKL-143 - Definir e aplicar limite mínimo de cobertura**  
  `P1` `Responsável: QA` `Estimativa: 0,5 h` `Dependências: BKL-137,BKL-142`  
  **Entrega:** Coverage gate no CI, alvo sugerido 80% nas regras críticas.  
  **Aceite:** Pipeline falha abaixo do limite definido.

### E17 - Testes do frontend e Selenium

**Objetivo:** Validar os principais fluxos visuais exigidos pela banca e evitar regressões no comportamento do usuário.

**Critério de saída do épico:** Testes unitários essenciais e cinco cenários Selenium executam localmente e no CI.

- [ ] **BKL-144 - Configurar testes do frontend**  
  `P0` `Responsável: QA/Frontend` `Estimativa: 0,75 h` `Dependências: BKL-110`  
  **Entrega:** Runner, DOM testing e mocks HTTP.  
  **Aceite:** Testes executam de forma headless.
- [ ] **BKL-145 - Testar AuthProvider, guards e cliente HTTP**  
  `P1` `Responsável: QA/Frontend` `Estimativa: 1 h` `Dependências: BKL-114,BKL-116,BKL-144`  
  **Entrega:** Testes de sessão e 401.  
  **Aceite:** Estados de autenticação não causam loops de redirecionamento.
- [ ] **BKL-146 - Testar formulários e componentes críticos**  
  `P1` `Responsável: QA/Frontend` `Estimativa: 1 h` `Dependências: BKL-120,BKL-124,BKL-144`  
  **Entrega:** Testes de validação e ações.  
  **Aceite:** Erros da API são apresentados ao usuário.
- [ ] **BKL-147 - Configurar Selenium em container**  
  `P0` `Responsável: QA/DevOps` `Estimativa: 1 h` `Dependências: BKL-027,BKL-134`  
  **Entrega:** Serviço Selenium/Chrome headless.  
  **Aceite:** Teste pode ser iniciado por Docker Compose.
- [ ] **BKL-148 - Criar E2E de login e acesso à aplicação**  
  `P0` `Responsável: QA` `Estimativa: 1 h` `Dependências: BKL-113,BKL-147`  
  **Entrega:** Cenário de autenticação.  
  **Aceite:** Usuário autenticado chega à lista de tarefas.
- [ ] **BKL-149 - Criar E2E de categoria e tarefa**  
  `P0` `Responsável: QA` `Estimativa: 1 h` `Dependências: BKL-120,BKL-124,BKL-147`  
  **Entrega:** Criação ponta a ponta.  
  **Aceite:** Nova tarefa aparece associada à categoria criada.
- [ ] **BKL-150 - Criar E2E de filtro, paginação e status**  
  `P0` `Responsável: QA` `Estimativa: 1 h` `Dependências: BKL-127,BKL-128,BKL-147`  
  **Entrega:** Consulta e conclusão/reabertura.  
  **Aceite:** UI e API permanecem sincronizadas.
- [ ] **BKL-151 - Criar E2E de compartilhamento e aceite**  
  `P0` `Responsável: QA` `Estimativa: 1,5 h` `Dependências: BKL-129,BKL-131,BKL-147`  
  **Entrega:** Fluxo com dois usuários de teste.  
  **Aceite:** Destinatário aceita e acessa a tarefa com a permissão correta.
- [ ] **BKL-152 - Eliminar flakiness e registrar evidência dos testes**  
  `P0` `Responsável: QA` `Estimativa: 0,75 h` `Dependências: BKL-148,BKL-151`  
  **Entrega:** Waits explícitos, dados isolados e relatório.  
  **Aceite:** Testes passam repetidamente sem sleeps arbitrários.

### E18 - Segurança e hardening

**Objetivo:** Reduzir riscos reais sem criar infraestrutura excessiva.

**Critério de saída do épico:** Tokens, permissões, rede, segredos, headers, logs e dependências possuem controles verificáveis.

- [ ] **BKL-153 - Restringir CORS e ALLOWED_HOSTS por ambiente**  
  `P0` `Responsável: Segurança` `Estimativa: 0,5 h` `Dependências: BKL-033`  
  **Entrega:** Origens e hosts explícitos.  
  **Aceite:** Produção não usa wildcard.
- [ ] **BKL-154 - Configurar throttling/rate limiting no DRF**  
  `P1` `Responsável: Segurança` `Estimativa: 0,75 h` `Dependências: BKL-034`  
  **Entrega:** Limites para usuário e endpoints sensíveis.  
  **Aceite:** Abuso simples é limitado sem impedir uso normal.
- [ ] **BKL-155 - Aplicar validação de tamanho e formato dos payloads**  
  `P0` `Responsável: Segurança/Backend` `Estimativa: 0,75 h` `Dependências: BKL-066,BKL-061`  
  **Entrega:** Limites de título, descrição, e-mail e paginação.  
  **Aceite:** Payload excessivo ou inválido retorna 400.
- [ ] **BKL-156 - Garantir logs sem tokens, senhas ou dados sensíveis**  
  `P0` `Responsável: Segurança/Observabilidade` `Estimativa: 0,5 h` `Dependências: BKL-040`  
  **Entrega:** Filtros/redação de campos.  
  **Aceite:** Busca no log não encontra Authorization ou credenciais.
- [ ] **BKL-157 - Configurar headers de segurança e HTTPS de produção**  
  `P0` `Responsável: Segurança/DevOps` `Estimativa: 0,75 h` `Dependências: BKL-033`  
  **Entrega:** SECURE_SSL_REDIRECT, HSTS quando aplicável e cookies seguros do fluxo.  
  **Aceite:** Ambiente publicado não aceita HTTP em tráfego de usuário.
- [ ] **BKL-158 - Aplicar IAM de menor privilégio**  
  `P0` `Responsável: AWS/Segurança` `Estimativa: 1 h` `Dependências: BKL-100,BKL-103`  
  **Entrega:** Roles separadas para ECS, Lambda e CI.  
  **Aceite:** Cada componente acessa somente recursos necessários.
- [ ] **BKL-159 - Armazenar segredos no Secrets Manager/variáveis protegidas**  
  `P0` `Responsável: AWS/Segurança` `Estimativa: 0,75 h` `Dependências: BKL-011`  
  **Entrega:** Segredos fora do Git e da imagem.  
  **Aceite:** Rotação ou troca não exige rebuild do código.
- [ ] **BKL-160 - Manter RDS privado e Security Groups mínimos**  
  `P0` `Responsável: AWS/Segurança` `Estimativa: 1 h` `Dependências: BKL-048`  
  **Entrega:** Acesso somente do backend/Lambda necessários.  
  **Aceite:** Banco não possui endpoint público acessível.
- [ ] **BKL-161 - Executar pip-audit, npm audit e secret scan**  
  `P0` `Responsável: Segurança/CI` `Estimativa: 0,75 h` `Dependências: BKL-013`  
  **Entrega:** Relatórios no pipeline.  
  **Aceite:** Vulnerabilidade crítica conhecida bloqueia a entrega ou possui justificativa registrada.
- [ ] **BKL-162 - Revisar ameaças IDOR, replay e enumeração de usuários**  
  `P1` `Responsável: Segurança` `Estimativa: 1 h` `Dependências: BKL-024,BKL-091`  
  **Entrega:** Checklist e evidências de mitigação.  
  **Aceite:** Testes comprovam que IDs e respostas não vazam dados de terceiros.

### E19 - Observabilidade e operação

**Objetivo:** Permitir diagnóstico rápido de falhas da API, integrações e processamento assíncrono.

**Critério de saída do épico:** Logs correlacionados, métricas, dashboard e alarmes mínimos estão ativos.

- [ ] **BKL-163 - Padronizar logs JSON da API**  
  `P0` `Responsável: Observabilidade` `Estimativa: 0,75 h` `Dependências: BKL-040`  
  **Entrega:** Campos timestamp, level, service, request_id, route, status e duration.  
  **Aceite:** Logs podem ser pesquisados no CloudWatch.
- [ ] **BKL-164 - Propagar request_id para event_id e Lambda**  
  `P1` `Responsável: Observabilidade` `Estimativa: 0,75 h` `Dependências: BKL-099,BKL-163`  
  **Entrega:** Correlação no payload e logs.  
  **Aceite:** Um compartilhamento pode ser rastreado até o envio do e-mail.
- [ ] **BKL-165 - Configurar log groups e retenção**  
  `P0` `Responsável: AWS/Observabilidade` `Estimativa: 0,5 h` `Dependências: BKL-163,BKL-103`  
  **Entrega:** Grupos separados para API e Lambda.  
  **Aceite:** Retenção evita custo indefinido e logs não são perdidos imediatamente.
- [ ] **BKL-166 - Criar métricas e alarmes de erros e latência da API**  
  `P1` `Responsável: AWS/Observabilidade` `Estimativa: 1 h` `Dependências: BKL-165`  
  **Entrega:** Alarmes de 5xx e latência elevada.  
  **Aceite:** Condição de teste aciona o alarme ou é validada por configuração.
- [ ] **BKL-167 - Criar alarmes de Lambda, SQS e DLQ**  
  `P0` `Responsável: AWS/Observabilidade` `Estimativa: 0,75 h` `Dependências: BKL-102,BKL-165`  
  **Entrega:** Erros, throttling, idade da fila e mensagens na DLQ.  
  **Aceite:** Uma mensagem na DLQ gera sinal visível.
- [ ] **BKL-168 - Criar métricas básicas do RDS**  
  `P1` `Responsável: AWS/Observabilidade` `Estimativa: 0,5 h` `Dependências: BKL-160`  
  **Entrega:** CPU, conexões e armazenamento.  
  **Aceite:** Limites críticos estão documentados.
- [ ] **BKL-169 - Montar dashboard CloudWatch**  
  `P1` `Responsável: AWS/Observabilidade` `Estimativa: 1 h` `Dependências: BKL-166,BKL-168`  
  **Entrega:** Painel de saúde da solução.  
  **Aceite:** API, fila, Lambda e banco são visualizados em uma tela.
- [ ] **BKL-170 - Criar runbook curto para falhas comuns**  
  `P1` `Responsável: Docs/Operação` `Estimativa: 0,75 h` `Dependências: BKL-167,BKL-169`  
  **Entrega:** Passos para API 5xx, DLQ, SES e banco.  
  **Aceite:** Outra pessoa consegue diagnosticar sem conhecer o código inteiro.

### E20 - CI/CD e automação de qualidade

**Objetivo:** Automatizar validação, build e publicação para reduzir erro manual na entrega.

**Critério de saída do épico:** Pull requests validam qualidade; main publica com health check e falha de deploy não passa silenciosamente.

- [ ] **BKL-171 - Criar workflow de lint e formatação do backend**  
  `P0` `Responsável: CI` `Estimativa: 0,5 h` `Dependências: BKL-013`  
  **Entrega:** Ruff no GitHub Actions.  
  **Aceite:** PR com erro de estilo falha.
- [ ] **BKL-172 - Criar workflow de Pytest e cobertura**  
  `P0` `Responsável: CI` `Estimativa: 0,75 h` `Dependências: BKL-135,BKL-143`  
  **Entrega:** Banco de teste e relatório.  
  **Aceite:** Testes e coverage gate bloqueiam merge.
- [ ] **BKL-173 - Criar workflow de lint, build e testes do frontend**  
  `P0` `Responsável: CI` `Estimativa: 0,75 h` `Dependências: BKL-144`  
  **Entrega:** Node cache e lockfile.  
  **Aceite:** Build de produção é validado em PR.
- [ ] **BKL-174 - Executar Selenium no CI**  
  `P0` `Responsável: CI/QA` `Estimativa: 1 h` `Dependências: BKL-147,BKL-152`  
  **Entrega:** Serviços iniciados e cenário E2E headless.  
  **Aceite:** Pipeline publica log/evidência em falha.
- [ ] **BKL-175 - Adicionar auditoria de dependências e segredos**  
  `P0` `Responsável: CI/Segurança` `Estimativa: 0,75 h` `Dependências: BKL-161`  
  **Entrega:** pip-audit, npm audit e secret scan.  
  **Aceite:** Falhas críticas são visíveis e tratadas.
- [ ] **BKL-176 - Construir imagens Docker no CI**  
  `P0` `Responsável: CI/DevOps` `Estimativa: 0,75 h` `Dependências: BKL-025,BKL-026`  
  **Entrega:** Build do backend e frontend.  
  **Aceite:** Imagem é reproduzível e não inclui .env.
- [ ] **BKL-177 - Configurar push da imagem do backend para ECR**  
  `P1` `Responsável: CI/AWS` `Estimativa: 0,75 h` `Dependências: BKL-176,BKL-181`  
  **Entrega:** Autenticação por OIDC do GitHub.  
  **Aceite:** CI não usa access key AWS de longa duração.
- [ ] **BKL-178 - Automatizar migration task e deploy no ECS**  
  `P1` `Responsável: CI/AWS` `Estimativa: 1,25 h` `Dependências: BKL-177,BKL-184`  
  **Entrega:** Etapas controladas de migration e atualização do serviço.  
  **Aceite:** Deploy não troca tráfego antes de migrations concluírem.
- [ ] **BKL-179 - Configurar deploy do frontend pelo Amplify**  
  `P1` `Responsável: CI/AWS` `Estimativa: 0,5 h` `Dependências: BKL-188`  
  **Entrega:** Branch main dispara build e publicação.  
  **Aceite:** URL publicada reflete o commit entregue.
- [ ] **BKL-180 - Adicionar smoke test e estratégia de rollback**  
  `P1` `Responsável: CI/Operação` `Estimativa: 1 h` `Dependências: BKL-178,BKL-179`  
  **Entrega:** Health check pós-deploy e instrução de rollback.  
  **Aceite:** Falha impede marcar o pipeline como sucesso.

### E21 - Infraestrutura e deploy AWS

**Objetivo:** Publicar a solução usando serviços gerenciados com custo e complexidade proporcionais ao teste.

**Critério de saída do épico:** Frontend e API estão acessíveis por HTTPS; banco, identidade, fila, worker, e-mail e observabilidade funcionam.

- [ ] **BKL-181 - Criar ECR para a imagem do backend**  
  `P1` `Responsável: AWS` `Estimativa: 0,5 h` `Dependências: BKL-176`  
  **Entrega:** Repositório ECR com lifecycle policy.  
  **Aceite:** Imagens antigas não crescem sem limite.
- [ ] **BKL-182 - Criar VPC, subnets e Security Groups mínimos**  
  `P1` `Responsável: AWS/Segurança` `Estimativa: 1,5 h` `Dependências: BKL-160`  
  **Entrega:** Rede com RDS privado e acesso controlado.  
  **Aceite:** Somente ALB é público; banco não é exposto.
- [ ] **BKL-183 - Criar RDS PostgreSQL e aplicar parâmetros básicos**  
  `P1` `Responsável: AWS/Dados` `Estimativa: 1 h` `Dependências: BKL-182`  
  **Entrega:** Instância, backups e credenciais via segredo.  
  **Aceite:** API conecta e migrations executam.
- [ ] **BKL-184 - Criar ECS Fargate, task definition e serviço**  
  `P1` `Responsável: AWS` `Estimativa: 1,5 h` `Dependências: BKL-181,BKL-182,BKL-183`  
  **Entrega:** Backend containerizado no ECS.  
  **Aceite:** Tarefa inicia saudável e reinicia automaticamente em falha.
- [ ] **BKL-185 - Criar Application Load Balancer e health check**  
  `P1` `Responsável: AWS` `Estimativa: 1 h` `Dependências: BKL-184,BKL-038`  
  **Entrega:** ALB encaminha para ECS.  
  **Aceite:** /health responde e instâncias não saudáveis são removidas.
- [ ] **BKL-186 - Configurar HTTPS e domínio da API**  
  `P2` `Responsável: AWS` `Estimativa: 1 h` `Dependências: BKL-185`  
  **Entrega:** Certificado ACM e DNS.  
  **Aceite:** API pública usa HTTPS válido.
- [ ] **BKL-187 - Configurar Secrets Manager no ECS e Lambda**  
  `P1` `Responsável: AWS/Segurança` `Estimativa: 0,75 h` `Dependências: BKL-159,BKL-184`  
  **Entrega:** Segredos injetados em runtime.  
  **Aceite:** Nenhum segredo aparece na task definition em texto aberto.
- [ ] **BKL-188 - Criar app no Amplify Hosting**  
  `P1` `Responsável: AWS/Frontend` `Estimativa: 0,75 h` `Dependências: BKL-110`  
  **Entrega:** Frontend publicado por branch.  
  **Aceite:** HTTPS e variáveis de ambiente estão configurados.
- [ ] **BKL-189 - Finalizar Cognito callbacks para o frontend publicado**  
  `P1` `Responsável: AWS/Segurança` `Estimativa: 0,5 h` `Dependências: BKL-188,BKL-052`  
  **Entrega:** Callback/logout URLs exatas.  
  **Aceite:** Login publicado retorna ao domínio correto.
- [ ] **BKL-190 - Conectar SQS, Lambda, SES e permissões**  
  `P1` `Responsável: AWS` `Estimativa: 1,25 h` `Dependências: BKL-102,BKL-103,BKL-106,BKL-158`  
  **Entrega:** Integração serverless ativa.  
  **Aceite:** Mensagem de teste gera e-mail e logs.
- [ ] **BKL-191 - Configurar CloudWatch e alarmes de produção**  
  `P1` `Responsável: AWS/Observabilidade` `Estimativa: 1 h` `Dependências: BKL-165,BKL-167`  
  **Entrega:** Logs, métricas e alarmes.  
  **Aceite:** Falhas críticas possuem visibilidade.
- [ ] **BKL-192 - Criar orçamento/alerta de custo e desligar recursos desnecessários**  
  `P1` `Responsável: AWS/FinOps` `Estimativa: 0,5 h` `Dependências: BKL-181`  
  **Entrega:** Budget e revisão de custo.  
  **Aceite:** Recursos de teste não ficam consumindo indefinidamente.
- [ ] **BKL-193 - Provisionar infraestrutura por Terraform**  
  `P2` `Responsável: IaC` `Estimativa: 3 h` `Dependências: BKL-182,BKL-190`  
  **Entrega:** Código IaC reproduzível.  
  **Aceite:** terraform plan é revisável e não contém segredos.

### E22 - Documentação técnica e experiência da banca

**Objetivo:** Permitir que a banca entenda, execute, avalie e navegue pela solução rapidamente.

**Critério de saída do épico:** README completo, API documentada, diagramas preservados e instruções testadas em clone limpo.

- [ ] **BKL-194 - Atualizar README com visão geral e atendimento aos requisitos**  
  `P0` `Responsável: Docs` `Estimativa: 0,75 h` `Dependências: BKL-001`  
  **Entrega:** Matriz requisito x implementação.  
  **Aceite:** A banca identifica rapidamente onde cada ponto foi atendido.
- [ ] **BKL-195 - Documentar execução por Docker Compose**  
  `P0` `Responsável: Docs` `Estimativa: 0,5 h` `Dependências: BKL-027,BKL-031`  
  **Entrega:** Pré-requisitos, env, up, migrate, seed e stop.  
  **Aceite:** Passos funcionam em clone limpo.
- [ ] **BKL-196 - Documentar arquitetura, decisões e trade-offs**  
  `P0` `Responsável: Docs/Arquitetura` `Estimativa: 1 h` `Dependências: BKL-018,BKL-019`  
  **Entrega:** Camadas, AWS, segurança, mensageria e observabilidade.  
  **Aceite:** Texto explica por que a solução não usa Redis, Prometheus, Kafka ou RabbitMQ.
- [ ] **BKL-197 - Preservar e estilizar todos os diagramas existentes**  
  `P0` `Responsável: Docs` `Estimativa: 1 h` `Dependências: BKL-019,BKL-021`  
  **Entrega:** Sequência, classes, modelos e C4 no README/docs.  
  **Aceite:** Nenhum diagrama solicitado anteriormente é removido.
- [ ] **BKL-198 - Documentar API, filtros, erros e Swagger**  
  `P0` `Responsável: Docs/Backend` `Estimativa: 0,75 h` `Dependências: BKL-035,BKL-082`  
  **Entrega:** Endpoints e exemplos de requisição.  
  **Aceite:** Contrato descrito coincide com OpenAPI publicado.
- [ ] **BKL-199 - Documentar autenticação, segurança e variáveis**  
  `P0` `Responsável: Docs/Segurança` `Estimativa: 0,75 h` `Dependências: BKL-060,BKL-162`  
  **Entrega:** PKCE, JWT, permissions, secrets e CORS.  
  **Aceite:** Não há instrução que peça credenciais reais no repositório.
- [ ] **BKL-200 - Adicionar screenshots ou GIF curto da aplicação**  
  `P1` `Responsável: Docs/Produto` `Estimativa: 0,75 h` `Dependências: BKL-126,BKL-132`  
  **Entrega:** Evidência visual do fluxo principal.  
  **Aceite:** README mostra a aplicação sem exigir execução imediata.
- [ ] **BKL-201 - Adicionar links reais, credenciais demo e limitações conhecidas**  
  `P0` `Responsável: Docs` `Estimativa: 0,5 h` `Dependências: BKL-188,BKL-194`  
  **Entrega:** URLs e dados de demonstração controlados.  
  **Aceite:** Nenhum placeholder <URL_...> permanece na entrega.
- [ ] **BKL-202 - Criar guia de deploy e runbook mínimo**  
  `P1` `Responsável: Docs/Operação` `Estimativa: 1 h` `Dependências: BKL-170,BKL-180`  
  **Entrega:** Deploy, rollback e diagnóstico.  
  **Aceite:** Banca entende como a solução é operada.

### E23 - Validação final, release e entrega

**Objetivo:** Reduzir risco de falha no momento da avaliação e entregar um repositório profissional.

**Critério de saída do épico:** Release estável, ambiente publicado, evidências reunidas e e-mail enviado no prazo.

- [ ] **BKL-203 - Executar instalação completa a partir de clone limpo**  
  `P0` `Responsável: QA` `Estimativa: 1 h` `Dependências: BKL-195`  
  **Entrega:** Teste em diretório/máquina limpa.  
  **Aceite:** Aplicação sobe apenas com os passos documentados.
- [ ] **BKL-204 - Executar toda a suíte local e no CI**  
  `P0` `Responsável: QA` `Estimativa: 1 h` `Dependências: BKL-172,BKL-174`  
  **Entrega:** Pytest, frontend e Selenium verdes.  
  **Aceite:** Nenhum teste obrigatório está ignorado sem justificativa.
- [ ] **BKL-205 - Executar matriz manual de requisitos da banca**  
  `P0` `Responsável: QA/Produto` `Estimativa: 1 h` `Dependências: BKL-003,BKL-204`  
  **Entrega:** Checklist requisito por requisito.  
  **Aceite:** Todos os itens obrigatórios têm evidência de sucesso.
- [ ] **BKL-206 - Executar revisão de segurança e segredos**  
  `P0` `Responsável: Segurança` `Estimativa: 0,75 h` `Dependências: BKL-161,BKL-162`  
  **Entrega:** Secret scan, permissões e configurações.  
  **Aceite:** Histórico público não contém credenciais.
- [ ] **BKL-207 - Executar smoke test no ambiente publicado**  
  `P0` `Responsável: QA/Operação` `Estimativa: 1 h` `Dependências: BKL-180,BKL-191`  
  **Entrega:** Login, CRUD, filtros, compartilhamento e e-mail.  
  **Aceite:** Fluxo principal funciona na URL entregue.
- [ ] **BKL-208 - Revisar logs, alarmes e DLQ após smoke test**  
  `P1` `Responsável: Observabilidade` `Estimativa: 0,5 h` `Dependências: BKL-207`  
  **Entrega:** Evidência de observabilidade.  
  **Aceite:** Requisições e evento assíncrono aparecem correlacionados.
- [ ] **BKL-209 - Revisar histórico de commits e organização do repositório**  
  `P0` `Responsável: Gestão` `Estimativa: 0,5 h` `Dependências: BKL-005`  
  **Entrega:** Commits pequenos e mensagens semânticas.  
  **Aceite:** Não existe um único commit gigante contendo todo o projeto.
- [ ] **BKL-210 - Criar tag/release de entrega**  
  `P0` `Responsável: Gestão` `Estimativa: 0,5 h` `Dependências: BKL-204,BKL-209`  
  **Entrega:** Tag v1.0.0 e release notes.  
  **Aceite:** Commit entregue fica imutável e fácil de localizar.
- [ ] **BKL-211 - Gravar vídeo curto de demonstração como contingência**  
  `P2` `Responsável: Produto` `Estimativa: 1 h` `Dependências: BKL-207`  
  **Entrega:** Vídeo de 5 a 8 minutos.  
  **Aceite:** Fluxo principal pode ser avaliado mesmo se o ambiente falhar.
- [ ] **BKL-212 - Enviar e-mail de entrega com link do repositório**  
  `P0` `Responsável: Entrega` `Estimativa: 0,25 h` `Dependências: BKL-201,BKL-210`  
  **Entrega:** E-mail para recrutamento@advicehealth.com.br.  
  **Aceite:** Mensagem contém repositório, aplicação, API e observações essenciais.
- [ ] **BKL-213 - Confirmar acesso público e guardar comprovante da entrega**  
  `P0` `Responsável: Entrega` `Estimativa: 0,25 h` `Dependências: BKL-212`  
  **Entrega:** Verificação anônima e registro do envio.  
  **Aceite:** Links abrem sem permissão especial e envio ocorreu antes do prazo.

<div class="page-break"></div>

## 6. Definition of Ready - DoR

Uma tarefa pode entrar em **Doing** quando:

- [ ] Objetivo e resultado esperado estão claros.
- [ ] Critério de aceite é verificável.
- [ ] Dependências anteriores foram concluídas ou possuem mock/alternativa.
- [ ] Dados, endpoints, variáveis e permissões necessários são conhecidos.
- [ ] A tarefa é pequena o suficiente para gerar um commit ou PR revisável.

## 7. Definition of Done - DoD

Uma tarefa só pode ser marcada como concluída quando:

- [ ] Código implementado conforme a arquitetura e o padrão do projeto.
- [ ] Testes relevantes foram criados e executados.
- [ ] Lint, formatação e build passam.
- [ ] Segurança e isolamento entre usuários foram considerados.
- [ ] Logs não expõem segredos ou tokens.
- [ ] Documentação e `.env.example` foram atualizados quando necessário.
- [ ] Mudança foi integrada sem quebrar `main`.
- [ ] Critério de aceite foi demonstrado ou validado automaticamente.

## 8. Quality gates da entrega

| Gate | Condição para aprovação |
|---|---|
| Funcional | Todos os requisitos obrigatórios passam na matriz manual |
| Backend | Pytest verde; regras críticas e autorização cobertas |
| Frontend | Build e lint verdes; fluxos essenciais funcionando |
| E2E | Selenium cobre login, tarefa/categoria, filtros/status e compartilhamento |
| Segurança | Sem segredos no Git; JWT e permissões testados; CORS restrito |
| Reprodutibilidade | Clone limpo sobe por Docker Compose seguindo o README |
| CI/CD | Pipeline de PR verde; deploy ou build automatizado validado |
| AWS | Ambiente publicado acessível por HTTPS; serviços essenciais saudáveis |
| Documentação | README sem placeholders, links reais, diagramas e decisões presentes |
| Entrega | Repositório público, release criada e e-mail enviado no prazo |

## 9. Plano de corte por falta de tempo

### Não cortar

- React, Django REST Framework, Docker Compose, Pytest, Selenium e CI/CD.
- Cadastro/login, CRUD de tarefas, categorias, conclusão/reabertura, filtros, paginação e compartilhamento.
- Autorização por objeto, isolamento entre usuários e README executável.
- API externa testada com mocks.

### Cortar primeiro

- Terraform completo, domínio próprio, controle otimista, vídeo e GIF.
- Dashboard elaborado, métricas avançadas e testes unitários de componentes não críticos.
- Auditoria detalhada de todas as alterações, mantendo ao menos os eventos críticos.

### Alternativas de contingência

- Se Cognito atrasar o desenvolvimento local, manter a autenticação local implementada nesta rodada e usar tokens mockados **somente nos testes**, nunca em produção.
- Se SES estiver em sandbox, usar destinatários verificados e documentar a limitação.
- Se o deploy ECS consumir tempo excessivo, publicar a API em um serviço gerenciado compatível e manter a arquitetura AWS documentada; não sacrificar os requisitos obrigatórios.
- Se Selenium estiver instável, reduzir para os fluxos exigidos, usar dados isolados e waits explícitos.

## 10. Estratégia de commits recomendada

```text
chore: initialize monorepo and quality tools
chore: add docker compose development environment
feat(api): bootstrap django rest framework project
feat(auth): add local credentials and password recovery
feat(auth): validate cognito access tokens
feat(tasks): add task and category domain models
feat(tasks): implement task CRUD and status actions
feat(sharing): add invitations and object permissions
feat(integration): add holiday API adapter
feat(async): publish task shared events to SQS
feat(web): implement authenticated task management UI
test: cover authorization and core use cases
test(e2e): add selenium critical journeys
ci: validate tests build and security checks
deploy: publish frontend and backend to AWS
docs: finalize setup architecture and delivery guide
```

## 11. Checklist final de envio

- [ ] Repositório público abre em janela anônima.
- [ ] README possui links reais da aplicação, API, Swagger e health check.
- [x] docker compose up --build funciona em clone limpo.
- [x] Migrations e seed executam sem passos ocultos.
- [x] Pytest, frontend tests e Selenium estão verdes.
- [ ] Pipeline principal está verde no commit da release.
- [x] Login por e-mail/senha e recuperação de senha funcionam; Google fica condicionado ao Cognito externo.
- [x] CRUD, categorias, conclusão/reabertura, filtros, paginação e compartilhamento foram demonstrados.
- [x] BrasilAPI possui teste de sucesso e falha sem internet.
- [ ] SQS/Lambda/SES ou a alternativa documentada foi validada.
- [x] Nenhum .env, token, senha ou chave AWS está no Git.
- [ ] URLs e callbacks do Cognito não possuem wildcard inseguro.
- [x] Limitações conhecidas e decisões de design estão documentadas.
- [ ] Tag v1.0.0/release criada no commit entregue.
- [ ] E-mail enviado para recrutamento@advicehealth.com.br com o link do repositório.
- [ ] Comprovante e horário do envio foram guardados.
