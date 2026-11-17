import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Database,
  Eye,
  ExternalLink,
  LoaderCircle,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';

const EMPTY_FORM = {
  title: '',
  platform: 'TikTok',
  contentType: 'Short video',
  status: 'Draft',
  views: '0',
  link: '',
  description: '',
};

async function apiRequest(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    let message = 'Something went wrong. Please try again.';
    try {
      const body = await response.json();
      if (body.error) message = body.error;
    } catch {
      // Keep the default message when the server does not return JSON.
    }
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

function formatCount(value) {
  return new Intl.NumberFormat('en', { notation: value >= 10000 ? 'compact' : 'standard', maximumFractionDigits: 1 }).format(value || 0);
}

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function ContentStudio() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [databaseStatus, setDatabaseStatus] = useState('checking');
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');

  const loadPosts = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const [records, health] = await Promise.all([
        apiRequest('/content'),
        apiRequest('/health'),
      ]);
      setPosts(records);
      setDatabaseStatus(health.database === 'connected' ? 'connected' : 'disconnected');
    } catch (error) {
      setDatabaseStatus('disconnected');
      setLoadError(error.message || 'Unable to connect to the content database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesFilter = filter === 'All' || post.status === filter;
      const matchesSearch = !term || [post.title, post.platform, post.contentType, post.description]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term));
      return matchesFilter && matchesSearch;
    });
  }, [posts, search, filter]);

  const totalViews = posts.reduce((sum, post) => sum + post.views, 0);
  const publishedCount = posts.filter((post) => post.status === 'Published').length;

  const openCreateForm = () => {
    setEditingPost(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setNotice('');
    setIsFormOpen(true);
  };

  const openEditForm = (post) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      platform: post.platform,
      contentType: post.contentType,
      status: post.status,
      views: String(post.views),
      link: post.link || '',
      description: post.description || '',
    });
    setFormError('');
    setNotice('');
    setIsFormOpen(true);
  };

  const closeForm = () => {
    if (saving) return;
    setIsFormOpen(false);
    setEditingPost(null);
    setForm(EMPTY_FORM);
    setFormError('');
  };

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFormError('');
    setNotice('');

    const payload = {
      ...form,
      views: Number(form.views || 0),
      link: form.link.trim(),
      description: form.description.trim(),
    };

    try {
      if (editingPost) {
        await apiRequest(`/content/${editingPost.id}`, { method: 'PUT', body: JSON.stringify(payload) });
        setNotice('Your content record has been updated.');
      } else {
        await apiRequest('/content', { method: 'POST', body: JSON.stringify(payload) });
        setNotice('Your new content record has been saved.');
      }
      setIsFormOpen(false);
      setEditingPost(null);
      setForm(EMPTY_FORM);
      await loadPosts();
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (post) => {
    const confirmed = window.confirm(`Delete “${post.title}”? This removes the record from the database.`);
    if (!confirmed) return;
    setNotice('');
    try {
      await apiRequest(`/content/${post.id}`, { method: 'DELETE' });
      setPosts((current) => current.filter((item) => item.id !== post.id));
      setNotice('Content record deleted.');
    } catch (error) {
      setLoadError(error.message);
    }
  };

  return (
    <div className="studio-panel glass-card">
      <div className="studio-panel-top">
        <div>
          <div className="studio-label"><span className="studio-label-dot" /> CREATOR DASHBOARD</div>
          <h3>Content manager</h3>
          <p>Keep your next big idea organized.</p>
        </div>
        <div className={`database-indicator ${databaseStatus}`}>
          {databaseStatus === 'checking' ? <LoaderCircle size={14} className="spin" /> : databaseStatus === 'connected' ? <Database size={14} /> : <AlertCircle size={14} />}
          <span>{databaseStatus === 'checking' ? 'Checking database' : databaseStatus === 'connected' ? 'Database connected' : 'Database offline'}</span>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="dashboard-stat"><span>CONTENT RECORDS</span><b>{posts.length}</b><small>Total saved</small></div>
        <div className="dashboard-stat"><span>PUBLISHED</span><b>{publishedCount}</b><small>Ready for the world</small></div>
        <div className="dashboard-stat"><span>TOTAL VIEWS</span><b>{formatCount(totalViews)}</b><small>Across saved posts</small></div>
      </div>

      <div className="content-toolbar">
        <div className="content-search"><Search size={16} /><input aria-label="Search content" placeholder="Search your content..." value={search} onChange={(event) => setSearch(event.target.value)} /></div>
        <button className="button button-primary add-content-button" onClick={openCreateForm}><Plus size={16} /> Add content</button>
      </div>

      <div className="filter-row" aria-label="Filter content by status">
        {['All', 'Draft', 'Scheduled', 'Published'].map((value) => (
          <button key={value} className={filter === value ? 'filter-chip active' : 'filter-chip'} onClick={() => setFilter(value)}>{value}</button>
        ))}
      </div>

      {notice && <div className="inline-notice"><CheckCircle2 size={15} /> {notice}</div>}
      {loadError && <div className="inline-error"><AlertCircle size={15} /> {loadError} <button onClick={loadPosts}>Retry</button></div>}

      {loading ? (
        <div className="studio-empty"><LoaderCircle className="spin" size={23} /><b>Loading your content...</b><span>Connecting to your Prisma database.</span></div>
      ) : filteredPosts.length === 0 ? (
        <div className="studio-empty">
          <div className="empty-icon"><Clock3 size={22} /></div>
          <b>{posts.length === 0 ? 'Your content space is ready.' : 'No matching content found.'}</b>
          <span>{posts.length === 0 ? 'Add your first creator post to get started.' : 'Try another search or choose a different filter.'}</span>
          {posts.length === 0 && <button className="text-button" onClick={openCreateForm}>Create your first record <Plus size={15} /></button>}
        </div>
      ) : (
        <div className="content-list">
          {filteredPosts.map((post) => (
            <article className="content-row" key={post.id}>
              <div className="content-type-icon"><span>{post.platform === 'TikTok' ? '♪' : post.platform === 'YouTube' ? '▶' : post.platform === 'Instagram' ? '◎' : '✦'}</span></div>
              <div className="content-details">
                <div className="content-title-line"><h4>{post.title}</h4><span className={`status-pill ${post.status.toLowerCase()}`}>{post.status}</span></div>
                <p>{post.platform} <span>•</span> {post.contentType} <span>•</span> {formatDate(post.createdAt)}</p>
                <div className="content-meta"><span><Eye size={13} /> {formatCount(post.views)} views</span>{post.link && <a href={post.link} target="_blank" rel="noreferrer">Open link <ExternalLink size={12} /></a>}</div>
              </div>
              <div className="content-actions">
                <button onClick={() => openEditForm(post)} aria-label={`Edit ${post.title}`} title="Edit"><Pencil size={15} /></button>
                <button onClick={() => handleDelete(post)} aria-label={`Delete ${post.title}`} title="Delete"><Trash2 size={15} /></button>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="studio-panel-footer"><Database size={14} /> Your content is stored in the local SQLite database through Prisma ORM.</div>

      {isFormOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeForm(); }}>
          <section className="content-modal" role="dialog" aria-modal="true" aria-labelledby="content-modal-title">
            <div className="modal-heading">
              <div><span className="section-kicker">CONTENT DETAILS</span><h3 id="content-modal-title">{editingPost ? 'Edit content' : 'Add new content'}</h3></div>
              <button className="modal-close" onClick={closeForm} aria-label="Close form"><X size={19} /></button>
            </div>
            <form className="content-form" onSubmit={handleSubmit}>
              <label className="form-field full-field">Content title <input name="title" value={form.title} onChange={updateField} maxLength={100} placeholder="e.g. My favorite everyday finds" required /></label>
              <div className="form-field-grid">
                <label className="form-field">Platform
                  <select name="platform" value={form.platform} onChange={updateField}>
                    {['TikTok', 'Instagram', 'Facebook', 'YouTube', 'Other'].map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <label className="form-field">Content type
                  <select name="contentType" value={form.contentType} onChange={updateField}>
                    {['Short video', 'Shop affiliate video', 'Lifestyle video', 'Product showcase', 'Photo post', 'Live stream', 'Other'].map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <label className="form-field">Status
                  <select name="status" value={form.status} onChange={updateField}>
                    {['Draft', 'Scheduled', 'Published'].map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <label className="form-field">Views
                  <input name="views" type="number" min="0" step="1" value={form.views} onChange={updateField} />
                </label>
              </div>
              <label className="form-field full-field">Post link <span className="optional-label">Optional</span><input name="link" type="url" value={form.link} onChange={updateField} placeholder="https://..." /></label>
              <label className="form-field full-field">Description <span className="optional-label">Optional</span><textarea name="description" value={form.description} onChange={updateField} maxLength={500} rows={3} placeholder="Add a short note about this post..." /></label>
              {formError && <div className="form-error"><AlertCircle size={15} /> {formError}</div>}
              <div className="modal-actions"><button type="button" className="button button-ghost" onClick={closeForm} disabled={saving}>Cancel</button><button type="submit" className="button button-primary" disabled={saving}>{saving ? <LoaderCircle className="spin" size={16} /> : null}{saving ? 'Saving...' : editingPost ? 'Save changes' : 'Save content'}</button></div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default ContentStudio;
