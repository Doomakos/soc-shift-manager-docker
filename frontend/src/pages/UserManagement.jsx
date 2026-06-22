import React, { useState, useEffect } from 'react';
import api, { analystAPI } from '../api';
import { Loader, UserPlus, CheckCircle, Edit2, Trash2, Shield, User, Key } from 'lucide-react';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [analysts, setAnalysts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [resetPassword, setResetPassword] = useState('');
    const [resetPasswordConfirm, setResetPasswordConfirm] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: '',
        analyst_id: '',
        first_name: '',
        last_name: '',
        analyst_level: 'L1',
        daily_hours: 8,
        create_analyst: false,
    });

    const roles = [
        { value: 'admin', label: 'Administrator', description: 'Full system access' },
        { value: 'soc_manager', label: 'SOC Manager', description: 'Manage shifts and users' },
        { value: 'shift_coordinator', label: 'Shift Coordinator', description: 'Assign and manage shifts' },
        { value: 'l1_analyst', label: 'Level 1 Analyst', description: 'View own shifts' },
        { value: 'l2_analyst', label: 'Level 2 Analyst', description: 'View own shifts and standby' },
        { value: 'hr_payroll', label: 'HR/Payroll', description: 'View analytics and reports' }
    ];

    const statusColors = {
        'active': 'bg-green-100 text-green-800',
        'pending_approval': 'bg-yellow-100 text-yellow-800',
        'inactive': 'bg-gray-100 text-gray-800'
    };

    useEffect(() => {
        fetchUsers();
        fetchAnalysts();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (err) {
            console.error('Error fetching users:', err);
            alert('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalysts = async () => {
        try {
            const response = await analystAPI.getAll();
            setAnalysts(response.data);
        } catch (err) {
            console.error('Error fetching analysts:', err);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();

        if (!formData.username || !formData.email || !formData.password || !formData.role) {
            alert('Please fill in all required fields');
            return;
        }

        if (formData.create_analyst && (!formData.first_name || !formData.last_name)) {
            alert('Please provide first name and last name for analyst creation');
            return;
        }

        try {
            const payload = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                analyst_id: formData.create_analyst ? null : (formData.analyst_id || null),
                create_analyst: formData.create_analyst,
                first_name: formData.create_analyst ? formData.first_name : undefined,
                last_name: formData.create_analyst ? formData.last_name : undefined,
                analyst_level: formData.create_analyst ? formData.analyst_level : undefined,
                daily_hours: formData.create_analyst ? Number(formData.daily_hours || 8) : undefined,
            };

            await api.post('/users', payload);
            alert('User created successfully');
            setShowCreateModal(false);
            resetForm();
            fetchUsers();
        } catch (err) {
            console.error('Error creating user:', err);
            alert(err.response?.data?.error || 'Failed to create user');
        }
    };

    const handleApproveUser = async (e) => {
        e.preventDefault();

        if (!formData.role) {
            alert('Please select a role');
            return;
        }

        try {
            await api.post(`/users/${selectedUser.id}/approve`, {
                role: formData.role,
                analyst_id: formData.analyst_id || null
            });
            alert('User approved successfully');
            setShowApproveModal(false);
            resetForm();
            setSelectedUser(null);
            fetchUsers();
        } catch (err) {
            console.error('Error approving user:', err);
            alert(err.response?.data?.error || 'Failed to approve user');
        }
    };

    const handleEditUser = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                role: formData.role,
                analyst_id: formData.analyst_id || null,
                status: formData.status
            };

            if (formData.email) payload.email = formData.email;

            await api.put(`/users/${selectedUser.id}`, payload);
            alert('User updated successfully');
            setShowEditModal(false);
            resetForm();
            setSelectedUser(null);
            fetchUsers();
        } catch (err) {
            console.error('Error updating user:', err);
            alert(err.response?.data?.error || 'Failed to update user');
        }
    };

    const handleDeleteUser = async (userId, username) => {
        if (!window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
            return;
        }

        try {
            await api.delete(`/users/${userId}`);
            alert('User deleted successfully');
            fetchUsers();
        } catch (err) {
            console.error('Error deleting user:', err);
            alert(err.response?.data?.error || 'Failed to delete user');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!resetPassword || resetPassword.length < 8) {
            alert('Password must be at least 8 characters');
            return;
        }

        if (resetPassword !== resetPasswordConfirm) {
            alert('Passwords do not match');
            return;
        }

        try {
            await api.put(`/users/${selectedUser.id}/reset-password`, {
                new_password: resetPassword
            });
            alert('Password reset successfully. User will be prompted to change it on next login.');
            setShowResetPasswordModal(false);
            setResetPassword('');
            setResetPasswordConfirm('');
            setSelectedUser(null);
        } catch (err) {
            console.error('Error resetting password:', err);
            alert(err.response?.data?.error || 'Failed to reset password');
        }
    };

    const openResetPasswordModal = (user) => {
        setSelectedUser(user);
        setResetPassword('');
        setResetPasswordConfirm('');
        setShowResetPasswordModal(true);
    };

    const openApproveModal = (user) => {
        setSelectedUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            password: '',
            role: '',
            analyst_id: '',
            first_name: '',
            last_name: '',
            analyst_level: 'L1',
            daily_hours: 8,
            create_analyst: false,
        });
        setShowApproveModal(true);
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            password: '',
            role: user.role,
            analyst_id: user.analyst_id || '',
            status: user.status,
            first_name: '',
            last_name: '',
            analyst_level: 'L1',
            daily_hours: 8,
            create_analyst: false,
        });
        setShowEditModal(true);
    };

    const resetForm = () => {
        setFormData({
            username: '',
            email: '',
            password: '',
            role: '',
            analyst_id: '',
            first_name: '',
            last_name: '',
            analyst_level: 'L1',
            daily_hours: 8,
            create_analyst: false,
        });
    };

    const getRoleLabel = (roleValue) => {
        const role = roles.find(r => r.value === roleValue);
        return role ? role.label : roleValue;
    };

    const getAnalystName = (analystId) => {
        const analyst = analysts.find(a => a.id === analystId);
        return analyst ? `${analyst.first_name} ${analyst.last_name}` : '-';
    };

    // Get analysts that are not assigned to any other user (or only assigned to current user being edited)
    const getAvailableAnalysts = (currentUserId = null) => {
        const assignedAnalystIds = users
            .filter(user => user.analyst_id && user.id !== currentUserId)
            .map(user => user.analyst_id);

        return analysts.filter(analyst => !assignedAnalystIds.includes(analyst.id));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">User Management</h1>
                    <p className="text-gray-600">Manage system users and permissions</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowCreateModal(true);
                    }}
                    className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 flex items-center gap-2"
                >
                    <UserPlus size={20} />
                    Create User
                </button>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Username</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Linked Analyst</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <User size={16} className="text-gray-400" />
                                            <span className="font-medium">{user.username}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Shield size={14} className="text-indigo-500" />
                                            <span className="text-sm font-medium">{getRoleLabel(user.role)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {user.analyst_id ? getAnalystName(user.analyst_id) : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded ${statusColors[user.status]}`}>
                                            {user.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {user.status === 'pending_approval' ? (
                                                <button
                                                    onClick={() => openApproveModal(user)}
                                                    className="text-green-600 hover:text-green-700 p-1"
                                                    title="Approve user"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="text-blue-600 hover:text-blue-700 p-1"
                                                    title="Edit user"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                            )}
                                            {user.status !== 'pending_approval' && (
                                                <button
                                                    onClick={() => openResetPasswordModal(user)}
                                                    className="text-purple-600 hover:text-purple-700 p-1"
                                                    title="Reset password"
                                                >
                                                    <Key size={18} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteUser(user.id, user.username)}
                                                className="text-red-600 hover:text-red-700 p-1"
                                                title="Delete user"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create User Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Create New User</h2>
                        <form onSubmit={handleCreateUser}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Username *</label>
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Email *</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Password *</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                        minLength="8"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Role *</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => {
                                            const role = e.target.value;
                                            setFormData({
                                                ...formData,
                                                role,
                                                analyst_level: role === 'l2_analyst' ? 'L2' : formData.analyst_level,
                                            });
                                        }}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    >
                                        <option value="">-- Select Role --</option>
                                        {roles.map((role) => (
                                            <option key={role.value} value={role.value}>
                                                {role.label} - {role.description}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="border border-indigo-200 bg-indigo-50 rounded p-3">
                                    <label className="inline-flex items-center gap-3 text-sm font-semibold">
                                        <input
                                            type="checkbox"
                                            checked={!!formData.create_analyst}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                create_analyst: e.target.checked,
                                                analyst_level: e.target.checked && formData.role === 'l2_analyst' ? 'L2' : formData.analyst_level,
                                                analyst_id: e.target.checked ? '' : formData.analyst_id,
                                            })}
                                            className="h-4 w-4 rounded"
                                        />
                                        Create and link a new analyst profile
                                    </label>
                                    <p className="text-xs text-indigo-700 mt-2">
                                        Enable this to show analyst fields (first name, last name, level, and daily hours).
                                    </p>
                                </div>

                                {formData.create_analyst ? (
                                    <>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">First Name *</label>
                                            <input
                                                type="text"
                                                value={formData.first_name}
                                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                                className="w-full border rounded px-3 py-2"
                                                required={formData.create_analyst}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Last Name *</label>
                                            <input
                                                type="text"
                                                value={formData.last_name}
                                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                                className="w-full border rounded px-3 py-2"
                                                required={formData.create_analyst}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Analyst Level</label>
                                            <select
                                                value={formData.analyst_level}
                                                onChange={(e) => setFormData({ ...formData, analyst_level: e.target.value })}
                                                className="w-full border rounded px-3 py-2"
                                            >
                                                <option value="L1">Level 1 (Shift Work)</option>
                                                <option value="L2">Level 2 (Standby)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Daily Hours</label>
                                            <input
                                                type="number"
                                                min="1"
                                                step="0.5"
                                                value={formData.daily_hours}
                                                onChange={(e) => setFormData({ ...formData, daily_hours: e.target.value })}
                                                className="w-full border rounded px-3 py-2"
                                            />
                                        </div>
                                        <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
                                            Employee ID will be auto-generated by the app. You can edit it later from Analyst Management.
                                        </div>
                                    </>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Link to Analyst (Optional)</label>
                                        <select
                                            value={formData.analyst_id}
                                            onChange={(e) => setFormData({ ...formData, analyst_id: e.target.value })}
                                            className="w-full border rounded px-3 py-2"
                                        >
                                            <option value="">-- None --</option>
                                            {getAvailableAnalysts().map((analyst) => (
                                                <option key={analyst.id} value={analyst.id}>
                                                    {analyst.first_name} {analyst.last_name} (ID: {analyst.employee_id})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="submit"
                                    className="flex-1 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
                                >
                                    Create User
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        resetForm();
                                    }}
                                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Approve User Modal */}
            {showApproveModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Approve User: {selectedUser.username}</h2>
                        <form onSubmit={handleApproveUser}>
                            <div className="space-y-4">
                                <div className="bg-blue-50 p-3 rounded border border-blue-200">
                                    <p className="text-sm text-blue-800">
                                        <strong>Email:</strong> {selectedUser.email}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Assign Role *</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    >
                                        <option value="">-- Select Role --</option>
                                        {roles.map((role) => (
                                            <option key={role.value} value={role.value}>
                                                {role.label} - {role.description}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Link to Analyst (Optional)</label>
                                    <select
                                        value={formData.analyst_id}
                                        onChange={(e) => setFormData({ ...formData, analyst_id: e.target.value })}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="">-- None --</option>
                                        {getAvailableAnalysts().map((analyst) => (
                                            <option key={analyst.id} value={analyst.id}>
                                                {analyst.first_name} {analyst.last_name} (ID: {analyst.employee_id})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="submit"
                                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    Approve User
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowApproveModal(false);
                                        setSelectedUser(null);
                                        resetForm();
                                    }}
                                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Edit User: {selectedUser.username}</h2>
                        <form onSubmit={handleEditUser}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Role *</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    >
                                        {roles.map((role) => (
                                            <option key={role.value} value={role.value}>
                                                {role.label} - {role.description}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Linked Analyst</label>
                                    <select
                                        value={formData.analyst_id}
                                        onChange={(e) => setFormData({ ...formData, analyst_id: e.target.value })}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="">-- None --</option>
                                        {/* Show currently assigned analyst even if "taken" */}
                                        {selectedUser?.analyst_id && !getAvailableAnalysts(selectedUser.id).find(a => a.id === selectedUser.analyst_id) && (
                                            <option key={selectedUser.analyst_id} value={selectedUser.analyst_id}>
                                                {getAnalystName(selectedUser.analyst_id)} (Current)
                                            </option>
                                        )}
                                        {getAvailableAnalysts(selectedUser?.id).map((analyst) => (
                                            <option key={analyst.id} value={analyst.id}>
                                                {analyst.first_name} {analyst.last_name} (ID: {analyst.employee_id})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Status *</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedUser(null);
                                        resetForm();
                                    }}
                                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {showResetPasswordModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Key className="text-purple-600" size={24} />
                            Reset Password: {selectedUser.username}
                        </h2>
                        <form onSubmit={handleResetPassword}>
                            <div className="space-y-4">
                                <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                                    <p className="text-sm text-yellow-800">
                                        <strong>Note:</strong> The user will be prompted to change this password on their next login.
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">New Password *</label>
                                    <input
                                        type="password"
                                        value={resetPassword}
                                        onChange={(e) => setResetPassword(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Minimum 8 characters"
                                        required
                                        minLength="8"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Confirm New Password *</label>
                                    <input
                                        type="password"
                                        value={resetPasswordConfirm}
                                        onChange={(e) => setResetPasswordConfirm(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Re-enter password"
                                        required
                                        minLength="8"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="submit"
                                    className="flex-1 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                                >
                                    Reset Password
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowResetPasswordModal(false);
                                        setSelectedUser(null);
                                        setResetPassword('');
                                        setResetPasswordConfirm('');
                                    }}
                                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
