function sanitizarNomeArquivo(str) {
  if (!str) return "";
  return str
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-zA-Z0-9]/g, "_")  // substitui caracteres especiais por underscore
    .replace(/_+/g, "_")           // remove underscores duplicados
    .replace(/^_|_$/g, "");         // remove underscores nas pontas
}

function gerarNomeArquivoSugerido() {
  const nomeAluno = localStorage.getItem("nomeAluno") || "aluno";
  const nomeMateria = localStorage.getItem("nomeMateria") || "disciplina";
  const tipoTeste = localStorage.getItem("tipoTeste") || "Teste de Performance";
  const numeroTeste = localStorage.getItem("numeroTeste") || "";

  const alunoSanitizado = sanitizarNomeArquivo(nomeAluno).toLowerCase() || "aluno";
  const materiaSanitizada = sanitizarNomeArquivo(nomeMateria).toUpperCase() || "INFNET";

  let tipoSigla = "TP";
  if (tipoTeste.includes("Assessment")) {
    tipoSigla = "AT";
  } else if (tipoTeste.includes("Live")) {
    tipoSigla = "LC";
  }

  const sufixoTeste = numeroTeste ? `${tipoSigla}${numeroTeste}` : tipoSigla;
  return `${alunoSanitizado}_${materiaSanitizada}_${sufixoTeste}.pdf`;
}

function copiarParaAreaTransferencia(texto, onSucesso) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(texto)
      .then(onSucesso)
      .catch(() => fallbackCopiar(texto, onSucesso));
  } else {
    fallbackCopiar(texto, onSucesso);
  }
}

function fallbackCopiar(texto, onSucesso) {
  const textarea = document.createElement("textarea");
  textarea.value = texto;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
    if (onSucesso) onSucesso();
  } catch (err) {
    console.error("Erro ao copiar texto:", err);
  }
  document.body.removeChild(textarea);
}

/**
 * Exibe notificação temporária em tela
 */
function exibirToast(mensagem) {
  const toast = document.getElementById("toastNotificacao");
  if (!toast) return;

  toast.textContent = mensagem;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}


function configurarMarked() {
  if (typeof marked === "undefined") return;

  marked.setOptions({
    gfm: true,
    breaks: true,
    highlight: function (code, lang) {
      if (typeof hljs !== "undefined") {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(code, { language: lang }).value;
          } catch (e) {
            console.error(e);
          }
        }
        try {
          return hljs.highlightAuto(code).value;
        } catch (e) {}
      }
      return code;
    },
  });
}

// PÁGINA: RESPOSTAS / MODELO.HTML

function atualizarTipoTeste() {
  const tipoTeste = localStorage.getItem("tipoTeste") || "Teste de Performance";
  const el1 = document.getElementById("tipoTeste1");
  const el2 = document.getElementById("tipoTeste2");

  if (el1) el1.textContent = tipoTeste;
  if (el2) el2.textContent = tipoTeste;
}

function atualizarNumeroTeste() {
  const tipoTeste = localStorage.getItem("tipoTeste") || "Teste de Performance";
  let numeroTeste = localStorage.getItem("numeroTeste") || "";

  if (tipoTeste !== "Assessment" && !numeroTeste) {
    numeroTeste = "1";
  }

  const el1 = document.getElementById("numeroTeste1");
  const el2 = document.getElementById("numeroTeste2");

  if (el1) el1.textContent = numeroTeste;
  if (el2) el2.textContent = numeroTeste;
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
  const nomeMateria = localStorage.getItem("nomeMateria") || "{Nome da Materia}";
  const nomeAluno = localStorage.getItem("nomeAluno") || "{Seu Nome}";
  const nomeProfessor = localStorage.getItem("nomeProfessor") || "{Nome do Professor}";

  const cursoElement = document.getElementById("nomeCurso");
  const materiaElement = document.getElementById("nomeMateria");
  const alunoElement = document.getElementById("nomeAluno");
  const professorElement = document.getElementById("nomeProfessor");
  const headerAlunoInfo = document.getElementById("headerAlunoInfo");

  if (cursoElement) cursoElement.textContent = nomeCurso;
  if (materiaElement) materiaElement.textContent = nomeMateria;
  if (alunoElement) alunoElement.textContent = nomeAluno;
  if (professorElement) professorElement.textContent = nomeProfessor;

  if (headerAlunoInfo) {
    headerAlunoInfo.textContent = `${nomeAluno} • ${nomeMateria}`;
  }
}

