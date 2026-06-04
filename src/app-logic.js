import { supabase as _supabase } from './supabaseClient';

// ═══ STATE ═══════════════════════════════════════════════════
let currentUser = null,
    currentAuthMode = 'signin',
    currentView = 'feed',
    prevView = 'feed',
    guestMode = false;

let uploadedImageData = null,
    aiImageUrl = null,
    useAIImage = false,
    lastKeywords = '';

let allFeedPosts = [],
    activeFilter = 'All',
    autoSaveTimer = null,
    currentReadPost = null;

let followingSet = new Set(),
    likedPosts = new Set(),
    bookmarkedPosts = new Set(),
    showAnalyticsActive = false;

let userAvatarUrl = null; // base64 avatar stored in localStorage
let regenCounter = 0;     // increments on "New Image" click for different results
let usernameCache = {};   // userId → custom username mapping

const PEXELS_API_KEY = 'XrMHBVNp8PKxNVaUJUzWusdj73xlbsQj56aYFkRCXInnTWdF2bqJ5H3j';


// ═══ THEME ═══════════════════════════════════════════════════
function toggleTheme() {
  const h = document.documentElement,
        isDark = h.getAttribute('data-theme') === 'dark';
  h.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.getElementById('themeBtn').textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('tb_theme', isDark ? 'light' : 'dark');
}


// ═══ UTILS ═══════════════════════════════════════════════════
function generateSlug(t) {
  return (t || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60) || 'untitled';
}

function onTitleChange() {
  document.getElementById('slugDisplay').textContent =
    generateSlug(document.getElementById('titleInput').value) || 'your-blog-title';
  scheduleAutoSave();
}

function calcReadTime(text) {
  // Strip HTML tags for accurate word count
  const stripped = (text || '').replace(/<[^>]*>/g, ' ');
  const w = stripped ? stripped.trim().split(/\s+/).filter(Boolean).length : 0;
  return Math.max(1, Math.round(w / 200)) + ' min read';
}

function getInitial(email) {
  return (email || '?')[0].toUpperCase();
}

function avatarColor(str) {
  const c = ['#7c5cfc', '#e05cfc', '#f0b429', '#4ade80', '#fc5c7d', '#38bdf8'];
  let h = 0;
  for (let i = 0; i < (str || '').length; i++) {
    h = (h * 31 + str.charCodeAt(i)) & 0xfffffff;
  }
  return c[h % c.length];
}

// Clean display name — strip numbers and show only letters
function displayName(email) {
  return (email || '')
    .split('@')[0]
    .replace(/\d+/g, '')
    .replace(/[^a-zA-Z\s]/g, ' ')
    .trim() || 'Writer';
}


// ═══ AVATAR UPLOAD ════════════════════════════════════════════
function handleAvatarUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    userAvatarUrl = e.target.result;
    localStorage.setItem('tb_avatar_' + currentUser?.id, userAvatarUrl);
    updateAllAvatarDisplays();
    showToast('', 'Profile picture updated!');
  };
  reader.readAsDataURL(file);
  event.target.value = '';
}

