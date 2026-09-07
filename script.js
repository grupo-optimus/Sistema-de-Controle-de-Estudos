// ============================================================
// OPTIMUS STUDY — SISTEMA DE CONTROLE DE ESTUDOS
// Estrutura acadêmica: objetos -> array de objetos -> JSON -> localStorage
// ============================================================

let disciplinas = [];

const form = document.getElementById("formDisciplina");
const nomeInput = document.getElementById("nomeDisciplina");
const horasInput = document.getElementById("horasEstudadas");
const feedback = document.getElementById("formFeedback");
const lista = document.getElementById("listaDisciplinas");
const emptyState = document.getElementById("emptyState");
const totalDisciplinas = document.getElementById("totalDisciplinas");
const totalConcluidas = document.getElementById("totalConcluidas");
const totalHoras = document.getElementById("totalHoras");
const countBadge = document.getElementById("countBadge");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeLabel = document.getElementById("themeLabel");

const CHAVE_STORAGE = "disciplinas";
const CHAVE_TEMA = "optimusStudyTema";

// ------------------------------------------------------------
// PERSISTÊNCIA
// ------------------------------------------------------------

function carregarDisciplinas() {
  const dados = localStorage.getItem(CHAVE_STORAGE);

  if (!dados) {
    disciplinas = [];
    return;
  }

  try {
    const dadosConvertidos = JSON.parse(dados);

    if (Array.isArray(dadosConvertidos)) {
      disciplinas = dadosConvertidos;
    } else {
      disciplinas = [];
    }
  } catch (erro) {
    disciplinas = [];
  }
}

function salvarDisciplinas() {
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(disciplinas));
}

// ------------------------------------------------------------
// RENDERIZAÇÃO
// ------------------------------------------------------------

function atualizarResumo() {
  const concluidas = disciplinas.filter((disciplina) => disciplina.concluida).length;
  const horas = disciplinas.reduce(
    (total, disciplina) => total + Number(disciplina.horasEstudadas),
    0
  );

  totalDisciplinas.textContent = disciplinas.length;
  totalConcluidas.textContent = concluidas;
  totalHoras.textContent = horas % 1 === 0 ? horas : horas.toFixed(1);
  countBadge.textContent = `${disciplinas.length} ${disciplinas.length === 1 ? "disciplina" : "disciplinas"}`;
}

function listarDisciplinas() {
  lista.innerHTML = "";

  if (disciplinas.length === 0) {
    lista.hidden = true;
    emptyState.hidden = false;
    atualizarResumo();
    return;
  }

  lista.hidden = false;
  emptyState.hidden = true;

  disciplinas.forEach((disciplina, indice) => {
    const article = document.createElement("article");
    article.className = `discipline${disciplina.concluida ? " is-done" : ""}`;

    const main = document.createElement("div");
    main.className = "discipline-main";

    const title = document.createElement("div");
    title.className = "discipline-title";

    const heading = document.createElement("h3");
    heading.textContent = disciplina.nome;

    const status = document.createElement("span");
    status.className = `status${disciplina.concluida ? " done" : ""}`;
    status.textContent = disciplina.concluida ? "Concluída" : "Em andamento";

    title.append(heading, status);

    const meta = document.createElement("div");
    meta.className = "discipline-meta";

    const hours = document.createElement("span");
    hours.innerHTML = `Horas estudadas: <strong>${formatarHoras(disciplina.horasEstudadas)}h</strong>`;

    meta.append(hours);
    main.append(title, meta);

    const actions = document.createElement("div");
    actions.className = "discipline-actions";

    const statusButton = document.createElement("button");
    statusButton.className = "action";
    statusButton.type = "button";
    statusButton.textContent = disciplina.concluida ? "Reabrir" : "Concluir";
    statusButton.setAttribute(
      "aria-label",
      `${disciplina.concluida ? "Reabrir" : "Concluir"} ${disciplina.nome}`
    );
    statusButton.addEventListener("click", () => alterarConclusao(indice));

    const removeButton = document.createElement("button");
    removeButton.className = "action action-danger";
    removeButton.type = "button";
    removeButton.textContent = "Remover";
    removeButton.setAttribute("aria-label", `Remover ${disciplina.nome}`);
    removeButton.addEventListener("click", () => removerDisciplina(indice));

    actions.append(statusButton, removeButton);
    article.append(main, actions);
    lista.append(article);
  });

  atualizarResumo();
}

function formatarHoras(valor) {
  const horas = Number(valor);
  return horas % 1 === 0 ? String(horas) : horas.toFixed(1);
}

// ------------------------------------------------------------
// CRUD
// ------------------------------------------------------------

function adicionarDisciplina(event) {
  event.preventDefault();
  feedback.textContent = "";

  const nome = nomeInput.value.trim();
  const horas = Number(horasInput.value);

  if (!nome) {
    feedback.textContent = "Informe o nome da disciplina.";
    nomeInput.focus();
    return;
  }

  if (horasInput.value.trim() === "") {
    feedback.textContent = "Informe a quantidade de horas estudadas.";
    horasInput.focus();
    return;
  }

  if (!Number.isFinite(horas) || horas < 0) {
    feedback.textContent = "Informe uma quantidade de horas válida.";
    horasInput.focus();
    return;
  }

  const novaDisciplina = {
    nome: nome,
    horasEstudadas: horas,
    concluida: false
  };

  disciplinas.push(novaDisciplina);
  salvarDisciplinas();
  listarDisciplinas();

  form.reset();
  nomeInput.focus();
}

function alterarConclusao(indice) {
  disciplinas[indice].concluida = !disciplinas[indice].concluida;
  salvarDisciplinas();
  listarDisciplinas();
}

function removerDisciplina(indice) {
  disciplinas.splice(indice, 1);
  salvarDisciplinas();
  listarDisciplinas();
}

// ------------------------------------------------------------
// TEMA
// ------------------------------------------------------------

function aplicarTema(tema) {
  const escuro = tema === "escuro";

  document.body.classList.toggle("light", !escuro);
  themeIcon.textContent = escuro ? "☀" : "☾";
  themeLabel.textContent = escuro ? "Tema claro" : "Tema escuro";
  themeToggle.setAttribute(
    "aria-label",
    escuro ? "Ativar tema claro" : "Ativar tema escuro"
  );
}

function carregarTema() {
  const temaSalvo = localStorage.getItem(CHAVE_TEMA);

  if (temaSalvo === "claro" || temaSalvo === "escuro") {
    aplicarTema(temaSalvo);
    return;
  }

  aplicarTema("escuro");
}

function alternarTema() {
  const temaAtual = document.body.classList.contains("light") ? "claro" : "escuro";
  const proximoTema = temaAtual === "claro" ? "escuro" : "claro";

  localStorage.setItem(CHAVE_TEMA, proximoTema);
  aplicarTema(proximoTema);
}

// ------------------------------------------------------------
// INICIALIZAÇÃO
// ------------------------------------------------------------

form.addEventListener("submit", adicionarDisciplina);
themeToggle.addEventListener("click", alternarTema);

carregarTema();
carregarDisciplinas();
listarDisciplinas();