function atualizarLinksRespostas() {
  const container = document.getElementById("respostas-links-container");
  const secaoContainer = document.getElementById("secao-links-container");
  if (!container || !secaoContainer) return;

  container.innerHTML = "";
  const linksJSON = localStorage.getItem("respostasLinks");
  let linksValidos = [];

  if (linksJSON) {
    try {
      const links = JSON.parse(linksJSON);
      linksValidos = links.filter((link) => link && link.trim() !== "");
    } catch (e) {
      console.error("Erro ao carregar links de respostas:", e);
    }
  }

  if (linksValidos.length > 0) {
    secaoContainer.style.display = "block";
    linksValidos.forEach((link, index) => {
      const itemRow = document.createElement("div");
      itemRow.className = "link-item-row";

      const numFormatado = String(index + 1).padStart(2, "0");
      itemRow.innerHTML = `
        <span class="badge-questao">Q${numFormatado}</span>
        <a href="${link}" class="link-anchor" target="_blank" rel="noopener noreferrer">${link}</a>
      `;
      container.appendChild(itemRow);
    });
  } else {
    secaoContainer.style.display = "none";
  }
}

function atualizarTextoLivre() {
  const container = document.getElementById("texto-livre-container");
  const secaoContainer = document.getElementById("secao-markdown-container");
  if (!container || !secaoContainer) return;

  container.innerHTML = "";
  const texto = localStorage.getItem("textoLivre");

  if (texto && texto.trim() !== "") {
    secaoContainer.style.display = "block";
    configurarMarked();

    if (typeof marked !== "undefined") {
      try {
        container.innerHTML = marked.parse(texto);
      } catch (err) {
        console.error("Erro no parser Markdown:", err);
        container.innerHTML = texto;
      }
    } else {
      container.innerHTML = texto;
    }

    // Realce de código via highlight.js
    if (typeof hljs !== "undefined") {
      container.querySelectorAll("pre code").forEach((bloco) => {
        hljs.highlightElement(bloco);
      });
    }
  } else {
    secaoContainer.style.display = "none";
  }
}

function verificarDocumentoVazio() {
  const aviso = document.getElementById("documento-vazio-aviso");
  const secaoLinks = document.getElementById("secao-links-container");
  const secaoMarkdown = document.getElementById("secao-markdown-container");

  if (!aviso || !secaoLinks || !secaoMarkdown) return;

  const linksVisiveis = secaoLinks.style.display !== "none";
  const markdownVisivel = secaoMarkdown.style.display !== "none";

  if (!linksVisiveis && !markdownVisivel) {
    aviso.style.display = "block";
  } else {
    aviso.style.display = "none";
  }
}

function atualizarBarraAcoesModelo() {
  const nomeSugestaoEl = document.getElementById("nomeArquivoSugerido");
  if (nomeSugestaoEl) {
    nomeSugestaoEl.textContent = gerarNomeArquivoSugerido();
  }

  const btnCopiar = document.getElementById("btnCopiarNome");
  if (btnCopiar) {
    btnCopiar.onclick = function () {
      const nome = gerarNomeArquivoSugerido();
      copiarParaAreaTransferencia(nome, () => {
        exibirToast(`Nome copiado: ${nome}`);
      });
    };
  }

  const btnImprimir = document.getElementById("btnImprimirDoc");
  if (btnImprimir) {
    btnImprimir.onclick = function () {
      window.print();
    };
  }
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
      verificarDocumentoVazio();
      atualizarBarraAcoesModelo();
    }

    window.addEventListener("load", atualizarTodoConteudo);

    window.addEventListener("storage", function (e) {
      if (
        [
          "tipoTeste",
          "numeroTeste",
          "dataDocumento",
          "nomeCurso",
          "nomeMateria",
          "nomeAluno",
          "nomeProfessor",
          "respostasLinks",
          "textoLivre",
        ].includes(e.key)
      ) {
        atualizarTodoConteudo();
      }
    });

    atualizarTodoConteudo();
  }
}

