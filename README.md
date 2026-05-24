# Backend LangApp
- Esse é backend do LangApp, a primeira versão de um projeto acadêmico/educacional que ainda vai receber diversas atualizações, refatorações e novas funcionalidades. A ideia pr trás do app é servir como um caderno online para estudantes de idiomas, no qual o usuário pode adicionar palavras novas na língua-alvo, suas categorias gramáticais e uma lista de traduções (máximo de três).
- Além do sistema de CRUD básico, o sistema conta com autenticação via JWT, com tokens de acesso (que permitem expiram mais rapidamente e permitem o acesso aos recursos da plataforma) e tokens de refresh (que são enviados e armazenados somente em cookies e servem para emitir novos tokens de acesso e possuem uma duração maior). Também foi implementado um sistema de cadastro via email e nome de usuário (sendo ambos chaves primárias no banco de dados), validação de email (via token) e recuperação de senha (que requer que o email tenha sido previamente validado.

## Descrição:
- No backend especialmente, foram

## Tecnologias utilizadas:
- NodeJS (com Javascript)
- Express para configuração de rotas.
- MongoDB no banco de dados (com Mongoose).
- Zod para validação de dados recebidos.
- bcrypt e JWT para criptografia e autenticação
- Express-rate-limiter.
- Pino para logs.

## Funcionalidades:
- CRUD simples de palavras em inglês com suas traduções
- Cadastro e login de usuários com email, nome e senha.
- Validação de email para permitir recuperação da senha e edição de dados da conta.
- Rate limiting básico para login, validação de
- Observabilidade através de logs com Pino.
- Deploy via Vercel

## Melhorias futuras:
- Suporte a múltiplas sessões.
- 

# Importante
- Por se tratar de um projeto de nível inciante, é possível que algumas funcionalidades não sigam o padrão comum em projetos profissionais reais.
