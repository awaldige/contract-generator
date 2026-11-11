
document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // =========================================
    // ELEMENTOS E CONFIGURAÇÕES
    // =========================================

    const form = document.getElementById("formContrato");
    const preview = document.getElementById("contratoPreview");

    const btnGerar = document.getElementById("btnGerar");
    const btnExportarPDF = document.getElementById("btnExportarPDF");
    const btnSalvar = document.getElementById("btnSalvar");
    const btnCarregar = document.getElementById("btnCarregar");
    const btnLimpar = document.getElementById("btnLimpar");

    const STORAGE_KEY = "awContractGenerator_documents_v2";
    const OLD_STORAGE_KEY = "rascunhoContrato";

    let documentoAtualId = null;

    if (!form || !preview) {
        console.error("Não foi possível inicializar o AW Contract Generator.");
        return;
    }

    // =========================================
    // UTILITÁRIOS
    // =========================================

    function escaparHTML(valor) {
        return String(valor ?? "").replace(/[&<>"']/g, caractere => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[caractere]);
    }

    function formatarData(data) {
        if (!data) return "";

        const partes = data.split("-");

        if (partes.length !== 3) return "";

        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    // Converte valores brasileiros para números.
    // Exemplos:
    // 1.800,00 -> 1800
    // 2500,50  -> 2500.50
    // 10000    -> 10000
    // 1.800    -> 1800

    function converterParaNumero(valor) {
        if (valor === null || valor === undefined) {
            return null;
        }

        let texto = String(valor)
            .trim()
            .replace(/\s/g, "")
            .replace(/^R\$/i, "")
            .replace(/\s/g, "");

        if (!texto) return null;

        // Aceita somente números e separadores monetários.
        if (!/^-?[\d.,]+$/.test(texto)) {
            return NaN;
        }

        const temVirgula = texto.includes(",");
        const temPonto = texto.includes(".");

        if (temVirgula && temPonto) {
            // Formato brasileiro: 1.800,00
            texto = texto.replace(/\./g, "").replace(",", ".");
        } else if (temVirgula) {
            // Formato brasileiro: 1800,50
            texto = texto.replace(",", ".");
        } else if (temPonto) {
            const partes = texto.split(".");

            if (
                partes.length > 2 ||
                (partes.length === 2 && partes[1].length === 3)
            ) {
                // Formato de milhar: 1.800
                texto = texto.replace(/\./g, "");
            }
        }

        return Number(texto);
    }

    function formatarMoeda(valor) {
        if (valor === "" || valor === null || valor === undefined) {
            return "Não especificado.";
        }

        const numero = converterParaNumero(valor);

        if (!Number.isFinite(numero) || numero < 0) {
            return "Não especificado.";
        }

        return numero.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    function gerarId() {
        if (window.crypto && typeof window.crypto.randomUUID === "function") {
            return window.crypto.randomUUID();
        }

        return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }

    function gerarNomeArquivo(nome) {
        const nomeSeguro = String(nome || "contrato")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-zA-Z0-9_-]/g, "_")
            .replace(/_+/g, "_")
            .replace(/^_|_$/g, "")
            .slice(0, 60);

        return `Contrato_${nomeSeguro || "documento"}.pdf`;
    }

    function mostrarMensagem(mensagem) {
        alert(mensagem);
    }

    // =========================================
    // COLETA E VALIDAÇÃO
    // =========================================

    function coletarDados() {
        const dados = {};

        form.querySelectorAll("input, textarea, select").forEach(elemento => {
            dados[elemento.id] = elemento.value.trim();
        });

        return {
            tipoContrato: dados.tipoContrato || "Prestação de Serviços",
            contratante: dados.contratante || "",
            contratanteDoc: dados.contratanteDoc || "",
            contratado: dados.contratado || "",
            contratadoDoc: dados.contratadoDoc || "",
            objeto: dados.objeto || "",
            valor: dados.valor || "",
            prazo: dados.prazo || "",
            dataInicio: dados.dataInicio || "",
            dataFim: dados.dataFim || "",
            clausulas: dados.clausulas || ""
        };
    }

    function validarDados(dados) {
        if (!dados.contratante || !dados.contratado || !dados.objeto) {
            mostrarMensagem(
                "Preencha os campos obrigatórios:\n\n" +
                "• Contratante\n" +
                "• Contratado\n" +
                "• Objeto do contrato"
            );

            return false;
        }

        if (dados.valor !== "") {
            const valor = converterParaNumero(dados.valor);

            if (!Number.isFinite(valor) || valor < 0) {
                mostrarMensagem(
                    "Informe um valor válido para o contrato.\n\n" +
                    "Exemplo: 1.800,00"
                );

                return false;
            }
        }

        if (dados.dataInicio && dados.dataFim) {
            const inicio = new Date(`${dados.dataInicio}T00:00:00`);
            const fim = new Date(`${dados.dataFim}T00:00:00`);

            if (
                Number.isNaN(inicio.getTime()) ||
                Number.isNaN(fim.getTime())
            ) {
                mostrarMensagem("Verifique as datas informadas.");
                return false;
            }

            if (fim < inicio) {
                mostrarMensagem(
                    "A data de término não pode ser anterior à data de início."
                );

                return false;
            }
        }

        return true;
    }

    // =========================================
    // MONTAGEM DO CONTRATO
    // =========================================

    function montarHTMLContrato(dados) {
        const contratante = escaparHTML(dados.contratante);
        const contratanteDoc = escaparHTML(dados.contratanteDoc);
        const contratado = escaparHTML(dados.contratado);
        const contratadoDoc = escaparHTML(dados.contratadoDoc);

        const objeto = escaparHTML(dados.objeto).replace(/\n/g, "<br>");
        const prazo = escaparHTML(dados.prazo);
        const clausulas = escaparHTML(dados.clausulas).replace(/\n/g, "<br>");
        const tipo = escaparHTML(dados.tipoContrato);

        const dataInicio = formatarData(dados.dataInicio) || "Não especificada";
        const dataFim = formatarData(dados.dataFim) || "Não especificada";

        return `
            <div class="cabecalho">
                <h1>CONTRATO DE ${tipo.toUpperCase()}</h1>
                <hr>
            </div>

            <p class="clausula">
                <strong>1. DAS PARTES</strong><br><br>

                CONTRATANTE: ${contratante}<br>
                CPF/CNPJ: ${contratanteDoc || "Não informado"}.<br><br>

                CONTRATADO: ${contratado}<br>
                CPF/CNPJ: ${contratadoDoc || "Não informado"}.
            </p>

            <p class="clausula">
                <strong>2. DO OBJETO</strong><br><br>
                ${objeto}
            </p>

            <p class="clausula">
                <strong>3. DO PRAZO</strong><br><br>

                Prazo: ${prazo || "Não especificado"}.<br>
                Data de início: ${dataInicio}.<br>
                Data de término: ${dataFim}.
            </p>

            <p class="clausula">
                <strong>4. DO VALOR</strong><br><br>
                ${formatarMoeda(dados.valor)}
            </p>

            <p class="clausula">
                <strong>5. CLÁUSULAS ADICIONAIS</strong><br><br>
                ${clausulas || "Não há cláusulas adicionais."}
            </p>

            <p class="clausula">
                E, por estarem de acordo com as condições aqui descritas,
                as partes assinam o presente instrumento.
            </p>

            <div class="assinaturas">
                <div class="assinatura">
                    <p>________________________________</p>
                    <p><strong>CONTRATANTE</strong></p>
                    <p>${contratante}</p>
                </div>

                <div class="assinatura">
                    <p>________________________________</p>
                    <p><strong>CONTRATADO</strong></p>
                    <p>${contratado}</p>
                </div>
            </div>

            <p style="margin-top:35px; text-align:right;">
                Local e data: ______________________________
            </p>
        `;
    }

    // =========================================
    // PRÉ-VISUALIZAÇÃO
    // =========================================

    function gerarPreview() {
        const dados = coletarDados();

        if (!validarDados(dados)) return false;

        preview.innerHTML = montarHTMLContrato(dados);

        return true;
    }

    // =========================================
    // ARMAZENAMENTO LOCAL
    // =========================================

    function obterDocumentos() {
        try {
            const dados = localStorage.getItem(STORAGE_KEY);

            if (!dados) return [];

            const documentos = JSON.parse(dados);

            return Array.isArray(documentos) ? documentos : [];

        } catch (erro) {
            console.error("Erro ao ler os rascunhos:", erro);

            mostrarMensagem(
                "Não foi possível acessar os contratos salvos."
            );

            return [];
        }
    }

    function persistirDocumentos(documentos) {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(documentos)
            );

            return true;

        } catch (erro) {
            console.error("Erro ao salvar os contratos:", erro);

            mostrarMensagem(
                "Não foi possível salvar o documento. " +
                "Verifique o espaço disponível no navegador."
            );

            return false;
        }
    }

    function salvarRascunho() {
        const dados = coletarDados();

        if (!validarDados(dados)) return;

        const documentos = obterDocumentos();

        const existente = documentos.find(
            documento => documento.id === documentoAtualId
        );

        const nomeSugerido = existente?.nome || dados.contratante;

        const nome = prompt(
            "Digite um nome para identificar este contrato:",
            nomeSugerido
        );

        if (nome === null) return;

        if (!nome.trim()) {
            mostrarMensagem("Informe um nome para salvar o contrato.");
            return;
        }

        const agora = new Date().toISOString();

        if (existente) {
            existente.nome = nome.trim();
            existente.dados = dados;
            existente.atualizadoEm = agora;

        } else {
            const novoDocumento = {
                id: gerarId(),
                nome: nome.trim(),
                dados,
                criadoEm: agora,
                atualizadoEm: agora
            };

            documentos.push(novoDocumento);
            documentoAtualId = novoDocumento.id;
        }

        if (persistirDocumentos(documentos)) {
            mostrarMensagem("Contrato salvo com sucesso!");
        }
    }

    function migrarRascunhoAntigo() {
        const documentos = obterDocumentos();

        if (documentos.length > 0) return;

        try {
            const antigo = localStorage.getItem(OLD_STORAGE_KEY);

            if (!antigo) return;

            const dadosAntigos = JSON.parse(antigo);

            if (!dadosAntigos || typeof dadosAntigos !== "object") {
                return;
            }

            const dados = {};

            form.querySelectorAll("input, textarea, select").forEach(elemento => {
                dados[elemento.id] = String(
                    dadosAntigos[elemento.id] ?? ""
                );
            });

            const novoDocumento = {
                id: gerarId(),
                nome: "Rascunho antigo",
                dados,
                criadoEm: new Date().toISOString(),
                atualizadoEm: new Date().toISOString()
            };

            if (persistirDocumentos([novoDocumento])) {
                mostrarMensagem(
                    "Encontramos seu rascunho da versão anterior e o importamos."
                );
            }

        } catch (erro) {
            console.error(
                "Não foi possível importar o rascunho antigo:",
                erro
            );
        }
    }

    function carregarDocumento(documento) {
        if (!documento || !documento.dados) return;

        form.querySelectorAll("input, textarea, select").forEach(elemento => {
            if (
                Object.prototype.hasOwnProperty.call(
                    documento.dados,
                    elemento.id
                )
            ) {
                elemento.value = documento.dados[elemento.id] ?? "";
            }
        });

        documentoAtualId = documento.id;

        gerarPreview();

        mostrarMensagem(`Contrato "${documento.nome}" carregado.`);
    }

    function gerenciarRascunhos() {
        const documentos = obterDocumentos();

        if (documentos.length === 0) {
            mostrarMensagem("Nenhum contrato salvo foi encontrado.");
            return;
        }

        const lista = documentos.map((documento, indice) => {
            return `${indice + 1}. ${documento.nome}`;
        }).join("\n");

        const escolha = prompt(
            "CONTRATOS SALVOS\n\n" +
            lista +
            "\n\nDigite o número do contrato desejado:"
        );

        if (escolha === null) return;

        const indice = Number(escolha) - 1;

        if (!Number.isInteger(indice) || !documentos[indice]) {
            mostrarMensagem("Número inválido.");
            return;
        }

        const documento = documentos[indice];

        const acao = prompt(
            `Contrato: ${documento.nome}\n\n` +
            "Digite uma opção:\n" +
            "1 - Carregar contrato\n" +
            "2 - Duplicar contrato\n" +
            "3 - Excluir contrato"
        );

        if (acao === null) return;

        if (acao === "1") {
            carregarDocumento(documento);
            return;
        }

        if (acao === "2") {
            const agora = new Date().toISOString();

            const copia = {
                ...documento,
                id: gerarId(),
                nome: `${documento.nome} - Cópia`,
                dados: { ...documento.dados },
                criadoEm: agora,
                atualizadoEm: agora
            };

            documentos.push(copia);

            if (persistirDocumentos(documentos)) {
                mostrarMensagem("Cópia do contrato criada com sucesso.");
            }

            return;
        }

        if (acao === "3") {
            const confirmar = confirm(
                `Deseja excluir o contrato "${documento.nome}"?`
            );

            if (!confirmar) return;

            const atualizados = documentos.filter(
                item => item.id !== documento.id
            );

            if (persistirDocumentos(atualizados)) {
                if (documentoAtualId === documento.id) {
                    documentoAtualId = null;
                }

                mostrarMensagem("Contrato excluído com sucesso.");
            }

            return;
        }

        mostrarMensagem("Opção inválida.");
    }

    // =========================================
    // LIMPAR FORMULÁRIO
    // =========================================

    function limparTudo() {
        const confirmar = confirm(
            "Deseja limpar os dados do formulário e a pré-visualização?\n\n" +
            "Os contratos já salvos não serão excluídos."
        );

        if (!confirmar) return;

        form.reset();
        documentoAtualId = null;

        preview.innerHTML = `
            <div class="empty-preview">
                <div class="empty-icon">▤</div>

                <h3>Seu contrato aparecerá aqui</h3>

                <p>
                    Preencha os dados ao lado e clique em
                    "Gerar pré-visualização" para visualizar seu documento.
                </p>
            </div>
        `;
    }

    // =========================================
    // EXPORTAÇÃO PDF
    // =========================================

    function exportarPDF() {
        const dados = coletarDados();

        if (!validarDados(dados)) return;

        if (!window.jspdf || !window.jspdf.jsPDF) {
            mostrarMensagem(
                "A biblioteca de PDF não foi carregada. " +
                "Verifique sua conexão com a internet e tente novamente."
            );

            return;
        }

        const valorNumerico = converterParaNumero(dados.valor);

        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "pt",
            format: "a4"
        });

        const largura = pdf.internal.pageSize.getWidth();
        const altura = pdf.internal.pageSize.getHeight();

        const margem = 48;
        const larguraTexto = largura - margem * 2;
        const alturaLinha = 17;
        const limiteInferior = altura - margem - 35;

        let y = margem;

        pdf.setTextColor(35, 35, 35);

        function verificarPagina(alturaNecessaria = alturaLinha) {
            if (y + alturaNecessaria > limiteInferior) {
                pdf.addPage();
                y = margem;
            }
        }

        function adicionarEspaco(valor = 12) {
            y += valor;
            verificarPagina(0);
        }

        function adicionarTexto(texto, opcoes = {}) {
            const {
                negrito = false,
                tamanho = 12,
                alinhamento = "left",
                espacamento = alturaLinha
            } = opcoes;

            pdf.setFont("times", negrito ? "bold" : "normal");
            pdf.setFontSize(tamanho);

            const blocos = String(texto ?? "").split("\n");

            blocos.forEach((bloco, indice) => {
                const linhas = pdf.splitTextToSize(
                    bloco || " ",
                    larguraTexto
                );

                linhas.forEach(linha => {
                    verificarPagina(espacamento);

                    pdf.text(linha, margem, y, {
                        align: alinhamento
                    });

                    y += espacamento;
                });

                if (indice < blocos.length - 1) {
                    adicionarEspaco(4);
                }
            });
        }

        function adicionarSecao(titulo, conteudo) {
            adicionarEspaco(10);

            adicionarTexto(titulo, {
                negrito: true,
                tamanho: 12
            });

            adicionarEspaco(3);

            adicionarTexto(conteudo);
        }

        // Cabeçalho

        pdf.setFont("times", "bold");
        pdf.setFontSize(16);

        const titulo = `CONTRATO DE ${dados.tipoContrato.toUpperCase()}`;
        const linhasTitulo = pdf.splitTextToSize(titulo, larguraTexto);

        linhasTitulo.forEach(linha => {
            verificarPagina(22);

            pdf.text(linha, largura / 2, y, {
                align: "center"
            });

            y += 22;
        });

        adicionarEspaco(5);

        pdf.setDrawColor(160, 170, 185);
        pdf.setLineWidth(0.7);

        pdf.line(margem, y, largura - margem, y);

        adicionarEspaco(22);

        // Partes

        adicionarSecao(
            "1. DAS PARTES",
            `CONTRATANTE: ${dados.contratante}\n` +
            `CPF/CNPJ: ${dados.contratanteDoc || "Não informado"}.\n\n` +
            `CONTRATADO: ${dados.contratado}\n` +
            `CPF/CNPJ: ${dados.contratadoDoc || "Não informado"}.`
        );

        // Objeto

        adicionarSecao(
            "2. DO OBJETO",
            dados.objeto
        );

        // Prazo

        adicionarSecao(
            "3. DO PRAZO",
            `Prazo: ${dados.prazo || "Não especificado"}.\n` +
            `Data de início: ${formatarData(dados.dataInicio) || "Não especificada"}.\n` +
            `Data de término: ${formatarData(dados.dataFim) || "Não especificada"}.`
        );

        // Valor

        adicionarSecao(
            "4. DO VALOR",
            dados.valor === ""
                ? "Não especificado."
                : valorNumerico.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                })
        );

        // Cláusulas

        adicionarSecao(
            "5. CLÁUSULAS ADICIONAIS",
            dados.clausulas || "Não há cláusulas adicionais."
        );

        adicionarEspaco(16);

        adicionarTexto(
            "E, por estarem de acordo com as condições aqui descritas, " +
            "as partes assinam o presente instrumento."
        );

        // Assinaturas: mantém os dois campos juntos.

        adicionarEspaco(45);

        const alturaAssinaturas = 85;

        verificarPagina(alturaAssinaturas);

        const metade = largura / 2;
        const larguraAssinatura = 190;

        const xEsquerda = metade - larguraAssinatura / 2 - 15;
        const xDireita = metade + larguraAssinatura / 2 + 15;

        pdf.setDrawColor(80, 80, 80);

        pdf.line(
            xEsquerda - larguraAssinatura / 2,
            y,
            xEsquerda + larguraAssinatura / 2,
            y
        );

        pdf.line(
            xDireita - larguraAssinatura / 2,
            y,
            xDireita + larguraAssinatura / 2,
            y
        );

        y += 15;

        pdf.setFont("times", "bold");
        pdf.setFontSize(10);

        pdf.text("CONTRATANTE", xEsquerda, y, {
            align: "center"
        });

        pdf.text("CONTRATADO", xDireita, y, {
            align: "center"
        });

        y += 15;

        pdf.setFont("times", "normal");
        pdf.setFontSize(9);

        const nomeContratante = pdf.splitTextToSize(
            dados.contratante,
            larguraAssinatura
        );

        const nomeContratado = pdf.splitTextToSize(
            dados.contratado,
            larguraAssinatura
        );

        pdf.text(nomeContratante, xEsquerda, y, {
            align: "center"
        });

        pdf.text(nomeContratado, xDireita, y, {
            align: "center"
        });

        y += Math.max(
            nomeContratante.length,
            nomeContratado.length
        ) * 12 + 25;

        adicionarTexto(
            "Local e data: __________________________________________"
        );

        // Numeração das páginas

        const totalPaginas = pdf.internal.getNumberOfPages();

        for (let pagina = 1; pagina <= totalPaginas; pagina++) {
            pdf.setPage(pagina);

            pdf.setFont("times", "normal");
            pdf.setFontSize(9);
            pdf.setTextColor(120, 120, 120);

            pdf.text(
                `Página ${pagina} de ${totalPaginas}`,
                largura / 2,
                altura - 22,
                { align: "center" }
            );
        }

        pdf.save(gerarNomeArquivo(dados.contratante));
    }

    // =========================================
    // EVENTOS
    // =========================================

    if (btnGerar) {
        btnGerar.addEventListener("click", gerarPreview);
    }

    if (btnSalvar) {
        btnSalvar.addEventListener("click", salvarRascunho);
    }

    if (btnCarregar) {
        btnCarregar.addEventListener("click", gerenciarRascunhos);
    }

    if (btnLimpar) {
        btnLimpar.addEventListener("click", limparTudo);
    }

    if (btnExportarPDF) {
        btnExportarPDF.addEventListener("click", exportarPDF);
    }

    // Importa o rascunho da versão anterior, se existir.

    migrarRascunhoAntigo();
});
