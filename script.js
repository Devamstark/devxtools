document.addEventListener("DOMContentLoaded", async () => {
  const toolList = document.getElementById("tool-list");
  const searchInput = document.getElementById("search");
  const useCaseFilter = document.getElementById("useCaseFilter");
  const apiOnly = document.getElementById("apiOnly");

  let tools = [];

  try {
    const res = await fetch("tools.json");
    tools = await res.json();
  } catch (e) {
    toolList.innerHTML = "<p style='color: red;'>Failed to load tools. Check your GitHub repo.</p>";
    console.error("Failed to load tools.json:", e);
    return;
  }

  function renderTools() {
    const query = searchInput.value.toLowerCase();
    const useCase = useCaseFilter.value;
    const api = apiOnly.checked;

    const filtered = tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(query) ||
                            tool.description.toLowerCase().includes(query) ||
                            (tool.tags && tool.tags.some(t => t.toLowerCase().includes(query)));
      const matchesUseCase = !useCase || (tool.useCases && tool.useCases.includes(useCase));
      const matchesApi = !api || tool.hasApi;
      return matchesSearch && matchesUseCase && matchesApi;
    });

    toolList.innerHTML = filtered.map(tool => `
      <div class="tool-card">
        <h3>
          <a href="${tool.url}" target="_blank">${tool.name}</a>
          ${tool.githubUrl ? `<a href="${tool.githubUrl}" class="github-link" target="_blank">⭐${tool.stars || '?'}</a>` : ''}
        </h3>
        <p>${tool.description}</p>
        <div class="tags">
          ${tool.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  searchInput.addEventListener("input", renderTools);
  useCaseFilter.addEventListener("change", renderTools);
  apiOnly.addEventListener("change", renderTools);

  renderTools();
});