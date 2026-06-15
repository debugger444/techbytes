import { supabase as _supabase } from './supabaseClient';
import { rawIcon } from './icons.js';

// SVG icon shorthand helpers (used inline in template literals)
const SVG = {
  heart:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em" style="display:inline-block;vertical-align:middle"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  heartFill:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" style="display:inline-block;vertical-align:middle"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor"/></svg>`,
  bookmark: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em" style="display:inline-block;vertical-align:middle"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
  bookmarkFill:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" style="display:inline-block;vertical-align:middle"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill="currentColor"/></svg>`,
  eye:      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em" style="display:inline-block;vertical-align:middle"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  clock:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em" style="display:inline-block;vertical-align:middle"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  link:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em" style="display:inline-block;vertical-align:middle"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  warning:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em" style="display:inline-block;vertical-align:middle"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  check:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em" style="display:inline-block;vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg>`,
  error:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em" style="display:inline-block;vertical-align:middle"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  confetti: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em" style="display:inline-block;vertical-align:middle"><path d="M3 3v3m0 0l3-3M3 6h3M21 21v-3m0 3h-3m3 0l-3-3"/><path d="M5 19L19 5"/><circle cx="5" cy="19" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="5" r="1" fill="currentColor" stroke="none"/></svg>`,
  mic:      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em" style="display:inline-block;vertical-align:middle"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,
  stop:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" style="display:inline-block;vertical-align:middle"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="currentColor"/></svg>`,
  save:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em" style="display:inline-block;vertical-align:middle"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`,
  lock:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em" style="display:inline-block;vertical-align:middle"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  users:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="display:inline-block;vertical-align:middle"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  user:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="display:inline-block;vertical-align:middle"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  notifLike:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" style="display:inline-block;vertical-align:middle"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="#fc5c7d"/></svg>`,
  notifMsg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em" style="display:inline-block;vertical-align:middle"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  notifFollow:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em" style="display:inline-block;vertical-align:middle"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>`,
  notifBkm: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" style="display:inline-block;vertical-align:middle"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill="#7c5cfc"/></svg>`,
  pen:      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em" style="display:inline-block;vertical-align:middle"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>`,
  note:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="display:inline-block;vertical-align:middle"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  mailbox:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="display:inline-block;vertical-align:middle"><path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8"/><path d="M22 7l-10 5L2 7"/><path d="M16 19h6"/><path d="M19 16v6"/></svg>`,
  star:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" style="display:inline-block;vertical-align:middle"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  fire:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em" style="display:inline-block;vertical-align:middle"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
  crown:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em" style="display:inline-block;vertical-align:middle"><path d="M2 20h20"/><path d="M4 20L2 8l5 5 5-8 5 8 5-5-2 12"/></svg>`,
  books:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em" style="display:inline-block;vertical-align:middle"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  analytics:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em" style="display:inline-block;vertical-align:middle"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  wave:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em" style="display:inline-block;vertical-align:middle"><path d="M7 11c.33-2 2.67-2 3 0s2.67 2 3 0 2.67-2 3 0"/><path d="M3 15c.33-2 2.67-2 3 0s2.67 2 3 0 2.67-2 3 0 2.67-2 3 0"/></svg>`,
  palette:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em" style="display:inline-block;vertical-align:middle"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
  sparkle:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em" style="display:inline-block;vertical-align:middle"><path d="M12 3v1m0 16v1M3 12h1m16 0h1m-3.2-6.8-.7.7M6.9 17.1l-.7.7m0-11.4.7.7M17.1 17.1l.7.7"/><circle cx="12" cy="12" r="4"/></svg>`,
  refresh:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em" style="display:inline-block;vertical-align:middle"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`,
  reply:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em" style="display:inline-block;vertical-align:middle"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>`,
};


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
    interactedPosts = new Set(),   // posts the current user has read or liked
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
  document.getElementById('themeBtn').innerHTML = isDark
    ? SVG.sparkle.replace('width="1em" height="1em"', 'width="1.1em" height="1.1em"')
    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1.1em" height="1.1em" style="display:inline-block;vertical-align:middle"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
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
    showToast(SVG.check, 'Profile picture updated!');
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
    showToast(SVG.warning, 'Username must be at least 2 characters.');
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
    showToast(SVG.check, 'Username saved — visible to everyone!');
  } catch (e) {
    showToast(SVG.warning, 'Could not save: ' + e.message);
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
        <div class="empty-state-icon">${SVG.warning}</div>
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
        <div class="empty-state-icon">${SVG.mailbox}</div>
        <div class="empty-state-title">No posts found</div>
        <div class="empty-state-sub">Be the first to write something!</div>
        <button class="btn btn-primary" onclick="switchView('editor')">${SVG.pen} Write a Blog</button>
      </div>`;
    return;
  }

  // Separate interacted (read/liked) posts — they always sink to the bottom
  const freshPosts = posts.filter(p => !interactedPosts.has(p.id));
  const seenPosts  = posts.filter(p =>  interactedPosts.has(p.id));

  // Within fresh posts: followed authors first, then others
  // Each group sorted newest-first (latest post = top-left)
  const newestFirst = (a, b) => new Date(b.created_at) - new Date(a.created_at);
  const followedFresh = freshPosts.filter(p =>  followingSet.has(p.user_id)).sort(newestFirst);
  const otherFresh    = freshPosts.filter(p => !followingSet.has(p.user_id)).sort(newestFirst);

  // Liked/read posts sink to the bottom — also newest-first within that group
  const followedSeen  = seenPosts.filter(p =>  followingSet.has(p.user_id)).sort(newestFirst);
  const otherSeen     = seenPosts.filter(p => !followingSet.has(p.user_id)).sort(newestFirst);

  const sorted = [...followedFresh, ...otherFresh, ...followedSeen, ...otherSeen];
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
          <div class="empty-state-icon">${SVG.note}</div>
          <div class="empty-state-title">No blogs yet</div>
          <div class="empty-state-sub">Start writing your first blog!</div>
          <button class="btn btn-primary" onclick="switchView('editor')">${SVG.pen} Write Your First Blog</button>
        </div>`;
      return;
    }

    document.getElementById('myBlogsMeta').textContent =
      `${data.length} blog${data.length !== 1 ? 's' : ''} published`;
    data.forEach(post => grid.appendChild(buildCard(post, 'mine')));
  } catch (e) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">${SVG.warning}</div>
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
      : `<div class="blog-card-img-placeholder">${SVG.note}</div>`
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
            <div class="blog-card-meta">${SVG.clock} ${rt}</div>
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
        <span class="like-heart">${isLiked ? SVG.heartFill : SVG.heart}</span> <span class="like-num">${post.claps || 0}</span>
      </button>
      <button class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" data-id="${post.id}" onclick="toggleBookmark('${post.id}',this)" title="Bookmark post">
        ${SVG.bookmark}
      </button>
      <span class="view-badge">${SVG.eye} <span class="view-num">${post.views || 0}</span></span>
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
  burstEffect(btn, SVG.heartFill);
  const wasLiked = likedPosts.has(postId);

  // ── Optimistic UI update (instant feedback) ──────────────────
  const heartEl = btn.querySelector('.like-heart');
  const numEl   = btn.querySelector('.like-num');
  const curDisplayed = parseInt(numEl?.textContent || '0', 10);

  if (wasLiked) {
    likedPosts.delete(postId);
    btn.classList.remove('liked');
    if (heartEl) heartEl.innerHTML = SVG.heart;
    if (numEl)   numEl.textContent = Math.max(0, curDisplayed - 1);
  } else {
    likedPosts.add(postId);
    btn.classList.add('liked');
    if (heartEl) heartEl.innerHTML = SVG.heartFill;
    if (numEl)   numEl.textContent = curDisplayed + 1;
    // Mark as interacted — post sinks to the bottom on next render
    markInteracted(postId);
  }

  // ── Sync with DB (correct the real count) ───────────────────
  try {
    const { data } = await _supabase
      .from('posts')
      .select('claps, user_id, title')
      .eq('id', postId)
      .single();

    const cur    = data?.claps ?? curDisplayed;
    const newVal = wasLiked ? Math.max(0, cur - 1) : cur + 1;

    await _supabase.from('posts').update({ claps: newVal }).eq('id', postId);

    // Correct displayed count with authoritative server value
    if (numEl) numEl.textContent = newVal;

    // Keep allFeedPosts in sync so re-renders show the right count
    const idx = allFeedPosts.findIndex(p => p.id === postId);
    if (idx > -1) allFeedPosts[idx].claps = newVal;

    // Trigger notification to post author
    if (!wasLiked && data && data.user_id !== currentUser.id) {
      await createNotification(data.user_id, 'like', postId, data.title);
    }
  } catch (e) {
    // On error: revert the optimistic update
    if (wasLiked) {
      likedPosts.add(postId);
      btn.classList.add('liked');
      if (heartEl) heartEl.innerHTML = SVG.heartFill;
      if (numEl)   numEl.textContent = curDisplayed;
    } else {
      likedPosts.delete(postId);
      btn.classList.remove('liked');
      if (heartEl) heartEl.innerHTML = SVG.heart;
      if (numEl)   numEl.textContent = Math.max(0, curDisplayed);
    }
  }
}

