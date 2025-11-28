const API_URL = "http://localhost:3000/api";

// Elementos do DOM
const eventForm = document.getElementById("event-form");
const eventsList = document.getElementById("events-list");
const alertBox = document.getElementById("alert");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const clearSearchBtn = document.getElementById("clear-search-btn");
const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const eventIdInput = document.getElementById("event-id");

// Estado da aplicação
let isEditing = false;

// Inicializar aplicação
document.addEventListener("DOMContentLoaded", () => {
  loadEvents();
  setupEventListeners();
});

// Configurar listeners
function setupEventListeners() {
  eventForm.addEventListener("submit", handleFormSubmit);
  searchBtn.addEventListener("click", handleSearch);
  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    loadEvents();
  });
  cancelBtn.addEventListener("click", resetForm);
}

// Carregar eventos
async function loadEvents() {
  try {
    const response = await fetch(`${API_URL}/service-orders`);
    const result = await response.json();

    if (result.success) {
      displayEvents(result.data);
    } else {
      showAlert("Erro ao carregar eventos", "error");
    }
  } catch (error) {
    showAlert("Erro ao conectar com o servidor", "error");
    console.error("Erro:", error);
  }
}

// Exibir eventos
function displayEvents(events) {
  if (events.length === 0) {
    eventsList.innerHTML =
      '<p class="no-events">Nenhuma ordem de serviço encontrada.</p>';
    return;
  }

  eventsList.innerHTML = events
    .map(
      (event) => `
        <div class="event-card">
            <div class="event-header">
                <h3 class="event-title">${event.titulo}</h3>
                <div class="event-actions">
                    <button class="btn btn-edit" onclick="editEvent('${
                      event._id
                    }')">✏️ Editar</button>
                    <button class="btn btn-danger" onclick="deleteEvent('${
                      event._id
                    }')">🗑️ Excluir</button>
                </div>
            </div>
            <div class="event-info">
                <div class="event-info-item">
                    <strong>📅 Abertura:</strong>
                    <span>${formatDate(event.dataAbertura)}</span>
                </div>
                <div class="event-info-item">
                    <strong>📊 Status:</strong>
                    <span class="status-badge status-${event.status.replace(
                      " ",
                      "-"
                    )}">${event.status}</span>
                </div>
                <div class="event-info-item">
                    <strong>⚡ Prioridade:</strong>
                    <span class="priority-badge priority-${event.prioridade}">${
        event.prioridade
      }</span>
                </div>
                <div class="event-info-item">
                    <strong>🏢 Setor:</strong>
                    <span>${event.setorSolicitante}</span>
                </div>
                ${
                  event.responsavel
                    ? `
                <div class="event-info-item">
                    <strong>👤 Responsável:</strong>
                    <span>${event.responsavel}</span>
                </div>
                `
                    : ""
                }
                <div class="event-info-item">
                    <strong>💰 Valor:</strong>
                    <span class="event-valor">R$ ${parseFloat(
                      event.valorServico
                    ).toFixed(2)}</span>
                </div>
                ${
                  event.prazoEstimado
                    ? `
                <div class="event-info-item">
                    <strong>⏰ Prazo:</strong>
                    <span>${formatDate(event.prazoEstimado)}</span>
                </div>
                `
                    : ""
                }
            </div>
            <div class="event-description">
                <strong>Descrição:</strong><br>
                ${event.descricao}
            </div>
        </div>
    `
    )
    .join("");
}

// Formatar data
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Submeter formulário
async function handleFormSubmit(e) {
  e.preventDefault();

  const formData = {
    titulo: document.getElementById("titulo").value,
    descricao: document.getElementById("descricao").value,
    prioridade: document.getElementById("prioridade").value,
    setorSolicitante: document.getElementById("setorSolicitante").value,
    valorServico: parseFloat(document.getElementById("valorServico").value),
  };

  // Adicionar campos opcionais apenas se preenchidos
  const responsavel = document.getElementById("responsavel").value;
  if (responsavel) formData.responsavel = responsavel;

  const prazoEstimado = document.getElementById("prazoEstimado").value;
  if (prazoEstimado) formData.prazoEstimado = prazoEstimado;

  try {
    let response;
    if (isEditing) {
      const eventId = eventIdInput.value;
      response = await fetch(`${API_URL}/service-orders/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } else {
      response = await fetch(`${API_URL}/service-orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    }

    const result = await response.json();

    if (result.success) {
      showAlert(result.message, "success");
      resetForm();
      loadEvents();
    } else {
      showAlert(result.message || "Erro ao salvar evento", "error");
    }
  } catch (error) {
    showAlert("Erro ao conectar com o servidor", "error");
    console.error("Erro:", error);
  }
}

// Editar evento
async function editEvent(id) {
  try {
    const response = await fetch(`${API_URL}/service-orders/${id}`);
    const result = await response.json();

    if (result.success) {
      const event = result.data;

      // Preencher formulário
      document.getElementById("titulo").value = event.titulo;
      document.getElementById("descricao").value = event.descricao || "";
      document.getElementById("prioridade").value = event.prioridade;
      document.getElementById("setorSolicitante").value =
        event.setorSolicitante;
      document.getElementById("responsavel").value = event.responsavel || "";
      document.getElementById("valorServico").value = event.valorServico;
      if (event.prazoEstimado) {
        document.getElementById("prazoEstimado").value = new Date(
          event.prazoEstimado
        )
          .toISOString()
          .slice(0, 16);
      }
      eventIdInput.value = event._id;

      // Atualizar UI
      isEditing = true;
      formTitle.textContent = "✏️ Editar Ordem de Serviço";
      submitBtn.textContent = "Atualizar Ordem";
      cancelBtn.style.display = "inline-block";

      // Scroll para o formulário
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  } catch (error) {
    showAlert("Erro ao carregar ordem de serviço", "error");
    console.error("Erro:", error);
  }
}

// Deletar evento
async function deleteEvent(id) {
  if (!confirm("Tem certeza que deseja excluir esta ordem de serviço?")) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/service-orders/${id}`, {
      method: "DELETE",
    });
    const result = await response.json();

    if (result.success) {
      showAlert(result.message, "success");
      loadEvents();
    } else {
      showAlert("Erro ao excluir ordem de serviço", "error");
    }
  } catch (error) {
    showAlert("Erro ao conectar com o servidor", "error");
    console.error("Erro:", error);
  }
}

// Buscar eventos
async function handleSearch() {
  const searchTerm = searchInput.value.trim();

  if (!searchTerm) {
    loadEvents();
    return;
  }

  try {
    const response = await fetch(
      `${API_URL}/service-orders/search?titulo=${encodeURIComponent(
        searchTerm
      )}`
    );
    const result = await response.json();

    if (result.success) {
      displayEvents(result.data);
      showAlert(
        `${result.count} ordem(ns) de serviço encontrada(s)`,
        "success"
      );
    } else {
      showAlert("Erro ao buscar ordens de serviço", "error");
    }
  } catch (error) {
    showAlert("Erro ao conectar com o servidor", "error");
    console.error("Erro:", error);
  }
}

// Resetar formulário
function resetForm() {
  eventForm.reset();
  eventIdInput.value = "";
  isEditing = false;
  formTitle.textContent = "➕ Adicionar Nova Ordem de Serviço";
  submitBtn.textContent = "Adicionar Ordem";
  cancelBtn.style.display = "none";
}

// Exibir alertas
function showAlert(message, type) {
  alertBox.textContent = message;
  alertBox.className = `alert ${type} show`;

  setTimeout(() => {
    alertBox.classList.remove("show");
  }, 5000);
}
