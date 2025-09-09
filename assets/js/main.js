// Theme + Search (client-side)
(function () {
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  if (saved) root.setAttribute('data-theme', saved);
  else root.setAttribute('data-theme', 'light');

  window.toggleTheme = function () {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  // Simple search for search.html
  window.runSearch = async function () {
    const q = (document.querySelector('#q')?.value || '').trim().toLowerCase();
    const container = document.querySelector('#results');
    if (!container) return;
    container.innerHTML = '<p class="small" style="color:var(--muted)">Searching…</p>';
    try {
      const res = await fetch('./posts.json', { cache: 'no-store' });
      const posts = await res.json();
      const filtered = posts.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.categories || []).join(' ').toLowerCase().includes(q)
      );
      if (!q) { container.innerHTML = '<p class="small" style="color:var(--muted)">Type to search posts…</p>'; return; }
      if (filtered.length === 0) { container.innerHTML = '<p>No results.</p>'; return; }
      container.innerHTML = filtered.map(p => `
        <article class="card">
          <a href="${p.url}"><h3 class="post-title">${p.title}</h3></a>
          <div class="meta small">${p.date} • ${p.categories?.join(', ') || ''}</div>
          <p class="small" style="color:var(--muted)">${p.description}</p>
        </article>
      `).join('');
    } catch (e) {
      container.innerHTML = '<p>Failed to load search index.</p>';
    }
  };
})();