function updateAllAvatarDisplays() {
  const el = document.getElementById('profileAvatarEl');
  if (el) {
    if (userAvatarUrl) {
      el.innerHTML = `<img src="${userAvatarUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
    } else {
      el.textContent = getInitial(currentUser?.email || '?');
    }
  }
}

function loadUserAvatar() {
  if (!currentUser) return;
  userAvatarUrl = localStorage.getItem('tb_avatar_' + currentUser.id) || null;
  updateAllAvatarDisplays();
}


// ═══ USERNAME (profiles table) ════════════════════════════════
async function loadUsername() {
  if (!currentUser) return;
  try {
    const { data } = await _supabase
      .from('profiles')
      .select('username')
      .eq('id', currentUser.id)
      .maybeSingle();
    if (data?.username) usernameCache[currentUser.id] = data.username;
  } catch (e) { console.warn('Could not load username:', e); }
}

async function loadUsernames(userIds) {
  const ids = (userIds || []).filter(id => id && !usernameCache[id]);
  if (!ids.length) return;
  try {
    const { data } = await _supabase.from('profiles').select('id, username').in('id', ids);
    (data || []).forEach(p => { if (p.username) usernameCache[p.id] = p.username; });
  } catch (e) {}
}

function getDisplayName(userId, email) {
  if (userId && usernameCache[userId]) return usernameCache[userId];
  return displayName(email);
}

function startEditUsername() {
  if (!currentUser) return;
  const input = document.getElementById('usernameInput');
  input.value = usernameCache[currentUser.id] || '';
  document.getElementById('profileName').style.display = 'none';
  document.getElementById('editUsernameBtn').style.display = 'none';
  document.getElementById('editUsernameInline').style.display = 'block';
  input.focus();
}

async function saveUsername() {
  const username = document.getElementById('usernameInput').value.trim();
  if (!username || username.length < 2) {
    showToast('⚠️', 'Username must be at least 2 characters.');
    return;
  }
  try {
    const { error } = await _supabase
      .from('profiles')
      .upsert({ id: currentUser.id, username }, { onConflict: 'id' });
    if (error) throw error;
    usernameCache[currentUser.id] = username;
    document.getElementById('profileName').textContent = username;
    document.getElementById('userEmailLabel').textContent = username;
    cancelEditUsername();
    showToast('✓', 'Username saved — visible to everyone!');
  } catch (e) {
    showToast('⚠️', 'Could not save: ' + e.message);
  }
}

function cancelEditUsername() {
  document.getElementById('profileName').style.display = '';
  document.getElementById('editUsernameBtn').style.display = '';
  document.getElementById('editUsernameInline').style.display = 'none';
}


function getAvatarImgTag(userId, email, size) {
  const savedAvatar = localStorage.getItem('tb_avatar_' + userId);
  const color = avatarColor(userId || '');
  const initial = getInitial(email || '?');
  if (savedAvatar) {
    return `<img src="${savedAvatar}" style="width:${size}px;height:${size}px;object-fit:cover;border-radius:50%;">`;
  }
  return `<span style="font-size:${Math.round(size * 0.4)}px;">${initial}</span>`;
}


// ═══ VIEW SWITCHING ═══════════════════════════════════════════
function switchView(view) {
  // Hide all views
  ['feedView', 'editorView', 'myblogsView', 'bookmarksView', 'readView', 'profileView'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  // Remove active class from all nav tabs
  ['navFeed', 'navWrite', 'navMyBlogs', 'navBookmarks'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });

  document.getElementById('headerPublishBtn').classList.remove('show');

  // Handle reading progress bar
  const bar = document.getElementById('readProgressBar');
  if (bar) {
    if (view === 'read') {
      bar.style.display = 'block';
      bar.style.width = '0%';
    } else {
      bar.style.display = 'none';
      bar.style.width = '0%';
    }
  }

  // Show the requested view
  if (view === 'feed') {
    document.getElementById('feedView').style.display = 'block';
    document.getElementById('navFeed').classList.add('active');
    loadFeed();
    loadSidebar();
  } else if (view === 'editor') {
    document.getElementById('editorView').style.display = 'block';
    document.getElementById('navWrite').classList.add('active');
    document.getElementById('headerPublishBtn').classList.add('show');
  } else if (view === 'myblogs') {
    document.getElementById('myblogsView').style.display = 'block';
    document.getElementById('navMyBlogs').classList.add('active');
    loadMyBlogs();
  } else if (view === 'bookmarks') {
    document.getElementById('bookmarksView').style.display = 'block';
    document.getElementById('navBookmarks').classList.add('active');
    loadBookmarksView();
  } else if (view === 'read') {
    document.getElementById('readView').style.display = 'block';
  } else if (view === 'profile') {
    document.getElementById('profileView').style.display = 'block';
  }

  prevView = currentView;
  currentView = view;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Sync mobile nav active states
  ['mNavFeed', 'mNavWrite', 'mNavMyBlogs', 'mNavBookmarks'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });
  const mNavMap = { feed: 'mNavFeed', editor: 'mNavWrite', myblogs: 'mNavMyBlogs', bookmarks: 'mNavBookmarks' };
  if (mNavMap[view]) {
    const el = document.getElementById(mNavMap[view]);
    if (el) el.classList.add('active');
  }
}

function readGoBack() {
  switchView(prevView === 'read' ? 'feed' : prevView);
}


// ═══ MOBILE NAV ═══════════════════════════════════════════════
function toggleMobileNav() {
  const nav = document.getElementById('mobileNav');
  const btn = document.getElementById('hamburgerBtn');
  if (!nav) return;
  const isOpen = nav.classList.toggle('open');
  // Animate hamburger → X
  const spans = btn?.querySelectorAll('span');
  if (spans) {
    if (isOpen) {
      spans[0].style.cssText = 'transform:rotate(45deg) translate(4px,4px)';
      spans[1].style.cssText = 'opacity:0;transform:scaleX(0)';
      spans[2].style.cssText = 'transform:rotate(-45deg) translate(4px,-4px)';
    } else {
      spans.forEach(s => s.style.cssText = '');
    }
  }
  // Prevent body scroll when open
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMobileNav() {
  const nav = document.getElementById('mobileNav');
  if (!nav) return;
  nav.classList.remove('open');
  const btn = document.getElementById('hamburgerBtn');
  btn?.querySelectorAll('span').forEach(s => s.style.cssText = '');
  document.body.style.overflow = '';
}


// ═══ WORD COUNT + GOAL ════════════════════════════════════════
function countWords() {
  // Get text from Quill if available, otherwise fallback to textarea
  let text = '';
  if (window._quill) {
    text = window._quill.getText().trim();
  } else {
    text = document.getElementById('blogBody').value.trim();
  }
  const count = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const el = document.getElementById('charCount');
  el.textContent = count + ' word' + (count !== 1 ? 's' : '');
  el.className = 'char-count';
  updateWordGoal(count);
  scheduleAutoSave();
}

function updateWordGoal(count) {
  if (count === undefined) {
    const t = document.getElementById('blogBody').value.trim();
    count = t ? t.split(/\s+/).length : 0;
  }
  const goal = parseInt(document.getElementById('wordGoalSelect').value);
  const bar = document.getElementById('wgBar'),
        status = document.getElementById('wgStatus');

  if (!goal) {
    bar.style.width = '0%';
    status.textContent = '';
    return;
  }

  const pct = Math.min(100, Math.round((count / goal) * 100));
  bar.style.width = pct + '%';
  bar.className = pct >= 100 ? 'wg-bar done' : 'wg-bar';

  if (pct >= 100) {
    status.textContent = 'Goal!';
  } else if (pct >= 80) {
    status.textContent = (goal - count) + ' to go';
    document.getElementById('charCount').className = 'char-count warn';
  } else {
    status.textContent = (goal - count) + ' to go';
  }
}


// ═══ AUTO-SAVE ════════════════════════════════════════════════
function scheduleAutoSave() {
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(triggerAutoSave, 30000);
}

async function triggerAutoSave() {
  if (!currentUser) return;

  const title = document.getElementById('titleInput').value.trim();
  const body = document.getElementById('blogBody').value.trim();
  if (!title && !body) return;

  try {
    const draft = {
      user_id: currentUser.id,
      title,
      body,
      caption: document.getElementById('captionInput').value.trim(),
      category: document.querySelector('.cat-chip.active')?.textContent || null,
      slug: generateSlug(title),
      image_url: (useAIImage && aiImageUrl) ? aiImageUrl : (uploadedImageData || null),
      is_draft: true,
      claps: 0,
      author_email: currentUser.email
    };

    const { data: ex } = await _supabase
      .from('posts')
      .select('id')
      .eq('user_id', currentUser.id)
      .eq('is_draft', true)
      .maybeSingle();

    if (ex) {
      await _supabase.from('posts').update(draft).eq('id', ex.id);
    } else {
      await _supabase.from('posts').insert([draft]);
    }

    const ind = document.getElementById('autosaveTag');
    ind.classList.add('show');
    setTimeout(() => ind.classList.remove('show'), 3000);
  } catch (e) {}
}


// ═══ FEED ═════════════════════════════════════════════════════
async function loadFeed() {
  const grid = document.getElementById('feedGrid');
  grid.innerHTML = '';

  // Show skeleton loading cards
  for (let i = 0; i < 6; i++) {
    grid.innerHTML += `
      <div class="card-skeleton">
        <div class="card-skel-img"></div>
        <div class="card-skel-body">
          <div class="card-skel-line" style="width:40%"></div>
          <div class="card-skel-line" style="width:80%"></div>
          <div class="card-skel-line" style="width:55%"></div>
        </div>
      </div>`;
  }

  try {
    const { data, error } = await _supabase
      .from('posts')
      .select('*')
      .eq('is_draft', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    allFeedPosts = data || [];
    renderFeedGrid();
  } catch (e) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <div class="empty-state-title">Could not load posts</div>
        <div class="empty-state-sub">${e.message}</div>
      </div>`;
  }
}

function renderFeedGrid() {
  const grid = document.getElementById('feedGrid');
  grid.innerHTML = '';

  const q = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
  let posts = allFeedPosts;

  if (activeFilter !== 'All') {
    posts = posts.filter(p => p.category === activeFilter);
  }
  if (q) {
    posts = posts.filter(p =>
      (p.title || '').toLowerCase().includes(q) ||
      (p.body || '').toLowerCase().includes(q)
    );
  }

  if (!posts.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📭</div>
        <div class="empty-state-title">No posts found</div>
        <div class="empty-state-sub">Be the first to write something!</div>
        <button class="btn btn-primary" onclick="switchView('editor')">✏️ Write a Blog</button>
      </div>`;
    return;
  }

  // Sort: followed users first, then by likes (most → least) within each group
  const followedPosts = posts.filter(p => followingSet.has(p.user_id));
  const otherPosts = posts.filter(p => !followingSet.has(p.user_id));
  followedPosts.sort((a, b) => (b.claps || 0) - (a.claps || 0));
  otherPosts.sort((a, b) => (b.claps || 0) - (a.claps || 0));
  const sorted = [...followedPosts, ...otherPosts];

  sorted.forEach(post => grid.appendChild(buildCard(post, 'feed')));
}

function setFilter(cat, el) {
  activeFilter = cat;
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  renderFeedGrid();
}

function filterPosts() {
  renderFeedGrid();
}


// ═══ MY BLOGS ════════════════════════════════════════════════
async function loadMyBlogs() {
  if (!currentUser) return;

  if (showAnalyticsActive) {
    loadAnalytics();
    return;
  }

  const grid = document.getElementById('myBlogsGrid');
  grid.innerHTML = '';

  // Show skeleton loading cards
  for (let i = 0; i < 3; i++) {
    grid.innerHTML += `
      <div class="card-skeleton">
        <div class="card-skel-img"></div>
        <div class="card-skel-body">
          <div class="card-skel-line" style="width:40%"></div>
          <div class="card-skel-line" style="width:80%"></div>
          <div class="card-skel-line" style="width:55%"></div>
        </div>
      </div>`;
  }

  try {
    const { data, error } = await _supabase
      .from('posts')
      .select('*')
      .eq('user_id', currentUser.id)
      .eq('is_draft', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    grid.innerHTML = '';

    if (!data || !data.length) {
      document.getElementById('myBlogsMeta').textContent = '0 posts published';
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📝</div>
          <div class="empty-state-title">No blogs yet</div>
          <div class="empty-state-sub">Start writing your first blog!</div>
          <button class="btn btn-primary" onclick="switchView('editor')">✏️ Write Your First Blog</button>
        </div>`;
      return;
    }

    document.getElementById('myBlogsMeta').textContent =
      `${data.length} blog${data.length !== 1 ? 's' : ''} published`;
    data.forEach(post => grid.appendChild(buildCard(post, 'mine')));
  } catch (e) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <div class="empty-state-title">Error loading blogs</div>
        <div class="empty-state-sub">${e.message}</div>
      </div>`;
  }
}


// ═══ BUILD CARD ════════════════════════════════════════════════
function buildCard(post, mode) {
  const card = document.createElement('div');
  card.className = 'blog-card';

  const date = new Date(post.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
  const rt = calcReadTime(post.body);
  const authorName = getDisplayName(post.user_id, post.author_email || currentUser?.email || '');
  const color = avatarColor(post.user_id || '');
  const avatarHtml = getAvatarImgTag(post.user_id, post.author_email, 22);
  const isLiked = likedPosts.has(post.id);

  const isBookmarked = bookmarkedPosts.has(post.id);

  card.innerHTML = `
    ${post.image_url
      ? `<img class="blog-card-img" src="${post.image_url}" alt="${post.title || ''}" onerror="this.style.display='none'">`
      : `<div class="blog-card-img-placeholder">📝</div>`
    }
    <div class="blog-card-body">
      ${post.category ? `<div class="blog-card-category">${post.category}</div>` : ''}
      <div class="blog-card-title">${post.title || 'Untitled'}</div>
      <div class="blog-card-excerpt">${(post.body || '').replace(/<[^>]*>/g, ' ').trim()}</div>
      <div class="blog-card-footer">
        <div class="blog-card-author">
          <div class="author-avatar-sm" style="background:${color}">${avatarHtml}</div>
          <div>
            <button class="author-name-link" onclick="openAuthorProfile('${post.user_id}')" title="View ${authorName}'s profile">${authorName}</button>
            <div class="blog-card-meta">⏱ ${rt}</div>
          </div>
        </div>
        <div class="blog-card-actions">
          <button class="btn-read" onclick='openRead(${JSON.stringify(post).replace(/'/g, "&#39;")})'>Read →</button>
          ${mode === 'mine'
            ? `<button class="btn-del" data-id="${post.id}" onclick="deletePost('${post.id}',this)">delete</button>`
            : ''
          }
        </div>
      </div>
    </div>
    <div class="like-row" style="display:flex;align-items:center;gap:.6rem;flex-wrap:wrap;">
      <button class="like-btn ${isLiked ? 'liked' : ''}" onclick="quickLike('${post.id}',this)">
        ❤️ <span class="like-num">${post.claps || 0}</span>
      </button>
      <button class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" data-id="${post.id}" onclick="toggleBookmark('${post.id}',this)" title="Bookmark post">
        🔖
      </button>
      <span class="view-badge">👁️ <span class="view-num">${post.views || 0}</span></span>
      <span style="font-size:.72rem;color:var(--muted);margin-left:auto;">${date}</span>
    </div>`;

  return card;
}


// ═══ QUICK LIKE (on card) ═════════════════════════════════════
async function quickLike(postId, btn) {
  if (guestMode || !currentUser) {
    showGuestToast();
    return;
  }
  burstEffect(btn, '❤️');
  const wasLiked = likedPosts.has(postId);

  if (wasLiked) {
    likedPosts.delete(postId);
    btn.classList.remove('liked');
  } else {
    likedPosts.add(postId);
    btn.classList.add('liked');
  }

  try {
    const { data } = await _supabase
      .from('posts')
      .select('claps, user_id, title')
      .eq('id', postId)
      .single();

    const cur = data?.claps || 0;
    const newVal = wasLiked ? Math.max(0, cur - 1) : cur + 1;

    await _supabase.from('posts').update({ claps: newVal }).eq('id', postId);

    const numEl = btn.querySelector('.like-num');
    if (numEl) numEl.textContent = newVal;

    const idx = allFeedPosts.findIndex(p => p.id === postId);
    if (idx > -1) allFeedPosts[idx].claps = newVal;

    // Trigger Notification
    if (!wasLiked && data && data.user_id !== currentUser.id) {
      await createNotification(data.user_id, 'like', postId, data.title);
    }
  } catch (e) {}
}

function burstEffect(el, emoji) {
  const rect = el.getBoundingClientRect();
  const burst = document.createElement('div');
  burst.className = 'like-burst';
  burst.textContent = emoji;
  burst.style.left = (rect.left + rect.width / 2 - 12) + 'px';
  burst.style.top = (rect.top - 10) + 'px';
  document.body.appendChild(burst);
  setTimeout(() => burst.remove(), 650);
}


// ═══ DELETE POST ══════════════════════════════════════════════
async function deletePost(postId, btn) {
  if (!confirm('Delete this blog post? This cannot be undone.')) return;
  btn.disabled = true;
  btn.textContent = '…';

  try {
    const { error } = await _supabase
      .from('posts')
      .delete()
      .eq('id', postId)
      .eq('user_id', currentUser.id);

    if (error) throw error;

    const card = btn.closest('.blog-card');
    card.style.opacity = '0';
    card.style.transform = 'scale(.95)';
    card.style.transition = 'all .3s ease';
    setTimeout(() => { card.remove(); loadMyBlogs(); }, 300);

    showToast('delete', 'Blog deleted.');
    loadPostsCount();
  } catch (e) {
    btn.disabled = false;
    btn.textContent = 'delete';
    showToast('⚠️', 'Could not delete: ' + e.message);
    console.error('Delete error:', e);
  }
}


// ═══ READ VIEW ════════════════════════════════════════════════
function openRead(post) {
  currentReadPost = post;
  prevView = currentView;
  switchView('read');

  const cover = document.getElementById('readCover');
  if (post.image_url) {
    cover.src = post.image_url;
    cover.style.display = 'block';
  } else {
    cover.style.display = 'none';
  }

  document.getElementById('readCategory').textContent = post.category || '';
  document.getElementById('readTitle').textContent = post.title || 'Untitled';

  const color = avatarColor(post.user_id || '');
  const avatarEl = document.getElementById('readAuthorAvatar');
  avatarEl.style.background = color;

  const savedAv = localStorage.getItem('tb_avatar_' + post.user_id);
  if (savedAv) {
    avatarEl.innerHTML = `<img src="${savedAv}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
  } else {
    avatarEl.textContent = getInitial(post.author_email || '?');
  }

  document.getElementById('readAuthorName').textContent = getDisplayName(post.user_id, post.author_email || '');
  
  // Set Views + Time Meta
  const viewsCount = post.views || 0;
  document.getElementById('readAuthorMeta').textContent =
    new Date(post.created_at).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    }) + ' · ' + calcReadTime(post.body) + ' · 👁️ ' + viewsCount + ' views';

  document.getElementById('readSlug').textContent =
    '🔗 techbytes.com/blog/' + (post.slug || generateSlug(post.title || ''));

  const cap = document.getElementById('readCaption');
  if (post.caption) {
    cap.textContent = '"' + post.caption + '"';
    cap.style.display = 'block';
  } else {
    cap.style.display = 'none';
  }

  document.getElementById('readContent').innerHTML = post.body || '';

  // Likes
  const liked = likedPosts.has(post.id);
  const bigBtn = document.getElementById('bigLikeBtn');
  bigBtn.className = 'big-like-btn' + (liked ? ' liked' : '');
  document.getElementById('bigLikeCount').textContent = post.claps || 0;
  document.getElementById('likeMsg').textContent = liked ? 'You liked this!' : 'Like this post!';

  // Bookmarks status in Read View
  const bookmarkBtn = document.getElementById('readBookmarkBtn');
  if (bookmarkBtn) {
    bookmarkBtn.setAttribute('data-id', post.id);
    const hasBookmarked = bookmarkedPosts.has(post.id);
    bookmarkBtn.classList.toggle('bookmarked', hasBookmarked);
    bookmarkBtn.innerHTML = hasBookmarked ? '🔖 Bookmarked' : '🔖 Bookmark';
  }

  // Comments Visibility & loading
  const isLoggedIn = currentUser && !guestMode;
  document.getElementById('commentInputArea').style.display = isLoggedIn ? 'block' : 'none';
  document.getElementById('guestCommentPrompt').style.display = isLoggedIn ? 'none' : 'block';
  loadComments(post.id);

  // Increment views
  incrementView(post.id);
}

async function handleReadLike() {
  if (guestMode || !currentUser) {
    showGuestToast();
    return;
  }
  if (!currentReadPost) return;
  const btn = document.getElementById('bigLikeBtn');
  burstEffect(btn, '❤️');

  const wasLiked = likedPosts.has(currentReadPost.id);
  if (wasLiked) {
    likedPosts.delete(currentReadPost.id);
    btn.classList.remove('liked');
    document.getElementById('likeMsg').textContent = 'Like this post!';
  } else {
    likedPosts.add(currentReadPost.id);
    btn.classList.add('liked');
    document.getElementById('likeMsg').textContent = '❤️ Thanks for the like!';
  }

  try {
    const { data } = await _supabase
      .from('posts')
      .select('claps, user_id, title')
      .eq('id', currentReadPost.id)
      .single();

    const cur = data?.claps || 0;
    const newVal = wasLiked ? Math.max(0, cur - 1) : cur + 1;

    await _supabase.from('posts').update({ claps: newVal }).eq('id', currentReadPost.id);
    document.getElementById('bigLikeCount').textContent = newVal;
    currentReadPost.claps = newVal;

    // Trigger Notification
    if (!wasLiked && data && data.user_id !== currentUser.id) {
      await createNotification(data.user_id, 'like', currentReadPost.id, data.title);
    }
  } catch (e) {}
}


