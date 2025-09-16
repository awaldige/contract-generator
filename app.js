// Aguarda DOM carregar
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formContrato");
  const preview = document.getElementById("contratoPreview");

  // Botões
  const btnGerar = document.getElementById("btnGerar");
  const btnExportarPDF = document.getElementById("btnExportarPDF");
  const btnSalvar = document.getElementById("btnSalvar");

  // Função para gerar contrato
  function gerarContrato() {
    const contratante = document.getElementById("contratante").value;
    const contratado = document.getElementById("contratado").value;
    const objeto = document.getElementById("objeto").value;
    const prazo = document.getElementById("prazo").value;
    const valor = document.getElementById("valor").value;

    const contratoHTML = `
      <h2 style="text-align:center;">CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h2>
      <p><strong>CONTRATANTE:</strong> ${contratante}</p>
      <p><strong>CONTRATADO:</strong> ${contratado}</p>
      <p><strong>OBJETO:</strong> ${objeto}</p>
      <p><strong>PRAZO:</strong> ${prazo}</p>
      <p><strong>VALOR:</strong> R$ ${valor}</p>
      <br><br>
      <p style="text-align:center;">___________________________________<br>CONTRATANTE</p>
      <br>
      <p style="text-align:center;">___________________________________<br>CONTRATADO</p>
    `;

    preview.innerHTML = contratoHTML;
  }

  // Função para exportar PDF
  function exportarPDF() {
    if (preview.innerHTML.trim() === "") {
      alert("⚠️ Primeiro gere o contrato!");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.html(preview, {
      callback: function (doc) {
        doc.save("contrato.pdf");
      },
      margin: [10, 10, 10, 10],
      autoPaging: "text",
      x: 10,
      y: 10,
      width: 180
    });
  }

  // Função para salvar TXT
  function salvarTXT() {
    if (preview.innerHTML.trim() === "") {
      alert("⚠️ Primeiro gere o contrato!");
      return;
    }

    const textoContrato = preview.innerText;
    const blob = new Blob([textoContrato], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "contrato.txt";
    link.click();
  }

  // Eventos
  btnGerar.addEventListener("click", (e) => {
    e.preventDefault();
    gerarContrato();
  });

  btnExportarPDF.addEventListener("click", (e) => {
    e.preventDefault();
    exportarPDF();
  });

  btnSalvar.addEventListener("click", (e) => {
    e.preventDefault();
    salvarTXT();
  });
});
