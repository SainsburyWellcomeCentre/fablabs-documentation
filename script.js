// script.js – full features
const API_BASE = 'https://api.github.com';
const ORG = 'SainsburyWellcomeCentre';
let repos = [];
let customContent = {};
let filteredRepos = [];

// ——— Load custom.json ———
async function loadCustomContent() {
    try {
        const res = await fetch('custom.json');
        if (!res.ok) throw new Error();
        customContent = await res.json();
    } catch (err) {
        console.warn('custom.json not found');
        customContent = {};
    }
}

// ——— Theme Toggle ———
function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const saved = localStorage.getItem('theme');
    const isDark = saved === 'dark' || (!saved && prefersDark);

    document.documentElement.classList.toggle('dark-mode', isDark);
    toggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';

    toggle.addEventListener('click', () => {
        const willBeDark = !document.documentElement.classList.contains('dark-mode');
        document.documentElement.classList.toggle('dark-mode', willBeDark);
        toggle.textContent = willBeDark ? 'Light Mode' : 'Dark Mode';
        localStorage.setItem('theme', willBeDark ? 'dark' : 'light');
    });
}

// ——— Search ———
function initSearch() {
    const input = document.getElementById('search-input');
    const clear = document.getElementById('clear-search');

    input.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();
        clear.style.display = query ? 'block' : 'none';
        filteredRepos = repos.filter(r =>
            r.name.toLowerCase().includes(query) ||
            (r.description && r.description.toLowerCase().includes(query))
        );
        renderRepoGrid();
    });

    clear.addEventListener('click', () => {
        input.value = '';
        clear.style.display = 'none';
        filteredRepos = repos;
        renderRepoGrid();
    });
}

// ——— Rest of logic ———
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function showError(el, msg) {
    el.textContent = msg; el.style.display = 'block';
}

async function fetchRepos() {
    try {
        const res = await fetch(`${API_BASE}/orgs/${ORG}/repos?per_page=100&sort=updated`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        repos = (await res.json())
            .filter(r => !r.archived && !r.fork)
            .filter(r => r.topics.includes('swc-fablabs'))
            .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));
        filteredRepos = [...repos];

        document.getElementById('repo-count').textContent = repos.length;
        document.getElementById('last-refresh').textContent = new Date().toLocaleTimeString();
        renderRepoGrid();
        checkHash();
    } catch (err) {
        showError(document.getElementById('error'), 'Failed to load repos. Retrying...');
        setTimeout(fetchRepos, 5000);
    }
}

function renderRepoGrid() {
    const grid = document.getElementById('repo-grid');
    const display = filteredRepos.length ? filteredRepos : repos;
    grid.innerHTML = display.map(repo => `
        <div class="repo-card" onclick="showRepo('${repo.name}')">
            <div class="repo-name">
                ${repo.name}
                ${repo.stargazers_count ? `<span class="badge">${repo.stargazers_count}</span>` : ''}
            </div>
            <div class="repo-desc">${repo.description || 'No description.'}</div>
            <div class="repo-meta">
                <span class="repo-lang">${repo.language || '—'}</span>
                <span> • Updated ${formatDate(repo.pushed_at)}</span>
            </div>
        </div>
    `).join('');
    document.getElementById('loading').style.display = 'none';
}