// HISTÓRICO DE MATÉRIAS E PROFESSORES (SALVAR & SELECIONAR)

const MATERIAS_PADRAO = [
  "Desenvolvimento Web com JavaScript",
  "Engenharia de Requisitos",
  "Estruturas de Dados e Algoritmos",
  "Banco de Dados e SQL",
  "Arquitetura de Software",
];

function obterMateriasSalvas() {
  const salvas = localStorage.getItem("materiasSalvas");
  if (salvas) {
    try {
      const lista = JSON.parse(salvas);
      if (Array.isArray(lista) && lista.length > 0) return lista;
    } catch (e) {}
  }
  return [...MATERIAS_PADRAO];
}

function salvarMateriaNaLista(materia) {
  const nomeLimpo = (materia || "").trim();
  if (!nomeLimpo) return;
  const lista = obterMateriasSalvas();
  if (!lista.some((m) => m.toLowerCase() === nomeLimpo.toLowerCase())) {
    lista.unshift(nomeLimpo);
    localStorage.setItem("materiasSalvas", JSON.stringify(lista));
    renderizarHistoricoMaterias();
    exibirToast(`Matéria "${nomeLimpo}" salva para reutilização!`);
  }
}

function removerMateriaDaLista(materia) {
  let lista = obterMateriasSalvas();
  lista = lista.filter((m) => m.toLowerCase() !== materia.toLowerCase());
  localStorage.setItem("materiasSalvas", JSON.stringify(lista));
  renderizarHistoricoMaterias();
}

function renderizarHistoricoMaterias() {
  const datalist = document.getElementById("listaMaterias");
  const chipsContainer = document.getElementById("chipsMaterias");
  const containerHistorico = document.getElementById("containerHistoricoMaterias");
  const inputMateria = document.getElementById("nomeMateria");

  if (!datalist || !chipsContainer) return;

  const lista = obterMateriasSalvas();

  // Datalist nativo
  datalist.innerHTML = "";
  lista.forEach((item) => {
    const opt = document.createElement("option");
    opt.value = item;
    datalist.appendChild(opt);
  });

  // Chips visíveis
  chipsContainer.innerHTML = "";
  if (lista.length === 0) {
    if (containerHistorico) containerHistorico.style.display = "none";
    return;
  }
  if (containerHistorico) containerHistorico.style.display = "block";

  lista.forEach((item) => {
    const chip = document.createElement("div");
    chip.className = "chip-item";
    chip.innerHTML = `
      <span class="chip-label" title="Clique para selecionar esta matéria">${item}</span>
      <button type="button" class="btn-chip-remover" title="Excluir do histórico">&times;</button>
    `;

    chip.querySelector(".chip-label").addEventListener("click", () => {
      if (inputMateria) {
        inputMateria.value = item;
        inputMateria.focus();
        atualizarPreviewNomeArquivoNaConfig();
      }
    });

    chip.querySelector(".btn-chip-remover").addEventListener("click", (e) => {
      e.stopPropagation();
      removerMateriaDaLista(item);
    });

    chipsContainer.appendChild(chip);
  });
}

function obterProfessoresSalvos() {
  const salvas = localStorage.getItem("professoresSalvos");
  if (salvas) {
    try {
      const lista = JSON.parse(salvas);
      if (Array.isArray(lista)) return lista;
    } catch (e) {}
  }
  return [];
}

