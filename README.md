💻 Front-end
📁 Estrutura de Telas

frontend/
├── pages/
│   ├── login.tsx
│   ├── register.tsx
│   ├── dashboard-usuario.tsx
│   ├── dashboard-agente.tsx
│   ├── enviar-denuncia.tsx
├── components/
├── services/
├── hooks/
└── App.tsx

📌 Funcionalidades

Login e Registro

Registro com nome, email, senha e tipo de usuário

Redirecionamento com base no tipo:

Comum → Tela de envio

Agente → Painel administrativo

Tela de Envio de Denúncia

Campos obrigatórios: título, descrição, imagem, mapa

Validações visuais e feedback ao usuário

Tela do Usuário

Lista de suas denúncias com status, data e opção de detalhes

Painel Administrativo

Filtros por status e data

Atualização do status

Comentários de acompanhamento

Visualização de mapa e imagem

🌟 Melhorias (opcionais)

Gráficos com quantidade por bairro/status

Mapa de calor das denúncias

Notificações visuais em tempo real