// ═══ SIDEBAR ══════════════════════════════════════════════════
async function loadSidebar() {
  if (!currentUser) return;

  // Profile card
  document.getElementById('profileCard').style.display = 'block';
  await loadUsername();
  const name = getDisplayName(currentUser.id, currentUser.email);
  document.getElementById('profileName').textContent = name;
  document.getElementById('userEmailLabel').textContent = name;
  document.getElementById('profileEmailSidebar').textContent = currentUser.email || '';
  loadUserAvatar();
  await loadFollows();

  // Followers count (people who follow ME)
  let followersCount = 0;
  try {
    const { count } = await _supabase
      .from('follows')
      .select('id', { count: 'exact', head: true })
      .eq('following_id', currentUser.id);
    followersCount = count || 0;
  } catch (e) {}
  document.getElementById('statFollowersCount').textContent = followersCount;
  document.getElementById('statFollowingCount').textContent = followingSet.size;

  try {
    const { count: pc } = await _supabase
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', currentUser.id)
      .eq('is_draft', false);
    document.getElementById('statPosts').textContent = pc || 0;

    const { data: cd } = await _supabase
      .from('posts')
      .select('claps')
      .eq('user_id', currentUser.id)
      .eq('is_draft', false);
    document.getElementById('statLikes').textContent =
      (cd || []).reduce((s, p) => s + (p.claps || 0), 0);
  } catch (e) {}

  // Who to follow — no longer preloaded, handled by search
  const fl = document.getElementById('followList');
  fl.innerHTML = `<div style="font-size:.82rem;color:var(--muted);">Use the search icon to find writers.</div>`;


  // Preload usernames for feed posts
  const feedUserIds = allFeedPosts.map(p => p.user_id).filter(Boolean);
  await loadUsernames([...new Set(feedUserIds)]);

  // Render achievement badges
  renderBadges();

  // Trending tags
  try {
    const { data: catPosts } = await _supabase
      .from('posts')
      .select('category')
      .eq('is_draft', false)
      .limit(100);
    const catCount = {};
    (catPosts || []).forEach(p => {
      if (p.category) catCount[p.category] = (catCount[p.category] || 0) + 1;
    });
    const sorted = Object.entries(catCount).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const tl = document.getElementById('trendingList');
    tl.innerHTML = '';
    if (!sorted.length) {
      tl.innerHTML = `<div style="font-size:.82rem;color:var(--muted);">No categories yet.</div>`;
      return;
    }
    sorted.forEach(([cat, count]) => {
      tl.innerHTML += `<div class="trending-item"><span class="trending-tag">#${cat}</span><span class="trending-count">${count} post${count !== 1 ? 's' : ''}</span></div>`;
    });
  } catch (e) {}
}

async function loadFollows() {
  if (!currentUser) return;
  try {
    const { data, error } = await _supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', currentUser.id);

    if (error) throw error;
    followingSet.clear();
    (data || []).forEach(r => followingSet.add(r.following_id));
  } catch (e) {
    console.warn('Could not load follows:', e);
  }
}

async function toggleFollow(userId, btn) {
  if (!currentUser) {
    showToast('⚠️', 'Please sign in first.');
    return;
  }

  const wasFollowing = followingSet.has(userId);

  // Optimistic UI update — update instantly before DB call
  if (wasFollowing) {
    followingSet.delete(userId);
    btn.textContent = 'Follow';
    btn.classList.remove('following');
  } else {
    followingSet.add(userId);
    btn.textContent = 'Following';
    btn.classList.add('following');
  }

  const statEl = document.getElementById('statFollowers');
  if (statEl) statEl.textContent = followingSet.size;

  try {
    if (wasFollowing) {
      const { error } = await _supabase
        .from('follows')
        .delete()
        .eq('follower_id', currentUser.id)
        .eq('following_id', userId);
      if (error) throw error;
      showToast('', 'Unfollowed.');
    } else {
      const { error } = await _supabase
        .from('follows')
        .insert([{ follower_id: currentUser.id, following_id: userId }]);
      if (error) throw error;
      showToast('', 'Following!');
    }
  } catch (e) {
    // Revert on failure
    if (wasFollowing) {
      followingSet.add(userId);
      btn.textContent = 'Following';
      btn.classList.add('following');
    } else {
      followingSet.delete(userId);
      btn.textContent = 'Follow';
      btn.classList.remove('following');
    }
    if (statEl) statEl.textContent = followingSet.size;
    showToast('⚠️', 'Could not update follow: ' + e.message);
  }
}


// ═══ AUTH ═════════════════════════════════════════════════════
function switchTab(mode) {
  currentAuthMode = mode;
  const isSignUp = mode === 'signup';

  document.getElementById('tabSignIn').classList.toggle('active', !isSignUp);
  document.getElementById('tabSignUp').classList.toggle('active', isSignUp);
  document.getElementById('confirmField').style.display = isSignUp ? 'block' : 'none';
  document.getElementById('authBtnText').textContent = isSignUp ? 'Create Account' : 'Sign In';
  document.getElementById('authTagline').textContent = isSignUp
    ? 'Create your account to start writing.'
    : 'Sign in to continue writing your story.';
  document.getElementById('authFooter').textContent = isSignUp
    ? 'Your account is saved to Supabase Auth'
    : 'Credentials verified against Supabase Auth';

  hideAuthMessages();
  document.getElementById('loginConfirm').value = '';
}

function handleAuth() {
  currentAuthMode === 'signup' ? handleSignUp() : handleLogin();
}

function showAuthError(msg) {
  const el = document.getElementById('loginError');
  el.textContent = msg;
  el.classList.add('show');
  document.getElementById('loginSuccess').classList.remove('show');
}

function showAuthSuccess(msg) {
  const el = document.getElementById('loginSuccess');
  el.textContent = msg;
  el.classList.add('show');
  document.getElementById('loginError').classList.remove('show');
}

function hideAuthMessages() {
  document.getElementById('loginError').classList.remove('show');
  document.getElementById('loginSuccess').classList.remove('show');
}

function setAuthLoading(l) {
  document.getElementById('authBtn').disabled = l;
  document.getElementById('loginSpinner').style.display = l ? 'inline-block' : 'none';
  document.getElementById('authBtnText').textContent = l
    ? (currentAuthMode === 'signup' ? 'Creating…' : 'Signing in…')
    : (currentAuthMode === 'signup' ? 'Create Account' : 'Sign In');
}

async function handleLogin() {
  hideAuthMessages();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    showAuthError('Please enter your email and password.');
    return;
  }

  setAuthLoading(true);
  try {
    const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
    if (error) {
      showAuthError(error.message || 'Invalid email or password.');
      setAuthLoading(false);
      return;
    }
    setAuthLoading(false);
    showApp(data.user);
  } catch (e) {
    setAuthLoading(false);
    showAuthError('Something went wrong.');
  }
}

async function handleSignUp() {
  hideAuthMessages();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const confirm = document.getElementById('loginConfirm').value;

  if (!email || !password) {
    showAuthError('Please enter your email and password.');
    return;
  }
  if (password.length < 6) {
    showAuthError('Password must be at least 6 characters.');
    return;
  }
  if (password !== confirm) {
    showAuthError('Passwords do not match.');
    return;
  }

  setAuthLoading(true);
  try {
    const { data, error } = await _supabase.auth.signUp({ email, password });
    if (error) {
      showAuthError(error.message || 'Could not create account.');
      setAuthLoading(false);
      return;
    }
    setAuthLoading(false);
    if (data.session) {
      showApp(data.user);
      showToast('🎉', 'Account created! Welcome to TechBytes.');
    } else {
      showAuthSuccess('Account created! Sign in now.');
      switchTab('signin');
    }
  } catch (e) {
    setAuthLoading(false);
    showAuthError('Something went wrong.');
  }
}

async function handleSignOut() {
  await _supabase.auth.signOut();
  currentUser = null;
  showLogin();
  showToast('👋', 'Signed out.');
}

function continueWithoutAccount() {
  guestMode = true;
  currentUser = null;
  document.getElementById('loginOverlay').classList.add('hidden');
  document.getElementById('userPill').style.display = 'none';
  document.getElementById('signoutBtn').style.display = 'none';
  document.getElementById('navTabs').classList.add('show');
  document.getElementById('headerPublishBtn').classList.remove('show');
  
  // Hide notifications wrap for guest mode
  const nw = document.getElementById('notifWrap');
  if (nw) nw.style.display = 'none';
  if (window._notifInterval) {
    clearInterval(window._notifInterval);
    window._notifInterval = null;
  }

  switchView('feed');
}

function showGuestToast() {
  const toast = document.getElementById('toast');
  document.getElementById('toastIcon').textContent = '🔒';
  document.getElementById('toastMsg').textContent = 'Sign in to do this!';
  const signinBtn = document.getElementById('toastSignInBtn');
  signinBtn.style.display = 'inline-flex';
  toast.classList.add('show');
  clearTimeout(toast._guestTimer);
  toast._guestTimer = setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => { signinBtn.style.display = 'none'; }, 400);
  }, 4000);
}

function showLoginFromToast() {
  const toast = document.getElementById('toast');
  toast.classList.remove('show');
  document.getElementById('toastSignInBtn').style.display = 'none';
  guestMode = false;
  showLogin();
}

function showApp(user) {
  guestMode = false;
  currentUser = user;
  document.getElementById('loginOverlay').classList.add('hidden');
  document.getElementById('userEmailLabel').textContent = displayName(user?.email || '');
  document.getElementById('userPill').style.display = 'flex';
  document.getElementById('signoutBtn').style.display = 'inline-block';
  document.getElementById('navTabs').classList.add('show');
  const mso = document.getElementById('mNavSignOut');
  if (mso) mso.style.display = 'block';

  // Load Bookmarks and Notifications
  loadBookmarks();
  const nw = document.getElementById('notifWrap');
  if (nw) {
    nw.style.display = 'block';
    loadNotifications();
    if (!window._notifInterval) {
      window._notifInterval = setInterval(loadNotifications, 30000);
    }
  }

  switchView('feed');
}

function showLogin() {
  document.getElementById('loginOverlay').classList.remove('hidden');
  document.getElementById('userPill').style.display = 'none';
  document.getElementById('signoutBtn').style.display = 'none';
  document.getElementById('navTabs').classList.remove('show');
  document.getElementById('headerPublishBtn').classList.remove('show');
  const mso = document.getElementById('mNavSignOut');
  if (mso) mso.style.display = 'none';

  // Clean up notifications poller
  const nw = document.getElementById('notifWrap');
  if (nw) nw.style.display = 'none';
  if (window._notifInterval) {
    clearInterval(window._notifInterval);
    window._notifInterval = null;
  }

  closeMobileNav();
}


// ═══ PUBLISH ══════════════════════════════════════════════════
async function publishPost() {
  if (guestMode || !currentUser) {
    showGuestToast();
    return;
  }

  const title = document.getElementById('titleInput').value.trim();
  const body = document.getElementById('blogBody').value.trim();
  const caption = document.getElementById('captionInput').value.trim();
  const category = document.querySelector('.cat-chip.active')?.textContent || null;

  if (!title) {
    showPublishStatus('error', '⚠️ Please add a title before publishing.');
    return;
  }
  if (!body) {
    showPublishStatus('error', '⚠️ Please write some content before publishing.');
    return;
  }

  const imageUrl = (useAIImage && aiImageUrl) ? aiImageUrl : (uploadedImageData || null);
  setPublishLoading(true);

  try {
    const { error } = await _supabase.from('posts').insert([{
      user_id: currentUser.id,
      title,
      body,
      caption: caption || null,
      category,
      image_url: imageUrl,
      slug: generateSlug(title),
      claps: 0,
      is_draft: false,
      author_email: currentUser.email
    }]).select();

    if (error) {
      showPublishStatus('error', '❌ Failed: ' + (error.message || 'Unknown'));
      setPublishLoading(false);
      return;
    }

    setPublishLoading(false);
    showPublishStatus('success', '🎉 Published! Your blog is live.');
    showToast('', 'Blog published!');
    loadPostsCount();
  } catch (e) {
    setPublishLoading(false);
    showPublishStatus('error', '❌ Something went wrong.');
  }
}

