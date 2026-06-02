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
    <button class="nav-tab active" id="navFeed" onclick="switchView('feed')">Feed</button>
    <button class="nav-tab" id="navWrite" onclick="switchView('editor')">Write</button>
    <button class="nav-tab" id="navMyBlogs" onclick="switchView('myblogs')">My Blogs</button>
    <button class="nav-tab" id="navBookmarks" onclick="switchView('bookmarks')">Bookmarks</button>
  </div>
  <div class="header-right">
    <span class="autosave-tag" id="autosaveTag">✓ Draft saved</span>
    <span class="user-pill" id="userPill" style="display:none;"><span class="user-pill-dot"></span><span id="userEmailLabel">user</span></span>

    <div class="notif-wrap" id="notifWrap" style="display:none;position:relative;">
      <button class="notif-btn" id="notifBtn" onclick="toggleNotifPanel()" title="Notifications" style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:.45rem .7rem;cursor:pointer;font-size:1rem;transition:all .2s;color:var(--text);position:relative;display:flex;align-items:center;justify-content:center;">
        🔔<span class="notif-badge" id="notifBadge" style="display:none;position:absolute;top:-4px;right:-4px;background:var(--danger);color:#fff;border-radius:50%;width:16px;height:16px;font-size:.65rem;display:flex;align-items:center;justify-content:center;font-weight:700;">0</span>
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
    <button class="theme-toggle" onclick="toggleTheme()" id="themeBtn">🌙</button>
    <button class="btn-signout" id="signoutBtn" style="display:none;" onclick="handleSignOut()">Sign out</button>
    <button class="hamburger" id="hamburgerBtn" onclick="toggleMobileNav()" aria-label="Open navigation">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>

<!-- MOBILE NAV OVERLAY -->
<nav class="mobile-nav" id="mobileNav">
  <button class="nav-tab active" id="mNavFeed" onclick="switchView('feed');closeMobileNav()">🏠 Feed</button>
  <button class="nav-tab" id="mNavWrite" onclick="switchView('editor');closeMobileNav()">✍️ Write</button>
  <button class="nav-tab" id="mNavMyBlogs" onclick="switchView('myblogs');closeMobileNav()">📚 My Blogs</button>
  <button class="nav-tab" id="mNavBookmarks" onclick="switchView('bookmarks');closeMobileNav()">🔖 Bookmarks</button>
  <div class="mobile-nav-divider"></div>
  <button class="nav-tab" onclick="toggleTheme();" style="color:var(--muted);">🌙 Toggle Theme</button>
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
            <div class="profile-avatar" id="profileAvatarEl">😊</div>
            <div class="profile-avatar-edit"></div>
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
          <div class="slug-row"><span class="slug-prefix">techbytes.com/blog/</span><span class="slug-value" id="slugDisplay">your-blog-title</span></div>
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
          <div class="field-label"><span>Your Blog</span><span style="display:flex;align-items:center;gap:.6rem;"><button class="voice-btn" id="voiceBtn" onclick="toggleVoice()" title="Voice typing"><span class="mic-icon">🎙️</span><span>Voice</span><span class="mic-dot"></span></button><span class="char-count" id="charCount">0 words</span></span></div>
          <div class="word-goal-row">
            <span class="wg-label">Goal:</span>
            <select class="wg-select" id="wordGoalSelect" onchange="updateWordGoal()">
              <option value="0">None</option><option value="300">300w</option>
              <option value="500" selected>500w</option><option value="800">800w</option><option value="1200">1200w</option>
            </select>
            <div class="wg-bar-wrap"><div class="wg-bar" id="wgBar"></div></div>
            <span class="wg-label" id="wgStatus"></span>
          </div>
          <textarea id="blogBody" class="blog-body" placeholder="Start writing…" oninput="countWords()"></textarea>
          <div class="voice-indicator" id="voiceIndicator"><span class="pulse-ring"></span><span>Listening… speak now</span></div>
        </div>
        <div class="field-group">
          <div class="field-label">Cover Image</div>
          <div class="image-zone" id="imageZone" onclick="document.getElementById('fileInput').click()">
            <div class="image-zone-inner" id="imagePlaceholder">
              <div class="image-zone-icon">🖼️</div>
              <div class="image-zone-text"><strong>Upload your photo</strong>Click to browse or drag & drop</div>
            </div>
            <img id="uploadedImg" style="display:none;" alt="Cover">
          </div>
          <input type="file" id="fileInput" accept="image/*" onchange="handleImageUpload(event)">
          <div class="image-actions" id="imageActions" style="display:none;">
            <button onclick="removeImage()">delete Remove</button>
            <button class="active" id="aiImgToggle" onclick="toggleAIImage()">✦ Use AI Image</button>
          </div>
        </div>
        <div class="field-group">
          <div class="field-label">Caption / Tagline</div>
          <input type="text" id="captionInput" placeholder="Your caption will appear here…" maxlength="200">
        </div>
        <div class="ai-panel">
          <div class="ai-panel-title"> Suggestions</div>
          <div class="ai-btn-row">
            <button id="suggestBtn" onclick="suggestCaptions()">✦ Suggest Captions</button>
            <button id="genImgBtn" onclick="generateAIImage()">Generate AI Image</button>
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
          <button class="btn btn-ghost" onclick="resetForm()">✕ Clear</button>
          <button class="btn btn-gold" onclick="showPreview()" style="flex:1;">👁 Preview</button>
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
          <div class="preview-slug-line" id="previewSlug"></div>
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
        <button class="btn btn-ghost" id="toggleAnalyticsBtn" onclick="toggleAnalyticsView()">📈 Analytics</button>
        <button class="btn btn-primary" onclick="switchView('editor')">✍️ Write New</button>
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
      <button class="bookmark-btn" id="readBookmarkBtn" onclick="toggleBookmark(currentReadPost?.id, this)" title="Bookmark post" style="background:none;border:1px solid var(--border);border-radius:8px;padding:.4rem .8rem;cursor:pointer;color:var(--muted);transition:all .2s;font-family:'DM Sans',sans-serif;font-size:.8rem;font-weight:500;">🔖 Bookmark</button>
    </div>
    <div class="read-article">
      <img id="readCover" class="read-cover" src="" alt="" style="display:none;">
      <div class="read-body">
        <div class="read-category-label" id="readCategory"></div>
        <h1 class="read-title" id="readTitle"></h1>
        <div class="read-author-row">
          <div class="read-author-avatar" id="readAuthorAvatar">✍</div>
          <div class="read-author-info">
            <span class="read-author-name" id="readAuthorName">Author</span>
            <span class="read-author-meta" id="readAuthorMeta"></span>
          </div>
        </div>
        <div class="read-slug-line" id="readSlug"></div>
        <p class="read-caption" id="readCaption" style="display:none;"></p>
        <div class="read-divider"></div>
        <div class="read-content" id="readContent"></div>
      </div>
      <div class="read-like-section" style="display:flex;align-items:center;gap:1rem;margin-top:2rem;padding-top:1.5rem;border-top:1px solid var(--border);flex-wrap:wrap;">
        <button class="big-like-btn" id="bigLikeBtn" onclick="handleReadLike()">
          ❤️ <span class="lc" id="bigLikeCount">0</span>
        </button>
        <button class="share-btn" onclick="sharePost()" style="background:var(--surface2);border:1px solid var(--border);border-radius:100px;padding:.55rem 1.25rem;font-size:.9rem;font-weight:600;color:var(--text);cursor:pointer;display:flex;align-items:center;gap:.35rem;transition:all .2s;font-family:'DM Sans',sans-serif;">
          🌐 Share
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
</main>

