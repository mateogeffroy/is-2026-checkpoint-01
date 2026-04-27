const API_BASE_URL = "http://localhost:5000";

const backendStatus = document.getElementById("backend-status");
const tableBody = document.getElementById("team-table-body");
const memberCount = document.getElementById("member-count");

document.addEventListener("DOMContentLoaded", () => {
  checkBackendHealth();
  loadTeamMembers();
});

async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);

    if (!response.ok) {
      throw new Error("El backend respondió con error");
    }

    const data = await response.json();

    if (data.status === "healthy") {
      backendStatus.textContent = "Backend conectado";
      backendStatus.className = "status-badge online";
    } else {
      backendStatus.textContent = "Backend con estado desconocido";
      backendStatus.className = "status-badge offline";
    }
  } catch (error) {
    backendStatus.textContent = "Backend sin conexión";
    backendStatus.className = "status-badge offline";
    console.error("Error al verificar el backend:", error);
  }
}

async function loadTeamMembers() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/team`);

    if (!response.ok) {
      throw new Error("No se pudieron obtener los datos del equipo");
    }

    const members = await response.json();

    renderTeamTable(members);
  } catch (error) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="message error">
          No se pudieron cargar los integrantes. Verificá que el backend y la base de datos estén funcionando.
        </td>
      </tr>
    `;

    memberCount.textContent = "0 integrantes";
    console.error("Error al cargar integrantes:", error);
  }
}

function renderTeamTable(members) {
  tableBody.innerHTML = "";

  if (!Array.isArray(members) || members.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="message">
          No hay integrantes cargados en la base de datos.
        </td>
      </tr>
    `;

    memberCount.textContent = "0 integrantes";
    return;
  }

  members.forEach((member) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${escapeHtml(member.nombre)}</td>
      <td>${escapeHtml(member.apellido)}</td>
      <td>${escapeHtml(member.legajo)}</td>
      <td>${escapeHtml(member.feature)}</td>
      <td><span class="service-pill">${escapeHtml(member.servicio)}</span></td>
      <td><span class="${getStateClass(member.estado)}">${escapeHtml(member.estado)}</span></td>
    `;

    tableBody.appendChild(row);
  });

  memberCount.textContent = `${members.length} integrante${members.length === 1 ? "" : "s"}`;
}

function getStateClass(state) {
  const normalizedState = String(state || "").toLowerCase();

  if (normalizedState.includes("activo")) {
    return "state-pill activo";
  }

  if (normalizedState.includes("desarrollo")) {
    return "state-pill desarrollo";
  }

  return "state-pill otro";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}