function setPublishLoading(l) {
  ['headerPublishBtn', 'bottomPublishBtn'].forEach(id => {
    const b = document.getElementById(id);
    if (b) b.disabled = l;
  });
  ['pubSpinH', 'pubSpinB'].forEach(id => {
    const s = document.getElementById(id);
    if (s) s.style.display = l ? 'inline-block' : 'none';
  });
}

function showPublishStatus(type, msg) {
  const el = document.getElementById('publishStatus');
  el.textContent = msg;
  el.className = 'publish-status ' + type;
  setTimeout(() => { el.className = 'publish-status'; }, 5000);
}

async function loadPostsCount() {
  if (!currentUser) return;
  try {
    const { count } = await _supabase
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', currentUser.id)
      .eq('is_draft', false);

    if (count !== null) {
      const el = document.getElementById('statPosts');
      if (el) el.textContent = count;
    }
  } catch (e) {}
}


// ═══ EDITOR ═══════════════════════════════════════════════════
function toggleCat(el) {
  document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
  uploadedImageData = e.target.result;
  const img = document.getElementById('uploadedImg');
  img.src = uploadedImageData;
  img.style.display = 'block';
  document.getElementById('imagePlaceholder').style.display = 'none';
  document.getElementById('imageZone').classList.add('has-image');
  document.getElementById('imageActions').style.display = 'flex';
  useAIImage = false;
  document.getElementById('aiImgToggle').classList.add('active');
  document.getElementById('genImageArea').style.display = 'none';

  // Upload to Supabase Storage
  try {
    const blob = await fetch(e.target.result).then(r => r.blob());
    const fileName = `upload-${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
    const { data, error } = await _supabase.storage
      .from('post-images')
      .upload(fileName, blob, { contentType: file.type });
    if (!error) {
      const { data: urlData } = _supabase.storage
        .from('post-images')
        .getPublicUrl(fileName);
      uploadedImageData = urlData.publicUrl;
      img.src = uploadedImageData;
    }
  } catch (e) {
    console.warn('Could not upload to storage:', e);
  }

  showToast('', 'Image uploaded!');
};
  reader.readAsDataURL(file);
}

function removeImage() {
  uploadedImageData = null;
  const img = document.getElementById('uploadedImg');
  img.src = '';
  img.style.display = 'none';
  document.getElementById('imagePlaceholder').style.display = 'block';
  document.getElementById('imageZone').classList.remove('has-image');
  document.getElementById('imageActions').style.display = 'none';
  document.getElementById('fileInput').value = '';
}

function toggleAIImage() {
  if (!aiImageUrl) {
    generateAIImage();
  } else {
    useAIImage = !useAIImage;
    document.getElementById('aiImgToggle').classList.toggle('active', useAIImage);
  }
}

function generateLocalCaptions(title, body, category) {
  const subject = title || body.split(' ').slice(0, 4).join(' ') || 'this story';
  const cat = category || 'life';
  const words = (title + ' ' + body).toLowerCase().split(/\s+/).filter(w => w.length > 4);
  const keyword = words[Math.floor(Math.random() * Math.min(words.length, 8))] || subject;
  return [
    `${title ? title : 'This'} — a perspective you didn't know you needed.`,
    `In the quiet corners of ${cat.toLowerCase()}, some stories demand to be told.`,
    `What does ${keyword} really mean for the world we live in today?`,
    `A deep dive into ${subject}: the insights, the lessons, and what comes next.`,
    `Everything you need to know about ${keyword} — and why it matters.`,
    `The untold side of ${subject} that everyone is talking about.`,
    `${title ? title : 'This'} — breaking it down, one insight at a time.`
  ];
}

async function suggestCaptions() {
  const title = document.getElementById('titleInput').value.trim();
  const body = document.getElementById('blogBody').value.trim();
  const category = document.querySelector('.cat-chip.active')?.textContent || '';

  if (!title && !body) {
    showToast('⚠️', 'Please write a title or content first.');
    return;
  }

  const btn = document.getElementById('suggestBtn');
  btn.disabled = true;
  btn.textContent = '⏳ Thinking…';
  document.getElementById('loadingState').style.display = 'block';
  document.getElementById('captionChips').innerHTML = '';

  const prompt = `Blog title: ${title}\nCategory: ${category}\nContent: ${body.substring(0, 600)}\nGenerate exactly 7 catchy captions. Return ONLY a JSON array of 7 strings.`;
  let captions = null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 600,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      const raw = data?.content?.[0]?.text?.trim() || '';
      const clean = raw.replace(/```json|```/g, '').trim();
      const match = clean.match(/\[[\s\S]*\]/);
      if (match) captions = JSON.parse(match[0]);
    }
  } catch (e) {}

  if (!Array.isArray(captions) || captions.length === 0) {
    captions = generateLocalCaptions(title, body, category);
    showToast('✦', '7 captions ready!');
  } else {
    showToast('✦', '7 captions generated!');
  }

  document.getElementById('loadingState').style.display = 'none';
  renderCaptions(captions);
  btn.disabled = false;
  btn.textContent = '✦ Suggest Captions';
}

function renderCaptions(captions) {
  const container = document.getElementById('captionChips');
  container.innerHTML = '';
  captions.forEach(cap => {
    const div = document.createElement('div');
    div.className = 'caption-chip';
    div.innerHTML = `<span>${cap}</span><span class="chip-use-btn">Use this →</span>`;
    div.onclick = () => {
      document.getElementById('captionInput').value = cap;
      document.querySelectorAll('.caption-chip').forEach(c => c.classList.remove('selected'));
      div.classList.add('selected');
      showToast('✓', 'Caption selected!');
    };
    container.appendChild(div);
  });
}

/**
 * Build multiple search queries from the title, ordered from most specific
 * to most general. This gives Pexels the best chance of returning a
 * highly relevant image for the exact title the user typed.
 */
function buildTitleSearchQueries(title) {
  const stop = new Set([
    'the','a','an','and','or','but','in','on','at','to','for','of','with',
    'by','from','is','are','was','were','be','been','being','have','has','had',
    'do','does','did','will','would','could','should','shall','may','might',
    'can','my','your','our','their','its','this','that','these','those',
    'how','why','what','when','where','who','which','about','i','we','you',
    'he','she','it','they','me','him','her','us','them','not','no','very',
    'just','so','also','too','then','than','more','most','some','any','all',
    'every','each','much','many','few','own','new','old','good','bad','best',
    'worst','first','last','next','great','big','small','little','long','top',
    'high','low','right','left','real','true','full','blog','post','article',
    'write','writing','read','reading','complete','ultimate','definitive'
  ]);
  const abstract = new Set([
    'experience','taste','feel','feeling','essence','story','guide','review',
    'thoughts','opinion','perspective','take','look','way','thing','stuff',
    'idea','tips','tricks','secrets','reasons','ways','steps','everything',
    'nothing','something','anyone','everyone','nobody','world','life'
  ]);

  // Clean title — only letters, numbers, spaces
  const cleaned = title.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

  // Extract meaningful words
  const allWords = cleaned.split(/\s+/).filter(w => w.length > 2 && !stop.has(w));
  const concreteWords = allWords.filter(w => !abstract.has(w));
  const bestWords = concreteWords.length > 0 ? concreteWords : allWords;

  const queries = [];

  // Strategy 1: Full cleaned title (most specific — Pexels is smart with phrases)
  if (cleaned.length > 0 && cleaned.split(/\s+/).length <= 8) {
    queries.push(cleaned);
  }

  // Strategy 2: All concrete keywords joined (e.g. "artificial intelligence future")
  if (bestWords.length >= 2) {
    queries.push(bestWords.slice(0, 4).join(' '));
  }

  // Strategy 3: Top 2 keywords (broader match)
  if (bestWords.length >= 2) {
    queries.push(bestWords.slice(0, 2).join(' '));
  }

  // Strategy 4: Single strongest keyword (broadest, guaranteed results)
  if (bestWords.length >= 1) {
    queries.push(bestWords[0]);
  }

  // Deduplicate while preserving order
  const seen = new Set();
  return queries.filter(q => {
    const key = q.trim().toLowerCase();
    if (seen.has(key) || !key) return false;
    seen.add(key);
    return true;
  });
}

function hashString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/**
 * Search Pexels with a single query. Returns array of photo URLs or [].
 */
async function searchPexels(query, perPage = 15) {
  if (!PEXELS_API_KEY) return [];
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const resp = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&page=1`,
      { signal: controller.signal, headers: { 'Authorization': PEXELS_API_KEY } }
    );
    clearTimeout(timeout);
    if (!resp.ok) return [];
    const data = await resp.json();
    return (data.photos || []).map(p => p.src.landscape || p.src.large2x || p.src.large);
  } catch (e) {
    console.warn('Pexels search failed for "' + query + '":', e);
    return [];
  }
}

/**
 * Search Wikimedia Commons — completely free, no API key, CORS-friendly.
 * Returns array of image URLs relevant to the query.
 */
async function searchWikimedia(query, limit = 15) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query + ' photo')}&gsrnamespace=6&gsrlimit=${limit}&prop=imageinfo&iiprop=url|mime&iiurlwidth=900&format=json&origin=*`;
    const resp = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!resp.ok) return [];
    const data = await resp.json();
    const pages = data.query?.pages;
    if (!pages) return [];
    return Object.values(pages)
      .filter(p => {
        const info = p.imageinfo?.[0];
        if (!info?.thumburl) return false;
        // Only include actual photos (jpg/png/webp), skip SVGs, PDFs, icons
        const mime = (info.mime || '').toLowerCase();
        return mime.startsWith('image/jpeg') || mime.startsWith('image/png') || mime.startsWith('image/webp');
      })
      .map(p => p.imageinfo[0].thumburl);
  } catch (e) {
    console.warn('Wikimedia search failed for "' + query + '":', e);
    return [];
  }
}

/**
 * Generate a beautiful canvas-based cover image from the blog title.
 * This is the ultimate fallback — it ALWAYS works and is ALWAYS relevant
 * because it literally displays the title on a gorgeous gradient.
 * Returns a data URL.
 */
