# 📄 AW Contract Generator

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![jsPDF](https://img.shields.io/badge/jsPDF-PDF-red?style=flat)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat&logo=vercel)

Aplicação web para criação, visualização, gerenciamento e exportação de contratos em PDF, desenvolvida com HTML5, CSS3 e JavaScript.

O projeto possui interface responsiva, preenchimento organizado por etapas, pré-visualização do documento e armazenamento local de contratos no navegador.

## 🌐 Demonstração

[Acessar AW Contract Generator](https://aw-contract-generator.vercel.app/)

## ✨ Funcionalidades

- Criação de contratos a partir de modelos disponíveis.
- Formulário organizado por seções.
- Cadastro de contratante e contratado.
- Descrição do objeto do contrato.
- Definição de valores e prazos.
- Inclusão de cláusulas personalizadas.
- Pré-visualização do contrato em formato A4.
- Exportação do documento em PDF.
- Salvamento de múltiplos contratos no navegador.
- Carregamento, duplicação e exclusão de contratos salvos.
- Recuperação de rascunho de uma versão anterior.
- Validação de campos obrigatórios e datas.
- Interface responsiva para diferentes dispositivos.

## 🛠️ Tecnologias utilizadas

| Tecnologia | Aplicação |
|---|---|
| HTML5 | Estrutura da aplicação |
| CSS3 | Layout, identidade visual e responsividade |
| JavaScript | Lógica, validações e gerenciamento dos contratos |
| LocalStorage | Armazenamento local dos documentos |
| jsPDF | Geração e exportação de arquivos PDF |
| Vercel | Hospedagem e publicação |

## 🎨 Interface

O projeto utiliza uma identidade visual moderna, com tons escuros, detalhes em azul e elementos de destaque para facilitar a navegação.

A interface foi organizada em duas áreas principais:

- **Formulário:** preenchimento das informações do contrato.
- **Pré-visualização:** visualização do documento antes da exportação.

## 🚀 Como executar localmente

1. Clone este repositório:

   ```bash
   git clone https://github.com/awaldige/contract-generator.git
   ```

2. Entre na pasta:

   ```bash
   cd contract-generator
   ```

3. Abra o arquivo `index.html` no navegador ou utilize a extensão Live Server do Visual Studio Code.

Não é necessário configurar banco de dados ou backend.

## 💾 Armazenamento

Os contratos são armazenados no `LocalStorage` do navegador.

Isso permite salvar e recuperar documentos no mesmo navegador e dispositivo. Os dados não são sincronizados entre dispositivos e podem ser perdidos se o armazenamento do navegador for apagado.

## 📄 Exportação em PDF

A aplicação utiliza a biblioteca jsPDF para gerar documentos em PDF no formato A4, com organização de conteúdo, quebras de página e identificação das páginas.

## ⚠️ Aviso importante

Este projeto é uma ferramenta demonstrativa para criação de documentos e modelos de contratos.

Os documentos gerados devem ser revisados e adaptados às necessidades de cada situação. A aplicação não substitui a orientação de um profissional jurídico e não garante, por si só, a validade legal dos contratos.

Não utilize informações confidenciais ou dados reais sensíveis em ambientes de demonstração.

## 👨‍💻 Desenvolvido por

**André Waldige — AW TECHNOLOGY**

Desenvolvimento de sistemas web, aplicações personalizadas e soluções digitais.

- Portfólio: https://andre-waldige.vercel.app/
- GitHub: https://github.com/awaldige

## 📜 Licença

Este projeto está sob a licença MIT.