function salvarProfessorNaLista(professor) {
  const nomeLimpo = (professor || "").trim();
  if (!nomeLimpo) return;
  const lista = obterProfessoresSalvos();
  if (!lista.some((p) => p.toLowerCase() === nomeLimpo.toLowerCase())) {
    lista.unshift(nomeLimpo);
    localStorage.setItem("professoresSalvos", JSON.stringify(lista));
    renderizarHistoricoProfessores();
    exibirToast(`Professor(a) "${nomeLimpo}" salvo para reutilização!`);
  }
}

function removerProfessorDaLista(professor) {
  let lista = obterProfessoresSalvos();
  lista = lista.filter((p) => p.toLowerCase() !== professor.toLowerCase());
  localStorage.setItem("professoresSalvos", JSON.stringify(lista));
  renderizarHistoricoProfessores();
}

function renderizarHistoricoProfessores() {
  const datalist = document.getElementById("listaProfessores");
  const chipsContainer = document.getElementById("chipsProfessores");
  const containerHistorico = document.getElementById("containerHistoricoProfessores");
  const inputProfessor = document.getElementById("nomeProfessor");

  if (!datalist || !chipsContainer) return;

  const lista = obterProfessoresSalvos();

  datalist.innerHTML = "";
  lista.forEach((item) => {
    const opt = document.createElement("option");
    opt.value = item;
    datalist.appendChild(opt);
  });

  chipsContainer.innerHTML = "";
  if (lista.length === 0) {
    if (containerHistorico) containerHistorico.style.display = "none";
    return;
  }
  if (containerHistorico) containerHistorico.style.display = "block";

  lista.forEach((item) => {
    const chip = document.createElement("div");
    chip.className = "chip-item";
    chip.innerHTML = `
      <span class="chip-label" title="Clique para selecionar este professor">${item}</span>
      <button type="button" class="btn-chip-remover" title="Excluir do histórico">&times;</button>
    `;

    chip.querySelector(".chip-label").addEventListener("click", () => {
      if (inputProfessor) {
        inputProfessor.value = item;
        inputProfessor.focus();
      }
    });

    chip.querySelector(".btn-chip-remover").addEventListener("click", (e) => {
      e.stopPropagation();
      removerProfessorDaLista(item);
    });

    chipsContainer.appendChild(chip);
  });
}

// CONTROLE DE LINHAS DE RESPOSTAS (QUESTÕES)

function atualizarNumeracao() {
  const respostas = document.querySelectorAll(".resposta-item");
  respostas.forEach((item, index) => {
    const label = item.querySelector("label");
    if (label) {
      label.textContent = `${index + 1}:`;
    }
  });
}