function generateTitleCover(title) {
  const canvas = document.createElement('canvas');
  canvas.width = 900;
  canvas.height = 500;
  const ctx = canvas.getContext('2d');

  // Generate unique colors based on title
  const h = hashString(title);
  const hue1 = h % 360;
  const hue2 = (hue1 + 45) % 360;
  const hue3 = (hue1 + 180) % 360;

  // Beautiful gradient background
  const grad = ctx.createLinearGradient(0, 0, 900, 500);
  grad.addColorStop(0, `hsl(${hue1}, 65%, 30%)`);
  grad.addColorStop(0.5, `hsl(${hue2}, 55%, 22%)`);
  grad.addColorStop(1, `hsl(${hue3}, 50%, 18%)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 900, 500);

  // Subtle decorative circles
  ctx.globalAlpha = 0.06;
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.arc(
      ((h * (i + 1) * 137) % 800) + 50,
      ((h * (i + 1) * 97) % 400) + 50,
      60 + (i * 35),
      0, Math.PI * 2
    );
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }

  // Decorative lines
  ctx.globalAlpha = 0.08;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 100 + i * 120);
    ctx.bezierCurveTo(300, 80 + i * 100, 600, 140 + i * 110, 900, 90 + i * 130);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;

  // Small accent bar at top
  const accentGrad = ctx.createLinearGradient(340, 0, 560, 0);
  accentGrad.addColorStop(0, `hsl(${hue1}, 80%, 60%)`);
  accentGrad.addColorStop(1, `hsl(${hue2}, 80%, 65%)`);
  ctx.fillStyle = accentGrad;
  ctx.beginPath();
  ctx.roundRect(370, 140, 160, 4, 2);
  ctx.fill();

  // Title text with word wrap
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 38px "Segoe UI", system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Shadow for text
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;

  const maxWidth = 720;
  const words = title.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width > maxWidth) {
      if (line) lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);

  // Limit to 4 lines max
  if (lines.length > 4) {
    lines.length = 4;
    lines[3] = lines[3].slice(0, -3) + '...';
  }

  const lineHeight = 52;
  const startY = 250 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((l, i) => {
    ctx.fillText(l, 450, startY + i * lineHeight);
  });

  // "TechBytes" branding at bottom
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.font = '16px "Segoe UI", system-ui, sans-serif';
  ctx.globalAlpha = 0.5;
  ctx.fillText('✦ TechBytes', 450, startY + lines.length * lineHeight + 45);

  return canvas.toDataURL('image/jpeg', 0.92);
}

/**
 * Try searching across multiple image APIs with cascading queries.
 * Returns { url, matchedQuery, source } or null.
 */
async function searchImagesMultiAPI(queries, regenIdx, statusCallback) {
  // ─── Tier 1: Pexels (best quality & relevance) ───
  for (const query of queries) {
    if (statusCallback) statusCallback(`Pexels: "${query}"`);
    const urls = await searchPexels(query, 15);
    if (urls.length > 0) {
      const idx = regenIdx <= 1 ? 0 : ((regenIdx - 1) % urls.length);
      return { url: urls[idx], matchedQuery: query, source: 'Pexels' };
    }
  }

  // ─── Tier 2: Wikimedia Commons (free, no key, large library) ───
  for (const query of queries) {
    if (statusCallback) statusCallback(`Wikimedia: "${query}"`);
    const urls = await searchWikimedia(query);
    if (urls.length > 0) {
      const idx = regenIdx <= 1 ? 0 : ((regenIdx - 1) % urls.length);
      return { url: urls[idx], matchedQuery: query, source: 'Wikimedia' };
    }
  }

  return null;
}

async function generateAIImage() {
  const title = document.getElementById('titleInput').value.trim();

  if (!title) {
    showToast('⚠️', 'Please add a title first — images are generated from the title!');
    return;
  }

  const btn = document.getElementById('genImgBtn');
  btn.disabled = true;
  btn.textContent = '⏳ Searching…';
  document.getElementById('loadingState').style.display = 'block';
  document.getElementById('genImageArea').style.display = 'none';

  regenCounter++;

  // Build cascading search queries from the title (most specific → broadest)
  const queries = buildTitleSearchQueries(title);

  // Try Pexels → Wikimedia with status updates on the button
  const result = await searchImagesMultiAPI(queries, regenCounter, (status) => {
    btn.textContent = `⏳ ${status}`;
  });

  let imgUrl = null;
  let matchedQuery = '';
  let isCanvasCover = false;

  if (result) {
    imgUrl = result.url;
    matchedQuery = result.matchedQuery;
  } else {
    // ─── Tier 3: Canvas-generated title cover (ALWAYS works, ALWAYS relevant) ───
    btn.textContent = '🎨 Generating cover…';
    imgUrl = generateTitleCover(title);
    matchedQuery = title;
    isCanvasCover = true;
  }

  lastKeywords = matchedQuery || title;
  aiImageUrl = imgUrl;

  // Upload to Supabase Storage (works for both URLs and data URLs)
  try {
    let blob;
    if (isCanvasCover) {
      // Convert data URL to blob
      const parts = imgUrl.split(',');
      const mime = parts[0].match(/:(.*?);/)[1];
      const bstr = atob(parts[1]);
      const arr = new Uint8Array(bstr.length);
      for (let i = 0; i < bstr.length; i++) arr[i] = bstr.charCodeAt(i);
      blob = new Blob([arr], { type: mime });
    } else {
      const response = await fetch(imgUrl);
      blob = await response.blob();
    }
    const fileName = `ai-${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
    const { data, error } = await _supabase.storage
      .from('post-images')
      .upload(fileName, blob, { contentType: 'image/jpeg' });
    if (!error) {
      const { data: urlData } = _supabase.storage
        .from('post-images')
        .getPublicUrl(fileName);
      aiImageUrl = urlData.publicUrl;
    }
  } catch (e) {
    console.warn('Could not upload to storage, using direct URL:', e);
  }

  const imgEl = document.getElementById('aiGenImg');
  imgEl.style.opacity = '0';
  imgEl.style.transition = 'opacity .4s ease';

  imgEl.onload = () => {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('genImageArea').style.display = 'block';
    document.getElementById('keywordBadge').textContent = isCanvasCover
      ? '🎨 Title cover: "' + matchedQuery + '"'
      : '🔍 Matched: "' + matchedQuery + '"';
    useAIImage = true;
    document.getElementById('aiImgToggle').classList.add('active');
    imgEl.style.opacity = '1';
    showToast('🎨', isCanvasCover
      ? 'Cover generated from title!'
      : `Image matched: "${matchedQuery}"`);
  };

  imgEl.onerror = () => {
    // If URL-based image fails to load, generate canvas cover as rescue
    if (!isCanvasCover) {
      const coverUrl = generateTitleCover(title);
      aiImageUrl = coverUrl;
      imgEl.onload = () => {
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('genImageArea').style.display = 'block';
        document.getElementById('keywordBadge').textContent = '🎨 Title cover: "' + title + '"';
        useAIImage = true;
        document.getElementById('aiImgToggle').classList.add('active');
        imgEl.style.opacity = '1';
        showToast('🎨', 'Cover generated from title!');
      };
      imgEl.src = coverUrl;
    } else {
      document.getElementById('loadingState').style.display = 'none';
      showToast('⚠️', 'Could not generate image. Please try again!');
    }
  };

  imgEl.src = imgUrl;
  btn.disabled = false;
  btn.textContent = 'Generate AI Image';
}

function showPreview() {
  const title = document.getElementById('titleInput').value.trim() || 'Untitled Blog';
  const body = window._quill ? window._quill.root.innerHTML.trim() : document.getElementById('blogBody').value.trim();
  const plainBody = body.replace(/<[^>]*>/g, ' ');
  const caption = document.getElementById('captionInput').value.trim();
  const category = document.querySelector('.cat-chip.active')?.textContent || 'Blog';

  document.getElementById('previewTitle').textContent = title;
  document.getElementById('previewText').innerHTML = body || '(No content yet)';
  document.getElementById('previewCaption').textContent = caption ? `"${caption}"` : '';
  document.getElementById('previewCategory').textContent = '✦ ' + category;
  document.getElementById('previewDate').textContent = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  document.getElementById('previewReadTime').textContent = '⏱ ' + calcReadTime(body);
  document.getElementById('previewSlug').textContent = '🔗 techbytes.com/blog/' + generateSlug(title);

  const previewImg = document.getElementById('previewImage');
  let imgSrc = null;
  if (uploadedImageData && !useAIImage) imgSrc = uploadedImageData;
  else if (useAIImage && aiImageUrl) imgSrc = aiImageUrl;

  if (imgSrc) {
    previewImg.src = imgSrc;
    previewImg.style.display = 'block';
  } else {
    previewImg.style.display = 'none';
  }

  const section = document.getElementById('previewSection');
  section.classList.add('visible');
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  showToast('👁', 'Preview ready!');
}

function resetForm() {
  if (!confirm('Clear everything and start fresh?')) return;

  ['titleInput', 'captionInput'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('blogBody').value = '';

  // Clear Quill editor if initialized
  if (window._quill) {
    window._quill.setContents([]);
  }

  document.getElementById('slugDisplay').textContent = 'your-blog-title';
  document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
  document.getElementById('captionChips').innerHTML = '';
  document.getElementById('loadingState').style.display = 'none';
  document.getElementById('genImageArea').style.display = 'none';
  document.getElementById('previewSection').classList.remove('visible');
  document.getElementById('publishStatus').className = 'publish-status';

  removeImage();
  uploadedImageData = null;
  aiImageUrl = null;
  useAIImage = false;
  lastKeywords = '';
  countWords();
  updateWordGoal(0);
  showToast('✓', 'Form cleared!');
}

function showToast(icon, msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toastIcon').textContent = icon;
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}


// ═══ VOICE TYPING (Web Speech API) ═══════════════════════════
let voiceRecognition = null,
    isVoiceActive = false;

function initVoiceTyping() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    document.getElementById('voiceBtn').title = 'Voice typing not supported in this browser';
    return;
  }

  voiceRecognition = new SR();
  voiceRecognition.continuous = true;
  voiceRecognition.interimResults = true;
  voiceRecognition.lang = 'en-US';

  let finalTranscript = '';

  voiceRecognition.onresult = (event) => {
    let interim = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interim += transcript;
      }
    }
    if (finalTranscript) {
      // Insert into Quill if available, otherwise into textarea
      if (window._quill) {
        const range = window._quill.getSelection(true);
        const pos = range ? range.index : window._quill.getLength();
        window._quill.insertText(pos, (pos > 0 ? ' ' : '') + finalTranscript);
        window._quill.setSelection(pos + finalTranscript.length + 1);
      } else {
        const body = document.getElementById('blogBody');
        const needsSpace = body.value.length > 0 &&
          !body.value.endsWith(' ') &&
          !body.value.endsWith('\n');
        body.value += (needsSpace ? ' ' : '') + finalTranscript;
      }
      finalTranscript = '';
      countWords();
    }
  };

  voiceRecognition.onerror = (event) => {
    if (event.error === 'not-allowed') {
      showToast('⚠️', 'Microphone access denied. Please allow mic access.');
    } else if (event.error !== 'aborted') {
      showToast('⚠️', 'Voice error: ' + event.error);
    }
    stopVoice();
  };

  voiceRecognition.onend = () => {
    if (isVoiceActive) {
      try { voiceRecognition.start(); } catch (e) { stopVoice(); }
    }
  };
}

function toggleVoice() {
  if (!voiceRecognition) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      showToast('⚠️', 'Voice typing is not supported in this browser. Try Chrome.');
      return;
    }
    initVoiceTyping();
  }
  if (isVoiceActive) {
    stopVoice();
  } else {
    startVoice();
  }
}

function startVoice() {
  isVoiceActive = true;
  try {
    voiceRecognition.start();
  } catch (e) {
    voiceRecognition.stop();
    setTimeout(() => { voiceRecognition.start(); }, 200);
  }
  document.getElementById('voiceBtn').classList.add('recording');
  document.getElementById('voiceIndicator').classList.add('show');
  showToast('🎙️', 'Voice typing started — speak now!');
}

function stopVoice() {
  isVoiceActive = false;
  try { voiceRecognition.stop(); } catch (e) {}
  document.getElementById('voiceBtn').classList.remove('recording');
  document.getElementById('voiceIndicator').classList.remove('show');
  showToast('⏹️', 'Voice typing stopped.');
}

// ═══ DISCOVER WRITERS SEARCH ══════════════════════════════════
function toggleWriterSearch() {
  const wrap = document.getElementById('writerSearchWrap');
  const input = document.getElementById('writerSearchInput');
  if (wrap.style.display === 'none') {
    wrap.style.display = 'block';
    input.focus();
  } else {
    wrap.style.display = 'none';
    input.value = '';
    const fl = document.getElementById('followList');
    fl.innerHTML = `<div style="font-size:.82rem;color:var(--muted);">Use the search icon to find writers.</div>`;
  }
}

let writerSearchTimer = null;
function searchWriters(query) {
  clearTimeout(writerSearchTimer);
  const q = (query || '').trim();
  const fl = document.getElementById('followList');

  if (!q) {
    fl.innerHTML = `<div style="font-size:.82rem;color:var(--muted);">Use the search icon to find writers.</div>`;
    return;
  }
  if (q.length < 2) {
    fl.innerHTML = `<div style="font-size:.82rem;color:var(--muted);">Type at least 2 characters…</div>`;
    return;
  }

  fl.innerHTML = `<div style="font-size:.82rem;color:var(--muted);">Searching…</div>`;

  writerSearchTimer = setTimeout(async () => {
    try {
      const { data, error } = await _supabase
        .from('profiles')
        .select('id, username')
        .ilike('username', `%${q}%`)
        .limit(10);

      if (error) throw error;

      // Filter out current user
      const results = (data || []).filter(p => p.id !== currentUser?.id);

      fl.innerHTML = '';
      if (!results.length) {
        fl.innerHTML = `<div style="font-size:.82rem;color:var(--muted);">No writers found for "${q}".</div>`;
        return;
      }

      results.forEach(p => {
        usernameCache[p.id] = p.username;
        const color = avatarColor(p.id);
        const isFollowing = followingSet.has(p.id);
        const savedAv = localStorage.getItem('tb_avatar_' + p.id);
        const div = document.createElement('div');
        div.className = 'follow-item';
        div.innerHTML = `
          <div class="follow-avatar" style="background:${color}">
            ${savedAv ? `<img src="${savedAv}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">` : `<span>${getInitial(p.username)}</span>`}
          </div>
          <div class="follow-info">
            <div class="follow-name">${p.username}</div>
            <div class="follow-cat">Writer</div>
          </div>
          <button class="btn-follow ${isFollowing ? 'following' : ''}" onclick="toggleFollow('${p.id}',this)">
            ${isFollowing ? 'Following' : 'Follow'}
          </button>`;
        fl.appendChild(div);
      });
    } catch (e) {
      fl.innerHTML = `<div style="font-size:.82rem;color:var(--muted);">Search failed. Try again.</div>`;
    }
  }, 350);
}


