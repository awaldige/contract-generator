# 📄 AW Contract Generator

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat&logo=vercel&logoColor=white)

Aplicação web para **geração automatizada de contratos**, permitindo preencher dados, visualizar o documento e exportar em PDF pronto para assinatura.

Projeto desenvolvido por **André Waldige** para fins de portfólio e demonstração técnica.

---

## 🌐 Demonstração Online

Acesse o sistema:

🔗 https://aw-contract-generator.vercel.app/

---

## 🖼️ Demonstração Visual

![Captura de tela 2026-04-02 145233](https://github.com/user-attachments/assets/cf02ef58-79e6-43d6-9a8d-7b756d2e6531)
![Captura de tela 2026-04-02 145036](https://github.com/user-attachments/assets/0fbb6ff2-43de-4aec-9671-46be6702af9c)
![Captura de tela 2026-04-02 145013](https://github.com/user-attachments/assets/a70159e8-af58-4ca5-8cfe-115992cf51d0)

---
## ✨ Funcionalidades

| Recurso | Descrição |
|----------|-----------|
| 📥 Inserção de dados | Informações do contratante e contratado |
| 📄 Tipos de contrato | Prestação de serviços, compra e venda e outros |
| 💰 Campos adicionais | Valores, prazos, datas e cláusulas extras |
| 👁 Pré-visualização | Visualização dinâmica antes da exportação |
| 📑 Exportação PDF | Documento pronto para impressão/assinatura |
| 💾 Rascunho automático | Salvar e carregar dados temporários |

---

## 🛠 Tecnologias Utilizadas

| Tecnologia | Função |
|------------|--------|
| HTML5 | Estrutura da aplicação |
| CSS3 | Estilização e layout responsivo |
| JavaScript | Lógica e interações |
| html2canvas | Captura da pré-visualização |
| jsPDF | Geração do arquivo PDF |

---

## 🚀 Como Utilizar

1. Acesse o projeto online ou abra localmente.
2. Preencha os dados do contrato.
3. Clique em **Gerar Preview** para visualizar.
4. Clique em **Exportar PDF** para salvar o documento.
5. Opcionalmente, utilize **Salvar rascunho** para continuar depois.

---
## 📂 Estrutura do Projeto

```text
├── index.html          # Interface principal e formulários
├── assets/
│   ├── css/
│   │   └── style.css   # Estilização e media queries (Responsividade)
│   ├── js/
│   │   ├── main.js     # Lógica de manipulação do DOM e Rascunho
│   │   └── pdf.js      # Integração com jsPDF e html2canvas
│   └── img/            # Assets visuais e screenshots
└── README.md           # Documentação do sistema

## 🧠 Desafios Técnicos e Soluções

- **Fidelidade do PDF:** O uso do `html2canvas` foi essencial para garantir que a estilização CSS (fontes e espaçamentos) fosse preservada exatamente como na pré-visualização.
- **Persistência Offline:** Implementação de `LocalStorage` para que o usuário não perca os dados digitados caso a página seja recarregada acidentalmente.
- **Responsividade:** O formulário foi projetado com Flexbox/Grid para garantir usabilidade tanto em desktops quanto em dispositivos móveis.

## 📝 Licença

Este projeto está sob a licença MIT. 

---
Feito com ☕ por [André Waldige](https://github.com/awaldige)
