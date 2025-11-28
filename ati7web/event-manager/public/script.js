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
    const response = await fetch(`${API_URL}/events`);
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
    eventsList.innerHTML = '<p class="no-events">Nenhum evento encontrado.</p>';
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
                    <strong>📅 Data:</strong>
                    <span>${formatDate(event.data)}</span>
                </div>
                <div class="event-info-item">
                    <strong>📍 Local:</strong>
                    <span>${event.local}</span>
                </div>
                <div class="event-info-item">
                    <strong>💰 Valor:</strong>
                    <span class="event-valor">R$ ${parseFloat(
                      event.valor
                    ).toFixed(2)}</span>
                </div>
            </div>
            ${
              event.descricao
                ? `
                <div class="event-description">
                    <strong>Descrição:</strong><br>
                    ${event.descricao}
                </div>
            `
                : ""
            }
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
    data: document.getElementById("data").value,
    local: document.getElementById("local").value,
    valor: parseFloat(document.getElementById("valor").value),
  };

  try {
    let response;
    if (isEditing) {
      const eventId = eventIdInput.value;
      response = await fetch(`${API_URL}/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } else {
      response = await fetch(`${API_URL}/events`, {
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
    const response = await fetch(`${API_URL}/events/${id}`);
    const result = await response.json();

    if (result.success) {
      const event = result.data;

      // Preencher formulário
      document.getElementById("titulo").value = event.titulo;
      document.getElementById("descricao").value = event.descricao || "";
      document.getElementById("data").value = new Date(event.data)
        .toISOString()
        .slice(0, 16);
      document.getElementById("local").value = event.local;
      document.getElementById("valor").value = event.valor;
      eventIdInput.value = event._id;

      // Atualizar UI
      isEditing = true;
      formTitle.textContent = "✏️ Editar Evento";
      submitBtn.textContent = "Atualizar Evento";
      cancelBtn.style.display = "inline-block";

      // Scroll para o formulário
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  } catch (error) {
    showAlert("Erro ao carregar evento", "error");
    console.error("Erro:", error);
  }
}

// Deletar evento
async function deleteEvent(id) {
  if (!confirm("Tem certeza que deseja excluir este evento?")) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: "DELETE",
    });
    const result = await response.json();

    if (result.success) {
      showAlert(result.message, "success");
      loadEvents();
    } else {
      showAlert("Erro ao excluir evento", "error");
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
      `${API_URL}/events/search?titulo=${encodeURIComponent(searchTerm)}`
    );
    const result = await response.json();

    if (result.success) {
      displayEvents(result.data);
      showAlert(`${result.count} evento(s) encontrado(s)`, "success");
    } else {
      showAlert("Erro ao buscar eventos", "error");
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
  formTitle.textContent = "➕ Adicionar Novo Evento";
  submitBtn.textContent = "Adicionar Evento";
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