// ═══ FOLLOWERS / FOLLOWING MODAL ══════════════════════════════
async function showFollowersList() {
  if (!currentUser) return;
  const modal = document.getElementById('followModal');
  const body = document.getElementById('followModalBody');
  document.getElementById('followModalTitle').textContent = 'Followers';
  body.innerHTML = `<div style="font-size:.85rem;color:var(--muted);text-align:center;padding:2rem;">Loading…</div>`;
  modal.classList.add('show');

  try {
    const { data, error } = await _supabase
      .from('follows')
      .select('follower_id')
      .eq('following_id', currentUser.id);

    if (error) throw error;
    const followerIds = (data || []).map(r => r.follower_id);

    if (!followerIds.length) {
      body.innerHTML = `<div class="follow-modal-empty"><div class="empty-icon">👥</div>No followers yet.<br>Share your blogs to grow your audience!</div>`;
      return;
    }

    await loadUsernames(followerIds);
    renderFollowModal(body, followerIds);
  } catch (e) {
    body.innerHTML = `<div class="follow-modal-empty">Could not load followers.</div>`;
  }
}

async function showFollowingList() {
  if (!currentUser) return;
  const modal = document.getElementById('followModal');
  const body = document.getElementById('followModalBody');
  document.getElementById('followModalTitle').textContent = 'Following';
  body.innerHTML = `<div style="font-size:.85rem;color:var(--muted);text-align:center;padding:2rem;">Loading…</div>`;
  modal.classList.add('show');

  try {
    const { data, error } = await _supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', currentUser.id);

    if (error) throw error;
    const followingIds = (data || []).map(r => r.following_id);

    if (!followingIds.length) {
      body.innerHTML = `<div class="follow-modal-empty"><div class="empty-icon">✨</div>Not following anyone yet.<br>Discover writers using the search!</div>`;
      return;
    }

    await loadUsernames(followingIds);
    renderFollowModal(body, followingIds);
  } catch (e) {
    body.innerHTML = `<div class="follow-modal-empty">Could not load following list.</div>`;
  }
}

function renderFollowModal(container, userIds) {
  container.innerHTML = '';
  userIds.forEach(uid => {
    const uname = usernameCache[uid] || 'Writer';
    const color = avatarColor(uid);
    const savedAv = localStorage.getItem('tb_avatar_' + uid);
    const isFollowing = followingSet.has(uid);
    const div = document.createElement('div');
    div.className = 'follow-item';
    div.innerHTML = `
      <div class="follow-avatar" style="background:${color}">
        ${savedAv ? `<img src="${savedAv}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">` : `<span>${getInitial(uname)}</span>`}
      </div>
      <div class="follow-info">
        <div class="follow-name">${uname}</div>
        <div class="follow-cat">Writer</div>
      </div>
      ${uid !== currentUser?.id ? `
        <button class="btn-follow ${isFollowing ? 'following' : ''}" onclick="toggleFollow('${uid}',this)">
          ${isFollowing ? 'Following' : 'Follow'}
        </button>` : ''}`;
    container.appendChild(div);
  });
}

function closeFollowModal() {
  document.getElementById('followModal').classList.remove('show');
}


// ═══ READ PROGRESS BAR SCROLL LISTENER ═══════════════════════
window.addEventListener('scroll', () => {
  const bar = document.getElementById('readProgressBar');
  if (!bar || currentView !== 'read') return;
  const h = document.documentElement,
        b = document.body,
        st = 'scrollTop',
        sh = 'scrollHeight';
  const percent = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;
  bar.style.width = percent + '%';
});


// ═══ VIEW COUNTER ═════════════════════════════════════════════
async function incrementView(postId) {
  if (!postId) return;
  const viewed = sessionStorage.getItem('tb_viewed_' + postId);
  if (!viewed) {
    sessionStorage.setItem('tb_viewed_' + postId, 'true');
    try {
      const { data } = await _supabase.from('posts').select('views').eq('id', postId).maybeSingle();
      const cur = data?.views || 0;
      await _supabase.from('posts').update({ views: cur + 1 }).eq('id', postId);
      if (currentReadPost && currentReadPost.id === postId) {
        currentReadPost.views = cur + 1;
      }
    } catch (e) {
      console.warn('Could not increment view count:', e);
    }
  }
}


// ═══ BOOKMARKS / READING LIST ════════════════════════════════
async function loadBookmarks() {
  if (guestMode || !currentUser) return;
  try {
    const { data, error } = await _supabase
      .from('bookmarks')
      .select('post_id')
      .eq('user_id', currentUser.id);
    if (error) throw error;
    bookmarkedPosts.clear();
    (data || []).forEach(r => bookmarkedPosts.add(r.post_id));
  } catch (e) {
    console.warn('Could not load bookmarks:', e);
  }
}

async function toggleBookmark(postId, btn) {
  if (guestMode || !currentUser) {
    showGuestToast();
    return;
  }
  if (!postId) return;
  const isBookmarked = bookmarkedPosts.has(postId);
  
  if (isBookmarked) {
    bookmarkedPosts.delete(postId);
    showToast('🔖', 'Bookmark removed.');
  } else {
    bookmarkedPosts.add(postId);
    showToast('🔖', 'Post bookmarked!');
  }

  // Update visual status across all occurrences
  document.querySelectorAll(`.bookmark-btn[data-id="${postId}"]`).forEach(el => {
    const active = el.classList.toggle('bookmarked', !isBookmarked);
    if (el.id === 'readBookmarkBtn') {
      el.innerHTML = active ? '🔖 Bookmarked' : '🔖 Bookmark';
    }
  });

  try {
    if (isBookmarked) {
      await _supabase.from('bookmarks').delete().eq('user_id', currentUser.id).eq('post_id', postId);
    } else {
      await _supabase.from('bookmarks').insert([{ user_id: currentUser.id, post_id: postId }]);
      
      // Notify post author
      const { data: postData } = await _supabase.from('posts').select('title, user_id').eq('id', postId).maybeSingle();
      if (postData && postData.user_id !== currentUser.id) {
        await createNotification(postData.user_id, 'bookmark', postId, postData.title);
      }
    }
    
    if (currentView === 'bookmarks') {
      loadBookmarksView();
    }
  } catch (e) {
    // Revert state on error
    if (isBookmarked) {
      bookmarkedPosts.add(postId);
    } else {
      bookmarkedPosts.delete(postId);
    }
    document.querySelectorAll(`.bookmark-btn[data-id="${postId}"]`).forEach(el => {
      const active = el.classList.toggle('bookmarked', isBookmarked);
      if (el.id === 'readBookmarkBtn') {
        el.innerHTML = active ? '🔖 Bookmarked' : '🔖 Bookmark';
      }
    });
    showToast('⚠️', 'Error syncing bookmark.');
  }
}

