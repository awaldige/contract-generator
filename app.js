document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formContrato");
  const preview = document.getElementById("contratoPreview");

  const btnGerar = document.getElementById("btnGerar");
  const btnExportarPDF = document.getElementById("btnExportarPDF");
  const btnSalvar = document.getElementById("btnSalvar");
  const btnCarregar = document.getElementById("btnCarregar");
  const btnLimpar = document.getElementById("btnLimpar");

  // ------------------------------------------------------
  // Geração do preview
  // ------------------------------------------------------
  function gerarPreview() {
    const dados = coletarDados();
    if (!dados.contratante || !dados.contratado || !dados.objeto) {
      return alert("Preencha os campos obrigatórios: Contratante, Contratado e Objeto do contrato.");
    }
    preview.innerHTML = montarHTMLContrato(dados);
  }

  function coletarDados() {
    return {
      tipoContrato: document.getElementById("tipoContrato").value,
      contratante: document.getElementById("contratante").value.trim(),
      contratanteDoc: document.getElementById("contratanteDoc").value.trim(),
      contratado: document.getElementById("contratado").value.trim(),
      contratadoDoc: document.getElementById("contratadoDoc").value.trim(),
      objeto: document.getElementById("objeto").value.trim(),
      valor: document.getElementById("valor").value.trim(),
      prazo: document.getElementById("prazo").value.trim(),
      dataInicio: document.getElementById("dataInicio").value,
      dataFim: document.getElementById("dataFim").value,
      clausulas: document.getElementById("clausulas").value.trim()
    };
  }

  function formatDate(d) {
    if (!d || d.indexOf("-") === -1) return d;
    const [y,m,day] = d.split("-");
    return `${day}/${m}/${y}`;
  }

  function montarHTMLContrato(d) {
    return `
      <div class="cabecalho">
        <img src="aw-tecnologia.png" alt="AW Tecnologia" onerror="this.style.display='none'">
        <h1>CONTRATO — ${d.tipoContrato}</h1>
        <hr>
      </div>

      <p class="clausula"><strong>1. DAS PARTES</strong><br>
        CONTRATANTE: ${d.contratante || "__________________"} — CPF/CNPJ: ${d.contratanteDoc || "__________________"}.<br>
        CONTRATADO: ${d.contratado || "__________________"} — CPF/CNPJ: ${d.contratadoDoc || "__________________"}.
      </p>

      <p class="clausula"><strong>2. DO OBJETO</strong><br>${d.objeto || "__________________"}</p>

      <p class="clausula"><strong>3. DO PRAZO</strong><br>
        Prazo: ${d.prazo || "Não especificado."} Início: ${formatDate(d.dataInicio) || "—"}. 
        Término: ${d.dataFim ? formatDate(d.dataFim) : "—"}.
      </p>

      <p class="clausula"><strong>4. DO VALOR</strong><br>
        ${d.valor ? `R$ ${Number(d.valor).toFixed(2).replace(".",",")}` : "Não especificado."}
      </p>

      <p class="clausula"><strong>5. CLÁUSULAS ADICIONAIS</strong><br>
        ${d.clausulas || "Não há cláusulas adicionais."}
      </p>

      <p class="clausula">E por estarem de pleno acordo, assinam o presente instrumento.</p>

      <div class="assinaturas">
        <div class="assinatura">
          <p>____________________________________</p>
          <p><strong>Contratante</strong><br>${d.contratante || "__________________"}</p>
        </div>
        <div class="assinatura">
          <p>____________________________________</p>
          <p><strong>Contratado</strong><br>${d.contratado || "__________________"}</p>
        </div>
      </div>

      <p style="margin-top:18px; text-align:right;">Local e data: __________________________</p>
    `;
  }

  // ------------------------------------------------------
  // Rascunho (localStorage)
  // ------------------------------------------------------
  function salvarRascunho() {
    const dados = {};
    form.querySelectorAll("input, textarea, select").forEach(el => dados[el.id] = el.value);
    localStorage.setItem("rascunhoContrato", JSON.stringify(dados));
    alert("Rascunho salvo localmente.");
  }

  function carregarRascunho() {
    const raw = localStorage.getItem("rascunhoContrato");
    if (!raw) return alert("Nenhum rascunho encontrado.");
    const dados = JSON.parse(raw);
    Object.keys(dados).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = dados[id];
    });
    gerarPreview();
    alert("Rascunho carregado.");
  }

  function limparTudo() {
    if (confirm("Deseja limpar o formulário e a pré-visualização?")) {
      form.reset();
      preview.innerHTML = '<p class="info">Clique em "Gerar Preview" para montar o contrato.</p>';
    }
  }

  // ------------------------------------------------------
  // Exportação para PDF
  // ------------------------------------------------------
  async function exportarPDF() {
    const dados = coletarDados();
    if (!dados.contratante || !dados.contratado || !dados.objeto) {
      return alert("Preencha os campos obrigatórios antes de exportar o PDF.");
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 40;
    const lineHeight = 18;
    let y = margin;

    pdf.setFont("Times", "normal");
    pdf.setFontSize(12);

    // Helper para texto com quebra
    function addTextBlock(text, bold = false) {
      if (bold) pdf.setFont("Times", "bold"); else pdf.setFont("Times", "normal");
      const lines = pdf.splitTextToSize(text, pageWidth - 2*margin);
      for (let line of lines) {
        if (y + lineHeight > pageHeight - margin) {
          pdf.addPage();
          y = margin;
        }
        pdf.text(line, margin, y);
        y += lineHeight;
      }
    }

    // Logo opcional (adicione a logo em base64 se quiser)
    // Exemplo: const logo = "data:image/png;base64,....";
    // pdf.addImage(logo, "PNG", margin, y, 80, 40);
    // y += 50;

    addTextBlock(`CONTRATO — ${dados.tipoContrato}`, true);
    y += 10;
    pdf.setLineWidth(0.5);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 20;

    addTextBlock("1. DAS PARTES", true);
    addTextBlock(`CONTRATANTE: ${dados.contratante} — CPF/CNPJ: ${dados.contratanteDoc || "__________________"}`);
    addTextBlock(`CONTRATADO: ${dados.contratado} — CPF/CNPJ: ${dados.contratadoDoc || "__________________"}`);
    y += 10;

    addTextBlock("2. DO OBJETO", true);
    addTextBlock(dados.objeto);
    y += 10;

    addTextBlock("3. DO PRAZO", true);
    addTextBlock(`Prazo: ${dados.prazo || "Não especificado."} Início: ${formatDate(dados.dataInicio) || "—"}. Término: ${dados.dataFim ? formatDate(dados.dataFim) : "—"}`);
    y += 10;

    addTextBlock("4. DO VALOR", true);
    addTextBlock(dados.valor ? `R$ ${Number(dados.valor).toFixed(2).replace(".",",")}` : "Não especificado.");
    y += 10;

    addTextBlock("5. CLÁUSULAS ADICIONAIS", true);
    addTextBlock(dados.clausulas || "Não há cláusulas adicionais.");
    y += 20;

    addTextBlock("E por estarem de pleno acordo, assinam o presente instrumento.");
    y += 40;

    // Assinaturas lado a lado
    const metade = pageWidth / 2;
    pdf.text("____________________________________", margin, y);
    pdf.text("____________________________________", metade + 20, y);
    y += lineHeight;
    pdf.text("Contratante", margin, y);
    pdf.text("Contratado", metade + 20, y);
    y += lineHeight;
    pdf.text(dados.contratante, margin, y);
    pdf.text(dados.contratado, metade + 20, y);
    y += lineHeight + 10;
    pdf.text("Local e data: __________________________", pageWidth - margin - 200, y);

    pdf.save(`Contrato_${dados.contratante || "rascunho"}.pdf`);
  }

  // ------------------------------------------------------
  // Eventos
  // ------------------------------------------------------
  btnGerar.addEventListener("click", gerarPreview);
  btnSalvar.addEventListener("click", salvarRascunho);
  btnCarregar.addEventListener("click", carregarRascunho);
  btnLimpar.addEventListener("click", limparTudo);
  btnExportarPDF.addEventListener("click", exportarPDF);
});
