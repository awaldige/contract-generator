document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formContrato");
  const preview = document.getElementById("contratoPreview");

  const btnGerar = document.getElementById("btnGerar");
  const btnExportarPDF = document.getElementById("btnExportarPDF");
  const btnSalvar = document.getElementById("btnSalvar");
  const btnCarregar = document.getElementById("btnCarregar");
  const btnLimpar = document.getElementById("btnLimpar");

  function gerarPreview() {
    const dados = coletarDados();
    preview.innerHTML = montarHTMLContrato(dados);
  }

  function coletarDados() {
    return {
      tipoContrato: document.getElementById("tipoContrato").value,
      contratante: document.getElementById("contratante").value || "__________________",
      contratanteDoc: document.getElementById("contratanteDoc").value || "__________________",
      contratado: document.getElementById("contratado").value || "__________________",
      contratadoDoc: document.getElementById("contratadoDoc").value || "__________________",
      objeto: document.getElementById("objeto").value || "__________________",
      valor: document.getElementById("valor").value || "0,00",
      prazo: document.getElementById("prazo").value || "",
      dataInicio: document.getElementById("dataInicio").value,
      dataFim: document.getElementById("dataFim").value,
      clausulas: document.getElementById("clausulas").value || "Não há cláusulas adicionais."
    };
  }

  function formatDate(d) {
    if (!d || d.indexOf("-") === -1) return d;
    const [y,m,day] = d.split("-");
    return `${day}/${m}/${y}`;
  }

  function montarHTMLContrato(dados) {
    return `
      <div class="cabecalho">
        <img src="aw-tecnologia.png" alt="AW Tecnologia" onerror="this.style.display='none'">
        <h1>CONTRATO — ${dados.tipoContrato}</h1>
        <hr>
      </div>

      <p class="clausula"><strong>1. DAS PARTES</strong><br>
        CONTRATANTE: ${dados.contratante} — CPF/CNPJ: ${dados.contratanteDoc}.<br>
        CONTRATADO: ${dados.contratado} — CPF/CNPJ: ${dados.contratadoDoc}.
      </p>

      <p class="clausula"><strong>2. DO OBJETO</strong><br>${dados.objeto}</p>

      <p class="clausula"><strong>3. DO PRAZO</strong><br>
        Prazo: ${dados.prazo || "Não especificado."} Início: ${formatDate(dados.dataInicio)}. 
        Término: ${dados.dataFim ? formatDate(dados.dataFim) : "—"}.
      </p>

      <p class="clausula"><strong>4. DO VALOR</strong><br>
        Valor: R$ ${Number(dados.valor).toFixed(2).replace(".",",")}
      </p>

      <p class="clausula"><strong>5. CLÁUSULAS ADICIONAIS</strong><br>${dados.clausulas}</p>

      <p class="clausula">E por estarem de pleno acordo, assinam o presente instrumento.</p>

      <div class="assinaturas">
        <div class="assinatura">
          <p>____________________________________</p>
          <p><strong>Contratante</strong><br>${dados.contratante}</p>
        </div>
        <div class="assinatura">
          <p>____________________________________</p>
          <p><strong>Contratado</strong><br>${dados.contratado}</p>
        </div>
      </div>

      <p style="margin-top:18px; text-align:right;">Local e data: __________________________</p>
    `;
  }

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

  function exportarPDF() {
    const dados = coletarDados();
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 40;
    let y = margin;
    const lineHeight = 18;
    const pageFont = "Times";
    const fontSize = 12;

    pdf.setFont(pageFont, "normal");
    pdf.setFontSize(fontSize);

    // Função auxiliar para quebrar texto
    function addTextBlock(text, x, yStart, maxWidth) {
      const lines = pdf.splitTextToSize(text, maxWidth);
      let yPos = yStart;
      for (let line of lines) {
        if (yPos + lineHeight > pageHeight - margin) {
          pdf.addPage();
          yPos = margin;
        }
        pdf.text(line, x, yPos);
        yPos += lineHeight;
      }
      return yPos;
    }

    // Cabeçalho
    y = addTextBlock(`CONTRATO — ${dados.tipoContrato}`, margin, y, pageWidth - 2*margin);
    y += 10;
    pdf.setLineWidth(0.5);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 20;

    // Cláusulas
    y = addTextBlock(`1. DAS PARTES\nCONTRATANTE: ${dados.contratante} — CPF/CNPJ: ${dados.contratanteDoc}\nCONTRATADO: ${dados.contratado} — CPF/CNPJ: ${dados.contratadoDoc}`, margin, y, pageWidth - 2*margin);
    y += 10;
    y = addTextBlock(`2. DO OBJETO\n${dados.objeto}`, margin, y, pageWidth - 2*margin);
    y += 10;
    y = addTextBlock(`3. DO PRAZO\nPrazo: ${dados.prazo || "Não especificado."} Início: ${formatDate(dados.dataInicio)}. Término: ${dados.dataFim ? formatDate(dados.dataFim) : "—"}`, margin, y, pageWidth - 2*margin);
    y += 10;
    y = addTextBlock(`4. DO VALOR\nR$ ${Number(dados.valor).toFixed(2).replace(".",",")}`, margin, y, pageWidth - 2*margin);
    y += 10;
    y = addTextBlock(`5. CLÁUSULAS ADICIONAIS\n${dados.clausulas}`, margin, y, pageWidth - 2*margin);
    y += 20;
    y = addTextBlock(`E por estarem de pleno acordo, assinam o presente instrumento.`, margin, y, pageWidth - 2*margin);
    y += 40;

    // Assinaturas
    pdf.text("____________________________________", margin, y);
    pdf.text("____________________________________", pageWidth/2 + 10, y);
    y += lineHeight;
    pdf.text("Contratante", margin, y);
    pdf.text("Contratado", pageWidth/2 + 10, y);
    y += lineHeight;
    pdf.text(dados.contratante, margin, y);
    pdf.text(dados.contratado, pageWidth/2 + 10, y);
    y += lineHeight + 10;
    pdf.text("Local e data: __________________________", pageWidth - margin - 200, y);

    pdf.save(`Contrato_${dados.contratante}.pdf`);
  }

  btnGerar.addEventListener("click", gerarPreview);
  btnSalvar.addEventListener("click", salvarRascunho);
  btnCarregar.addEventListener("click", carregarRascunho);
  btnLimpar.addEventListener("click", limparTudo);
  btnExportarPDF.addEventListener("click", exportarPDF);
});
