function atualizarTipoTeste() {
  const tipoTeste = localStorage.getItem("tipoTeste") || "Teste de Performance";
  console.log("Tipo de teste carregado:", tipoTeste);

  const elemento1 = document.getElementById("tipoTeste1");
  const elemento2 = document.getElementById("tipoTeste2");

  console.log("Elemento1 encontrado:", elemento1);
  console.log("Elemento2 encontrado:", elemento2);

  if (elemento1) elemento1.textContent = tipoTeste;
  if (elemento2) elemento2.textContent = tipoTeste;
}

function atualizarNumeroTeste() {
  const tipoTeste = localStorage.getItem("tipoTeste") || "Teste de Performance";
  let numeroTeste = localStorage.getItem("numeroTeste") || "";

  // Se não for Assessment e não houver número, usar "1" como padrão
  if (tipoTeste !== "Assessment" && !numeroTeste) {
    numeroTeste = "1";
  }

  const elemento1 = document.getElementById("numeroTeste1");
  const elemento2 = document.getElementById("numeroTeste2");

  if (elemento1) elemento1.textContent = numeroTeste;
  if (elemento2) elemento2.textContent = numeroTeste;
}

function atualizarDataDocumento() {
  const dataAtual = new Date();
  const dia = String(dataAtual.getDate()).padStart(2, "0");
  const mes = String(dataAtual.getMonth() + 1).padStart(2, "0");
  const ano = dataAtual.getFullYear();
  const dataDefault = `${dia}/${mes}/${ano}`;

  const dataDocumento = localStorage.getItem("dataDocumento") || dataDefault;

  const dateElement = document.getElementById("dataDocumento");
  if (dateElement) dateElement.textContent = dataDocumento;
}

function atualizarInfoCurso() {
  const nomeCurso = localStorage.getItem("nomeCurso") || "{Nome do Curso}";
  const nomeMateria =
    localStorage.getItem("nomeMateria") || "{Nome da Materia}";
  const nomeAluno = localStorage.getItem("nomeAluno") || "{Seu Nome}";
  const nomeProfessor =
    localStorage.getItem("nomeProfessor") || "{Nome do Professor}";

  const cursoElement = document.getElementById("nomeCurso");
  const materiaElement = document.getElementById("nomeMateria");
  const alunoElement = document.getElementById("nomeAluno");
  const professorElement = document.getElementById("nomeProfessor");

  if (cursoElement) cursoElement.textContent = nomeCurso;
  if (materiaElement) materiaElement.textContent = nomeMateria;
  if (alunoElement) alunoElement.textContent = nomeAluno;
  if (professorElement) professorElement.textContent = nomeProfessor;
}

function atualizarLinksRespostas() {
  const container = document.getElementById("respostas-links-container");
  if (!container) return;

  container.innerHTML = "";

  const linksJSON = localStorage.getItem("respostasLinks");
  if (linksJSON) {
    const links = JSON.parse(linksJSON);

    if (links.length > 0) {
      const lista = document.createElement("ol");
      lista.style.paddingLeft = "2cm";
      lista.style.lineHeight = "1.5";

      links.forEach((link) => {
        const item = document.createElement("li");
        const linkElement = document.createElement("a");
        linkElement.href = link;
        linkElement.textContent = link;
        linkElement.target = "_blank"; // Open in new tab
        linkElement.style.color = "#0066cc";
        linkElement.style.textDecoration = "underline";

        item.appendChild(linkElement);
        lista.appendChild(item);
      });

      container.appendChild(lista);
    }
  }
}

function atualizarTextoLivre() {
  const container = document.getElementById("texto-livre-container");
  if (!container) return;

  container.innerHTML = "";

  const texto = localStorage.getItem("textoLivre");
  if (texto && texto.trim() !== "") {
    const textoDiv = document.createElement("div");
    textoDiv.style.padding = "0 2cm";
    textoDiv.style.lineHeight = "1.5";
    textoDiv.style.marginTop = "20px";
    textoDiv.innerHTML = texto;

    container.appendChild(textoDiv);
  } //
}

