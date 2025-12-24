import { useState, useEffect } from 'react';

function Dashboard({ token, setToken }) {
    const [notes, setNotes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [formData, setFormData] = useState({ title: '', content: '' });

    useEffect(() => {
        fetchNotes();
    }, [token]);

    const fetchNotes = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/notes`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setNotes(data);
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    const handleLogout = () => {
        setToken(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingNote
            ? `${import.meta.env.VITE_API_URL}/api/notes/${editingNote._id}`
            : `${import.meta.env.VITE_API_URL}/api/notes`;
        const method = editingNote ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                fetchNotes();
                closeModal();
            } else {
                const data = await res.json();
                alert(`Error: ${data.message || 'Failed to save note'}`);
            }
        } catch (error) {
            console.error('Error saving note:', error);
            alert('Network error: Failed to save note');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/notes/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchNotes();
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const openModal = (note = null) => {
        if (note) {
            setEditingNote(note);
            setFormData({ title: note.title, content: note.content });
        } else {
            setEditingNote(null);
            setFormData({ title: '', content: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingNote(null);
        setFormData({ title: '', content: '' });
    };

    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        document.body.className = theme === 'light' ? 'light-mode' : '';
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <div className="fade-in">
            <nav className="glass-panel navbar">
                <div className="logo">NoteSpace</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={toggleTheme} className="btn" style={{ background: 'transparent', border: '1px solid var(--glass-border)', padding: '0.5rem', color: 'var(--text-color)' }}>
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                    <button onClick={handleLogout} className="btn" style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-color)' }}>
                        Logout
                    </button>
                </div>
            </nav>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>My Notes</h2>
                <button onClick={() => openModal()} className="btn">
                    + New Note
                </button>
            </div>

            <div className="dashboard-grid">
                {notes.length === 0 ? (
                    <p className="text-muted">No notes yet. Create one!</p>
                ) : (
                    notes.map((note) => (
                        <div key={note._id} className="glass-panel note-card">
                            <div>
                                <h3>{note.title}</h3>
                                <p className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>{note.content}</p>
                            </div>
                            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => openModal(note)}
                                    className="btn"
                                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', background: 'transparent', border: '1px solid var(--primary-color)', color: 'var(--primary-color)' }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(note._id)}
                                    className="btn btn-danger"
                                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && closeModal()}>
                    <div className="glass-panel modal-content fade-in">
                        <h2 style={{ marginBottom: '1.5rem' }}>{editingNote ? 'Edit Note' : 'Create Note'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="input-group">
                                <textarea
                                    placeholder="Content"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    required
                                    rows="5"
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={closeModal} className="btn" style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-color)' }}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
