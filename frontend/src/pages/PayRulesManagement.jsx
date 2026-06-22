import React, { useState, useEffect } from 'react';
import { payRuleAPI, settingsAPI } from '../api';
import { Plus, Trash2, Loader, Settings, Power } from 'lucide-react';

const DAY_NAMES = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
];

export default function PayRulesManagement() {
    const [rules, setRules] = useState([]);
    const [payrollEnabled, setPayrollEnabled] = useState(true);
    const [savingSettings, setSavingSettings] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        rule_name: '',
        day_of_week: '',
        multiplier: 1.0,
        description: '',
    });

    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        try {
            setLoading(true);
            const [settingsResponse, rulesResponse] = await Promise.all([
                settingsAPI.get(),
                payRuleAPI.getAll().catch(() => ({ data: [] })),
            ]);

            setPayrollEnabled(!!settingsResponse.data?.payroll_enabled);
            setRules(Array.isArray(rulesResponse.data) ? rulesResponse.data : []);
            setError(null);
        } catch (err) {
            setError('Failed to load settings');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePayroll = async () => {
        try {
            setSavingSettings(true);
            const next = !payrollEnabled;
            await settingsAPI.update({ payroll_enabled: next });
            setPayrollEnabled(next);
            if (next) {
                const response = await payRuleAPI.getAll();
                setRules(response.data);
            } else {
                setRules([]);
            }
            setError(null);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update payroll setting');
        } finally {
            setSavingSettings(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!payrollEnabled) {
            setError('Enable payroll from settings before editing pay rules');
            return;
        }
        try {
            const data = {
                ...formData,
                day_of_week:
                    formData.day_of_week === '' ? null : parseInt(formData.day_of_week),
            };
            await payRuleAPI.create(data);
            fetchRules();
            setShowForm(false);
            setFormData({
                rule_name: '',
                day_of_week: '',
                multiplier: 1.0,
                description: '',
            });
        } catch (err) {
            setError('Failed to create pay rule');
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        if (!payrollEnabled) return;
        try {
            await payRuleAPI.update(id, { active: false });
            fetchRules();
        } catch (err) {
            setError('Failed to delete pay rule');
        }
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
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Settings size={30} />
                    App Settings
                </h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 disabled:opacity-50"
                    disabled={!payrollEnabled}
                >
                    <Plus size={20} /> Add Pay Rule
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6 border-l-4 border-indigo-500">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Power size={20} /> Payroll Functionality
                        </h2>
                        <p className="text-gray-600 text-sm mt-1">
                            Toggle payroll multipliers and pay-rules usage system-wide.
                        </p>
                    </div>
                    <button
                        onClick={handleTogglePayroll}
                        disabled={savingSettings}
                        className={`px-4 py-2 rounded-lg text-white font-semibold ${payrollEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500 hover:bg-gray-600'} disabled:opacity-50`}
                    >
                        {savingSettings ? 'Saving...' : payrollEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {showForm && payrollEnabled && (
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-6 rounded-lg shadow-md mb-6 border-l-4 border-blue-500"
                >
                    <h2 className="text-xl font-semibold mb-4">Add New Pay Rule</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Rule Name"
                            value={formData.rule_name}
                            onChange={(e) =>
                                setFormData({ ...formData, rule_name: e.target.value })
                            }
                            className="border rounded px-3 py-2"
                            required
                        />
                        <select
                            value={formData.day_of_week}
                            onChange={(e) =>
                                setFormData({ ...formData, day_of_week: e.target.value })
                            }
                            className="border rounded px-3 py-2"
                        >
                            <option value="">All Days (Default)</option>
                            {DAY_NAMES.map((day, idx) => (
                                <option key={idx} value={idx}>
                                    {day}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            placeholder="Pay Multiplier"
                            value={formData.multiplier}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    multiplier: parseFloat(e.target.value),
                                })
                            }
                            className="border rounded px-3 py-2"
                            required
                            step="0.05"
                            min="0"
                        />
                        <textarea
                            placeholder="Description"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            className="border rounded px-3 py-2 col-span-2"
                            rows="2"
                        />
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Create Rule
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="grid gap-4">
                {!payrollEnabled ? (
                    <div className="text-center py-8 text-gray-500">
                        Payroll is disabled. Enable it from settings to manage pay rules.
                    </div>
                ) : rules.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No pay rules configured.
                    </div>
                ) : (
                    rules.map((rule) => (
                        <div
                            key={rule.id}
                            className="bg-white p-4 rounded-lg shadow-md border-l-4 border-indigo-500"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold">{rule.rule_name}</h3>
                                    <p className="text-gray-600 text-sm">
                                        {rule.day_of_week !== null
                                            ? `Applies on: ${DAY_NAMES[rule.day_of_week]}`
                                            : 'Applies on: All Days (Default)'}
                                    </p>
                                    <p className="text-gray-700 font-semibold mt-2">
                                        Multiplier: {rule.multiplier}x
                                        {rule.multiplier > 1 &&
                                            ` (+${((rule.multiplier - 1) * 100).toFixed(0)}% bonus)`}
                                    </p>
                                    {rule.description && (
                                        <p className="text-gray-600 text-sm mt-2">
                                            {rule.description}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleDelete(rule.id)}
                                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-8 bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">How Pay Multipliers Work</h3>
                <ul className="space-y-2 text-gray-700">
                    <li>
                        • <strong>1.0x</strong> = Regular pay (base hourly rate)
                    </li>
                    <li>
                        • <strong>1.5x</strong> = +50% bonus
                    </li>
                    <li>
                        • <strong>1.75x</strong> = +75% bonus
                    </li>
                    <li>
                        • Rules are applied automatically based on the shift date
                    </li>
                </ul>
            </div>
        </div>
    );
}