async function loadBookmarksView() {
  if (guestMode || !currentUser) {
    showGuestToast();
    return;
  }
  const grid = document.getElementById('bookmarksGrid');
  grid.innerHTML = '<div style="color:var(--muted);font-size:.85rem;padding:1.5rem 0;">Loading bookmarks…</div>';

  try {
    const { data: bData, error: bErr } = await _supabase
      .from('bookmarks')
      .select('post_id')
      .eq('user_id', currentUser.id);

    if (bErr) throw bErr;
    const ids = (bData || []).map(r => r.post_id);

    if (!ids.length) {
      document.getElementById('bookmarksMeta').textContent = '0 saved posts';
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🔖</div>
          <div class="empty-state-title">No bookmarks saved</div>
          <div class="empty-state-sub">Browse the feed and save articles for later reading!</div>
          <button class="btn btn-primary" onclick="switchView('feed')">Explore Feed</button>
        </div>`;
      return;
    }

    const { data: posts, error: pErr } = await _supabase
      .from('posts')
      .select('*')
      .in('id', ids)
      .eq('is_draft', false);

    if (pErr) throw pErr;

    grid.innerHTML = '';
    document.getElementById('bookmarksMeta').textContent = `${posts.length} saved post${posts.length !== 1 ? 's' : ''}`;
    posts.forEach(post => {
      grid.appendChild(buildCard(post, 'feed'));
    });
  } catch (e) {
    grid.innerHTML = `<div style="color:var(--danger);font-size:.85rem;padding:1.5rem 0;">Failed to load bookmarks: ${e.message}</div>`;
  }
}


// ═══ COMMENTS ON POSTS ═══════════════════════════════════════
async function loadComments(postId) {
  const container = document.getElementById('commentsList');
  const countEl = document.getElementById('commentsCount');
  if (!container || !countEl) return;

  container.innerHTML = '<div style="color:var(--muted);font-size:.85rem;padding:1rem 0;">Loading comments…</div>';
  countEl.textContent = '0';

  try {
    const { data, error } = await _supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    countEl.textContent = data.length.toString();
    container.innerHTML = '';

    if (!data.length) {
      container.innerHTML = `<div style="font-size:.85rem;color:var(--muted);padding:1rem 0;">No comments yet. Be the first to share your thoughts!</div>`;
      return;
    }

    // Load custom usernames
    const userIds = data.map(c => c.user_id).filter(Boolean);
    await loadUsernames([...new Set(userIds)]);

    data.forEach(c => {
      const name = getDisplayName(c.user_id, c.author_email || '');
      const initial = getInitial(name);
      const color = avatarColor(c.user_id || c.author_email || '');
      const isMyComment = currentUser && c.user_id === currentUser.id;
      const dateStr = new Date(c.created_at).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
      const savedAv = localStorage.getItem('tb_avatar_' + c.user_id);

      const item = document.createElement('div');
      item.className = 'comment-item';
      item.innerHTML = `
        <div class="comment-avatar" style="background:${color}">
          ${savedAv ? `<img src="${savedAv}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">` : `<span>${initial}</span>`}
        </div>
        <div class="comment-content">
          <div class="comment-header">
            <span class="comment-author">${name}</span>
            <span class="comment-date">${dateStr}</span>
            ${isMyComment ? `<button class="comment-del-btn" onclick="deleteComment('${c.id}')">Delete</button>` : ''}
          </div>
          <div class="comment-body">${c.body}</div>
        </div>
      `;
      container.appendChild(item);
    });
  } catch (e) {
    container.innerHTML = `<div style="color:var(--danger);font-size:.85rem;padding:1rem 0;">Failed to load comments.</div>`;
  }
}

async function submitComment() {
  if (guestMode || !currentUser) {
    showGuestToast();
    return;
  }
  if (!currentReadPost) return;
  const input = document.getElementById('commentBody');
  const body = input.value.trim();
  if (!body) {
    showToast('⚠️', 'Comment cannot be empty!');
    return;
  }

  try {
    const { error } = await _supabase.from('comments').insert([{
      post_id: currentReadPost.id,
      user_id: currentUser.id,
      author_email: currentUser.email,
      body
    }]);

    if (error) throw error;
    input.value = '';
    showToast('✓', 'Comment posted!');
    loadComments(currentReadPost.id);

    // Notify post author
    if (currentReadPost.user_id !== currentUser.id) {
      await createNotification(
        currentReadPost.user_id,
        'comment',
        currentReadPost.id,
        currentReadPost.title
      );
    }
  } catch (e) {
    showToast('⚠️', 'Could not post comment.');
  }
}

async function deleteComment(commentId) {
  if (!confirm('Are you sure you want to delete your comment?')) return;
  try {
    const { error } = await _supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', currentUser.id);

    if (error) throw error;
    showToast('✓', 'Comment deleted!');
    if (currentReadPost) loadComments(currentReadPost.id);
  } catch (e) {
    showToast('⚠️', 'Failed to delete comment.');
  }
}


// ═══ NOTIFICATIONS SYSTEM ════════════════════════════════════
async function createNotification(recipientId, type, postId, postTitle) {
  if (!recipientId || !currentUser || recipientId === currentUser.id) return;
  try {
    await _supabase.from('notifications').insert([{
      recipient_id: recipientId,
      actor_id: currentUser.id,
      actor_email: currentUser.email,
      type,
      post_id: postId,
      post_title: postTitle,
      read: false
    }]);
  } catch (e) {
    console.warn('Could not create notification:', e);
  }
}

async function loadNotifications() {
  if (guestMode || !currentUser) return;
  try {
    const { data, error } = await _supabase
      .from('notifications')
      .select('*')
      .eq('recipient_id', currentUser.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    renderNotifications(data || []);
  } catch (e) {
    console.warn('Could not load notifications:', e);
  }
}

function renderNotifications(notifs) {
  const list = document.getElementById('notifList');
  const badge = document.getElementById('notifBadge');
  if (!list || !badge) return;

  const unreadCount = notifs.filter(n => !n.read).length;
  badge.textContent = unreadCount;
  badge.style.display = unreadCount > 0 ? 'flex' : 'none';

  list.innerHTML = '';
  if (!notifs.length) {
    list.innerHTML = `<div style="padding:1.5rem;text-align:center;color:var(--muted);font-size:.85rem;">No notifications yet.</div>`;
    return;
  }

  notifs.forEach(n => {
    const dateStr = new Date(n.created_at).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    const actorName = getDisplayName(n.actor_id, n.actor_email);
    let text = '';
    let icon = '';

    if (n.type === 'like') {
      icon = '❤️';
      text = `<strong>${actorName}</strong> liked your post "${n.post_title || 'Untitled'}"`;
    } else if (n.type === 'comment') {
      icon = '💬';
      text = `<strong>${actorName}</strong> commented on "${n.post_title || 'Untitled'}"`;
    } else if (n.type === 'follow') {
      icon = '👤';
      text = `<strong>${actorName}</strong> started following you`;
    } else if (n.type === 'bookmark') {
      icon = '🔖';
      text = `<strong>${actorName}</strong> bookmarked "${n.post_title || 'Untitled'}"`;
    }

    const item = document.createElement('div');
    item.className = 'notif-item' + (n.read ? ' read' : ' unread');
    item.onclick = async (e) => {
      e.stopPropagation();
      if (!n.read) {
        await _supabase.from('notifications').update({ read: true }).eq('id', n.id);
        loadNotifications();
      }
      if (n.post_id) {
        try {
          const { data } = await _supabase.from('posts').select('*').eq('id', n.post_id).maybeSingle();
          if (data) {
            document.getElementById('notifPanel').style.display = 'none';
            openRead(data);
          }
        } catch (e) {}
      }
    };

    item.innerHTML = `
      <div class="notif-icon">${icon}</div>
      <div class="notif-content">
        <div class="notif-text">${text}</div>
        <div class="notif-date">${dateStr}</div>
      </div>
    `;
    list.appendChild(item);
  });
}

async function markAllRead() {
  if (!currentUser) return;
  try {
    await _supabase.from('notifications').update({ read: true }).eq('recipient_id', currentUser.id);
    showToast('✓', 'All notifications marked as read.');
    loadNotifications();
  } catch (e) {}
}

function toggleNotifPanel() {
  const panel = document.getElementById('notifPanel');
  if (!panel) return;
  if (panel.style.display === 'none') {
    panel.style.display = 'block';
    loadNotifications();
  } else {
    panel.style.display = 'none';
  }
}

// Close notifications dropdown if clicking outside
document.addEventListener('click', (e) => {
  const wrap = document.getElementById('notifWrap');
  const panel = document.getElementById('notifPanel');
  if (wrap && panel && !wrap.contains(e.target)) {
    panel.style.display = 'none';
  }
});


// ═══ ACHIEVEMENT BADGES ══════════════════════════════════════
function computeBadges(postsCount, totalLikes, followersCount, bookmarksCount) {
  const badges = [];

  if (postsCount >= 1) {
    badges.push({ icon: '🎉', name: 'First Post', desc: 'Published your first post!' });
  }
  if (postsCount >= 5) {
    badges.push({ icon: '✍️', name: 'Prolific Writer', desc: 'Published 5 or more posts!' });
  }
  if (totalLikes >= 1) {
    badges.push({ icon: '❤️', name: 'Liked!', desc: 'Received your first like!' });
  }
  if (totalLikes >= 10) {
    badges.push({ icon: '🔥', name: 'Popular', desc: 'Received 10 or more total claps!' });
  }
  if (followersCount >= 1) {
    badges.push({ icon: '⭐', name: 'Rising Star', desc: 'Gained your first follower!' });
  }
  if (followersCount >= 5) {
    badges.push({ icon: '👑', name: 'Influencer', desc: 'Gained 5 or more followers!' });
  }
  if (bookmarksCount >= 1) {
    badges.push({ icon: '📚', name: 'Bookmarked!', desc: 'Had your posts saved by others!' });
  }

  return badges;
}

async function renderBadges() {
  if (!currentUser) return;
  const row = document.getElementById('badgeRow');
  if (!row) return;

  try {
    // 1. Get posts count
    const { count: pc } = await _supabase
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', currentUser.id)
      .eq('is_draft', false);
    const postsCount = pc || 0;

    // 2. Get total claps (likes) on user's posts
    const { data: clapsData } = await _supabase
      .from('posts')
      .select('claps')
      .eq('user_id', currentUser.id)
      .eq('is_draft', false);
    const totalLikes = (clapsData || []).reduce((s, p) => s + (p.claps || 0), 0);

    // 3. Get followers count
    const { count: fc } = await _supabase
      .from('follows')
      .select('id', { count: 'exact', head: true })
      .eq('following_id', currentUser.id);
    const followersCount = fc || 0;

    // 4. Get bookmarks count (how many times others have bookmarked this user's posts)
    const { data: postsData } = await _supabase
      .from('posts')
      .select('id')
      .eq('user_id', currentUser.id);
    const userPostIds = (postsData || []).map(p => p.id);
    let bookmarksCount = 0;
    if (userPostIds.length > 0) {
      const { count: bc } = await _supabase
        .from('bookmarks')
        .select('id', { count: 'exact', head: true })
        .in('post_id', userPostIds);
      bookmarksCount = bc || 0;
    }

    const earned = computeBadges(postsCount, totalLikes, followersCount, bookmarksCount);

    row.innerHTML = '';
    if (!earned.length) {
      row.innerHTML = `<div style="font-size:.78rem;color:var(--muted);padding-top:.25rem;">No badges earned yet. Keep active!</div>`;
      return;
    }

    earned.forEach(b => {
      const pill = document.createElement('div');
      pill.className = 'badge-pill';
      pill.title = `${b.name}: ${b.desc}`;
      pill.innerHTML = `<span class="badge-icon">${b.icon}</span><span class="badge-name">${b.name}</span>`;
      row.appendChild(pill);
    });
  } catch (e) {
    console.warn('Could not load badges:', e);
  }
}


// ═══ AUTHOR ANALYTICS ════════════════════════════════════════
function toggleAnalyticsView() {
  showAnalyticsActive = !showAnalyticsActive;
  const grid = document.getElementById('myBlogsGrid');
  const analytics = document.getElementById('myBlogsAnalytics');
  const btn = document.getElementById('toggleAnalyticsBtn');

  if (showAnalyticsActive) {
    if (grid) grid.style.display = 'none';
    if (analytics) analytics.style.display = 'block';
    if (btn) {
      btn.textContent = '📚 Show Blogs';
      btn.classList.add('active');
    }
    loadAnalytics();
  } else {
    if (grid) grid.style.display = 'grid';
    if (analytics) analytics.style.display = 'none';
    if (btn) {
      btn.textContent = '📈 Analytics';
      btn.classList.remove('active');
    }
  }
}

async function loadAnalytics() {
  if (!currentUser) return;
  try {
    const { data, error } = await _supabase
      .from('posts')
      .select('*')
      .eq('user_id', currentUser.id)
      .eq('is_draft', false);

    if (error) throw error;

    if (!data || !data.length) {
      document.getElementById('analyticsTotalViews').textContent = '0';
      document.getElementById('analyticsTotalLikes').textContent = '0';
      document.getElementById('analyticsAvgReadTime').textContent = '0 min';
      document.getElementById('analyticsTopViewsList').innerHTML = '<div style="color:var(--muted);font-size:.85rem;padding:1rem;">Publish blogs to see analytics.</div>';
      document.getElementById('analyticsCategoriesList').innerHTML = '<div style="color:var(--muted);font-size:.85rem;padding:1rem;">Publish blogs to see analytics.</div>';
      return;
    }

    // Calculations
    const totalViews = data.reduce((s, p) => s + (p.views || 0), 0);
    const totalLikes = data.reduce((s, p) => s + (p.claps || 0), 0);

    // Average read time
    let totalWords = 0;
    data.forEach(p => {
      totalWords += p.body ? p.body.trim().split(/\s+/).length : 0;
    });
    const avgReadTime = data.length > 0 ? Math.max(1, Math.round((totalWords / data.length) / 200)) : 0;

    document.getElementById('analyticsTotalViews').textContent = totalViews.toLocaleString();
    document.getElementById('analyticsTotalLikes').textContent = totalLikes.toLocaleString();
    document.getElementById('analyticsAvgReadTime').textContent = avgReadTime + ' min';

    // Top Posts by Views
    const topViews = [...data].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);
    const topList = document.getElementById('analyticsTopViewsList');
    topList.innerHTML = '';
    topViews.forEach(p => {
      const item = document.createElement('div');
      item.className = 'analytics-item';
      item.innerHTML = `
        <div class="analytics-item-title">${p.title || 'Untitled'}</div>
        <div class="analytics-item-value">👁️ ${p.views || 0}</div>
      `;
      topList.appendChild(item);
    });

    // Categories Distribution
    const catCount = {};
    data.forEach(p => {
      if (p.category) catCount[p.category] = (catCount[p.category] || 0) + 1;
    });
    const catList = document.getElementById('analyticsCategoriesList');
    catList.innerHTML = '';
    const totalCats = Object.values(catCount).reduce((a, b) => a + b, 0);

    Object.entries(catCount).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
      const pct = Math.round((count / totalCats) * 100);
      const item = document.createElement('div');
      item.className = 'analytics-item-progress';
      item.style.marginBottom = '.75rem';
      item.innerHTML = `
        <div class="analytics-item-progress-label">
          <span>${cat}</span>
          <span>${count} post${count !== 1 ? 's' : ''} (${pct}%)</span>
        </div>
        <div class="analytics-progress-bar-bg">
          <div class="analytics-progress-bar-fill" style="width:${pct}%;"></div>
        </div>
      `;
      catList.appendChild(item);
    });

  } catch (e) {
    console.error('Error loading analytics:', e);
  }
}


// ═══ SHARE BUTTON & MODAL ════════════════════════════════════
function sharePost() {
  if (!currentReadPost) return;
  const shareUrl = window.location.origin + '?post=' + (currentReadPost.slug || generateSlug(currentReadPost.title));
  const shareText = `Check out this amazing blog post on TechBytes: "${currentReadPost.title}"!`;

  if (navigator.share) {
    navigator.share({
      title: currentReadPost.title,
      text: shareText,
      url: shareUrl
    }).catch(err => {
      openShareModal();
    });
  } else {
    openShareModal();
  }
}

function openShareModal() {
  const m = document.getElementById('shareModal');
  if (m) m.style.display = 'flex';
}

function closeShareModal() {
  const m = document.getElementById('shareModal');
  if (m) m.style.display = 'none';
}

function copyShareLink() {
  if (!currentReadPost) return;
  const shareUrl = window.location.origin + '?post=' + (currentReadPost.slug || generateSlug(currentReadPost.title));
  navigator.clipboard.writeText(shareUrl).then(() => {
    showToast('🔗', 'Share link copied to clipboard!');
    closeShareModal();
  }).catch(e => {
    showToast('⚠️', 'Failed to copy link.');
  });
}

function shareToTwitter() {
  if (!currentReadPost) return;
  const shareUrl = window.location.origin + '?post=' + (currentReadPost.slug || generateSlug(currentReadPost.title));
  const shareText = `Check out this amazing blog post on TechBytes: "${currentReadPost.title}"!`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  window.open(twitterUrl, '_blank');
  closeShareModal();
}

function shareToWhatsApp() {
  if (!currentReadPost) return;
  const shareUrl = window.location.origin + '?post=' + (currentReadPost.slug || generateSlug(currentReadPost.title));
  const shareText = `Check out this amazing blog post on TechBytes: "${currentReadPost.title}"! ${shareUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  window.open(whatsappUrl, '_blank');
  closeShareModal();
}


// ═══ QUILL RICH TEXT EDITOR ════════════════════════════════════════
function initQuillEditor() {
  if (typeof Quill === 'undefined') {
    console.warn('Quill not loaded, falling back to textarea.');
    const ta = document.getElementById('blogBody');
    if (ta) {
      ta.style.display = '';
      ta.className = 'blog-body';
      ta.placeholder = 'Start writing…';
      ta.addEventListener('input', countWords);
    }
    return;
  }

  const toolbarContainer = document.getElementById('quillToolbar');
  const editorContainer = document.getElementById('quillEditor');
  if (!toolbarContainer || !editorContainer) return;

  window._quill = new Quill(editorContainer, {
    theme: 'snow',
    modules: {
      toolbar: toolbarContainer,
    },
    placeholder: 'Start writing your story… Use the toolbar for bold, headings, code blocks, and more!',
  });

  // Sync Quill HTML → hidden textarea on every change
  window._quill.on('text-change', () => {
    const html = window._quill.root.innerHTML;
    // Quill outputs '<p><br></p>' for empty — treat as empty
    const isEmpty = html === '<p><br></p>' || html === '';
    document.getElementById('blogBody').value = isEmpty ? '' : html;
    countWords();
  });

  // Load existing draft content into Quill if there's something in textarea
  const existing = document.getElementById('blogBody').value;
  if (existing) {
    window._quill.root.innerHTML = existing;
  }
}


// ═══ AUTHOR PROFILE PAGE ════════════════════════════════════════
let currentProfileUserId = null;

async function openAuthorProfile(userId) {
  if (!userId) return;
  currentProfileUserId = userId;
  prevView = currentView;
  switchView('profile');

  // Reset UI state
  const grid = document.getElementById('profilePageGrid');
  const followBtn = document.getElementById('profilePageFollowBtn');
  document.getElementById('profilePageName').textContent = 'Loading…';
  document.getElementById('profilePageEmail').textContent = '';
  document.getElementById('profilePageBio').textContent = '';
  document.getElementById('profilePagePosts').textContent = '0';
  document.getElementById('profilePageFollowers').textContent = '0';
  document.getElementById('profilePageLikes').textContent = '0';
  document.getElementById('profilePagePostsMeta').textContent = '';
  document.getElementById('profilePageEditBioBtn').style.display = 'none';
  grid.innerHTML = '<div class="card-skeleton"><div class="card-skel-img"></div><div class="card-skel-body"><div class="card-skel-line" style="width:60%"></div><div class="card-skel-line" style="width:80%"></div></div></div>'.repeat(3);

  // Hide follow button for own profile
  const isOwnProfile = currentUser && userId === currentUser.id;
  followBtn.style.display = isOwnProfile ? 'none' : 'inline-flex';
  if (isOwnProfile) {
    document.getElementById('profilePageEditBioBtn').style.display = 'inline-flex';
  }

  try {
    // Load profile data
    const { data: profile } = await _supabase
      .from('profiles')
      .select('id, username, bio')
      .eq('id', userId)
      .maybeSingle();

    const username = profile?.username || usernameCache[userId] || 'Writer';
    if (profile?.username) usernameCache[userId] = profile.username;

    const color = avatarColor(userId);
    const savedAv = localStorage.getItem('tb_avatar_' + userId);

    // Set avatar
    const avatarEl = document.getElementById('profilePageAvatar');
    avatarEl.style.background = color;
    if (savedAv) {
      avatarEl.innerHTML = `<img src="${savedAv}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
    } else {
      avatarEl.textContent = getInitial(username);
    }

    document.getElementById('profilePageName').textContent = username;

    // Bio
    const bioEl = document.getElementById('profilePageBio');
    if (profile?.bio) {
      bioEl.textContent = profile.bio;
      bioEl.style.display = 'block';
    } else {
      bioEl.textContent = isOwnProfile ? 'Click \u201cEdit bio\u201d to add a bio.' : 'This writer hasn\u2019t added a bio yet.';
      bioEl.style.display = 'block';
      bioEl.style.opacity = '0.6';
    }
    if (isOwnProfile) {
      document.getElementById('profilePageEditBioBtn').style.display = 'inline-flex';
    }

    // Follower count
    const { count: followersCount } = await _supabase
      .from('follows')
      .select('id', { count: 'exact', head: true })
      .eq('following_id', userId);
    document.getElementById('profilePageFollowers').textContent = followersCount || 0;

    // Update follow button state
    if (!isOwnProfile) {
      const isFollowing = followingSet.has(userId);
      followBtn.textContent = isFollowing ? 'Following' : 'Follow';
      followBtn.classList.toggle('following', isFollowing);
    }

    // Load posts
    const { data: posts, error: postsErr } = await _supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_draft', false)
      .order('created_at', { ascending: false });

    if (postsErr) throw postsErr;

    const totalLikes = (posts || []).reduce((s, p) => s + (p.claps || 0), 0);
    document.getElementById('profilePagePosts').textContent = posts?.length || 0;
    document.getElementById('profilePageLikes').textContent = totalLikes;
    document.getElementById('profilePagePostsMeta').textContent =
      `${posts?.length || 0} post${posts?.length !== 1 ? 's' : ''} published`;

    // Render post grid
    grid.innerHTML = '';
    if (!posts || !posts.length) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📝</div>
          <div class="empty-state-title">No posts yet</div>
          <div class="empty-state-sub">${isOwnProfile ? 'Start writing your first story!' : 'This writer hasn\'t published anything yet.'}</div>
          ${isOwnProfile ? '<button class="btn btn-primary" onclick="switchView(\'editor\')">Write Your First Blog</button>' : ''}
        </div>`;
    } else {
      posts.forEach(post => grid.appendChild(buildCard(post, 'feed')));
    }

    // Update URL hash without reload
    const slug = username.toLowerCase().replace(/\s+/g, '-');
    history.pushState(null, '', `#/u/${slug}`);

  } catch (e) {
    document.getElementById('profilePageName').textContent = 'Error loading profile';
    console.error('Profile load error:', e);
  }
}

function openAuthorProfileFromRead() {
  if (currentReadPost?.user_id) {
    openAuthorProfile(currentReadPost.user_id);
  }
}

function closeAuthorProfile() {
  // Clear URL hash
  history.pushState(null, '', window.location.pathname + window.location.search);
  switchView(prevView === 'profile' ? 'feed' : prevView);
}

async function toggleFollowFromProfile() {
  const btn = document.getElementById('profilePageFollowBtn');
  if (!currentProfileUserId || !btn) return;
  if (guestMode || !currentUser) {
    showGuestToast();
    return;
  }
  await toggleFollow(currentProfileUserId, btn);
  // Refresh follower count
  try {
    const { count } = await _supabase
      .from('follows')
      .select('id', { count: 'exact', head: true })
      .eq('following_id', currentProfileUserId);
    document.getElementById('profilePageFollowers').textContent = count || 0;
  } catch (e) {}
}

function startEditBio() {
  const bioEl = document.getElementById('profilePageBio');
  const editEl = document.getElementById('profilePageBioEdit');
  const editBtn = document.getElementById('profilePageEditBioBtn');
  const input = document.getElementById('profilePageBioInput');
  input.value = bioEl.textContent.includes('Edit bio') || bioEl.textContent.includes('hasn') ? '' : bioEl.textContent;
  bioEl.style.display = 'none';
  editBtn.style.display = 'none';
  editEl.style.display = 'block';
  input.focus();
}

async function saveProfileBio() {
  if (!currentUser) return;
  const bio = document.getElementById('profilePageBioInput').value.trim();
  try {
    const { error } = await _supabase
      .from('profiles')
      .upsert({ id: currentUser.id, bio }, { onConflict: 'id' });
    if (error) throw error;
    const bioEl = document.getElementById('profilePageBio');
    bioEl.textContent = bio || 'Click \u201cEdit bio\u201d to add a bio.';
    bioEl.style.opacity = bio ? '1' : '0.6';
    bioEl.style.display = 'block';
    document.getElementById('profilePageBioEdit').style.display = 'none';
    document.getElementById('profilePageEditBioBtn').style.display = 'inline-flex';
    showToast('✓', 'Bio saved!');
  } catch (e) {
    showToast('⚠️', 'Could not save bio. Make sure the bio column exists in your profiles table.');
    cancelEditBio();
  }
}

function cancelEditBio() {
  document.getElementById('profilePageBio').style.display = 'block';
  document.getElementById('profilePageBioEdit').style.display = 'none';
  document.getElementById('profilePageEditBioBtn').style.display = 'inline-flex';
}


// ═══ INIT APP ═════════════════════════════════════════════════
export function initApp() {

  // Load saved theme from localStorage
  (function () {
    const s = localStorage.getItem('tb_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', s);
    setTimeout(() => {
      document.getElementById('themeBtn').textContent = s === 'dark' ? '🌙' : '☀️';
    }, 50);
  })();

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 's') {
        e.preventDefault();
        triggerAutoSave();
        showToast('💾', 'Draft saved!');
      } else if (e.key === 'p') {
        e.preventDefault();
        showPreview();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        publishPost();
      }
    }
  });

  // Check if user is already logged in (existing session)
  (async () => {
    try {
      const { data: { session } } = await _supabase.auth.getSession();
      if (session?.user) showApp(session.user);
    } catch (e) {
      console.warn('Session check failed.');
    }
  })();

  // Listen for auth state changes (login/logout events)
  _supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session?.user) showApp(session.user);
    else if (event === 'SIGNED_OUT') showLogin();
  });

  // Check for post in URL query params
  setTimeout(async () => {
    const params = new URLSearchParams(window.location.search);
    const postSlug = params.get('post');
    if (postSlug) {
      try {
        const { data } = await _supabase.from('posts').select('*').eq('slug', postSlug).maybeSingle();
        if (data) {
          openRead(data);
        }
      } catch (e) { console.warn('Could not load shared post:', e); }
    }
  }, 1500);

  // Drag and drop image upload
  const zone = document.getElementById('imageZone');
  zone.addEventListener('dragover', e => {
    e.preventDefault();
    zone.style.borderColor = 'var(--accent)';
  });
  zone.addEventListener('dragleave', () => zone.style.borderColor = '');
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.style.borderColor = '';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload({ target: { files: [file] } });
    }
  });

  initVoiceTyping();
  initQuillEditor();

  // Expose all functions to window so HTML onclick handlers can call them
  Object.assign(window, {
    toggleTheme, generateSlug, onTitleChange, calcReadTime, getInitial,
    avatarColor, displayName, getDisplayName, handleAvatarUpload, updateAllAvatarDisplays,
    loadUserAvatar, getAvatarImgTag, switchView, readGoBack, countWords,
    updateWordGoal, scheduleAutoSave, triggerAutoSave, loadFeed, renderFeedGrid,
    setFilter, filterPosts, loadMyBlogs, buildCard, quickLike, burstEffect,
    deletePost, openRead, handleReadLike, loadSidebar, loadFollows, toggleFollow,
    switchTab, handleAuth, showAuthError, showAuthSuccess, hideAuthMessages,
    setAuthLoading, handleLogin, handleSignUp, handleSignOut, showApp, showLogin,
    publishPost, setPublishLoading, showPublishStatus, loadPostsCount, toggleCat,
    handleImageUpload, removeImage, toggleAIImage, generateLocalCaptions,
    suggestCaptions, renderCaptions, buildTitleSearchQueries,
    hashString, searchPexels, searchWikimedia, generateTitleCover, searchImagesMultiAPI,
    generateAIImage, showPreview, resetForm, showToast,
    initVoiceTyping, toggleVoice, startVoice, stopVoice,
    continueWithoutAccount, showGuestToast, showLoginFromToast,
    startEditUsername, saveUsername, cancelEditUsername,
    loadUsername, loadUsernames,
    toggleWriterSearch, searchWriters,
    showFollowersList, showFollowingList, closeFollowModal,
    toggleMobileNav, closeMobileNav,
    
    // New premium features
    incrementView,
    toggleBookmark, loadBookmarks, loadBookmarksView,
    loadComments, submitComment, deleteComment,
    createNotification, loadNotifications, markAllRead, toggleNotifPanel,
    computeBadges, renderBadges,
    toggleAnalyticsView, loadAnalytics,
    sharePost, closeShareModal, copyShareLink, shareToTwitter, shareToWhatsApp,
    openAuthorProfile, openAuthorProfileFromRead, closeAuthorProfile,
    toggleFollowFromProfile, startEditBio, saveProfileBio, cancelEditBio,
    initQuillEditor
  });
}