function initModeloPage() {
  if (
    document.getElementById("tipoTeste1") ||
    document.getElementById("tipoTeste2") ||
    document.getElementById("numeroTeste1") ||
    document.getElementById("numeroTeste2")
  ) {
    function atualizarTodoConteudo() {
      atualizarTipoTeste();
      atualizarNumeroTeste();
      atualizarDataDocumento();
      atualizarInfoCurso();
      atualizarLinksRespostas();
      atualizarTextoLivre();
    }

    window.addEventListener("load", function () {
      atualizarTodoConteudo();

      const downloadBtn = document.getElementById("download-pdf");
      if (downloadBtn) {
        downloadBtn.addEventListener("click", downloadPDF);
      }
    });

    window.addEventListener("storage", function (e) {
      if (
        e.key === "numeroTeste" ||
        e.key === "dataDocumento" ||
        e.key === "nomeCurso" ||
        e.key === "nomeMateria" ||
        e.key === "nomeAluno" ||
        e.key === "nomeProfessor" ||
        e.key === "respostasLinks" ||
        e.key === "textoLivre"
      ) {
        atualizarTodoConteudo();
      }
    });

    atualizarTodoConteudo();
  }
}

function atualizarNumeracao() {
  const respostas = document.querySelectorAll(".resposta-item");
  respostas.forEach((item, index) => {
    const label = item.querySelector("label");
    if (label) {
      label.textContent = `${index + 1}:`;
    }
  });
}

