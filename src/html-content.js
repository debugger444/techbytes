import { rawIcon } from './icons.js';
export const bodyHTML = `
<!-- LOGIN -->
<div id="loginOverlay">
  <div class="login-card">
    <div class="login-logo">Tech<span>Bytes</span></div>
    <p class="login-tagline" id="authTagline">Sign in to continue writing your story.</p>
    <div class="auth-tabs">
      <button class="auth-tab active" id="tabSignIn" onclick="switchTab('signin')">Sign In</button>
      <button class="auth-tab" id="tabSignUp" onclick="switchTab('signup')">Create Account</button>
    </div>
    <div class="login-field"><label>Email address</label><input type="email" id="loginEmail" placeholder="you@example.com" autocomplete="email"></div>
    <div class="login-field"><label>Password</label><input type="password" id="loginPassword" placeholder="••••••••" onkeydown="if(event.key==='Enter')handleAuth()"></div>
    <div class="login-field" id="confirmField" style="display:none;"><label>Confirm Password</label><input type="password" id="loginConfirm" placeholder="••••••••" onkeydown="if(event.key==='Enter')handleAuth()"></div>
    <button class="login-btn" id="authBtn" onclick="handleAuth()"><span class="login-spinner" id="loginSpinner"></span><span id="authBtnText">Sign In</span></button>
    <div class="login-error" id="loginError"></div>
    <div class="login-success" id="loginSuccess"></div>
    <p class="login-divider" id="authFooter">Credentials verified against Supabase Auth</p>
    <button class="guest-btn" onclick="continueWithoutAccount()">Continue without account →</button>
  </div>
</div>

<!-- HIDDEN FILE INPUT FOR AVATAR -->
<input type="file" id="avatarFileInput" accept="image/*" style="display:none;" onchange="handleAvatarUpload(event)">

<header>
  <div id="readProgressBar" class="read-progress-bar" style="position:absolute;bottom:0;left:0;height:3px;background:linear-gradient(90deg,var(--accent),var(--accent2));width:0%;z-index:101;transition:width 0.1s ease;display:none;"></div>
  <div class="logo" onclick="switchView('feed');closeMobileNav();">Tech<span>Bytes</span></div>
  <div class="nav-tabs" id="navTabs">
    <button class="nav-tab active" id="navFeed" onclick="switchView('feed')">Home</button>
    <button class="nav-tab" id="navWrite" onclick="switchView('editor')">Write</button>
    <button class="nav-tab" id="navMyBlogs" onclick="switchView('myblogs')">My Blogs</button>
    <button class="nav-tab" id="navBookmarks" onclick="switchView('bookmarks')">Bookmarks</button>
  </div>
  <div class="header-right">
    <span class="autosave-tag" id="autosaveTag"><span class="svg-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="0.85em" height="0.85em"><polyline points="20 6 9 17 4 12"/></svg></span> Draft saved</span>
    <span class="user-pill" id="userPill" style="display:none;"><span class="user-pill-dot"></span><span id="userEmailLabel">user</span></span>

    <div class="notif-wrap" id="notifWrap" style="display:none;position:relative;">
      <button class="notif-btn" id="notifBtn" onclick="toggleNotifPanel()" title="Notifications" style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:.45rem .7rem;cursor:pointer;font-size:1rem;transition:all .2s;color:var(--text);position:relative;display:flex;align-items:center;justify-content:center;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1.1em" height="1.1em"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg><span class="notif-badge" id="notifBadge" style="display:none;position:absolute;top:-4px;right:-4px;background:var(--danger);color:#fff;border-radius:50%;width:16px;height:16px;font-size:.65rem;display:flex;align-items:center;justify-content:center;font-weight:700;">0</span>
      </button>
      <div class="notif-panel" id="notifPanel" style="display:none;position:absolute;right:0;top:45px;background:var(--surface);border:1px solid var(--border);border-radius:12px;width:320px;max-height:400px;overflow-y:auto;z-index:1000;box-shadow:0 10px 30px rgba(0,0,0,.5);animation:slideUp .2s ease;">
        <div class="notif-header" style="display:flex;align-items:center;justify-content:space-between;padding:.75rem 1rem;border-bottom:1px solid var(--border);font-size:.8rem;font-weight:600;color:var(--text);">
          <span>Notifications</span>
          <button class="notif-clear-btn" onclick="markAllRead()" style="background:none;border:none;color:var(--accent);cursor:pointer;font-size:.72rem;font-weight:500;">Mark all as read</button>
        </div>
        <div class="notif-list" id="notifList">
          <div style="padding:1.5rem;text-align:center;color:var(--muted);font-size:.85rem;">No notifications yet.</div>
        </div>
      </div>
    </div>

    <button class="btn-publish" id="headerPublishBtn" onclick="publishPost()">
      <span id="pubSpinH" style="display:none;width:13px;height:13px;border:2px solid rgba(0,0,0,.3);border-top-color:#000;border-radius:50%;animation:spin .7s linear infinite;"></span>Publish
    </button>
    <button class="theme-toggle" onclick="toggleTheme()" id="themeBtn" title="Toggle theme"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1.1em" height="1.1em"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></button>
    <button class="btn-signout" id="signoutBtn" style="display:none;" onclick="handleSignOut()">Sign out</button>
    <button class="hamburger" id="hamburgerBtn" onclick="toggleMobileNav()" aria-label="Open navigation">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>

<!-- MOBILE NAV OVERLAY -->
<nav class="mobile-nav" id="mobileNav">
  <button class="nav-tab active" id="mNavFeed" onclick="switchView('feed');closeMobileNav()"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em"><path d="M3 9.75L12 3l9 6.75V21a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.75z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> Home</button>
  <button class="nav-tab" id="mNavWrite" onclick="switchView('editor');closeMobileNav()"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg> Write</button>
  <button class="nav-tab" id="mNavMyBlogs" onclick="switchView('myblogs');closeMobileNav()"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> My Blogs</button>
  <button class="nav-tab" id="mNavBookmarks" onclick="switchView('bookmarks');closeMobileNav()"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg> Bookmarks</button>
  <div class="mobile-nav-divider"></div>
  <button class="nav-tab" onclick="toggleTheme();" style="color:var(--muted);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> Toggle Theme</button>
  <button class="nav-tab" id="mNavSignOut" style="display:none;color:var(--danger);border-color:rgba(252,92,125,.25);" onclick="handleSignOut();closeMobileNav()">Sign Out</button>
</nav>

<main>
  <!-- FEED -->
  <div id="feedView" style="display:none;">
    <div class="feed-layout">
      <div class="feed-main">
        <div class="feed-topbar">
          <div class="search-wrap">
            <span class="search-icon"></span>
            <input type="text" id="searchInput" placeholder="Search posts by title…" oninput="filterPosts()">
          </div>
        </div>
        <div class="filter-chips">
          <button class="filter-chip active" onclick="setFilter('All',this)">All</button>
          <button class="filter-chip" onclick="setFilter('Technology',this)">Technology</button>
          <button class="filter-chip" onclick="setFilter('Travel',this)">Travel</button>
          <button class="filter-chip" onclick="setFilter('Lifestyle',this)">Lifestyle</button>
          <button class="filter-chip" onclick="setFilter('Education',this)">Education</button>
          <button class="filter-chip" onclick="setFilter('Food',this)">Food</button>
          <button class="filter-chip" onclick="setFilter('Opinions',this)">Opinions</button>
          <button class="filter-chip" onclick="setFilter('Entertainment',this)">Entertainment</button>
        </div>
        <div id="feedGrid" class="blog-grid"></div>
      </div>
      <div class="sidebar">
        <div class="sidebar-card" id="profileCard" style="display:none;">
          <div class="sidebar-title">Your Profile</div>
          <div class="profile-avatar-wrap" onclick="document.getElementById('avatarFileInput').click()" title="Click to change profile picture">
            <div class="profile-avatar" id="profileAvatarEl"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="60%" height="60%" style="opacity:.6"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
            <div class="profile-avatar-edit"></div>
          </div>
          <div class="avatar-action-btns">
            <button class="avatar-btn-upload" onclick="event.stopPropagation(); document.getElementById('avatarFileInput').click()" title="Upload a profile photo">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="0.8em" height="0.8em"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Upload
            </button>
            <button class="avatar-btn-remove" id="avatarRemoveBtn" onclick="event.stopPropagation(); removeAvatar();" title="Remove profile photo" style="display:none;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="0.8em" height="0.8em"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              Remove
            </button>
          </div>
          <div class="profile-name-row">
            <div class="profile-name" id="profileName">Writer</div>
            <button class="edit-username-btn" id="editUsernameBtn" onclick="startEditUsername()" title="Edit username">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
            </button>
          </div>
          <div class="edit-username-inline" id="editUsernameInline" style="display:none;">
            <input type="text" id="usernameInput" placeholder="Choose a username…" maxlength="30" onkeydown="if(event.key==='Enter')saveUsername()">
            <div class="edit-username-actions">
              <button class="edit-username-save" onclick="saveUsername()">Save</button>
              <button class="edit-username-cancel" onclick="cancelEditUsername()">Cancel</button>
            </div>
          </div>
          <div class="profile-email" id="profileEmailSidebar"></div>
          <div class="profile-stats four-col">
            <div class="stat-box"><div class="stat-num" id="statPosts">0</div><div class="stat-label">Posts</div></div>
            <div class="stat-box"><div class="stat-num" id="statLikes">0</div><div class="stat-label">Likes</div></div>
            <div class="stat-box clickable" onclick="showFollowersList()"><div class="stat-num" id="statFollowersCount">0</div><div class="stat-label">Followers</div></div>
            <div class="stat-box clickable" onclick="showFollowingList()"><div class="stat-num" id="statFollowingCount">0</div><div class="stat-label">Following</div></div>
          </div>
          <div class="badge-header" style="font-size:.72rem;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);margin-top:1.25rem;font-weight:600;margin-bottom:.5rem;">Achievements</div>
          <div class="badge-row" id="badgeRow" style="display:flex;flex-wrap:wrap;gap:.35rem;">
            <div style="font-size:.78rem;color:var(--muted);padding-top:.25rem;">No badges earned yet. Keep active!</div>
          </div>
        </div>
        <div class="sidebar-card">
          <div class="discover-header">
            <div class="sidebar-title" style="margin-bottom:0;">Discover Writers</div>
            <button class="writer-search-icon" onclick="toggleWriterSearch()" title="Search writers">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
          </div>
          <div class="writer-search-wrap" id="writerSearchWrap" style="display:none;">
            <input type="text" id="writerSearchInput" placeholder="Search by username…" oninput="searchWriters(this.value)" autocomplete="off">
          </div>
          <div class="follow-list" id="followList"><div style="font-size:.82rem;color:var(--muted);">Use the search icon to find writers.</div></div>
        </div>
        <div class="sidebar-card">
          <div class="sidebar-title">Trending Tags</div>
          <div class="trending-list" id="trendingList"><div style="font-size:.82rem;color:var(--muted);">Loading…</div></div>
        </div>
      </div>
    </div>
  </div>

  <!-- EDITOR -->
  <div id="editorView" style="display:none;">
    <div class="editor-wrap">
      <div class="hero-label">AI-Powered Blogging</div>
      <h1 class="page-title">Share your <span class="gradient-word">experience</span><br>with the world.</h1>
      <p class="subtitle">Write your story, let AI suggest the perfect caption and generate a visual.</p>
      <p class="shortcuts-hint"><kbd>Ctrl</kbd>+<kbd>S</kbd> save &nbsp;|&nbsp; <kbd>Ctrl</kbd>+<kbd>P</kbd> preview &nbsp;|&nbsp; <kbd>Ctrl</kbd>+<kbd>Enter</kbd> publish</p>
      <div class="editor-card">
        <div class="field-group">
          <div class="field-label">Blog Title</div>
          <input type="text" id="titleInput" placeholder="Give your story a title…" maxlength="120" oninput="onTitleChange()">

        </div>
        <div class="field-group">
          <div class="field-label">Category</div>
          <div class="category-row">
            <button class="cat-chip" onclick="toggleCat(this)">Technology</button>
            <button class="cat-chip" onclick="toggleCat(this)">Travel</button>
            <button class="cat-chip" onclick="toggleCat(this)">Lifestyle</button>
            <button class="cat-chip" onclick="toggleCat(this)">Education</button>
            <button class="cat-chip" onclick="toggleCat(this)">Food</button>
            <button class="cat-chip" onclick="toggleCat(this)">Opinions</button>
            <button class="cat-chip" onclick="toggleCat(this)">Entertainment</button>
          </div>
        </div>
        <div class="field-group">
          <div class="field-label"><span>Your Blog</span><span style="display:flex;align-items:center;gap:.6rem;"><button class="voice-btn" id="voiceBtn" onclick="toggleVoice()" title="Voice typing"><span class="mic-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg></span><span>Voice</span><span class="mic-dot"></span></button><span class="char-count" id="charCount">0 words</span></span></div>
          <div class="word-goal-row">
            <span class="wg-label">Goal:</span>
            <select class="wg-select" id="wordGoalSelect" onchange="updateWordGoal()">
              <option value="0">None</option><option value="300">300w</option>
              <option value="500" selected>500w</option><option value="800">800w</option><option value="1200">1200w</option>
            </select>
            <div class="wg-bar-wrap"><div class="wg-bar" id="wgBar"></div></div>
            <span class="wg-label" id="wgStatus"></span>
          </div>
          <!-- Quill Rich Text Editor -->
          <div id="quillToolbar" class="quill-toolbar-wrap">
            <span class="ql-formats">
              <select class="ql-header">
                <option value="1">Heading 1</option>
                <option value="2">Heading 2</option>
                <option value="3">Heading 3</option>
                <option value="">Normal</option>
              </select>
            </span>
            <span class="ql-formats">
              <button class="ql-bold" title="Bold"></button>
              <button class="ql-italic" title="Italic"></button>
              <button class="ql-underline" title="Underline"></button>
              <button class="ql-strike" title="Strikethrough"></button>
            </span>
            <span class="ql-formats">
              <button class="ql-blockquote" title="Blockquote"></button>
              <button class="ql-code-block" title="Code Block"></button>
            </span>
            <span class="ql-formats">
              <button class="ql-list" value="ordered" title="Numbered List"></button>
              <button class="ql-list" value="bullet" title="Bullet List"></button>
            </span>
            <span class="ql-formats">
              <button class="ql-link" title="Insert Link"></button>
              <button class="ql-image" title="Insert Image"></button>
            </span>
            <span class="ql-formats">
              <button class="ql-clean" title="Clear Formatting"></button>
            </span>
          </div>
          <div id="quillEditor" class="quill-editor-wrap"></div>
          <!-- Hidden textarea synced from Quill — all existing save/publish code reads this -->
          <textarea id="blogBody" style="display:none;"></textarea>
          <div class="voice-indicator" id="voiceIndicator"><span class="pulse-ring"></span><span>Listening… speak now</span></div>
        </div>
        <div class="cover-caption-row">
          <div class="field-group cover-field-group">
            <div class="field-label">Cover Image</div>
            <div class="image-zone image-zone-compact" id="imageZone" onclick="handleImageZoneClick(event)">
              <div class="image-zone-inner" id="imagePlaceholder">
                <div class="image-zone-icon-sm"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="1.4rem" height="1.4rem"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
                <div class="image-zone-text-sm">Upload cover</div>
              </div>
              <img id="uploadedImg" style="display:none;" alt="Cover">
            </div>
            <input type="file" id="fileInput" accept="image/*" onchange="handleImageUpload(event)">
            <div class="image-actions" id="imageActions" style="display:none;">
              <button onclick="removeImage()"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="0.9em" height="0.9em" style="display:inline-block;vertical-align:middle;margin-right:.3em"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>Remove</button>
              <button class="active" id="aiImgToggle" onclick="toggleAIImage()"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="0.9em" height="0.9em" style="display:inline-block;vertical-align:middle;margin-right:.3em"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>Use AI Image</button>
            </div>
          </div>
          <div class="field-group caption-field-group">
            <div class="field-label">Caption / Tagline</div>
            <input type="text" id="captionInput" placeholder="Your caption will appear here…" maxlength="200">
          </div>
        </div>
        <div class="ai-panel">
          <div class="ai-panel-title"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="0.9em" height="0.9em" style="display:inline-block;vertical-align:middle;margin-right:.35em"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>Suggestions</div>
          <div class="ai-btn-row">
            <button id="suggestBtn" onclick="suggestCaptions()"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="0.9em" height="0.9em" style="display:inline-block;vertical-align:middle;margin-right:.35em"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>Suggest Captions</button>
            <button id="genImgBtn" onclick="generateAIImage()"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="0.9em" height="0.9em" style="display:inline-block;vertical-align:middle;margin-right:.35em"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>Generate AI Image</button>
          </div>
          <div id="loadingState" style="display:none;">
            <div class="loading-bar"><div class="loading-bar-inner"></div></div>
            <div class="skeleton" style="width:90%"></div><div class="skeleton" style="width:75%"></div><div class="skeleton" style="width:85%"></div>
          </div>
          <div class="caption-chips" id="captionChips"></div>
          <div id="genImageArea" style="display:none;">
            <div class="gen-image-wrap">
              <img id="aiGenImg" src="" alt="AI Generated">
              <div class="gen-image-label">✦ AI Matched</div>
              <div class="gen-keyword-badge" id="keywordBadge"></div>
              <button class="regen-btn" onclick="generateAIImage()">↻ New image</button>
            </div>
          </div>
        </div>
        <div class="actions-bar">
          <button class="btn btn-ghost" onclick="resetForm()"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="0.9em" height="0.9em" style="display:inline-block;vertical-align:middle;margin-right:.35em"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Clear</button>
          <button class="btn btn-gold" onclick="showPreview()" style="flex:1;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="0.9em" height="0.9em" style="display:inline-block;vertical-align:middle;margin-right:.35em"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>Preview</button>
          <button class="btn-publish" id="bottomPublishBtn" onclick="publishPost()" style="display:flex;">
            <span id="pubSpinB" style="display:none;width:13px;height:13px;border:2px solid rgba(0,0,0,.3);border-top-color:#000;border-radius:50%;animation:spin .7s linear infinite;"></span>Publish
          </button>
        </div>
        <div class="publish-status" id="publishStatus"></div>
      </div>
      <div class="preview-section" id="previewSection">
        <div class="preview-header">
          <span class="preview-tag-label" id="previewCategory">Blog Preview</span>
          <div class="preview-meta-row"><span id="previewDate"></span><span id="previewReadTime"></span></div>
        </div>
        <div class="preview-body">
          <img id="previewImage" class="preview-image" src="" alt="" style="display:none;">
          <h2 class="preview-title" id="previewTitle">Untitled Blog</h2>
          <p class="preview-caption" id="previewCaption"></p>

          <p class="preview-text" id="previewText"></p>
        </div>
      </div>
    </div>
  </div>

  <!-- MY BLOGS -->
  <div id="myblogsView" style="display:none;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem;">
      <div>
        <div style="font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:900;">My <span style="background:linear-gradient(135deg,var(--accent),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Blogs</span></div>
        <div style="color:var(--muted);font-size:.88rem;margin-top:.2rem;" id="myBlogsMeta">Loading…</div>
      </div>
      <div style="display:flex;gap:.5rem;">
        <button class="btn btn-ghost" id="toggleAnalyticsBtn" onclick="toggleAnalyticsView()"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="0.9em" height="0.9em" style="display:inline-block;vertical-align:middle;margin-right:.35em"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>Analytics</button>
        <button class="btn btn-primary" onclick="switchView('editor')"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="0.9em" height="0.9em" style="display:inline-block;vertical-align:middle;margin-right:.35em"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>Write New</button>
      </div>
    </div>
    <div id="myBlogsGrid" class="blog-grid"></div>
    <div id="myBlogsAnalytics" style="display:none;" class="analytics-container">
      <div class="analytics-summary-cards" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem;margin-bottom:1.5rem;">
        <div class="analytics-card" style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1rem;text-align:center;">
          <div class="analytics-card-title" style="font-size:.68rem;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);margin-bottom:.35rem;">TOTAL VIEWS</div>
          <div class="analytics-card-num" id="analyticsTotalViews" style="font-size:1.6rem;font-weight:700;color:var(--accent);">0</div>
        </div>
        <div class="analytics-card" style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1rem;text-align:center;">
          <div class="analytics-card-title" style="font-size:.68rem;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);margin-bottom:.35rem;">TOTAL LIKES</div>
          <div class="analytics-card-num" id="analyticsTotalLikes" style="font-size:1.6rem;font-weight:700;color:var(--accent2);">0</div>
        </div>
        <div class="analytics-card" style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1rem;text-align:center;">
          <div class="analytics-card-title" style="font-size:.68rem;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);margin-bottom:.35rem;">AVG. READ TIME</div>
          <div class="analytics-card-num" id="analyticsAvgReadTime" style="font-size:1.6rem;font-weight:700;color:var(--gold);">0 min</div>
        </div>
      </div>

      <div class="analytics-charts-row" style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;align-items:start;">
        <div class="analytics-chart-box" style="background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:1.25rem;">
          <h3 style="font-size:.9rem;font-weight:600;margin-bottom:1rem;color:var(--text);">Top Posts by Views</h3>
          <div class="analytics-top-list" id="analyticsTopViewsList" style="display:flex;flex-direction:column;gap:.75rem;">
            <div style="color:var(--muted);font-size:.85rem;padding:1rem 0;">No views recorded yet.</div>
          </div>
        </div>
        <div class="analytics-chart-box" style="background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:1.25rem;">
          <h3 style="font-size:.9rem;font-weight:600;margin-bottom:1rem;color:var(--text);">Category Distribution</h3>
          <div class="analytics-top-list" id="analyticsCategoriesList" style="display:flex;flex-direction:column;gap:.75rem;">
            <div style="color:var(--muted);font-size:.85rem;padding:1rem 0;">Publish posts to see category distribution.</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- BOOKMARKS -->
  <div id="bookmarksView" style="display:none;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;">
      <div>
        <div style="font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:900;">My <span style="background:linear-gradient(135deg,var(--accent),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Bookmarks</span></div>
        <div style="color:var(--muted);font-size:.88rem;margin-top:.2rem;" id="bookmarksMeta">0 saved posts</div>
      </div>
    </div>
    <div id="bookmarksGrid" class="blog-grid"></div>
  </div>

  <!-- READ VIEW -->
  <div id="readView" style="display:none;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;">
      <button class="read-back-btn" onclick="readGoBack()">← Back</button>
      <button class="bookmark-btn" id="readBookmarkBtn" onclick="toggleBookmark(currentReadPost?.id, this)" title="Bookmark post" style="background:none;border:1px solid var(--border);border-radius:8px;padding:.4rem .8rem;cursor:pointer;color:var(--muted);transition:all .2s;font-family:'DM Sans',sans-serif;font-size:.8rem;font-weight:500;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="0.9em" height="0.9em" style="display:inline-block;vertical-align:middle;margin-right:.3em"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>Bookmark</button>
    </div>
    <div class="read-article">
      <img id="readCover" class="read-cover" src="" alt="" style="display:none;">
      <div class="read-body">
        <div class="read-category-label" id="readCategory"></div>
        <h1 class="read-title" id="readTitle"></h1>
        <div class="read-author-row">
          <div class="read-author-avatar" id="readAuthorAvatar"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="55%" height="55%"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
          <div class="read-author-info">
            <button class="read-author-name author-name-link" id="readAuthorName" onclick="openAuthorProfileFromRead()" title="View author profile">Author</button>
            <span class="read-author-meta" id="readAuthorMeta"></span>
          </div>
        </div>

        <p class="read-caption" id="readCaption" style="display:none;"></p>
        <div class="read-divider"></div>
        <div class="read-content ql-display" id="readContent"></div>
      </div>
      <div class="read-like-section" style="display:flex;align-items:center;gap:1rem;margin-top:2rem;padding-top:1.5rem;border-top:1px solid var(--border);flex-wrap:wrap;">
        <button class="big-like-btn" id="bigLikeBtn" onclick="handleReadLike()">
          <span class="like-heart"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1.1em" height="1.1em" style="display:inline-block;vertical-align:middle"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></span> <span class="lc" id="bigLikeCount">0</span>
        </button>
        <button class="share-btn" onclick="sharePost()" style="background:var(--surface2);border:1px solid var(--border);border-radius:100px;padding:.55rem 1.25rem;font-size:.9rem;font-weight:600;color:var(--text);cursor:pointer;display:flex;align-items:center;gap:.35rem;transition:all .2s;font-family:'DM Sans',sans-serif;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> Share
        </button>
        <span class="like-msg" id="likeMsg">Like this post!</span>
      </div>

      <div class="read-divider"></div>
      <div class="comments-section" style="margin-top:2.5rem;">
        <h3 style="font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:700;margin-bottom:1.25rem;color:var(--text);">Discussion (<span id="commentsCount">0</span>)</h3>
        <div class="comment-input-area" id="commentInputArea" style="display:none;margin-bottom:1.5rem;">
          <textarea id="commentBody" placeholder="Add a comment…" style="width:100%;height:100px;background:var(--surface2);border:1px solid var(--border);border-radius:12px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:.9rem;padding:.75rem 1rem;resize:none;outline:none;transition:border-color .2s;margin-bottom:.75rem;"></textarea>
          <button class="btn btn-primary" onclick="submitComment()">Submit Comment</button>
        </div>
        <div class="guest-comment-prompt" id="guestCommentPrompt" style="display:block;background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:1rem;font-size:.85rem;color:var(--muted);margin-bottom:1.5rem;text-align:center;">
          Please sign in to join the discussion.
        </div>
        <div class="comments-list" id="commentsList" style="display:flex;flex-direction:column;gap:1rem;">
          <div style="font-size:.85rem;color:var(--muted);padding:1rem 0;">No comments yet. Be the first to share your thoughts!</div>
        </div>
      </div>
    </div>
  </div>

  <!-- AUTHOR PROFILE PAGE -->
  <div id="profileView" style="display:none;" class="profile-page-wrap">
    <button class="read-back-btn" onclick="closeAuthorProfile()">← Back</button>
    <div class="profile-page-hero">
      <div class="profile-page-avatar-wrap">
        <div class="profile-page-avatar" id="profilePageAvatar"></div>
      </div>
      <div class="profile-page-info">
        <h1 class="profile-page-name" id="profilePageName"></h1>
        <div class="profile-page-email" id="profilePageEmail"></div>
        <div class="profile-page-bio-wrap" id="profilePageBioWrap">
          <p class="profile-page-bio" id="profilePageBio"></p>
          <button class="profile-page-edit-bio-btn" id="profilePageEditBioBtn" onclick="startEditBio()" style="display:none;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="0.85em" height="0.85em" style="display:inline-block;vertical-align:middle;margin-right:.3em"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>Edit bio</button>
          <div id="profilePageBioEdit" style="display:none;margin-top:.75rem;">
            <textarea id="profilePageBioInput" placeholder="Write a short bio about yourself…" maxlength="200" style="width:100%;min-height:80px;background:var(--surface2);border:1px solid var(--accent);border-radius:10px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:.88rem;padding:.65rem .9rem;resize:none;outline:none;"></textarea>
            <div style="display:flex;gap:.5rem;margin-top:.5rem;">
              <button class="edit-username-save" onclick="saveProfileBio()">Save Bio</button>
              <button class="edit-username-cancel" onclick="cancelEditBio()">Cancel</button>
            </div>
          </div>
        </div>
        <div class="profile-page-stats">
          <div class="profile-page-stat">
            <div class="stat-num" id="profilePagePosts">0</div>
            <div class="stat-label">Posts</div>
          </div>
          <div class="profile-page-stat">
            <div class="stat-num" id="profilePageFollowers">0</div>
            <div class="stat-label">Followers</div>
          </div>
          <div class="profile-page-stat">
            <div class="stat-num" id="profilePageLikes">0</div>
            <div class="stat-label">Likes</div>
          </div>
        </div>
        <button class="btn-follow profile-page-follow-btn" id="profilePageFollowBtn" onclick="toggleFollowFromProfile()">Follow</button>
      </div>
    </div>
    <div class="profile-page-posts-header">
      <div style="font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:700;">Published <span style="background:linear-gradient(135deg,var(--accent),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Stories</span></div>
      <div style="font-size:.82rem;color:var(--muted);" id="profilePagePostsMeta"></div>
    </div>
    <div id="profilePageGrid" class="blog-grid"></div>
  </div>
</main>

<div class="follow-modal-overlay" id="followModal" onclick="if(event.target===this)closeFollowModal()">
  <div class="follow-modal-card">
    <div class="follow-modal-header">
      <div class="follow-modal-title" id="followModalTitle">Followers</div>
      <button class="follow-modal-close" onclick="closeFollowModal()"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="follow-modal-body" id="followModalBody">
      <div style="font-size:.85rem;color:var(--muted);text-align:center;padding:2rem;">Loading…</div>
    </div>
  </div>
</div>

<div class="share-modal-overlay" id="shareModal" onclick="if(event.target===this)closeShareModal()" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.7);z-index:9999;align-items:center;justify-content:center;backdrop-filter:blur(4px);">
  <div class="share-modal-card" style="background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:1.5rem;width:90%;max-width:360px;box-shadow:0 20px 50px rgba(0,0,0,.6);animation:slideUp .3s ease;">
    <div class="share-modal-header" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem;">
      <div class="share-modal-title" style="font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:var(--text);">Share this blog</div>
      <button class="share-modal-close" onclick="closeShareModal()" style="background:none;border:none;color:var(--muted);font-size:1.1rem;cursor:pointer;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="share-modal-body" style="display:flex;flex-direction:column;gap:.75rem;">
      <button class="share-option-btn" onclick="copyShareLink()" style="width:100%;padding:.75rem 1rem;background:var(--surface2);border:1px solid var(--border);border-radius:10px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:.88rem;font-weight:500;cursor:pointer;text-align:left;display:flex;align-items:center;gap:.5rem;transition:all .2s;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> Copy Link</button>
      <button class="share-option-btn" onclick="shareToTwitter()" style="width:100%;padding:.75rem 1rem;background:var(--surface2);border:1px solid var(--border);border-radius:10px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:.88rem;font-weight:500;cursor:pointer;text-align:left;display:flex;align-items:center;gap:.5rem;transition:all .2s;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> Share on X (Twitter)</button>
      <button class="share-option-btn" onclick="shareToWhatsApp()" style="width:100%;padding:.75rem 1rem;background:var(--surface2);border:1px solid var(--border);border-radius:10px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:.88rem;font-weight:500;cursor:pointer;text-align:left;display:flex;align-items:center;gap:.5rem;transition:all .2s;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg> Share on WhatsApp</button>
    </div>
  </div>
</div>

<div class="toast" id="toast"><span class="toast-icon" id="toastIcon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em"><polyline points="20 6 9 17 4 12"/></svg></span><span id="toastMsg">Done!</span><button class="toast-signin-btn" id="toastSignInBtn" style="display:none;" onclick="showLoginFromToast()">Sign In</button></div>
`;