// ——— showRepo: Load custom content from repo → fallback to local custom.json ———
async function showRepo(name) {
    const repo = repos.find(r => r.name === name);
    if (!repo) return;

    history.pushState({ repo: name }, '', `#${name}`);
    document.getElementById('list-view').style.display = 'none';
    document.getElementById('detail-view').style.display = 'block';
    document.getElementById('detail-title').textContent = name;
    document.getElementById('detail-meta').textContent = `${repo.language || '—'} • Updated ${formatDate(repo.updated_at)}`;
    document.getElementById('github-btn').href = repo.html_url;

    const content = document.getElementById('detail-content');
    const loading = document.getElementById('detail-loading');
    const err    = document.getElementById('detail-error');

    content.innerHTML = '';
    loading.style.display = 'block';
    err.style.display = 'none';

    /* ---------- 1. Fetch default_branch ---------- */
    let defaultBranch = 'main';
    try {
        const repoRes = await fetch(`${API_BASE}/repos/${ORG}/${name}`);
        if (repoRes.ok) {
            const repoData = await repoRes.json();
            defaultBranch = repoData.default_branch || 'main';
        }
    } catch (e) {
        console.warn(`Using 'main' for ${name}`);
    }

    /* ---------- 2. Latest Release Link ---------- */
    let releaseHtml = '';
    try {
        const releaseRes = await fetch(`${API_BASE}/repos/${ORG}/${name}/releases/latest`);
        if (releaseRes.ok) {
            const r = await releaseRes.json();
            releaseHtml = `<div class="release-link"><strong>Latest Release:</strong> <a href="${r.html_url}" target="_blank">${r.tag_name}</a></div>`;
        } else {
            releaseHtml = '<div class="release-link"><strong>Latest Release:</strong> No releases yet</div>';
        }
    } catch {
        releaseHtml = '<div class="release-link"><strong>Latest Release:</strong> No releases yet</div>';
    }

    /* ---------- 3. Load altium-viewer.json (supports multiple) ---------- */
    let viewersHtml = '';
    try {
        const viewerRes = await fetch(`https://raw.githubusercontent.com/${ORG}/${name}/${defaultBranch}/altium-viewer.json`);
        if (viewerRes.ok) {
            const viewerData = await viewerRes.json();
            const addresses = viewerData.address;

            if (addresses && typeof addresses === 'object') {
                const tabs = Object.keys(addresses);
                if (tabs.length > 0) {
                    viewersHtml = `
                        <div id="viewer" class="altium-viewer-section">
                            <h2>Altium Viewer</h2>
                            <div class="altium-tabs">
                                <div class="altium-tab-buttons">
                                    ${tabs.map((key, i) => {
                                        const label = key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                                        return `<button class="altium-tab-btn ${i === 0 ? 'active' : ''}" data-tab="${key}">${label}</button>`;
                                    }).join('')}
                                </div>
                                <div class="altium-tab-content">
                                    ${tabs.map((key, i) => {
                                        const iframeHtml = addAltiumViewer(addresses[key]);
                                        return `<div class="altium-tab-pane ${i === 0 ? 'active' : ''}" data-tab="${key}">${iframeHtml}</div>`;
                                    }).join('')}
                                </div>
                            </div>
                        </div>
                    `;
                }
            }
        }
    } catch (e) {
        console.log(`No altium-viewer.json in ${name}`);
    }

    /* ---------- 4. Fetch README ---------- */
    let markdown = '';
    try {
        const res = await fetch(`${API_BASE}/repos/${ORG}/${name}/readme`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        const binary = atob(data.content);
        markdown = new TextDecoder('utf-8').decode(Uint8Array.from(binary, c => c.charCodeAt(0)));
    } catch {
        content.innerHTML = '<p class="error">Could not load README.</p>';
        loading.style.display = 'none';
        return;
    }

    /* ---------- 5. Fix relative URLs ---------- */
    const rawBase = `https://raw.githubusercontent.com/${ORG}/${name}/${defaultBranch}`;
    markdown = markdown
        .replace(/\]\((?!https?:\/\/|\/)([^)]+)\)/g, `](${rawBase}/$1)`)
        .replace(/src="(?!https?:\/\/|\/)([^"]+)"/g, `src="${rawBase}/$1"`);

    /* ---------- 6. Render Markdown ---------- */
    content.innerHTML = marked.parse(markdown);

    /* ---------- 7. Render and inject everything ---------- */
    content.innerHTML = marked.parse(markdown);

    // Inject release link at top
    content.insertAdjacentHTML('afterbegin', releaseHtml);

    // === NEW: Inject viewer at BOTTOM ===
    if (viewersHtml) {
        content.insertAdjacentHTML('beforeend', viewersHtml);

        // Tab switching logic
        content.querySelectorAll('.altium-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                content.querySelectorAll('.altium-tab-btn').forEach(b => b.classList.remove('active'));
                content.querySelectorAll('.altium-tab-pane').forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                content.querySelector(`.altium-tab-pane[data-tab="${tab}"]`).classList.add('active');
            });
        });

        // Auto-scroll to #viewer if URL has #viewer
        if (location.hash === '#viewer') {
            setTimeout(() => {
                document.getElementById('viewer')?.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    }

    loading.style.display = 'none';
}

// ——— Navigation ———
document.getElementById('back-btn').addEventListener('click', e => {
    e.preventDefault();
    history.pushState({}, '', window.location.pathname);
    document.getElementById('detail-view').style.display = 'none';
    document.getElementById('list-view').style.display = 'block';
});

window.addEventListener('popstate', () => {
    const hash = location.hash.slice(1);
    if (hash && repos.some(r => r.name === hash)) showRepo(hash);
    else {
        document.getElementById('detail-view').style.display = 'none';
        document.getElementById('list-view').style.display = 'block';
    }
});
function addAltiumViewer(address) {
    return `<body><iframe src="${address}" width="1280" height="720" style="overflow:hidden;border:none;width:100%;height:720px;" scrolling="no" allowfullscreen="true" onload="window.top.scrollTo(0,0);"></iframe></body>`;

}

function checkHash() {
    const hash = location.hash.slice(1);
    if (hash && repos.some(r => r.name === hash)) showRepo(hash);
}

// ——— Start ———
loadCustomContent().then(() => {
    initTheme();
    initSearch();
    fetchRepos();
});