const API_URL = "http://localhost:3000/api";

// Estado da aplicação
let mesasData = [];
let reservasData = [];
let filtroLocalizacao = "all";

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  inicializarEventos();
  carregarMesas();
  carregarReservas();
  carregarMesasParaSelect();
  setInterval(atualizarStatusMesas, 30000); // Atualiza a cada 30 segundos
});

// Event Listeners
function inicializarEventos() {
  // Tabs
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => mudarTab(btn.dataset.tab));
  });

  // Filtros de localização
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      filtroLocalizacao = btn.dataset.filter;
      renderizarMesas();
    });
  });

  // Formulário de criar reserva
  document
    .getElementById("form-reserva")
    .addEventListener("submit", criarReserva);

  // Validação de horário no formulário de criar
  document
    .getElementById("dataHora")
    .addEventListener("change", validarHorario);
  document.getElementById("duracao").addEventListener("change", validarHorario);

  // Formulário de editar reserva
  document
    .getElementById("form-editar-reserva")
    .addEventListener("submit", salvarEdicaoReserva);

  // Validação de horário no formulário de editar
  document
    .getElementById("edit-dataHora")
    .addEventListener("change", validarHorarioEdicao);
  document
    .getElementById("edit-duracao")
    .addEventListener("change", validarHorarioEdicao);

  // Filtros de reserva
  document
    .getElementById("btn-filtrar")
    .addEventListener("click", filtrarReservas);
  document
    .getElementById("btn-limpar-filtros")
    .addEventListener("click", limparFiltros);

  // Modal
  document.querySelectorAll(".close").forEach((closeBtn) => {
    closeBtn.addEventListener("click", fecharModals);
  });

  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      fecharModals();
    }
  });
}

// Navegação entre tabs
function mudarTab(tabName) {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active");
  });

  document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");
  document.getElementById(`${tabName}-tab`).classList.add("active");
}

// Carregar Mesas
async function carregarMesas() {
  try {
    const response = await fetch(`${API_URL}/reservas/status-mesas`);
    const data = await response.json();

    if (data.success) {
      mesasData = data.data;
      renderizarMesas();
    }
  } catch (error) {
    console.error("Erro ao carregar mesas:", error);
    mostrarMensagem("Erro ao carregar mesas", "error");
  }
}

// Renderizar Mesas
function renderizarMesas() {
  const container = document.getElementById("mesas-map");
  container.innerHTML = "";

  const mesasFiltradas =
    filtroLocalizacao === "all"
      ? mesasData
      : mesasData.filter((m) => m.localizacao === filtroLocalizacao);

  mesasFiltradas.forEach((mesa) => {
    const mesaCard = document.createElement("div");
    mesaCard.className = `mesa-card ${mesa.status}`;
    mesaCard.innerHTML = `
            <div class="mesa-numero">Mesa ${mesa.numero}</div>
            <div class="mesa-info">👥 ${mesa.capacidade} pessoas</div>
            <div class="mesa-localizacao">📍 ${mesa.localizacao}</div>
        `;
    mesaCard.addEventListener("click", () => mostrarDetalhesMesa(mesa));
    container.appendChild(mesaCard);
  });
}

// Mostrar detalhes da mesa
function mostrarDetalhesMesa(mesa) {
  const modal = document.getElementById("modal-mesa");
  const modalBody = document.getElementById("modal-body");

  let conteudo = `
        <h2>Mesa ${mesa.numero}</h2>
        <div class="modal-mesa-info">
            <p><strong>Capacidade:</strong> ${mesa.capacidade} pessoas</p>
            <p><strong>Localização:</strong> ${mesa.localizacao}</p>
            <p><strong>Status:</strong> <span class="reserva-status ${mesa.status}">${mesa.status}</span></p>
    `;

  if (mesa.reservaAtual) {
    const dataHora = new Date(mesa.reservaAtual.dataHora);
    conteudo += `
            <h3>Reserva Atual</h3>
            <p><strong>Cliente:</strong> ${mesa.reservaAtual.nomeCliente}</p>
            <p><strong>Contato:</strong> ${mesa.reservaAtual.contatoCliente}</p>
            <p><strong>Pessoas:</strong> ${
              mesa.reservaAtual.quantidadePessoas
            }</p>
            <p><strong>Data/Hora:</strong> ${dataHora.toLocaleString(
              "pt-BR"
            )}</p>
            <p><strong>Duração:</strong> ${
              mesa.reservaAtual.duracao
            } minutos</p>
            ${
              mesa.reservaAtual.observacoes
                ? `<p><strong>Observações:</strong> ${mesa.reservaAtual.observacoes}</p>`
                : ""
            }
        `;
  } else if (mesa.status === "disponível") {
    conteudo += `
            <p style="margin-top: 20px;">Esta mesa está disponível para reserva.</p>
            <button class="btn btn-primary" onclick="reservarMesa(${mesa.numero})">Fazer Reserva</button>
        `;
  }

  conteudo += "</div>";
  modalBody.innerHTML = conteudo;
  modal.classList.add("show");
}