<div class="follow-modal-overlay" id="followModal" onclick="if(event.target===this)closeFollowModal()">
  <div class="follow-modal-card">
    <div class="follow-modal-header">
      <div class="follow-modal-title" id="followModalTitle">Followers</div>
      <button class="follow-modal-close" onclick="closeFollowModal()">✕</button>
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
      <button class="share-modal-close" onclick="closeShareModal()" style="background:none;border:none;color:var(--muted);font-size:1.1rem;cursor:pointer;">✕</button>
    </div>
    <div class="share-modal-body" style="display:flex;flex-direction:column;gap:.75rem;">
      <button class="share-option-btn" onclick="copyShareLink()" style="width:100%;padding:.75rem 1rem;background:var(--surface2);border:1px solid var(--border);border-radius:10px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:.88rem;font-weight:500;cursor:pointer;text-align:left;display:flex;align-items:center;gap:.5rem;transition:all .2s;">🔗 Copy Link</button>
      <button class="share-option-btn" onclick="shareToTwitter()" style="width:100%;padding:.75rem 1rem;background:var(--surface2);border:1px solid var(--border);border-radius:10px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:.88rem;font-weight:500;cursor:pointer;text-align:left;display:flex;align-items:center;gap:.5rem;transition:all .2s;">🐦 Share on X (Twitter)</button>
      <button class="share-option-btn" onclick="shareToWhatsApp()" style="width:100%;padding:.75rem 1rem;background:var(--surface2);border:1px solid var(--border);border-radius:10px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:.88rem;font-weight:500;cursor:pointer;text-align:left;display:flex;align-items:center;gap:.5rem;transition:all .2s;">💬 Share on WhatsApp</button>
    </div>
  </div>
</div>

<div class="toast" id="toast"><span class="toast-icon" id="toastIcon">✓</span><span id="toastMsg">Done!</span><button class="toast-signin-btn" id="toastSignInBtn" style="display:none;" onclick="showLoginFromToast()">Sign In</button></div>
`;