function burstEffect(el, emoji) {
  const rect = el.getBoundingClientRect();
  const burst = document.createElement('div');
  burst.className = 'like-burst';
  burst.innerHTML = emoji;
  burst.style.left = (rect.left + rect.width / 2 - 12) + 'px';
  burst.style.top = (rect.top - 10) + 'px';
  document.body.appendChild(burst);
  setTimeout(() => burst.remove(), 650);
}


// ═══ DELETE POST ══════════════════════════════════════════════
async function deletePost(postId, btn) {
  if (!confirm('Delete this blog post? This cannot be undone.')) return;
  btn.disabled = true;
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em" style="display:inline-block;vertical-align:middle;animation:spin .7s linear infinite"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`;

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

    showToast(SVG.check, 'Blog deleted.');
    loadPostsCount();
  } catch (e) {
    btn.disabled = false;
    btn.textContent = 'delete';
    showToast(SVG.warning, 'Could not delete: ' + e.message);
    console.error('Delete error:', e);
  }
}


// ═══ READ VIEW ════════════════════════════════════════════════
function openRead(post) {
  currentReadPost = post;
  prevView = currentView;
  switchView('read');
  // Mark as interacted — this post sinks to the bottom of the feed grid
  markInteracted(post.id);

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
  document.getElementById('readAuthorMeta').innerHTML =
    new Date(post.created_at).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    }) + ' · ' + calcReadTime(post.body) + ' · ' + SVG.eye + ' ' + viewsCount + ' views';


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
  const bigHeartEl = bigBtn.querySelector('.like-heart');
  if (bigHeartEl) bigHeartEl.innerHTML = liked ? SVG.heartFill : SVG.heart;
  document.getElementById('bigLikeCount').textContent = post.claps || 0;
  document.getElementById('likeMsg').textContent = liked ? 'You liked this!' : 'Like this post!';

  // Bookmarks status in Read View
  const bookmarkBtn = document.getElementById('readBookmarkBtn');
  if (bookmarkBtn) {
    bookmarkBtn.setAttribute('data-id', post.id);
    const hasBookmarked = bookmarkedPosts.has(post.id);
    bookmarkBtn.classList.toggle('bookmarked', hasBookmarked);
    bookmarkBtn.innerHTML = hasBookmarked
      ? `${SVG.bookmarkFill} Bookmarked`
      : `${SVG.bookmark} Bookmark`;
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
  burstEffect(btn, SVG.heartFill);

  const wasLiked = likedPosts.has(currentReadPost.id);
  const heartEl = btn.querySelector('.like-heart');
  if (wasLiked) {
    likedPosts.delete(currentReadPost.id);
    btn.classList.remove('liked');
    if (heartEl) heartEl.innerHTML = SVG.heart;
    document.getElementById('likeMsg').textContent = 'Like this post!';
  } else {
    likedPosts.add(currentReadPost.id);
    btn.classList.add('liked');
    if (heartEl) heartEl.innerHTML = SVG.heartFill;
    document.getElementById('likeMsg').innerHTML = SVG.heartFill + ' Thanks for the like!';
    // Mark as interacted — post sinks to the bottom on return to feed
    markInteracted(currentReadPost.id);
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
    showToast(SVG.warning, 'Please sign in first.');
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
      showToast(SVG.check, 'Unfollowed.');
    } else {
      const { error } = await _supabase
        .from('follows')
        .insert([{ follower_id: currentUser.id, following_id: userId }]);
      if (error) throw error;
      showToast(SVG.check, 'Following!');
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
    showToast(SVG.warning, 'Could not update follow: ' + e.message);
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
      showToast(SVG.confetti, 'Account created! Welcome to TechBytes.');
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
  showToast(SVG.wave, 'Signed out.');
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
  document.getElementById('toastIcon').innerHTML = SVG.lock;
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

  // Load interacted posts from localStorage for this user
  loadInteractedPosts();

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
    showPublishStatus('error', 'Please add a title before publishing.');
    return;
  }
  if (!body) {
    showPublishStatus('error', 'Please write some content before publishing.');
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
      showPublishStatus('error', 'Failed: ' + (error.message || 'Unknown'));
      setPublishLoading(false);
      return;
    }

    setPublishLoading(false);
    showPublishStatus('success', 'Published! Your blog is live.');
    showToast(SVG.confetti, 'Blog published!');
    loadPostsCount();
  } catch (e) {
    setPublishLoading(false);
    showPublishStatus('error', 'Something went wrong.');
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

function handleImageZoneClick(e) {
  const zone = document.getElementById('imageZone');
  // If already has image, do nothing (remove button handles it)
  if (zone.classList.contains('has-image')) return;
  // If compact and not yet expanded, expand it first
  if (!zone.classList.contains('expanded')) {
    zone.classList.add('expanded');
    const textEl = zone.querySelector('.image-zone-text-sm');
    if (textEl) textEl.textContent = 'Click to browse or drag & drop';
    return;
  }
  // Already expanded — open file picker
  document.getElementById('fileInput').click();
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
  const zone = document.getElementById('imageZone');
  zone.classList.add('has-image');
  zone.classList.remove('expanded');
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
  document.getElementById('imagePlaceholder').style.display = '';
  const zone = document.getElementById('imageZone');
  zone.classList.remove('has-image');
  zone.classList.remove('expanded');
  const textEl = zone.querySelector('.image-zone-text-sm');
  if (textEl) textEl.textContent = 'Upload cover';
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
        showToast(SVG.palette, 'Cover generated from title!');
      };
      imgEl.src = coverUrl;
    } else {
      document.getElementById('loadingState').style.display = 'none';
      showToast(SVG.warning, 'Could not generate image. Please try again!');
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
  document.getElementById('previewReadTime').innerHTML = SVG.clock + ' ' + calcReadTime(body);


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
  showToast(SVG.eye, 'Preview ready!');
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
  showToast(SVG.check, 'Form cleared!');
}