function atualizarContadorQuestoes() {
  const container = document.getElementById("respostas-container");
  const contador = document.getElementById("contador-questoes");
  const inputQtd = document.getElementById("qtdLinhasInput");
  if (!container) return;

  const total = container.children.length;
  if (contador) {
    contador.textContent = total === 1 ? "1 linha" : `${total} linhas`;
  }
  if (inputQtd) {
    inputQtd.value = total;
  }

  // Atualizar estado ativo dos botões rápidos
  document.querySelectorAll(".btn-qtd-rapida").forEach((btn) => {
    if (parseInt(btn.dataset.qtd, 10) === total) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

function adicionarCampoResposta(valorInicial = "") {
  const container = document.getElementById("respostas-container");
  if (!container) return;

  const novaResposta = document.createElement("div");
  novaResposta.className = "resposta-item";

  const numeroResposta = container.children.length + 1;

  novaResposta.innerHTML = `
    <div class="resposta-wrapper">
      <label for="resposta${numeroResposta}">${numeroResposta}:</label>
      <input type="text" id="resposta${numeroResposta}" class="resposta-input" placeholder="Cole o link da questão (ex: GitHub, Colab, YouTube...)" value="${valorInicial}">
      <button type="button" class="remover-resposta" title="Remover esta questão">Remover</button>
    </div>
  `;

  container.appendChild(novaResposta);

  const botaoRemover = novaResposta.querySelector(".remover-resposta");
  botaoRemover.addEventListener("click", function () {
    novaResposta.remove();
    atualizarNumeracao();
    atualizarContadorQuestoes();
  });

  atualizarContadorQuestoes();
}

function carregarLinksRespostas() {
  const container = document.getElementById("respostas-container");
  if (!container) return;

  container.innerHTML = "";

  const linksJSON = localStorage.getItem("respostasLinks");
  let links = [];
  if (linksJSON) {
    try {
      links = JSON.parse(linksJSON);
    } catch (e) {
      links = [];
    }
  }

  // Por padrão tem apenas 1 linha se não houver links salvos!
  const totalCampos = links.length > 0 ? links.length : 1;
  for (let i = 0; i < totalCampos; i++) {
    adicionarCampoResposta(links[i] || "");
  }

  atualizarContadorQuestoes();
}

function definirQuantidadeLinhas(novaQtd) {
  const container = document.getElementById("respostas-container");
  if (!container) return;

  let qtd = parseInt(novaQtd, 10);
  if (isNaN(qtd) || qtd < 1) qtd = 1;
  if (qtd > 50) qtd = 50;

  const totalAtual = container.children.length;

  if (qtd > totalAtual) {
    // Adiciona linhas extras
    for (let i = totalAtual; i < qtd; i++) {
      adicionarCampoResposta("");
    }
  } else if (qtd < totalAtual) {
    // Reduz do final
    while (container.children.length > qtd) {
      container.removeChild(container.lastElementChild);
    }
  }

  atualizarNumeracao();
  atualizarContadorQuestoes();
}

function removerLinhasVazias() {
  const container = document.getElementById("respostas-container");
  if (!container) return;

  const itens = Array.from(container.querySelectorAll(".resposta-item"));
  itens.forEach((item) => {
    const input = item.querySelector(".resposta-input");
    if (input && input.value.trim() === "" && container.children.length > 1) {
      item.remove();
    }
  });

  atualizarNumeracao();
  atualizarContadorQuestoes();
  exibirToast("Linhas vazias removidas!");
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

// EDITOR MARKDOWN

function inserirMarkdown(prefixo, sufixo = "", textoPadrao = "") {
  const textarea = document.getElementById("editor-markdown");
  if (!textarea) return;

  const inicio = textarea.selectionStart;
  const fim = textarea.selectionEnd;
  const textoSelecionado = textarea.value.substring(inicio, fim) || textoPadrao;

  const textoSubstituto = `${prefixo}${textoSelecionado}${sufixo}`;
  textarea.setRangeText(textoSubstituto, inicio, fim, "select");

  const novoCursor = inicio + prefixo.length + textoSelecionado.length;
  textarea.selectionStart = novoCursor;
  textarea.selectionEnd = novoCursor;
  textarea.focus();

  atualizarPreviewMarkdown();
}

function atualizarPreviewMarkdown() {
  const textarea = document.getElementById("editor-markdown");
  const preview = document.getElementById("editor-markdown-preview");
  if (!textarea || !preview) return;

  configurarMarked();

  const texto = textarea.value;
  if (!texto.trim()) {
    preview.innerHTML = '<p class="preview-vazio"><em>A pré-visualização do Markdown aparecerá aqui...</em></p>';
    return;
  }

  if (typeof marked !== "undefined") {
    try {
      preview.innerHTML = marked.parse(texto);
      if (typeof hljs !== "undefined") {
        preview.querySelectorAll("pre code").forEach((bloco) => {
          hljs.highlightElement(bloco);
        });
      }
    } catch (err) {
      preview.innerHTML = `<p style="color:red">Erro na pré-visualização: ${err.message}</p>`;
    }
  } else {
    preview.textContent = texto;
  }
}

function initMarkdownEditor() {
  const textarea = document.getElementById("editor-markdown");
  if (!textarea) return;

  const conteudoSalvo = localStorage.getItem("textoLivre");
  if (conteudoSalvo) {
    textarea.value = conteudoSalvo;
  } else {
    textarea.value = `# Exercício 01 - Análise do Problema\n\nDescreva sua resposta ou solução teórica aqui usando **Markdown**.\n\n\`\`\`javascript\n// Exemplo de código\nfunction calcularMedia(notas) {\n  const soma = notas.reduce((acc, curr) => acc + curr, 0);\n  return soma / notas.length;\n}\n\`\`\`\n\n### Observações Adicionais\n- Item 1\n- Item 2\n`;
  }

  // Suporte a indentação com tecla TAB
  textarea.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      e.preventDefault();
      const inicio = this.selectionStart;
      const fim = this.selectionEnd;
      this.value = this.value.substring(0, inicio) + "  " + this.value.substring(fim);
      this.selectionStart = this.selectionEnd = inicio + 2;
      atualizarPreviewMarkdown();
    }
  });

  textarea.addEventListener("input", function () {
    atualizarPreviewMarkdown();
  });

  // Ações da barra de ferramentas do Markdown
  const toolbarBotoes = document.querySelectorAll(".md-btn");
  toolbarBotoes.forEach((btn) => {
    btn.addEventListener("click", function () {
      const acao = this.dataset.mdAction;
      switch (acao) {
        case "bold":
          inserirMarkdown("**", "**", "texto em negrito");
          break;
        case "italic":
          inserirMarkdown("*", "*", "texto em itálico");
          break;
        case "strike":
          inserirMarkdown("~~", "~~", "texto tachado");
          break;
        case "code":
          inserirMarkdown("`", "`", "código inline");
          break;
        case "codeblock":
          inserirMarkdown("```javascript\n", "\n```\n", "// seu código aqui");
          break;
        case "h1":
          inserirMarkdown("# ", "\n", "Título 1");
          break;
        case "h2":
          inserirMarkdown("## ", "\n", "Título 2");
          break;
        case "h3":
          inserirMarkdown("### ", "\n", "Título 3");
          break;
        case "quote":
          inserirMarkdown("> ", "\n", "Citação");
          break;
        case "ul":
          inserirMarkdown("- ", "\n", "Item da lista");
          break;
        case "ol":
          inserirMarkdown("1. ", "\n", "Item numerado");
          break;
        case "checklist":
          inserirMarkdown("- [ ] ", "\n", "Tarefa pendente");
          break;
        case "table":
          inserirMarkdown(
            "\n| Coluna 1 | Coluna 2 | Coluna 3 |\n| :--- | :---: | ---: |\n| Item A | 100 | Ativo |\n| Item B | 200 | Concluído |\n\n"
          );
          break;
        case "link":
          inserirMarkdown("[", "](https://link.com)", "Texto do Link");
          break;
        case "image":
          inserirMarkdown("![", "](https://link-da-imagem.png)", "Descrição da Imagem");
          break;
        case "hr":
          inserirMarkdown("\n---\n\n");
          break;
      }
    });
  });

  // Abas do Editor (Escrever vs Pré-visualizar)
  const tabEscrever = document.getElementById("tab-escrever");
  const tabPreview = document.getElementById("tab-preview");
  const containerEscrever = document.getElementById("container-escrever");
  const containerPreview = document.getElementById("container-preview");

  if (tabEscrever && tabPreview && containerEscrever && containerPreview) {
    tabEscrever.addEventListener("click", () => {
      tabEscrever.classList.add("active");
      tabPreview.classList.remove("active");
      containerEscrever.style.display = "block";
      containerPreview.style.display = "none";
      textarea.focus();
    });

    tabPreview.addEventListener("click", () => {
      tabPreview.classList.add("active");
      tabEscrever.classList.remove("active");
      containerEscrever.style.display = "none";
      containerPreview.style.display = "block";
      atualizarPreviewMarkdown();
    });
  }

  // Importar arquivo Markdown (.md)
  const btnImportarMd = document.getElementById("btnImportarMd");
  const inputImportarMd = document.getElementById("inputImportarMd");

  if (btnImportarMd && inputImportarMd) {
    btnImportarMd.addEventListener("click", () => inputImportarMd.click());

    inputImportarMd.addEventListener("change", function (e) {
      const arquivo = e.target.files[0];
      if (!arquivo) return;

      const leitor = new FileReader();
      leitor.onload = function (evt) {
        textarea.value = evt.target.result;
        atualizarPreviewMarkdown();
        if (tabEscrever) tabEscrever.click();
      };
      leitor.readAsText(arquivo);
    });
  }

  // Exportar Markdown para download (.md)
  const btnExportarMd = document.getElementById("btnExportarMd");
  if (btnExportarMd) {
    btnExportarMd.addEventListener("click", () => {
      const conteudo = textarea.value;
      const blob = new Blob([conteudo], { type: "text/markdown;charset=utf-8" });
      const link = document.createElement("a");
      const nomeSugestao = gerarNomeArquivoSugerido().replace(".pdf", ".md");
      link.href = URL.createObjectURL(blob);
      link.download = nomeSugestao;
      link.click();
      URL.revokeObjectURL(link.href);
    });
  }

  // Limpar texto
  const btnLimparMd = document.getElementById("btnLimparMd");
  if (btnLimparMd) {
    btnLimparMd.addEventListener("click", () => {
      if (confirm("Tem certeza de que deseja limpar o texto do editor?")) {
        textarea.value = "";
        atualizarPreviewMarkdown();
        textarea.focus();
      }
    });
  }

  atualizarPreviewMarkdown();
}

function atualizarPreviewNomeArquivoNaConfig() {
  const el = document.getElementById("previewNomeArquivo");
  if (el) {
    el.textContent = gerarNomeArquivoSugerido();
  }
}

function initConfigurarPage() {
  const salvarNumeroBtn = document.getElementById("salvarNumero");
  if (!salvarNumeroBtn) return;

  const tipoSalvo = localStorage.getItem("tipoTeste") || "Teste de Performance";
  const tipoTesteInput = document.getElementById("tipoTeste");
  if (tipoTesteInput) tipoTesteInput.value = tipoSalvo;

  const numeroSalvo = localStorage.getItem("numeroTeste") || "1";
  const numeroTesteInput = document.getElementById("numeroTeste");

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

  if (tipoTesteInput) {
    tipoTesteInput.addEventListener("change", function () {
      if (this.value === "Assessment") {
        numeroTesteInput.value = "";
        numeroTesteInput.placeholder = "Opcional para Assessment";
      } else {
        if (!numeroTesteInput.value) {
          numeroTesteInput.value = "1";
        }
        numeroTesteInput.placeholder = "";
      }
      atualizarPreviewNomeArquivoNaConfig();
    });
  }

  const hoje = new Date();
  const dataFormatada = hoje.toISOString().split("T")[0];
  const dataSalva = localStorage.getItem("dataDocumentoInput") || dataFormatada;
  const dataDocInput = document.getElementById("dataDocumento");
  if (dataDocInput) dataDocInput.value = dataSalva;

  const nomeCursoInput = document.getElementById("nomeCurso");
  const nomeMateriaInput = document.getElementById("nomeMateria");
  const nomeAlunoInput = document.getElementById("nomeAluno");
  const nomeProfessorInput = document.getElementById("nomeProfessor");

  if (nomeCursoInput) nomeCursoInput.value = localStorage.getItem("nomeCurso") || "";
  if (nomeMateriaInput) nomeMateriaInput.value = localStorage.getItem("nomeMateria") || "";
  if (nomeAlunoInput) nomeAlunoInput.value = localStorage.getItem("nomeAluno") || "";
  if (nomeProfessorInput) nomeProfessorInput.value = localStorage.getItem("nomeProfessor") || "";

  // Renderizar e vincular histórico de Matérias e Professores
  renderizarHistoricoMaterias();
  renderizarHistoricoProfessores();

  const btnSalvarMateria = document.getElementById("btnSalvarMateria");
  if (btnSalvarMateria) {
    btnSalvarMateria.addEventListener("click", () => {
      salvarMateriaNaLista(nomeMateriaInput.value);
    });
  }

  const btnSalvarProfessor = document.getElementById("btnSalvarProfessor");
  if (btnSalvarProfessor) {
    btnSalvarProfessor.addEventListener("click", () => {
      salvarProfessorNaLista(nomeProfessorInput.value);
    });
  }

  // Atualizar preview do nome de arquivo em tempo real enquanto digita
  [nomeAlunoInput, nomeMateriaInput, numeroTesteInput].forEach((input) => {
    if (input) {
      input.addEventListener("input", atualizarPreviewNomeArquivoNaConfig);
    }
  });

  // Carregar linhas de respostas (1 por padrão)
  carregarLinksRespostas();

  // Controles de quantidade de linhas
  document.querySelectorAll(".btn-qtd-rapida").forEach((btn) => {
    btn.addEventListener("click", function () {
      definirQuantidadeLinhas(this.dataset.qtd);
    });
  });

  const btnAplicarQtd = document.getElementById("btnAplicarQtd");
  const qtdLinhasInput = document.getElementById("qtdLinhasInput");
  if (btnAplicarQtd && qtdLinhasInput) {
    btnAplicarQtd.addEventListener("click", () => {
      definirQuantidadeLinhas(qtdLinhasInput.value);
    });
    qtdLinhasInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        definirQuantidadeLinhas(qtdLinhasInput.value);
      }
    });
  }

  const btnRemoverVazias = document.getElementById("btnRemoverVazias");
  if (btnRemoverVazias) {
    btnRemoverVazias.addEventListener("click", removerLinhasVazias);
  }

  const adicionarRespostaBtn = document.getElementById("adicionar-resposta");
  if (adicionarRespostaBtn) {
    adicionarRespostaBtn.addEventListener("click", function () {
      adicionarCampoResposta("");
    });
  }

  initMarkdownEditor();
  atualizarPreviewNomeArquivoNaConfig();

  salvarNumeroBtn.addEventListener("click", function () {
    const tipoTeste = document.getElementById("tipoTeste").value;
    const numeroTeste = document.getElementById("numeroTeste").value;
    const dataDocumento = document.getElementById("dataDocumento").value;

    let validado = true;

    if (!tipoTeste) {
      alert("Por favor, selecione um tipo de teste.");
      validado = false;
    }

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
      const numeroParaSalvar =
        tipoTeste === "Assessment" ? numeroTeste || "" : numeroTeste || "1";
      localStorage.setItem("numeroTeste", numeroParaSalvar);

      localStorage.setItem("dataDocumentoInput", dataDocumento);

      const partes = dataDocumento.split("-");
      if (partes.length === 3) {
        const dataFormatadaDisplay = `${partes[2]}/${partes[1]}/${partes[0]}`;
        localStorage.setItem("dataDocumento", dataFormatadaDisplay);
      }

      const mat = document.getElementById("nomeMateria").value;
      const prof = document.getElementById("nomeProfessor").value;

      localStorage.setItem("nomeCurso", document.getElementById("nomeCurso").value);
      localStorage.setItem("nomeMateria", mat);
      localStorage.setItem("nomeAluno", document.getElementById("nomeAluno").value);
      localStorage.setItem("nomeProfessor", prof);

      // Salva automaticamente no histórico para facilitar o reuso posterior
      if (mat) salvarMateriaNaLista(mat);
      if (prof) salvarProfessorNaLista(prof);

      salvarLinksRespostas();

      const textarea = document.getElementById("editor-markdown");
      if (textarea) {
        localStorage.setItem("textoLivre", textarea.value);
      }

      atualizarPreviewNomeArquivoNaConfig();

      const statusElement = document.getElementById("status");
      statusElement.textContent = "Alterações salvas com sucesso!";
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

// INICIALIZAÇÃO GERAL

document.addEventListener("DOMContentLoaded", function () {
  initModeloPage();
  initConfigurarPage();

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
