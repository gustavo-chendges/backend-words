# Backend LangApp
- Link: https://gustavo-chendges.github.io/frontend-words/#/
- Esse é backend do LangApp, a primeira versão de um projeto acadêmico/educacional que ainda vai receber diversas atualizações, refatorações e novas funcionalidades. A ideia pr trás do app é servir como um caderno online para estudantes de idiomas, no qual o usuário pode adicionar palavras novas na língua-alvo, suas categorias gramáticais e uma lista de traduções (máximo de três por palavra).

## Descrição:
- Além do sistema de CRUD básico, o sistema conta com autenticação via JWT, com tokens de acesso (que permitem expiram mais rapidamente e permitem o acesso aos recursos da plataforma) e tokens de refresh (que são enviados e armazenados somente em cookies e servem para emitir novos tokens de acesso e possuem uma duração maior). Também foi implementado um sistema de cadastro via email e nome de usuário (sendo ambos chaves primárias no banco de dados), validação de email (via token) e recuperação de senha (que requer que o email tenha sido previamente validado.
- No backend especialmente, foram tomadas decisões após consulta a documentação, tutoriais do YouTube e ferramentas de inteligência artificial. Mais do que no frontend, algumas escolhas iniciais se demonstraram insustentáveis e foram substituídas por uma versão atualizada da API ao longo do desenvolvimento. Um exemplo disso são os arquivos relacionados a "words" (tanto controllers, como validadores e rotas), que tiveram que ser migrados para uma segunda versão (por isso, encontram-se dentro de pastas denominadas "/v2"), pois as relações de cardinalidade no banco de dados, bem como a escalabilidade não haviam sido consideradas corretamente.
- Outro elemento "legado", mas funcional, é a decisão e manter as palavras básicas (disponíveis por padrão) em um arquivo JSON armazenado no próprio repositório, ao invés de migrá-las para uma tabela própria no MongoDB. Essa reestruturação será considerada no futuro.

## Arquitetura e tecnologias utilizadas:
- NodeJS (com Javascript).
- Express para configuração de rotas.
- MongoDB no banco de dados (com Mongoose).
- Zod para validação de dados recebidos.
- bcrypt e JWT para criptografia e autenticação
- Express-rate-limiter.
- Pino para logs.

### Fluxo da aplicação:
- Requisição do usuário -> rotas -> middlewares -> validadores -> controllers -> MongoDB

## Funcionalidades:
- CRUD simples de palavras em inglês com suas traduções
- Cadastro e login de usuários com email, nome e senha.
- Validação de email para permitir recuperação da senha e edição de dados da conta.
- Rate limiting básico para login, validação de email e operações de fetch.
- Observabilidade através de logs com Pino.
- Deploy via Vercel.

## Desafios enfrentados:
### Modelagem do banco de dados:
- Inicialmente,a ideia era usar somente
- 
### Implementação de middleware
- No primeiro momento,
### 


## Segurança:

## Instalação:
- git clone https://github.com/gustavo-chendges/backend-words.git
- npm run install
- Crie .env com as seguintes variáveis:
- DATABASE_URI = 
- ACCESS_TOKEN_SECRET = 
- REFRESH_TOKEN_SECRET = 
- EMAIL_USER = m
- EMAIL_PASS = 
- NODE_ENV =

## Melhorias futuras:
- Suporte a múltiplas sessões.
- Rotação de tokens.
- Migração das palavras básicas para o banco de dados.
- Criação de um "pool" único de palavras no banco de dados, do qual os usuários apenas recebem uma relação em uma tabela separada, na qual são aplicadas todas as personalizações.
- Sistema de repetição espaçada.
- Possibilidade de compatilhamento de deques entre usuários.
- Implementação de sistema de autorização para diferenciar usuários "Professores" e "Alunos".
- Criação de serviço ou app alternativo de exercícios no qual usuários "Professores" podem postar conteúdos.

# Importante
- Por se tratar de um projeto de nível inciante, é possível que algumas funcionalidades não sigam o padrão comum em projetos profissionais reais.

# Notas:
- Confira também o frontend: https://github.com/gustavo-chendges/frontend-words