function showToast(iconHtml, msg) {
  const toast = document.getElementById('toast');
  const iconEl = document.getElementById('toastIcon');
  // Support both HTML SVG strings and plain text chars
  if (iconHtml && (iconHtml.includes('<svg') || iconHtml.includes('<span'))) {
    iconEl.innerHTML = iconHtml;
  } else {
    iconEl.textContent = iconHtml || '';
  }
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
      showToast(SVG.warning, 'Microphone access denied. Please allow mic access.');
    } else if (event.error !== 'aborted') {
      showToast(SVG.warning, 'Voice error: ' + event.error);
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
      showToast(SVG.warning, 'Voice typing is not supported in this browser. Try Chrome.');
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
  showToast(SVG.mic, 'Voice typing started — speak now!');
}

function stopVoice() {
  isVoiceActive = false;
  try { voiceRecognition.stop(); } catch (e) {}
  document.getElementById('voiceBtn').classList.remove('recording');
  document.getElementById('voiceIndicator').classList.remove('show');
  showToast(SVG.stop, 'Voice typing stopped.');
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
      body.innerHTML = `<div class="follow-modal-empty"><div class="empty-icon">${SVG.users}</div>No followers yet.<br>Share your blogs to grow your audience!</div>`;
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
      body.innerHTML = `<div class="follow-modal-empty"><div class="empty-icon">${SVG.sparkle}</div>Not following anyone yet.<br>Discover writers using the search!</div>`;
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


// ═══ INTERACTED POSTS (read / liked → sink to bottom) ════════
function _interactedKey() {
  return 'tb_interacted_' + (currentUser?.id || 'guest');
}

function loadInteractedPosts() {
  interactedPosts.clear();
  try {
    const stored = localStorage.getItem(_interactedKey());
    if (stored) {
      JSON.parse(stored).forEach(id => interactedPosts.add(id));
    }
  } catch (e) {}
}

function markInteracted(postId) {
  if (!postId) return;
  if (interactedPosts.has(postId)) return; // already marked, no-op
  interactedPosts.add(postId);
  try {
    localStorage.setItem(_interactedKey(), JSON.stringify([...interactedPosts]));
  } catch (e) {}
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
    showToast(SVG.bookmark, 'Bookmark removed.');
  } else {
    bookmarkedPosts.add(postId);
    showToast(SVG.bookmarkFill, 'Post bookmarked!');
  }

  // Update visual status across all occurrences
  document.querySelectorAll(`.bookmark-btn[data-id="${postId}"]`).forEach(el => {
    const active = el.classList.toggle('bookmarked', !isBookmarked);
    if (el.id === 'readBookmarkBtn') {
      el.innerHTML = active
        ? `${SVG.bookmarkFill} Bookmarked`
        : `${SVG.bookmark} Bookmark`;
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
        el.innerHTML = active
          ? `${SVG.bookmarkFill} Bookmarked`
          : `${SVG.bookmark} Bookmark`;
      }
    });
    showToast(SVG.warning, 'Error syncing bookmark.');
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
          <div class="empty-state-icon">${SVG.bookmark}</div>
          <div class="empty-state-title">No bookmarks saved</div>
          <div class="empty-state-sub">Browse Home and save articles for later reading!</div>
          <button class="btn btn-primary" onclick="switchView('feed')">Go to Home</button>
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
    showToast(SVG.warning, 'Comment cannot be empty!');
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
    showToast(SVG.check, 'Comment posted!');
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
    showToast(SVG.warning, 'Could not post comment.');
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
    showToast(SVG.check, 'Comment deleted!');
    if (currentReadPost) loadComments(currentReadPost.id);
  } catch (e) {
    showToast(SVG.warning, 'Failed to delete comment.');
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
    showToast(SVG.check, 'All notifications marked as read.');
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
    badges.push({ icon: SVG.confetti,  name: 'First Post',      desc: 'Published your first post!' });
  }
  if (postsCount >= 5) {
    badges.push({ icon: SVG.pen,       name: 'Prolific Writer', desc: 'Published 5 or more posts!' });
  }
  if (totalLikes >= 1) {
    badges.push({ icon: SVG.heart,     name: 'Liked!',          desc: 'Received your first like!' });
  }
  if (totalLikes >= 10) {
    badges.push({ icon: SVG.fire,      name: 'Popular',         desc: 'Received 10 or more total claps!' });
  }
  if (followersCount >= 1) {
    badges.push({ icon: SVG.star,      name: 'Rising Star',     desc: 'Gained your first follower!' });
  }
  if (followersCount >= 5) {
    badges.push({ icon: SVG.crown,     name: 'Influencer',      desc: 'Gained 5 or more followers!' });
  }
  if (bookmarksCount >= 1) {
    badges.push({ icon: SVG.books,     name: 'Bookmarked!',     desc: 'Had your posts saved by others!' });
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
      btn.innerHTML = `${SVG.books} Show Blogs`;
      btn.classList.add('active');
    }
    loadAnalytics();
  } else {
    if (grid) grid.style.display = 'grid';
    if (analytics) analytics.style.display = 'none';
    if (btn) {
      btn.innerHTML = `${SVG.analytics} Analytics`;
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
        <div class="analytics-item-value">${SVG.eye} ${p.views || 0}</div>
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
    showToast(SVG.link, 'Share link copied to clipboard!');
    closeShareModal();
  }).catch(e => {
    showToast(SVG.warning, 'Failed to copy link.');
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
          <div class="empty-state-icon">${SVG.note}</div>
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
    showToast(SVG.check, 'Bio saved!');
  } catch (e) {
    showToast(SVG.warning, 'Could not save bio. Make sure the bio column exists in your profiles table.');
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
    const moonSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1.1em" height="1.1em"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
      document.getElementById('themeBtn').innerHTML = s === 'dark' ? moonSvg : SVG.sparkle;
    }, 50);
  })();

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 's') {
        e.preventDefault();
        triggerAutoSave();
        showToast(SVG.save, 'Draft saved!');
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