// Função para reservar mesa (preenche o formulário)
function reservarMesa(numeroMesa) {
  fecharModals();
  mudarTab("criar");
  document.getElementById("numeroMesa").value = numeroMesa;
}

// Carregar mesas para o select
async function carregarMesasParaSelect() {
  try {
    const response = await fetch(`${API_URL}/mesas`);
    const data = await response.json();

    if (data.success) {
      const selects = [
        document.getElementById("numeroMesa"),
        document.getElementById("edit-numeroMesa"),
      ];

      selects.forEach((select) => {
        select.innerHTML = '<option value="">Selecione...</option>';
        data.data.forEach((mesa) => {
          const option = document.createElement("option");
          option.value = mesa.numero;
          option.textContent = `Mesa ${mesa.numero} (${mesa.capacidade} pessoas - ${mesa.localizacao})`;
          select.appendChild(option);
        });
      });
    }
  } catch (error) {
    console.error("Erro ao carregar mesas para select:", error);
  }
}

// Criar Reserva
async function criarReserva(e) {
  e.preventDefault();

  const formData = {
    nomeCliente: document.getElementById("nomeCliente").value,
    contatoCliente: document.getElementById("contatoCliente").value,
    numeroMesa: parseInt(document.getElementById("numeroMesa").value),
    quantidadePessoas: parseInt(
      document.getElementById("quantidadePessoas").value
    ),
    dataHora: document.getElementById("dataHora").value,
    duracao: parseInt(document.getElementById("duracao").value),
    observacoes: document.getElementById("observacoes").value,
  };

  try {
    const response = await fetch(`${API_URL}/reservas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.success) {
      mostrarMensagem("Reserva criada com sucesso!", "success");
      document.getElementById("form-reserva").reset();
      carregarReservas();
      carregarMesas();
      mudarTab("listar");
    } else {
      mostrarMensagem(data.message || "Erro ao criar reserva", "error");
    }
  } catch (error) {
    console.error("Erro ao criar reserva:", error);
    mostrarMensagem("Erro ao criar reserva", "error");
  }
}

// Carregar Reservas
async function carregarReservas() {
  try {
    const response = await fetch(`${API_URL}/reservas`);
    const data = await response.json();

    if (data.success) {
      reservasData = data.data;
      renderizarReservas(reservasData);
    }
  } catch (error) {
    console.error("Erro ao carregar reservas:", error);
    mostrarMensagem("Erro ao carregar reservas", "error");
  }
}

// Renderizar Reservas
function renderizarReservas(reservas) {
  const container = document.getElementById("reservas-list");

  if (reservas.length === 0) {
    container.innerHTML =
      '<p style="text-align: center; color: #666; padding: 20px;">Nenhuma reserva encontrada.</p>';
    return;
  }

  container.innerHTML = reservas
    .map((reserva) => {
      const dataHora = new Date(reserva.dataHora);
      return `
            <div class="reserva-card ${reserva.status}">
                <div class="reserva-header">
                    <div class="reserva-nome">${reserva.nomeCliente}</div>
                    <span class="reserva-status ${reserva.status}">${
        reserva.status
      }</span>
                </div>
                <div class="reserva-info">📞 ${reserva.contatoCliente}</div>
                <div class="reserva-info">🪑 Mesa ${reserva.numeroMesa} | 👥 ${
        reserva.quantidadePessoas
      } pessoas</div>
                <div class="reserva-info">📅 ${dataHora.toLocaleString(
                  "pt-BR"
                )} | ⏱️ ${reserva.duracao} min</div>
                ${
                  reserva.observacoes
                    ? `<div class="reserva-info">📝 ${reserva.observacoes}</div>`
                    : ""
                }
                ${
                  reserva.status !== "cancelado" &&
                  reserva.status !== "finalizado"
                    ? `
                    <div class="reserva-actions">
                        <button class="btn-small btn-edit" onclick="editarReserva('${reserva._id}')">Editar</button>
                        <button class="btn-small btn-cancel" onclick="cancelarReserva('${reserva._id}')">Cancelar</button>
                        <button class="btn-small btn-delete" onclick="deletarReserva('${reserva._id}')">Excluir</button>
                    </div>
                `
                    : ""
                }
            </div>
        `;
    })
    .join("");
}

// Filtrar Reservas
function filtrarReservas() {
  const cliente = document.getElementById("filter-cliente").value.toLowerCase();
  const status = document.getElementById("filter-status").value;

  let reservasFiltradas = reservasData;

  if (cliente) {
    reservasFiltradas = reservasFiltradas.filter((r) =>
      r.nomeCliente.toLowerCase().includes(cliente)
    );
  }

  if (status) {
    reservasFiltradas = reservasFiltradas.filter((r) => r.status === status);
  }

  renderizarReservas(reservasFiltradas);
}

// Limpar Filtros
function limparFiltros() {
  document.getElementById("filter-cliente").value = "";
  document.getElementById("filter-status").value = "";
  renderizarReservas(reservasData);
}

// Editar Reserva
async function editarReserva(id) {
  try {
    const response = await fetch(`${API_URL}/reservas/${id}`);
    const data = await response.json();

    if (data.success) {
      const reserva = data.data;
      const dataHora = new Date(reserva.dataHora);
      const dataHoraLocal = new Date(
        dataHora.getTime() - dataHora.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 16);

      document.getElementById("edit-id").value = reserva._id;
      document.getElementById("edit-nomeCliente").value = reserva.nomeCliente;
      document.getElementById("edit-contatoCliente").value =
        reserva.contatoCliente;
      document.getElementById("edit-numeroMesa").value = reserva.numeroMesa;
      document.getElementById("edit-quantidadePessoas").value =
        reserva.quantidadePessoas;
      document.getElementById("edit-dataHora").value = dataHoraLocal;
      document.getElementById("edit-duracao").value = reserva.duracao;
      document.getElementById("edit-observacoes").value =
        reserva.observacoes || "";

      document.getElementById("modal-editar").classList.add("show");
    }
  } catch (error) {
    console.error("Erro ao carregar reserva:", error);
    mostrarMensagem("Erro ao carregar reserva", "error");
  }
}

// Salvar Edição de Reserva
async function salvarEdicaoReserva(e) {
  e.preventDefault();

  const id = document.getElementById("edit-id").value;
  const formData = {
    nomeCliente: document.getElementById("edit-nomeCliente").value,
    contatoCliente: document.getElementById("edit-contatoCliente").value,
    numeroMesa: parseInt(document.getElementById("edit-numeroMesa").value),
    quantidadePessoas: parseInt(
      document.getElementById("edit-quantidadePessoas").value
    ),
    dataHora: document.getElementById("edit-dataHora").value,
    duracao: parseInt(document.getElementById("edit-duracao").value),
    observacoes: document.getElementById("edit-observacoes").value,
  };

  try {
    const response = await fetch(`${API_URL}/reservas/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.success) {
      mostrarMensagem("Reserva atualizada com sucesso!", "success");
      fecharModals();
      carregarReservas();
      carregarMesas();
    } else {
      mostrarMensagem(data.message || "Erro ao atualizar reserva", "error");
    }
  } catch (error) {
    console.error("Erro ao atualizar reserva:", error);
    mostrarMensagem("Erro ao atualizar reserva", "error");
  }
}

