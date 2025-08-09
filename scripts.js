// === scripts.js - Full updated version with top navigation tabs ===
document.addEventListener("DOMContentLoaded", async () => {
  const toolList = document.getElementById("tool-list");
  const searchInput = document.getElementById("search");
  const navLinks = document.querySelectorAll(".nav-link");

  let activeFilter = "all";
  let tools = [];

  // Fetch tools.json
  try {
    const res = await fetch("tools.json");
    if (!res.ok) throw new Error("Failed to load tools.json");
    tools = await res.json();
  } catch (e) {
    toolList.innerHTML = `
      <p style="grid-column: 1 / -1; text-align: center; color: #d32f2f; padding: 20px;">
        🛠️ Failed to load tools. Check your <code>tools.json</code> file.
      </p>`;
    console.error("Error loading tools:", e);
    return;
  }

  // Filter logic
  function matchesFilter(tool, filter) {
    if (filter === "all") return true;
    if (filter === "hasApi") return tool.hasApi === true;
    if (tool.useCases && tool.useCases.includes(filter)) return true;
    if (tool.tags && tool.tags.includes(filter)) return true;
    return false;
  }

  // Render tools
  function renderTools() {
    const query = searchInput.value.toLowerCase().trim();

    const filtered = tools.filter(tool => {
      const matchesSearch = !query || 
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        (tool.tags && tool.tags.some(t => t.toLowerCase().includes(query)));
      const matchesTab = matchesFilter(tool, activeFilter);
      return matchesSearch && matchesTab;
    });

    if (filtered.length === 0) {
      toolList.innerHTML = `
        <p style="grid-column: 1 / -1; text-align: center; color: #666; padding: 20px;">
          No tools match your search.
        </p>`;
      return;
    }

    toolList.innerHTML = filtered.map(tool => `
      <div class="tool-card">
        <h3>
          <a href="${tool.url}" target="_blank">${tool.name}</a>
          ${tool.githubUrl 
            ? `<a href="${tool.githubUrl}" class="github-link" target="_blank">⭐${tool.stars.toLocaleString()}</a>` 
            : ''}
        </h3>
        <p>${tool.description}</p>
        <div class="tags">
          ${tool.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  // Search input
  searchInput.addEventListener("input", renderTools);

  // Top nav tab clicks
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      activeFilter = link.getAttribute("data-filter");

      // Update active class
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      renderTools();
    });
  });

  // Initial render
  renderTools();

  // === Dark Mode Toggle ===
  const body = document.body;
  const toggle = document.createElement("button");
  toggle.className = "theme-toggle";
  toggle.innerHTML = "🌙";
  toggle.title = "Toggle dark mode";
  toggle.onclick = () => {
    body.classList.toggle("dark");
    toggle.innerHTML = body.classList.contains("dark") ? "☀️" : "🌙";
    localStorage.setItem("theme", body.classList.contains("dark") ? "dark" : "light");
  };
  document.body.appendChild(toggle);

  // Load saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    body.classList.add("dark");
    toggle.innerHTML = "☀️";
  }
});