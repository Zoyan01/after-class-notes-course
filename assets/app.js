(() => {
  'use strict';
  const notes = [...globalThis.STUDY_NOTES].sort((a, b) => b.date.localeCompare(a.date));
  const categoryClass = { '提示詞': 'cat-prompt', '觀念整理': 'cat-concept', '動手做': 'cat-build' };
  const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  const noteURL = note => `./note.html?id=${encodeURIComponent(note.id)}`;
  const safeURL = value => { try { const url = new URL(value); return url.protocol === 'https:' ? escapeHTML(url.href) : '#'; } catch { return '#'; } };
  const dateLabel = value => value.replaceAll('-', '.');

  function renderHome() {
    let category = '全部';
    const search = document.querySelector('#search');
    const grid = document.querySelector('#notes-grid');
    const filters = [...document.querySelectorAll('[data-category]')];
    document.querySelector('#total-count').textContent = String(notes.length).padStart(2, '0');
    function render() {
      const query = search.value.trim().toLocaleLowerCase('zh-TW');
      const filtered = notes.filter(note => (category === '全部' || note.category === category) && [note.title, note.summary, note.category, note.takeaway, note.idea, ...note.points, note.example.before, note.example.after, note.example.caption, ...note.pitfalls, note.recap].join(' ').toLocaleLowerCase('zh-TW').includes(query));
      grid.innerHTML = filtered.map(note => `<a class="note-card ${categoryClass[note.category]}" href="${noteURL(note)}"><div class="card-top"><span class="tag">${escapeHTML(note.category)}</span><span class="card-number">${String(notes.indexOf(note) + 1).padStart(2, '0')}</span></div><h3>${escapeHTML(note.title)}</h3><p>${escapeHTML(note.summary)}</p><div class="card-footer"><span>${dateLabel(note.date)} &nbsp; / &nbsp; 約 ${note.minutes} 分鐘</span><span class="card-arrow" aria-hidden="true">↗</span></div></a>`).join('');
      document.querySelector('#empty-state').hidden = filtered.length > 0;
      document.querySelector('#search-status').textContent = query || category !== '全部' ? `找到 ${filtered.length} 篇${category === '全部' ? '' : `「${category}」`}筆記${query ? `，關鍵字：「${search.value.trim()}」` : ''}` : '';
      filters.forEach(button => { const active = button.dataset.category === category; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
    }
    filters.forEach(button => button.addEventListener('click', () => { category = button.dataset.category; render(); }));
    search.addEventListener('input', render);
    document.querySelector('#reset-search').addEventListener('click', () => { search.value = ''; category = '全部'; render(); search.focus(); });
    render();
  }

  function renderNote() {
    const note = notes.find(item => item.id === new URLSearchParams(location.search).get('id'));
    const container = document.querySelector('#article-content');
    if (!note) {
      document.title = '找不到這篇筆記｜課後十分鐘';
      container.innerHTML = '<section class="not-found"><p class="eyebrow">NOTE NOT FOUND</p><h1>這篇筆記，<br>好像還沒寫到。</h1><p>文章連結可能有誤，回首頁找其他筆記吧。</p><a class="button primary" href="./index.html#notes">回到所有筆記 ↗</a></section>';
      return;
    }
    document.title = `${note.title}｜課後十分鐘`;
    document.querySelector('meta[name="description"]').content = note.summary;
    const titles = ['用自己的話講', '先記這三點', '試一個例子', '容易卡住的地方', '下次怎麼用'];
    const heading = index => `<h2><span class="section-num">0${index + 1}</span>${titles[index]}</h2>`;
    const list = values => values.map(value => `<li>${escapeHTML(value)}</li>`).join('');
    const related = notes.filter(item => item.id !== note.id && item.category === note.category).concat(notes.filter(item => item.id !== note.id && item.category !== note.category)).slice(0, 2);
    container.innerHTML = `<article><header class="article-header"><div class="article-meta"><span class="tag ${categoryClass[note.category]}">${escapeHTML(note.category)}</span><time datetime="${escapeHTML(note.date)}">${dateLabel(note.date)}</time><span>約 ${note.minutes} 分鐘</span></div><h1>${escapeHTML(note.title)}</h1><p class="article-summary">${escapeHTML(note.summary)}</p></header><div class="article-layout"><div class="article-main"><div class="takeaway"><span aria-hidden="true">✳</span><p>${escapeHTML(note.takeaway)}</p></div><section class="article-section" id="section-1">${heading(0)}<p>${escapeHTML(note.idea)}</p></section><section class="article-section" id="section-2">${heading(1)}<ol>${list(note.points)}</ol></section><section class="article-section" id="section-3">${heading(2)}<p class="example-label">原本的寫法</p><pre class="example-before">${escapeHTML(note.example.before)}</pre><div class="example-after"><div class="example-bar"><span>換個方式試試</span><button type="button" class="copy-button" id="copy-example">複製範例 ↗</button></div><pre id="example-text">${escapeHTML(note.example.after)}</pre></div><p class="example-caption">${escapeHTML(note.example.caption)}</p></section><section class="article-section" id="section-4">${heading(3)}<ul>${list(note.pitfalls)}</ul></section><section class="article-section" id="section-5">${heading(4)}<div class="next-step"><p>${escapeHTML(note.recap)}</p></div></section>${note.sources.length ? `<section class="sources"><h2>這篇參考的資料</h2><ul>${note.sources.map(source => `<li><a href="${safeURL(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(source.label)} ↗</a></li>`).join('')}</ul></section>` : '<div class="sources"><p>這篇是學習方法與專案做法的整理，可依自己的使用情境調整。</p></div>'}</div><aside class="article-aside"><p class="eyebrow">IN THIS NOTE</p><nav aria-label="這篇筆記的目錄">${titles.map((title, index) => `<a href="#section-${index + 1}">0${index + 1} &nbsp; ${title}</a>`).join('')}</nav><p class="aside-caption">A small idea,<br>worth keeping.</p><a class="text-link" href="./rules.html">下一篇怎麼寫？ ↗</a></aside></div></article><section class="related"><h2>再翻一篇</h2><div class="related-links">${related.map(item => `<a href="${noteURL(item)}"><span>${escapeHTML(item.title)}</span><span aria-hidden="true">↗</span></a>`).join('')}</div></section>`;
    document.querySelector('#copy-example').addEventListener('click', async () => {
      const button = document.querySelector('#copy-example');
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(note.example.after);
        button.textContent = '已複製 ✓';
        showToast('範例複製好了，記得改成自己的情境。');
        setTimeout(() => { button.textContent = '複製範例 ↗'; }, 2500);
      } catch {
        const range = document.createRange();
        range.selectNodeContents(document.querySelector('#example-text'));
        const selection = window.getSelection();
        selection.removeAllRanges(); selection.addRange(range);
        showToast('已選取範例，請長按複製或按 Ctrl / ⌘ + C。');
      }
    });
  }
  let toastTimeout;
  function showToast(message) {
    const toast = document.querySelector('#toast');
    toast.textContent = message; toast.classList.add('visible');
    clearTimeout(toastTimeout); toastTimeout = setTimeout(() => toast.classList.remove('visible'), 4000);
  }
  if (document.body.dataset.page === 'home') renderHome();
  if (document.body.dataset.page === 'note') renderNote();
})();
