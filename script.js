/**
 * Documentación del código
 * 
 *  actor: Ivan Gonzalez
 *
 * Este script maneja la funcionalidad de agregar pestañas dinámicamente
 * al hacer clic en los enlaces del sidebar, y persistir estas pestañas
 * en localStorage para que se mantengan entre sesiones.
 *
 * Funciones principales:
 * 1. `createTab(id, title, content)`: Crea una nueva pestaña y su contenido asociado.
 * 2. `saveTabsToLocalStorage()`: Guarda las pestañas actuales en localStorage.
 * 3. `loadTabsFromLocalStorage()`: Carga las pestañas desde localStorage al iniciar.
 *
 * Eventos principales:
 * 1. `DOMContentLoaded`: Inicializa la aplicación al cargar el DOM.
 * 2. `tabList.click`: Maneja el evento de cierre de pestañas.
 * 3. `sidebarLinks.click`: Maneja el evento de creación de nuevas pestañas al hacer clic en los enlaces del sidebar.
 */

document.addEventListener("DOMContentLoaded", function () {
  const tabList = document.getElementById("tabList");
  const tabContent = document.getElementById("tabContent");
  const sidebarLinks = document.getElementById("sidebar-links");

  let tabCounter = 0;

  /**
   * Crea una nueva pestaña y su contenido asociado.
   *
   * @param {number} id - El identificador único de la pestaña.
   * @param {string} title - El título de la pestaña.
   * @param {string} content - El contenido HTML de la pestaña.
   */
  function createTab(id, title, content) {
    const tabId = `tab-${id}`;
    const paneId = `pane-${id}`;

    const tab = document.createElement("li");
    tab.className = "nav-item";
    tab.innerHTML = `
      <a class="nav-link" id="${tabId}-tab" data-bs-toggle="tab" href="#${paneId}" role="tab" aria-controls="${paneId}" aria-selected="false">
        ${title} <button class="btn btn-link btn-sm p-0 ms-2 close-tab" data-id="${id}">&times;</button>
      </a>
    `;

    const tabPane = document.createElement("div");
    tabPane.className = "tab-pane fade";
    tabPane.id = paneId;
    tabPane.role = "tabpanel";
    tabPane.setAttribute("aria-labelledby", `${tabId}-tab`);
    tabPane.innerHTML = content;

    tabList.appendChild(tab);
    tabContent.appendChild(tabPane);

    saveTabsToLocalStorage();
  }

  /**
   * Guarda las pestañas actuales en localStorage.
   */
  function saveTabsToLocalStorage() {
    const tabs = [];
    tabList.querySelectorAll(".nav-item").forEach((tab, index) => {
      const tabLink = tab.querySelector("a");
      const tabId = tabLink.getAttribute("href").replace("#pane-", "");
      const tabTitle = tabLink.childNodes[0].nodeValue.trim();
      const tabContent = document.getElementById(`pane-${tabId}`).innerHTML;

      tabs.push({ id: tabId, title: tabTitle, content: tabContent });
    });
    localStorage.setItem("tabs", JSON.stringify(tabs));
  }

  /**
   * Carga las pestañas desde localStorage.
   */
  function loadTabsFromLocalStorage() {
    const tabs = JSON.parse(localStorage.getItem("tabs"));
    if (tabs) {
      tabs.forEach((tab) => {
        createTab(tab.id, tab.title, tab.content);
        tabCounter = Math.max(tabCounter, parseInt(tab.id, 10) + 1);
      });
    }
  }

  /**
   * Maneja el evento de clic para cerrar pestañas.
   */
  tabList.addEventListener("click", function (event) {
    if (event.target.classList.contains("close-tab")) {
      const id = event.target.getAttribute("data-id");
      const tab = document.getElementById(`tab-${id}-tab`).parentNode;
      const tabPane = document.getElementById(`pane-${id}`);
      tab.remove();
      tabPane.remove();
      saveTabsToLocalStorage();
    }
  });

  /**
   * Maneja el evento de clic para crear nuevas pestañas al hacer clic en los enlaces del sidebar.
   */
  sidebarLinks.addEventListener("click", function (event) {
    if (event.target.classList.contains("list-group-item")) {
      event.preventDefault();
      const tabTitle = event.target.getAttribute("data-tab-title");
      const newTabId = tabCounter++;
      createTab(
        newTabId,
        tabTitle,
        `<p>Contenido de la pestaña ${tabTitle}</p>`
      );
      document.getElementById(`tab-${newTabId}-tab`).click(); // Activar la nueva pestaña
    }
  });

  // Cargar las pestañas desde localStorage al iniciar
  loadTabsFromLocalStorage();
});
