<div align="center">

# Task Management System

### Plataforma colaborativa de gerenciamento de tarefas

[![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Django REST Framework](https://img.shields.io/badge/Django_REST_Framework-API-A30000?logo=django&logoColor=white)](https://www.django-rest-framework.org/)
[![React](https://img.shields.io/badge/React-TypeScript-087EA4?logo=react&logoColor=white)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-RDS-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![AWS](https://img.shields.io/badge/AWS-Cloud-FF9900?logo=amazonwebservices&logoColor=white)](https://aws.amazon.com/)

Aplicação web criada para o teste prático de **Desenvolvedor Python Back-end**, com autenticação gerenciada, compartilhamento de tarefas, integração externa, processamento assíncrono, observabilidade, testes automatizados e entrega contínua.

</div>

> [!IMPORTANT]
> Antes da entrega, substitua apenas os campos `<URL_...>` pelos links reais do ambiente publicado e da documentação da API.

## Índice

- [Visão geral](#visão-geral)
- [Atendimento aos requisitos](#atendimento-aos-requisitos)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Decisões de design](#decisões-de-design)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Execução com Docker](#execução-com-docker)
- [Execução local](#execução-local)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [API](#api)
- [Autenticação e autorização](#autenticação-e-autorização)
- [Integração externa](#integração-externa)
- [Mensageria](#mensageria)
- [Segurança](#segurança)
- [Observabilidade](#observabilidade)
- [Testes](#testes)
- [CI/CD](#cicd)
- [Deploy na AWS](#deploy-na-aws)
- [Modelagem e diagramas](#modelagem-e-diagramas)
- [Estratégia de commits](#estratégia-de-commits)
- [Limitações conhecidas](#limitações-conhecidas)

## Visão geral

O **Task Management System** permite que usuários criem, organizem, filtrem, concluam e compartilhem tarefas com controle de permissão. A solução utiliza um **monólito modular**, evitando complexidade operacional desnecessária, e delega responsabilidades de infraestrutura para serviços gerenciados da AWS.

### Links da entrega

| Recurso | Endereço |
|---|---|
| Aplicação web | `<URL_DO_FRONTEND>` |
| API | `<URL_DA_API>` |
| Swagger/OpenAPI | `<URL_DA_API>/api/docs/` |
| Repositório público | `<URL_DO_REPOSITORIO>` |
| Health check | `<URL_DA_API>/api/v1/health/` |

## Atendimento aos requisitos

| Requisito da atividade | Implementação |
|---|---|
| Aplicação web de tarefas | React + TypeScript consumindo API REST |
| CRUD de tarefas | Criação, consulta, atualização, exclusão lógica, conclusão e reabertura |
| Categorias | CRUD e vínculo por proprietário |
| Compartilhamento | Convite com permissões `viewer` e `editor` |
| API externa | Consulta de feriados pela BrasilAPI, com timeout, fallback e testes com mocks |
| Cadastro e login | Amazon Cognito Managed Login com e-mail/senha e Google |
| Concluir ou reabrir tarefa | Endpoints específicos com autorização por objeto |
| Filtragem | Status, prioridade, categoria, prazo e busca textual |
| Paginação | Paginação nativa do Django REST Framework |
| React — 2 pontos | React + TypeScript |
| Docker e Docker Compose — 2 pontos | Frontend, backend e PostgreSQL executados por containers |
| Django REST Framework — 2 pontos | API versionada e documentada em OpenAPI |
| Pytest — 2 pontos | Testes unitários e de integração do backend |
| Selenium — 1 ponto | Fluxos críticos de autenticação, tarefas e filtros |
| CI/CD — 1 ponto | GitHub Actions para qualidade, testes, build e deploy |
| AWS — ponto extra | Amplify, Cognito, ECS Fargate, RDS, SQS, Lambda, SES e CloudWatch |

## Funcionalidades

- Cadastro e login por e-mail/senha ou Google.
- CRUD de tarefas e categorias.
- Prioridade, prazo, descrição, status e exclusão lógica.
- Conclusão e reabertura de tarefas.
- Busca textual, filtros combinados, ordenação e paginação.
- Compartilhamento com permissões de visualização ou edição.
- Aceite e recusa de convites.
- Histórico de alterações e auditoria.
- Alerta quando o prazo coincide com feriado nacional.
- Notificações por e-mail processadas de forma assíncrona.
- Tratamento padronizado de erros e health checks.

## Tecnologias

| Camada | Tecnologia | Responsabilidade |
|---|---|---|
| Frontend | React + TypeScript | Interface web e consumo da API |
| Hosting | AWS Amplify Hosting | Build, HTTPS, CDN e deploy do frontend |
| Identidade | Amazon Cognito | Managed Login, Google SSO, OAuth 2.0/OIDC e tokens |
| Backend | Python + Django REST Framework | API, regras de negócio e autorização |
| Persistência | Django ORM + PostgreSQL | Dados relacionais, constraints, índices e transações |
| Banco gerenciado | Amazon RDS PostgreSQL | Backups, disponibilidade e administração do banco |
| Mensageria | Amazon SQS + DLQ | Desacoplamento, retry e tratamento de falhas |
| Processamento | AWS Lambda | Consumo de eventos e envio de notificações |
| E-mail | Amazon SES | Entrega dos convites e notificações |
| Integração | BrasilAPI | Consulta de feriados |
| Observabilidade | Amazon CloudWatch | Logs, métricas, dashboards e alarmes |
| Containers | Docker + Docker Compose | Ambiente reproduzível de desenvolvimento |
| Qualidade | Pytest, Ruff e Selenium | Testes, lint, formatação e E2E |
| CI/CD | GitHub Actions | Validação, build e deploy |

## Arquitetura

A solução segue **Clean Architecture de forma pragmática**: regras de negócio permanecem separadas da entrega HTTP e das integrações externas, sem criar abstrações genéricas que apenas duplicariam o Django ORM.

### Visão geral

```mermaid
%%{init: {
  "theme": "base",
  "themeVariables": {
    "fontFamily": "Inter, Arial",
    "primaryColor": "#EFF6FF",
    "primaryTextColor": "#172554",
    "primaryBorderColor": "#2563EB",
    "lineColor": "#475569",
    "secondaryColor": "#F0FDF4",
    "tertiaryColor": "#FFF7ED"
  }
}}%%
flowchart LR
    USER[Usuário] --> WEB[React + TypeScript<br/>AWS Amplify Hosting]
    WEB --> AUTH[Amazon Cognito<br/>Managed Login + Google]
    AUTH -->|JWT| WEB
    WEB -->|REST + JWT| API[Django REST Framework<br/>ECS Fargate]
    API --> DB[(Amazon RDS<br/>PostgreSQL)]
    API --> HOLIDAY[BrasilAPI<br/>Feriados]
    API --> SQS[Amazon SQS + DLQ]
    SQS --> LAMBDA[AWS Lambda]
    LAMBDA --> SES[Amazon SES]
    API -. logs e métricas .-> CW[Amazon CloudWatch]
    LAMBDA -. logs e métricas .-> CW

    classDef user fill:#DBEAFE,stroke:#2563EB,color:#172554;
    classDef app fill:#DCFCE7,stroke:#16A34A,color:#14532D;
    classDef data fill:#FEF3C7,stroke:#D97706,color:#451A03;
    classDef async fill:#FCE7F3,stroke:#DB2777,color:#831843;
    classDef ops fill:#EDE9FE,stroke:#7C3AED,color:#4C1D95;

    class USER,WEB,AUTH user;
    class API,HOLIDAY app;
    class DB data;
    class SQS,LAMBDA,SES async;
    class CW ops;
```

### Organização das camadas

1. **Apresentação:** React e componentes da interface.
2. **Identidade:** Cognito Managed Login e emissão de tokens.
3. **Aplicação:** ViewSets, serializers, services e selectors.
4. **Domínio:** entidades, estados, permissões e regras de negócio.
5. **Infraestrutura:** ORM, PostgreSQL, clientes HTTP e publisher SQS.
6. **Operação:** CloudWatch, GitHub Actions e deploy AWS.

## Decisões de design

| Decisão | Justificativa | Trade-off aceito |
|---|---|---|
| Monólito modular | Menor custo cognitivo e operacional para um projeto de cinco dias | Escalabilidade independente por módulo não é necessária agora |
| PostgreSQL | Integridade relacional, transações, filtros e índices adequados ao domínio | Exige modelagem e migrations cuidadosas |
| Cognito Managed Login | Evita implementar senhas, recuperação, MFA, OAuth e rotação de tokens do zero | Dependência do provedor AWS |
| Authorization Code + PKCE | Protege o fluxo OAuth de aplicações públicas como o React | Adiciona redirecionamento ao login gerenciado |
| SQS + Lambda | Retry, DLQ e escalabilidade sem administrar brokers | Menos flexibilidade de roteamento que RabbitMQ e menos capacidade de streaming que Kafka |
| CloudWatch | Integração nativa com ECS, Lambda, SQS e RDS | Menor portabilidade que Prometheus/Grafana |
| Sem Redis | Não há gargalo comprovado nem sessão própria para armazenar | Cache poderá ser introduzido após medição real |
| BrasilAPI não bloqueante | Indisponibilidade externa não impede salvar uma tarefa | O aviso de feriado pode ficar temporariamente indisponível |
| Soft delete e auditoria | Preserva rastreabilidade sem remover dados imediatamente | Consultas devem excluir registros apagados por padrão |
| `transaction.on_commit()` para eventos | Publica somente após a confirmação da transação | Outbox transacional fica como evolução para cenários mais críticos |

## Clean Code, SOLID, DRY e KISS

- **SRP:** ViewSets tratam HTTP; services executam casos de uso; selectors concentram consultas; adapters isolam integrações.
- **OCP/DIP:** clientes externos e publisher de eventos podem ser substituídos em testes sem alterar regras de negócio.
- **DRY:** validações, políticas de autorização e tratamento de erros são centralizados.
- **KISS:** sem microsserviços, Kafka, RabbitMQ, Redis ou Kubernetes para um domínio que não exige isso.
- **Nomenclatura:** nomes explícitos, métodos curtos, tipagem e ausência de comentários que apenas repetem o código.

## Estrutura do projeto

```text
.
├── backend/
│   ├── config/                 # Configuração do Django
│   ├── apps/
│   │   ├── accounts/           # Sincronização do usuário Cognito
│   │   ├── tasks/              # Tarefas, services e selectors
│   │   ├── categories/         # Categorias
│   │   ├── sharing/            # Convites e permissões
│   │   ├── audit/              # Histórico e auditoria
│   │   └── integrations/       # BrasilAPI e SQS
│   ├── common/                 # Erros, paginação, logging e utilitários
│   ├── tests/
│   ├── manage.py
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/                # Rotas, providers e configuração
│   │   ├── features/           # Auth, tasks, categories e sharing
│   │   ├── pages/
│   │   ├── services/           # Cliente HTTP e Cognito
│   │   └── tests/e2e/          # Selenium
│   └── Dockerfile
├── infra/
│   ├── lambda/                 # Consumidor SQS
│   └── terraform/              # Infraestrutura, quando aplicável
├── docs/
├── .github/workflows/
├── docker-compose.yml
├── .env.example
└── README.md
```

## Execução com Docker

### Pré-requisitos

- Git.
- Docker Engine 24 ou superior.
- Docker Compose v2.
- Configuração de desenvolvimento do Amazon Cognito para testar autenticação real.

### Inicialização

```bash
git clone <URL_DO_REPOSITORIO>
cd <NOME_DO_REPOSITORIO>
cp .env.example .env
docker compose up --build
```

Serviços locais:

| Serviço | URL |
|---|---|
| Frontend | `http://localhost:5173` |
| Backend | `http://localhost:8000` |
| Swagger | `http://localhost:8000/api/docs/` |
| PostgreSQL | `localhost:5432` |

### Migrations

```bash
docker compose exec backend python manage.py migrate
```

### Dados de demonstração

```bash
docker compose exec backend python manage.py seed_demo
```

### Encerramento

```bash
docker compose down
```

Para remover também os volumes locais:

```bash
docker compose down -v
```

## Execução local

Use esta opção apenas para desenvolvimento sem containers.

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements/dev.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm ci
npm run dev
```

## Variáveis de ambiente

Crie `.env` a partir de `.env.example`.

```dotenv
DJANGO_SECRET_KEY=change-me
DJANGO_DEBUG=true
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgresql://postgres:postgres@database:5432/task_manager
CORS_ALLOWED_ORIGINS=http://localhost:5173

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

COGNITO_USER_POOL_ID=
COGNITO_APP_CLIENT_ID=
COGNITO_DOMAIN=
COGNITO_REDIRECT_URI=http://localhost:5173/auth/callback
COGNITO_LOGOUT_URI=http://localhost:5173/

SQS_TASK_EVENTS_URL=
SES_FROM_EMAIL=
BRASIL_API_BASE_URL=https://brasilapi.com.br/api
BRASIL_API_TIMEOUT_SECONDS=3

LOG_LEVEL=INFO
```

> [!CAUTION]
> Nunca versione `.env`, senhas, chaves AWS ou tokens. Em produção, armazene segredos no **AWS Secrets Manager**.

## API

Prefixo padrão: `/api/v1`.

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/tasks/` | Lista tarefas acessíveis com filtros e paginação |
| `POST` | `/tasks/` | Cria tarefa |
| `GET` | `/tasks/{id}/` | Consulta tarefa |
| `PATCH` | `/tasks/{id}/` | Atualiza tarefa |
| `DELETE` | `/tasks/{id}/` | Executa exclusão lógica |
| `PATCH` | `/tasks/{id}/complete/` | Marca tarefa como concluída |
| `PATCH` | `/tasks/{id}/reopen/` | Reabre tarefa |
| `GET` | `/categories/` | Lista categorias do usuário |
| `POST` | `/categories/` | Cria categoria |
| `PATCH` | `/categories/{id}/` | Atualiza categoria |
| `DELETE` | `/categories/{id}/` | Exclui categoria |
| `POST` | `/tasks/{id}/shares/` | Compartilha tarefa |
| `GET` | `/shares/` | Lista convites recebidos |
| `PATCH` | `/shares/{id}/` | Aceita ou recusa convite |
| `DELETE` | `/shares/{id}/` | Remove compartilhamento |
| `GET` | `/health/` | Verifica disponibilidade da API |
| `GET` | `/readiness/` | Verifica dependências essenciais |

### Filtros de tarefas

```http
GET /api/v1/tasks/?status=pending&priority=high&category=<uuid>&search=relatorio&ordering=due_at&page=1&page_size=20
```

Parâmetros suportados:

- `status`: `pending` ou `completed`.
- `priority`: `low`, `medium` ou `high`.
- `category`: UUID da categoria.
- `search`: busca por título e descrição.
- `due_before` e `due_after`: intervalo de vencimento.
- `ordering`: `created_at`, `updated_at`, `due_at` ou `priority`; prefixe com `-` para ordem decrescente.
- `page` e `page_size`: paginação.

### Respostas de erro

```json
{
  "error": {
    "code": "permission_denied",
    "message": "Você não possui permissão para editar esta tarefa.",
    "request_id": "2f281d3e-10aa-4a94-a5c1-d7ef40f93f2f",
    "details": {}
  }
}
```

## Autenticação e autorização

O frontend utiliza **Cognito Managed Login** para os dois métodos de entrada:

- E-mail e senha armazenados e validados no Cognito User Pool.
- Login social com Google.

O fluxo utiliza **OAuth 2.0/OIDC Authorization Code com PKCE**. O React recebe o código de autorização, troca pelo conjunto de tokens e envia o `Access Token` no cabeçalho:

```http
Authorization: Bearer <ACCESS_TOKEN>
```

A API valida:

- assinatura pelas chaves JWKS do Cognito;
- `exp` e validade temporal;
- `iss` do User Pool;
- `client_id`/audience esperado;
- `token_use=access`.

### Permissões por objeto

| Papel | Visualizar | Editar | Compartilhar | Excluir |
|---|---:|---:|---:|---:|
| Proprietário | Sim | Sim | Sim | Sim |
| Editor | Sim | Sim | Conforme política | Não |
| Visualizador | Sim | Não | Não | Não |

## Integração externa

A BrasilAPI é consultada quando uma tarefa possui `due_at`.

- Cliente HTTP isolado em adapter próprio.
- Timeout curto e tratamento de indisponibilidade.
- Falhas não impedem o salvamento da tarefa.
- Testes utilizam mocks; a suíte não depende da internet.
- Respostas podem ser armazenadas em cache de processo durante a execução, sem introduzir Redis prematuramente.

## Mensageria

Fluxo principal:

```text
Tarefa compartilhada → Django → SQS → Lambda → SES
```

Garantias implementadas:

- publicação após confirmação da transação;
- consumo idempotente;
- retry automático;
- Dead Letter Queue;
- logs com `event_id` e `request_id`;
- e-mail fora do tempo de resposta da API.

## Segurança

- Cognito Managed Login: a aplicação não armazena senhas.
- Authorization Code + PKCE para o frontend público.
- Access tokens curtos e refresh tokens gerenciados pelo Cognito.
- Autorização por objeto em todas as operações de tarefa e compartilhamento.
- RDS sem acesso público e restrito por Security Groups.
- HTTPS no frontend e na API.
- CORS restrito aos domínios autorizados.
- Throttling/rate limiting no Django REST Framework.
- Validação de payloads e limites de tamanho.
- Secrets Manager em produção.
- Logs sem senhas, tokens ou dados sensíveis.
- Auditoria de criação, alteração, conclusão, compartilhamento e exclusão.
- Dependências verificadas no pipeline com `pip-audit` e `npm audit`.

## Observabilidade

O CloudWatch centraliza:

- logs JSON estruturados;
- `request_id` e correlação entre API, SQS e Lambda;
- latência e taxa de erro da API;
- erros e duração da Lambda;
- idade das mensagens na fila;
- quantidade de mensagens na DLQ;
- conexões e armazenamento do RDS.

Alarmes mínimos:

| Alarme | Condição |
|---|---|
| Erros da API | Aumento de respostas `5xx` |
| Latência | Percentil elevado por período contínuo |
| DLQ | Uma ou mais mensagens disponíveis |
| Lambda | Erros ou throttling |
| RDS | Conexões, CPU ou armazenamento em nível crítico |

## Testes

### Backend — Pytest

```bash
docker compose exec backend pytest --cov=apps --cov-report=term-missing
```

Cobertura prioritária:

- regras de autorização por objeto;
- isolamento entre usuários;
- CRUD de tarefas e categorias;
- conclusão e reabertura;
- filtros, ordenação e paginação;
- compartilhamento, aceite e recusa;
- idempotência do processamento assíncrono;
- timeout e falha da BrasilAPI;
- validação de JWT com chaves mockadas.

### Frontend

```bash
docker compose exec frontend npm run test
```

### Selenium E2E

```bash
docker compose run --rm selenium
```

Cenários principais:

1. Login e acesso à aplicação.
2. Criação de categoria e tarefa.
3. Filtro e paginação.
4. Conclusão e reabertura.
5. Compartilhamento e aceite do convite.

### Qualidade estática

```bash
docker compose exec backend ruff check .
docker compose exec backend ruff format --check .
docker compose exec frontend npm run lint
```

## CI/CD

### Pull request

1. Ruff e verificação de formatação.
2. Pytest com relatório de cobertura.
3. Lint e testes do frontend.
4. Selenium para fluxos críticos.
5. Verificação de dependências.
6. Build das imagens Docker.

### Branch `main`

1. Build da imagem do backend.
2. Push no Amazon ECR.
3. Aplicação das migrations por tarefa controlada.
4. Deploy no ECS Fargate.
5. Deploy do frontend pelo Amplify.
6. Health check pós-deploy.
7. Rollback em caso de falha.

## Deploy na AWS

| Componente | Serviço AWS |
|---|---|
| Frontend | Amplify Hosting |
| Autenticação | Cognito User Pool + Managed Login |
| Imagem do backend | ECR |
| Backend | ECS Fargate atrás de Application Load Balancer |
| Banco | RDS PostgreSQL em subnet privada |
| Fila | SQS com DLQ |
| Worker | Lambda |
| E-mail | SES |
| Segredos | Secrets Manager |
| Logs e métricas | CloudWatch |

### Configurações de produção

- `DEBUG=false`.
- RDS privado e backups habilitados.
- HTTPS com certificado gerenciado.
- domínio de callback do Cognito restrito ao frontend publicado.
- SES fora do sandbox ou destinatários verificados durante a avaliação.
- migrations executadas antes da troca de tráfego.

## Modelagem e diagramas

Os diagramas foram mantidos em Mermaid para permitir versionamento, revisão por pull request e renderização direta no GitHub.

### Diagramas de sequência

<details>
<summary><strong>1. Autenticação com e-mail/senha ou Google</strong></summary>

```mermaid
    %%{init: {
    "theme": "base",
    "themeVariables": {
        "fontFamily": "Inter, Arial",
        "actorBkg": "#EFF6FF",
        "actorBorder": "#2563EB",
        "signalColor": "#334155",
        "noteBkgColor": "#FEF9C3"
    }
    }}%%

    sequenceDiagram
        autonumber

        actor Usuario
        participant React as React + TypeScript
        participant Cognito as Cognito Managed Login
        participant Google as Google Identity
        participant Token as Cognito Token Endpoint
        participant API as Django REST API
        participant JWKS as Cognito JWKS

        Usuario->>React: Seleciona entrar
        React->>React: Gera code_verifier e code_challenge
        React->>Cognito: Redireciona para /oauth2/authorize<br/>Authorization Code + PKCE

        alt Login com e-mail e senha
            Usuario->>Cognito: Informa e-mail e senha
            Cognito->>Cognito: Valida credenciais no User Pool

            alt Credenciais inválidas
                Cognito-->>Usuario: Exibe erro de autenticação
            end

        else Login com Google
            Usuario->>Cognito: Seleciona entrar com Google
            Cognito->>Google: Redireciona para autenticação
            Usuario->>Google: Autentica-se
            Google-->>Cognito: Retorna identidade autenticada
        end

        Cognito-->>React: Redireciona ao callback com authorization_code
        React->>Token: Troca code + code_verifier
        Token-->>React: Access Token + ID Token + Refresh Token

        React->>API: Requisição com Bearer Access Token
        API->>JWKS: Obtém chave pública, se não estiver em cache
        JWKS-->>API: Chave pública
        API->>API: Valida assinatura, expiração, issuer e client_id

        alt Token válido
            API-->>React: 200 OK
            React-->>Usuario: Acesso liberado
        else Token inválido ou expirado
            API-->>React: 401 Unauthorized
            React-->>Usuario: Solicita nova autenticação
        end
```

</details>

<details>
<summary><strong>2. Criação ou atualização de tarefa</strong></summary>

```mermaid
%%{init: {
  "theme": "base",
  "themeVariables": {
    "fontFamily": "Inter, Arial",
    "actorBkg": "#F0FDF4",
    "actorBorder": "#16A34A",
    "signalColor": "#334155",
    "noteBkgColor": "#FEF9C3"
  }
}}%%

sequenceDiagram
    autonumber
    actor Usuario
    participant React
    participant API as Django REST API
    participant Auth as Política de Autorização
    participant Feriados as BrasilAPI
    participant DB as PostgreSQL

    Usuario->>React: Cria ou edita tarefa
    React->>API: POST/PATCH /tasks + JWT
    API->>Auth: Verifica identidade e permissão

    alt Usuário autorizado
        Auth-->>API: Permitido
        API->>Feriados: Consulta feriado para due_at

        alt API externa disponível
            Feriados-->>API: Resultado da consulta
        else Timeout ou indisponibilidade
            Feriados--xAPI: Falha na consulta
            Note over API: Registra falha sem bloquear a operação
        end

        API->>DB: Salva tarefa e auditoria
        DB-->>API: Transação confirmada
        API-->>React: 201 Created / 200 OK
        React-->>Usuario: Tarefa salva
    else Usuário sem permissão
        Auth-->>API: Negado
        API-->>React: 403 Forbidden
    end
```

</details>

<details>
<summary><strong>3. Compartilhamento e notificação assíncrona</strong></summary>

```mermaid
%%{init: {
  "theme": "base",
  "themeVariables": {
    "fontFamily": "Inter, Arial",
    "actorBkg": "#FFF7ED",
    "actorBorder": "#EA580C",
    "signalColor": "#334155",
    "noteBkgColor": "#FEF9C3"
  }
}}%%

sequenceDiagram
    autonumber
    actor Usuario
    participant React
    participant API as Django REST API
    participant Auth as Política de Autorização
    participant DB as PostgreSQL
    participant SQS as Amazon SQS
    participant Lambda as AWS Lambda
    participant SES as Amazon SES

    Usuario->>React: Compartilha tarefa
    React->>API: POST /tasks/{id}/shares + JWT
    API->>Auth: Verifica permissão de compartilhamento

    alt Compartilhamento permitido
        Auth-->>API: Permitido
        API->>DB: Cria convite e auditoria
        DB-->>API: Transação confirmada
        API->>SQS: Publica TaskShared
        API-->>React: 202 Accepted

        SQS->>Lambda: Entrega mensagem
        Lambda->>DB: Verifica idempotência

        alt Evento ainda não processado
            DB-->>Lambda: Processamento permitido
            Lambda->>SES: Envia convite por e-mail

            alt Envio concluído
                SES-->>Lambda: Sucesso
                Lambda->>DB: Marca evento como processado
                Lambda-->>SQS: Confirma processamento
            else Falha temporária
                SES--xLambda: Erro no envio
                Lambda--xSQS: Mensagem retorna para retry
                Note over SQS,Lambda: Após as tentativas, segue para DLQ
            end
        else Evento duplicado
            DB-->>Lambda: Evento já processado
            Lambda-->>SQS: Descarta duplicidade
        end
    else Compartilhamento não permitido
        Auth-->>API: Negado
        API-->>React: 403 Forbidden
    end
```

</details>

<details>
<summary><strong>4. Aceite ou recusa de convite</strong></summary>

```mermaid
%%{init: {
  "theme": "base",
  "themeVariables": {
    "fontFamily": "Inter, Arial",
    "actorBkg": "#FAF5FF",
    "actorBorder": "#9333EA",
    "signalColor": "#334155",
    "noteBkgColor": "#FEF9C3"
  }
}}%%

sequenceDiagram
    autonumber
    actor Usuario
    participant React
    participant API as Django REST API
    participant Auth as Política de Autorização
    participant DB as PostgreSQL

    Usuario->>React: Aceita ou recusa convite
    React->>API: PATCH /shares/{id} + JWT
    API->>Auth: Verifica destinatário do convite

    alt Usuário é o destinatário
        Auth-->>API: Permitido
        API->>DB: Atualiza status e registra auditoria
        DB-->>API: Transação confirmada
        API-->>React: 200 OK
        React-->>Usuario: Convite atualizado
    else Usuário não é o destinatário
        Auth-->>API: Negado
        API-->>React: 403 Forbidden
    end
```

</details>

<details>
<summary><strong>5. Listagem, filtros, ordenação e paginação</strong></summary>

```mermaid
%%{init: {
  "theme": "base",
  "themeVariables": {
    "fontFamily": "Inter, Arial",
    "actorBkg": "#ECFEFF",
    "actorBorder": "#0891B2",
    "signalColor": "#334155",
    "noteBkgColor": "#FEF9C3"
  }
}}%%

sequenceDiagram
    autonumber
    actor Usuario
    participant React
    participant API as Django REST API
    participant Auth as Política de Autorização
    participant DB as PostgreSQL

    Usuario->>React: Define filtros, ordenação e página
    React->>API: GET /tasks?status=&category=&search=&ordering=&page=
    API->>Auth: Define escopo de acesso
    Auth-->>API: Tarefas próprias e compartilhadas
    API->>DB: Executa consulta filtrada e paginada
    DB-->>API: Resultados e total de registros
    API-->>React: items, count, next e previous
    React-->>Usuario: Exibe tarefas
```

</details>

<details>
<summary><strong>6. Conclusão ou reabertura</strong></summary>

```mermaid
%%{init: {
  "theme": "base",
  "themeVariables": {
    "fontFamily": "Inter, Arial",
    "actorBkg": "#FEF2F2",
    "actorBorder": "#DC2626",
    "signalColor": "#334155",
    "noteBkgColor": "#FEF9C3"
  }
}}%%

sequenceDiagram
    autonumber
    actor Usuario
    participant React
    participant API as Django REST API
    participant Auth as Política de Autorização
    participant DB as PostgreSQL

    Usuario->>React: Conclui ou reabre tarefa
    React->>API: PATCH /tasks/{id}/complete ou /reopen
    API->>Auth: Verifica proprietário ou editor

    alt Usuário autorizado
        Auth-->>API: Permitido
        API->>DB: Atualiza status, versão e auditoria
        DB-->>API: Transação confirmada
        API-->>React: 200 OK
        React-->>Usuario: Status atualizado
    else Usuário somente visualizador
        Auth-->>API: Negado
        API-->>React: 403 Forbidden
    end
```

</details>

### Diagrama de classes

<details>
<summary><strong>Classes de domínio e aplicação</strong></summary>

```mermaid
classDiagram
    class UserAccount {
        +UUID id
        +string cognitoSub
        +string email
        +string name
        +datetime createdAt
    }

    class Category {
        +UUID id
        +string name
        +string color
        +datetime createdAt
        +update()
        +delete()
    }

    class Task {
        +UUID id
        +string title
        +string description
        +TaskStatus status
        +Priority priority
        +datetime dueAt
        +int version
        +datetime createdAt
        +datetime updatedAt
        +complete()
        +reopen()
        +update()
        +softDelete()
    }

    class TaskShare {
        +UUID id
        +SharePermission permission
        +ShareStatus status
        +datetime createdAt
        +accept()
        +reject()
    }

    class AuditLog {
        +UUID id
        +string action
        +JSON changes
        +datetime createdAt
    }

    class TaskService {
        +createTask()
        +updateTask()
        +completeTask()
        +deleteTask()
    }

    class SharingService {
        +shareTask()
        +acceptInvitation()
        +rejectInvitation()
        +validatePermission()
    }

    class HolidayClient {
        +checkHoliday(date, state)
    }

    class TaskViewSet {
        +list()
        +create()
        +update()
        +destroy()
        +complete()
    }

    UserAccount "1" --> "0..*" Category : possui
    UserAccount "1" --> "0..*" Task : cria
    Category "1" --> "0..*" Task : organiza
    Task "1" *-- "0..*" TaskShare : compartilhamentos
    UserAccount "1" --> "0..*" TaskShare : recebe
    Task "1" --> "0..*" AuditLog : histórico
    UserAccount "1" --> "0..*" AuditLog : executa

    TaskViewSet --> TaskService
    TaskService --> HolidayClient
    TaskService --> Task
    SharingService --> TaskShare
```

</details>

### Modelo relacional

<details>
<summary><strong>Relações, chaves e referências</strong></summary>

```
USER_ACCOUNT(id, cognito_sub, email, name, created_at, updated_at)
PK: id | UK: cognito_sub | UK: email

CATEGORY(id, name, color, created_at, updated_at, #owner_id)
PK: id | FK: CATEGORY[owner_id] => USER_ACCOUNT[id] | UK: (owner_id, name)

TASK(id, title, description, status, priority, due_at, version, created_at, updated_at, deleted_at, #owner_id, #category_id)
PK: id | FK: TASK[owner_id] => USER_ACCOUNT[id] | FK: TASK[category_id] => CATEGORY[id]

TASK_SHARE(id, permission, status, created_at, responded_at, #task_id, #shared_with_id, #shared_by_id)
PK: id | FK: TASK_SHARE[task_id] => TASK[id] | FK: TASK_SHARE[shared_with_id] => USER_ACCOUNT[id] | FK: TASK_SHARE[shared_by_id] => USER_ACCOUNT[id] | UK: (task_id, shared_with_id)

AUDIT_LOG(id, action, changes, created_at, #task_id, #actor_id)
PK: id | FK: AUDIT_LOG[task_id] => TASK[id] | FK: AUDIT_LOG[actor_id] => USER_ACCOUNT[id]
```

</details>

### Modelo entidade-relacionamento

<details>
<summary><strong>Entidades, atributos e cardinalidades</strong></summary>

```mermaid
erDiagram
    USER_ACCOUNT {
        uuid id PK
        string cognito_sub UK
        string email UK
        string name
        datetime created_at
        datetime updated_at
    }

    CATEGORY {
        uuid id PK
        uuid owner_id FK
        string name
        string color
        datetime created_at
        datetime updated_at
    }

    TASK {
        uuid id PK
        uuid owner_id FK
        uuid category_id FK
        string title
        text description
        string status
        string priority
        datetime due_at
        integer version
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    TASK_SHARE {
        uuid id PK
        uuid task_id FK
        uuid shared_with_id FK
        uuid shared_by_id FK
        string permission
        string status
        datetime created_at
        datetime responded_at
    }

    AUDIT_LOG {
        uuid id PK
        uuid task_id FK
        uuid actor_id FK
        string action
        json changes
        datetime created_at
    }

    USER_ACCOUNT ||--o{ CATEGORY : owns
    USER_ACCOUNT ||--o{ TASK : owns
    CATEGORY ||--o{ TASK : categorizes
    TASK ||--o{ TASK_SHARE : has
    USER_ACCOUNT ||--o{ TASK_SHARE : receives
    USER_ACCOUNT ||--o{ TASK_SHARE : sends
    TASK ||--o{ AUDIT_LOG : generates
    USER_ACCOUNT ||--o{ AUDIT_LOG : performs
```

</details>

### C4 — C1: contexto

<details>
<summary><strong>Usuário, sistema e dependências externas</strong></summary>

```mermaid
C4Context
    title C1 — Contexto do Sistema

    Person(user, "Usuário", "Cria, organiza e compartilha tarefas")

    System(taskSystem, "Task Management System", "Gerenciamento colaborativo de tarefas")

    System_Ext(cognito, "Amazon Cognito", "Autenticação, Google SSO e emissão de tokens")
    System_Ext(google, "Google Identity", "Login social")
    System_Ext(holidayApi, "BrasilAPI", "Consulta de feriados")
    System_Ext(ses, "Amazon SES", "Envio de notificações por e-mail")

    Rel(user, taskSystem, "Utiliza", "HTTPS")
    Rel(taskSystem, cognito, "Autentica usuários", "OAuth 2.0 / OIDC")
    Rel(cognito, google, "Delega autenticação")
    Rel(taskSystem, holidayApi, "Consulta feriados", "REST")
    Rel(taskSystem, ses, "Envia notificações")
```

</details>

### C4 — C2: contêineres

<details>
<summary><strong>Aplicações e serviços executáveis</strong></summary>

```mermaid
C4Container
    title C2 — Contêineres

    Person(user, "Usuário")

    System_Ext(cognito, "Amazon Cognito", "Autenticação e SSO")
    System_Ext(holidayApi, "BrasilAPI", "Consulta de feriados")
    System_Ext(ses, "Amazon SES", "Envio de e-mails")
    System_Ext(cloudwatch, "Amazon CloudWatch", "Logs, métricas e alarmes")

    System_Boundary(system, "Task Management System") {
        Container(frontend, "Aplicação Web", "React + TypeScript / AWS Amplify", "Interface do usuário")

        Container(api, "API Backend", "Django REST Framework / ECS Fargate", "Regras de negócio e autorização")

        ContainerDb(database, "Banco de Dados", "Amazon RDS PostgreSQL", "Armazena usuários, tarefas e compartilhamentos")

        Container(queue, "Fila de Eventos", "Amazon SQS", "Desacopla notificações assíncronas")

        Container(worker, "Processador Assíncrono", "AWS Lambda", "Processa eventos e envia notificações")
    }

    Rel(user, frontend, "Utiliza", "HTTPS")
    Rel(frontend, cognito, "Realiza login", "OAuth 2.0 / OIDC")
    Rel(frontend, api, "Consome", "REST/JSON + JWT")
    Rel(api, database, "Lê e grava", "SQL")
    Rel(api, holidayApi, "Consulta feriados", "HTTPS")
    Rel(api, queue, "Publica eventos")
    Rel(queue, worker, "Entrega mensagens")
    Rel(worker, ses, "Envia e-mails")
    Rel(api, cloudwatch, "Envia logs e métricas")
    Rel(worker, cloudwatch, "Envia logs e métricas")
```

</details>

### C4 — C3: componentes

<details>
<summary><strong>Organização interna da API Django</strong></summary>

```mermaid
%%{init: {
  "theme": "base",
  "themeVariables": {
    "fontFamily": "Inter, Arial",
    "primaryColor": "#ECFDF5",
    "primaryTextColor": "#064E3B",
    "primaryBorderColor": "#059669",
    "lineColor": "#475569",
    "secondaryColor": "#EFF6FF",
    "tertiaryColor": "#FFF7ED"
  }
}}%%
C4Component
    title C3 — Componentes da API Django

    Container_Ext(frontend, "Aplicação React", "Frontend")
    Container_Ext(cognito, "Amazon Cognito", "Autenticação")
    ContainerDb_Ext(database, "PostgreSQL", "Banco de dados")
    Container_Ext(queue, "Amazon SQS", "Mensageria")
    System_Ext(holidayApi, "BrasilAPI", "Feriados")

    Container_Boundary(api, "API Django REST Framework") {
        Component(jwtAuth, "Cognito JWT Authentication", "DRF Authentication", "Valida assinatura e claims do JWT")

        Component(taskController, "Task API", "ViewSets e Serializers", "Endpoints de tarefas")
        Component(categoryController, "Category API", "ViewSets e Serializers", "Endpoints de categorias")
        Component(sharingController, "Sharing API", "ViewSets e Serializers", "Endpoints de compartilhamento")

        Component(taskService, "Task Service", "Application Service", "Executa casos de uso de tarefas")
        Component(categoryService, "Category Service", "Application Service", "Gerencia categorias")
        Component(sharingService, "Sharing Service", "Application Service", "Gerencia convites e permissões")

        Component(permissionPolicy, "Permission Policy", "Domain Service", "Aplica regras de Owner, Editor e Viewer")
        Component(taskSelectors, "Task Selectors", "Query Services", "Executa filtros, busca e paginação")
        Component(models, "Domain Models", "Django Models", "Task, Category, TaskShare e AuditLog")

        Component(holidayClient, "Holiday Client", "HTTP Adapter", "Consulta a BrasilAPI")
        Component(eventPublisher, "Event Publisher", "SQS Adapter", "Publica eventos assíncronos")
    }

    Rel(frontend, jwtAuth, "Envia JWT")
    Rel(frontend, taskController, "Consome")
    Rel(frontend, categoryController, "Consome")
    Rel(frontend, sharingController, "Consome")

    Rel(jwtAuth, cognito, "Valida chaves públicas")

    Rel(taskController, taskService, "Executa")
    Rel(categoryController, categoryService, "Executa")
    Rel(sharingController, sharingService, "Executa")

    Rel(taskService, permissionPolicy, "Verifica autorização")
    Rel(sharingService, permissionPolicy, "Verifica autorização")
    Rel(taskService, taskSelectors, "Consulta tarefas")

    Rel(taskService, models, "Manipula")
    Rel(categoryService, models, "Manipula")
    Rel(sharingService, models, "Manipula")

    Rel(models, database, "Persiste via Django ORM")
    Rel(taskService, holidayClient, "Consulta feriados")
    Rel(holidayClient, holidayApi, "REST")
    Rel(sharingService, eventPublisher, "Publica TaskShared")
    Rel(eventPublisher, queue, "Envia mensagem")
```

</details>

## Estratégia de commits

Os commits devem ser pequenos, revisáveis e focados em uma única alteração.

```text
chore: configure django, react and docker environment
feat(auth): integrate cognito managed login
feat(tasks): implement task and category management
feat(sharing): add object-level permissions and invitations
feat(integrations): add holiday API client
feat(events): publish task shared events to SQS
test(api): cover task authorization and pagination
test(e2e): add selenium critical user flows
ci: configure quality checks and deployment pipeline
docs: document architecture and execution
```

Antes do envio:

- histórico sem commits gigantes ou genéricos;
- nenhuma credencial versionada;
- branch principal executável;
- pipeline verde;
- README validado em uma máquina limpa.

## Limitações conhecidas

- A integração de feriados é informativa e não bloqueia a criação da tarefa.
- A revogação imediata de um access token já emitido depende da estratégia do Cognito; tokens curtos reduzem a janela de exposição.
- O envio pelo SES pode exigir verificação de remetentes e destinatários em ambiente sandbox.
- O projeto não utiliza Redis, Kafka, RabbitMQ ou Prometheus porque o escopo não justifica o custo operacional.
- O C4 nível 4 não foi criado: o diagrama de classes e o código já fornecem o nível de detalhe necessário.

## Entrega

Checklist final da banca:

- [ ] Repositório público e acessível.
- [ ] README revisado.
- [ ] `docker compose up --build` executa o projeto.
- [ ] Migrations versionadas.
- [ ] Testes Pytest aprovados.
- [ ] Testes Selenium aprovados.
- [ ] GitHub Actions verde.
- [ ] Aplicação publicada na AWS.
- [ ] Link enviado para `recrutamento@advicehealth.com.br` dentro do prazo.

---

<div align="center">

Desenvolvido por **Ademar Castro** para avaliação técnica de Desenvolvedor Python Back-end.

</div>