function adicionarCampoResposta() {
  const container = document.getElementById("respostas-container");
  const novaResposta = document.createElement("div");
  novaResposta.className = "resposta-item";

  const numeroResposta = container.children.length + 1;

  novaResposta.innerHTML = `
        <div class="resposta-wrapper">
            <label for="resposta${numeroResposta}">${numeroResposta}:</label>
            <input type="text" id="resposta${numeroResposta}" class="resposta-input" placeholder="Cole o link aqui" style="width:835px">
            <button type="button" class="remover-resposta" style="width:auto;min-width:80px;max-width:150px;">Remover</button>
        </div>
    `;

  container.appendChild(novaResposta);

  const botaoRemover = novaResposta.querySelector(".remover-resposta");
  botaoRemover.addEventListener("click", function () {
    novaResposta.remove();
    atualizarNumeracao();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const botaoAdicionar = document.getElementById("adicionar-resposta");
  if (botaoAdicionar) {
    botaoAdicionar.addEventListener("click", adicionarCampoResposta);
  }
});

function carregarLinksRespostas() {
  const container = document.getElementById("respostas-container");
  if (!container) return;

  while (container.children.length > 0) {
    container.removeChild(container.lastChild);
  }

  const linksJSON = localStorage.getItem("respostasLinks");
  let links = [];
  if (linksJSON) {
    links = JSON.parse(linksJSON);
  }

  // Sempre mostrar 16 campos
  for (let i = 0; i < 16; i++) {
    adicionarCampoResposta();
    // Se houver links salvos, preencher o campo
    if (links[i]) {
      const input = container.lastElementChild.querySelector(".resposta-input");
      if (input) input.value = links[i];
    }
  }
}

function salvarLinksRespostas() {
  const inputs = document.querySelectorAll(".resposta-input");
  const links = [];

  inputs.forEach((input) => {
    const valor = input.value.trim();
    if (valor) {
      links.push(valor);
    }
  });

  localStorage.setItem("respostasLinks", JSON.stringify(links));
}

function initConfigurarPage() {
  const salvarNumeroBtn = document.getElementById("salvarNumero");
  if (!salvarNumeroBtn) return;

  const tipoSalvo = localStorage.getItem("tipoTeste") || "Teste de Performance";
  document.getElementById("tipoTeste").value = tipoSalvo;

  const numeroSalvo = localStorage.getItem("numeroTeste") || "1";
  const numeroTesteInput = document.getElementById("numeroTeste");

  // Configurar campo número do teste baseado no tipo salvo
  if (tipoSalvo === "Assessment") {
    if (!numeroSalvo || numeroSalvo === "1") {
      numeroTesteInput.value = "";
    } else {
      numeroTesteInput.value = numeroSalvo;
    }
    numeroTesteInput.placeholder = "Opcional para Assessment";
  } else {
    numeroTesteInput.value = numeroSalvo;
    numeroTesteInput.placeholder = "";
  }

  // Adicionar event listener para mudança no tipo de teste
  document.getElementById("tipoTeste").addEventListener("change", function () {
    const numeroTesteInput = document.getElementById("numeroTeste");
    if (this.value === "Assessment") {
      // Limpar o campo quando selecionar Assessment
      numeroTesteInput.value = "";
      numeroTesteInput.placeholder = "Opcional para Assessment";
    } else {
      // Restaurar valor padrão para outros tipos
      if (!numeroTesteInput.value) {
        numeroTesteInput.value = "1";
      }
      numeroTesteInput.placeholder = "";
    }
  });

  const hoje = new Date();
  const dataFormatada = hoje.toISOString().split("T")[0]; // Format YYYY-MM-DD for input type="date"
  const dataSalva = localStorage.getItem("dataDocumentoInput") || dataFormatada;
  document.getElementById("dataDocumento").value = dataSalva;

  document.getElementById("nomeCurso").value =
    localStorage.getItem("nomeCurso") || "";
  document.getElementById("nomeMateria").value =
    localStorage.getItem("nomeMateria") || "";
  document.getElementById("nomeAluno").value =
    localStorage.getItem("nomeAluno") || "";
  document.getElementById("nomeProfessor").value =
    localStorage.getItem("nomeProfessor") || "";

  carregarLinksRespostas();

  initCustomEditor();

  const adicionarRespostaBtn = document.getElementById("adicionar-resposta");
  if (adicionarRespostaBtn) {
    adicionarRespostaBtn.addEventListener("click", function () {
      adicionarCampoResposta();
    });
  }

  document.addEventListener("click", function (e) {
    if (e.target && e.target.classList.contains("remover-resposta")) {
      e.target.closest(".resposta-item").remove();
    }
  });

  salvarNumeroBtn.addEventListener("click", function () {
    const tipoTeste = document.getElementById("tipoTeste").value;
    const numeroTeste = document.getElementById("numeroTeste").value;
    const dataDocumento = document.getElementById("dataDocumento").value;

    let validado = true;

    if (!tipoTeste) {
      alert("Por favor, selecione um tipo de teste.");
      validado = false;
    }

    // Validar número do teste apenas se não for Assessment
    if (
      tipoTeste !== "Assessment" &&
      (!numeroTeste || parseInt(numeroTeste) <= 0)
    ) {
      alert("Por favor, insira um número válido maior que zero.");
      validado = false;
    }

    if (!dataDocumento) {
      alert("Por favor, selecione uma data para o documento.");
      validado = false;
    }

    if (validado) {
      localStorage.setItem("tipoTeste", tipoTeste);
      // Para Assessment, permitir salvar string vazia; para outros, garantir que tenha um valor
      const numeroParaSalvar =
        tipoTeste === "Assessment" ? numeroTeste || "" : numeroTeste || "1";
      localStorage.setItem("numeroTeste", numeroParaSalvar);

      localStorage.setItem("dataDocumentoInput", dataDocumento);

      const partes = dataDocumento.split("-");
      if (partes.length === 3) {
        const dataFormatadaDisplay = `${partes[2]}/${partes[1]}/${partes[0]}`;
        localStorage.setItem("dataDocumento", dataFormatadaDisplay);
      }

      localStorage.setItem(
        "nomeCurso",
        document.getElementById("nomeCurso").value
      );
      localStorage.setItem(
        "nomeMateria",
        document.getElementById("nomeMateria").value
      );
      localStorage.setItem(
        "nomeAluno",
        document.getElementById("nomeAluno").value
      );
      localStorage.setItem(
        "nomeProfessor",
        document.getElementById("nomeProfessor").value
      );

      salvarLinksRespostas();

      const editorContent = document.getElementById("editor-texto-livre");
      if (editorContent) {
        localStorage.setItem("textoLivre", editorContent.innerHTML);
      }

      const statusElement = document.getElementById("status");
      statusElement.textContent = "Configurações atualizadas com sucesso!";
      statusElement.className = "status success";
      statusElement.style.display = "block";

      setTimeout(function () {
        statusElement.style.display = "none";
      }, 3000);

      const docLink = document.getElementById("abrirDocumento");
      if (docLink) {
        docLink.href = `respostas/modelo.html?t=${Date.now()}`;
      }
    }
  });
}

function imprimirPDF() {
  const botaoImprimir = document.querySelector(".botao-imprimir");
  if (botaoImprimir) {
    botaoImprimir.style.display = "none";
  }

  window.print();

  setTimeout(() => {
    if (botaoImprimir) {
      botaoImprimir.style.display = "block";
    }
  }, 1000);
}

document.addEventListener("DOMContentLoaded", function () {
  const botaoImprimir = document.querySelector(".botao-imprimir");
  if (botaoImprimir) {
    botaoImprimir.addEventListener("click", imprimirPDF);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  initModeloPage();
  initConfigurarPage();
});

document.addEventListener("DOMContentLoaded", function () {
  const logo = document.querySelector(".rotating-logo");
  if (logo) {
    let isSpinning = false;

    function toggleSpin() {
      if (!isSpinning) {
        logo.classList.add("spinning");
        isSpinning = true;

        setTimeout(() => {
          logo.classList.remove("spinning");
          logo.classList.add("stopping");
          isSpinning = false;

          setTimeout(() => {
            logo.classList.remove("stopping");
          }, 1000);
        }, 5000);
      }
    }

    setInterval(toggleSpin, 10000);

    toggleSpin();
  }
});

function initCustomEditor() {
  const editor = document.getElementById("editor-texto-livre");
  if (!editor) return;

  const savedContent = localStorage.getItem("textoLivre");
  if (savedContent && savedContent.trim() !== "") {
    editor.innerHTML = savedContent;
  } else {
    editor.innerHTML = "";
  }

  function updateButtonStates() {
    const buttons = document.querySelectorAll(".toolbar-btn");
    buttons.forEach((button) => {
      const command = button.dataset.command;
      if (["bold", "italic", "underline", "strikeThrough"].includes(command)) {
        if (document.queryCommandState(command)) {
          button.classList.add("active");
        } else {
          button.classList.remove("active");
        }
      }
    });

    const formatSelector = document.querySelector(".toolbar-select");
    if (formatSelector) {
      const currentFormat = document
        .queryCommandValue("formatBlock")
        .replace(/[<>]/g, "");
      if (
        currentFormat &&
        Array.from(formatSelector.options).some(
          (option) => option.value === currentFormat
        )
      ) {
        formatSelector.value = currentFormat;
      } else {
        formatSelector.value = "p"; // Default to paragraph
      }
    }
  }

  const buttons = document.querySelectorAll(".toolbar-btn");
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      const command = this.dataset.command;

      if (
        command === "bold" ||
        command === "italic" ||
        command === "underline" ||
        command === "strikeThrough" ||
        command === "justifyLeft" ||
        command === "justifyCenter" ||
        command === "justifyRight" ||
        command === "insertUnorderedList" ||
        command === "insertOrderedList"
      ) {
        document.execCommand(command, false, null);
        updateButtonStates();
      }

      editor.focus();
    });
  });

  const formatSelector = document.querySelector(".toolbar-select");
  if (formatSelector) {
    formatSelector.addEventListener("change", function () {
      const command = this.dataset.command;
      const value = this.value;

      if (command === "formatBlock") {
        document.execCommand(command, false, "<" + value + ">");
      }

      editor.focus();
    });
  }

  editor.addEventListener("click", function () {
    this.focus();
    updateButtonStates();
  });

  editor.addEventListener("keyup", updateButtonStates);
  editor.addEventListener("mouseup", updateButtonStates);

  document.addEventListener("selectionchange", function () {
    if (document.activeElement === editor) {
      updateButtonStates();
    }
  });

  function isEditorEmpty() {
    const content = editor.innerHTML.trim();
    return (
      content === "" || content === "<br>" || content === "<div><br></div>"
    );
  }

  function updatePlaceholder() {
    if (isEditorEmpty()) {
      editor.classList.add("empty");
    } else {
      editor.classList.remove("empty");
    }
  }

  editor.addEventListener("focus", function () {
    this.classList.add("focused");
    updatePlaceholder();
  });

  editor.addEventListener("blur", function () {
    this.classList.remove("focused");
    if (isEditorEmpty()) {
      this.innerHTML = "";
    }
    updatePlaceholder();
  });

  editor.addEventListener("input", updatePlaceholder);

  setTimeout(function () {
    updateButtonStates();
    updatePlaceholder();
  }, 100);
}