// Cancelar Reserva
async function cancelarReserva(id) {
  if (!confirm("Deseja realmente cancelar esta reserva?")) return;

  try {
    const response = await fetch(`${API_URL}/reservas/${id}/cancelar`, {
      method: "PATCH",
    });

    const data = await response.json();

    if (data.success) {
      mostrarMensagem("Reserva cancelada com sucesso!", "success");
      carregarReservas();
      carregarMesas();
    } else {
      mostrarMensagem(data.message || "Erro ao cancelar reserva", "error");
    }
  } catch (error) {
    console.error("Erro ao cancelar reserva:", error);
    mostrarMensagem("Erro ao cancelar reserva", "error");
  }
}

// Deletar Reserva
async function deletarReserva(id) {
  if (
    !confirm(
      "Deseja realmente excluir esta reserva? Esta ação não pode ser desfeita."
    )
  )
    return;

  try {
    const response = await fetch(`${API_URL}/reservas/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (data.success) {
      mostrarMensagem("Reserva excluída com sucesso!", "success");
      carregarReservas();
      carregarMesas();
    } else {
      mostrarMensagem(data.message || "Erro ao excluir reserva", "error");
    }
  } catch (error) {
    console.error("Erro ao excluir reserva:", error);
    mostrarMensagem("Erro ao excluir reserva", "error");
  }
}

// Atualizar status das mesas periodicamente
function atualizarStatusMesas() {
  carregarMesas();
}

// Fechar Modals
function fecharModals() {
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.classList.remove("show");
  });
}

function fecharModalEditar() {
  document.getElementById("modal-editar").classList.remove("show");
}

// Mostrar Mensagem
function mostrarMensagem(texto, tipo) {
  const listarTab = document.getElementById("listar-tab");
  const criarTab = document.getElementById("criar-tab");

  const mensagem = document.createElement("div");
  mensagem.className = `message ${tipo}`;
  mensagem.textContent = texto;

  // Adiciona a mensagem na tab ativa
  const tabAtiva = document.querySelector(".tab-content.active");
  tabAtiva.insertBefore(mensagem, tabAtiva.firstChild);

  setTimeout(() => {
    mensagem.remove();
  }, 5000);
}

// Validar horário de funcionamento (19h às 23h)
function validarHorario() {
  const dataHoraInput = document.getElementById("dataHora");
  const duracaoInput = document.getElementById("duracao");

  if (!dataHoraInput.value) return;

  const dataHora = new Date(dataHoraInput.value);
  const hora = dataHora.getHours();
  const duracao = parseInt(duracaoInput.value) || 90;

  const fimReserva = new Date(dataHora.getTime() + duracao * 60000);
  const horaFim = fimReserva.getHours();
  const minutoFim = fimReserva.getMinutes();

  if (hora < 12 || hora >= 23) {
    dataHoraInput.setCustomValidity("O restaurante funciona das 12h às 23h");
    dataHoraInput.reportValidity();
  } else if (horaFim > 23 || (horaFim === 23 && minutoFim > 0)) {
    dataHoraInput.setCustomValidity("A reserva deve terminar até às 23h");
    dataHoraInput.reportValidity();
  } else {
    dataHoraInput.setCustomValidity("");
  }
}

function validarHorarioEdicao() {
  const dataHoraInput = document.getElementById("edit-dataHora");
  const duracaoInput = document.getElementById("edit-duracao");

  if (!dataHoraInput.value) return;

  const dataHora = new Date(dataHoraInput.value);
  const hora = dataHora.getHours();
  const duracao = parseInt(duracaoInput.value) || 90;

  const fimReserva = new Date(dataHora.getTime() + duracao * 60000);
  const horaFim = fimReserva.getHours();
  const minutoFim = fimReserva.getMinutes();

  if (hora < 19 || hora >= 23) {
    dataHoraInput.setCustomValidity("O restaurante funciona das 19h às 23h");
    dataHoraInput.reportValidity();
  } else if (horaFim > 23 || (horaFim === 23 && minutoFim > 0)) {
    dataHoraInput.setCustomValidity("A reserva deve terminar até às 23h");
    dataHoraInput.reportValidity();
  } else {
    dataHoraInput.setCustomValidity("");
  }
}
