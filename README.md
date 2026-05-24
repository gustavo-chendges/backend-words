# Backend LangApp
- Link: https://gustavo-chendges.github.io/frontend-words/#/
- Esse é backend do LangApp, a primeira versão de um projeto acadêmico/educacional que ainda vai receber diversas atualizações, refatorações e novas funcionalidades. A ideia pr trás do app é servir como um caderno online para estudantes de idiomas, no qual o usuário pode adicionar palavras novas na língua-alvo, suas categorias gramáticais e uma lista de traduções (máximo de três por palavra).

## Descrição:
- Além do sistema de CRUD básico, o sistema conta com autenticação via JWT, com tokens de acesso (que permitem expiram mais rapidamente e permitem o acesso aos recursos da plataforma) e tokens de refresh (que são enviados e armazenados somente em cookies e servem para emitir novos tokens de acesso e possuem uma duração maior). Também foi implementado um sistema de cadastro via email e nome de usuário, validação de email (via token) e recuperação de senha (que requer que o email tenha sido previamente validado.
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
- Observabilidade básica através de logs com Pino.
- Deploy via Vercel.

## Desafios enfrentados:
### Modelagem do banco de dados:
- Inicialmente, a ideia era usar somente arquivos JSON locais e o módulo fs para armazenar as palavras (tanto aquelas disponibilizadas por padrão como aquelas informada pelo usuário). Essa estratégia se demonstrou uma má escolhaem termos de escalabilidade e acoplamento.
- Depois, as palavras personalizadas foram movidas para um array dentro do modelo User no MongoDB. Mesmo que relativamente melhor que a solução anterior, ainda apresentava problema de escalabilidade e desempenho.
- A solução aqui foi migrar a API (ou pelo menos o endpoint Words) para uma "v2", na qual as palavras básicas ficam armazenadas em um JSON local e as palavras personalizadas são transferidas para o MongoDB em uma relação de cardinalidade n para n (um usuário pode ter várias palavras e a mesma palavra pode ser inserida por vários usuários). Por isso, o modelo foi denominado "UserWords".
### Implementação de middleware
- No primeiro momento, middlewares pareciam um pouco obscuros e desnecessários. No entanto, como o progresso do desenvolvimento do app, sua utililidade e função se tornou clara e eles são usados nessa versão do app para validação de token de acesso, dados enviados pelo usuário e rate limiting.
### Estrutura de validação:
- A validação dos dados recebidos na requisição do usuário eram inicialmente feitas nos próprios controllers, seguindo um modelo aprendido de um tutorial, adaptado às necessidades da aplicação. No entanto, isso os tornava excessivamente grandes e repetitivos. Assim, foi tomada a decisão de usar schemas Zod + middleware para centralizar a validação e as mensagens de erro relacionadas diretamente às informações enviadas do frontend.

## Segurança:
- Cadastro com nome de usuário, email e senha.
- Senha criptografada com bcrypt.
- Nome de usuário e email únicos.
- Tokens de acesso expiram rápido e controlam o acesso às requisições e transportam insformações da conta ao frontend.
- Tokens de refresh duram mais tempo e controlam a emissão de novos tokens de acesso. São enviados via cookies.
- Sistema opcional de validação de email através de token.
- Recuperação, mudança de senha e edição de informações da conta para usuários com email validado
- Decisões críticas (como exclusão da conta) protegidas po senha.

## Instalação:
- git clone https://github.com/gustavo-chendges/backend-words.git
- npm run install
- Crie .env com as seguintes variáveis:
- DATABASE_URI = 
- ACCESS_TOKEN_SECRET = 
- REFRESH_TOKEN_SECRET = 
- EMAIL_USER = 
- EMAIL_PASS = 
- NODE_ENV =
- PORT =
- npm run dev

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
