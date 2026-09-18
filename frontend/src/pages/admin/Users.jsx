import { useEffect, useState } from 'react';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

const roleConfig = {
  patient: { cls: 'badge-teal',   label: 'Patient' },
  doctor:  { cls: 'badge-blue',   label: 'Doctor' },
  admin:   { cls: 'bg-purple-100 text-purple-700', label: 'Admin' },
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchUsers = () => {
    setLoading(true);
    const params = roleFilter !== 'all' ? { role: roleFilter } : {};
    api.get('/admin/users', { params }).then(({ data }) => setUsers(data.users)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [roleFilter]);

  const handleToggle = async (id) => {
    try {
      const { data } = await api.put(`/admin/users/${id}/toggle-status`);
      toast.success(data.message);
      fetchUsers();
    } catch (err) { toast.error('Action failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) { toast.error('Delete failed'); }
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Spinner />;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="page-header">
        <div>
          <h1 className="section-title">Manage Users</h1>
          <p className="section-subtitle">{users.length} user{users.length !== 1 ? 's' : ''} registered</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card flex flex-wrap items-center gap-4 p-4">
        <div className="flex gap-2">
          {['all', 'patient', 'doctor', 'admin'].map((r) => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border capitalize transition-all ${
                roleFilter === r ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-slate-600 border-surface-200 hover:border-primary-300'
              }`}>
              {r}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email..." className="input-field pl-9 text-sm" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">👥</div>
          <p className="text-slate-400">No users found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card border border-surface-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-50 border-b border-surface-200">
                <tr>
                  {['User', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {filtered.map((user) => {
                  const rc = roleConfig[user.role] || roleConfig.patient;
                  return (
                    <tr key={user._id} className="hover:bg-surface-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm shrink-0">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{user.name}</p>
                            <p className="text-xs text-slate-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge ${rc.cls}`}>{rc.label}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge ${user.isActive ? 'badge-green' : 'badge-red'}`}>
                          {user.isActive ? '● Active' : '○ Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-400 text-xs">
                        {new Date(user.createdAt).toLocaleDateString('en', { day:'numeric', month:'short', year:'numeric' })}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleToggle(user._id)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                              user.isActive
                                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            }`}>
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          {user.role !== 'admin' && (
                            <button onClick={() => handleDelete(user._id)}
                              className="px-3 py-1 rounded-lg text-xs font-semibold bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
