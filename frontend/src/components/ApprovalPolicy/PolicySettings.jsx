import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import API from '../../api/client';

const PolicySettings = ({ projectId }) => {
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [templates, setTemplates] = useState([]);

  const fetchPolicy = useCallback(async () => {
    try {
      const response = await API.get(`/approval-policies/${projectId}`);
      setPolicy(response.data.data || getDefaultPolicy());
    } catch (error) {
      console.error('Error fetching policy:', error);
      setPolicy(getDefaultPolicy());
    } finally {
      setLoading(false);
    }
  }, [projectId, getDefaultPolicy]);

  const fetchTemplates = useCallback(async () => {
    try {
      const response = await API.get('/approval-policies/templates');
      setTemplates(response.data.data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  }, []);

  useEffect(() => {
    fetchPolicy();
    fetchTemplates();
  }, [fetchPolicy, fetchTemplates]);

  const getDefaultPolicy = useCallback(() => ({
    projectId,
    enabled: false,
    requireApprovalForTaskTypes: ['STORY', 'TASK'],
    autoApproveEnabled: false,
    autoApproveAfterHours: 48,
    escalationEnabled: false,
    escalationAfterHours: 24,
    rules: [],
    checklistTemplates: {
      STORY: [],
      TASK: [],
      BUG: []
    }
  }), [projectId]);

  const handleToggleEnabled = async () => {
    try {
      const response = await API.patch(`/approval-policies/${projectId}/toggle`, {
        enabled: !policy.enabled
      });
      setPolicy(response.data.data);
      toast.success(`Approval system ${!policy.enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update policy');
      console.error(error);
    }
  };

  const handleSavePolicy = async () => {
    setSaving(true);
    try {
      const response = await API.put(`/approval-policies/${projectId}`, policy);
      setPolicy(response.data.data);
      toast.success('Policy saved successfully');
    } catch (error) {
      toast.error('Failed to save policy');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleApplyTemplate = async (templateName) => {
    try {
      const response = await API.post(`/approval-policies/${projectId}/apply-template`, {
        template: templateName
      });
      setPolicy(response.data.data);
      toast.success(`${templateName} template applied`);
    } catch (error) {
      toast.error('Failed to apply template');
      console.error(error);
    }
  };

  const handleAddRule = () => {
    setPolicy({
      ...policy,
      rules: [
        ...policy.rules,
        {
          name: 'New Rule',
          priority: policy.rules.length + 1,
          enabled: true,
          conditions: {
            taskTypes: ['STORY'],
            priorities: [],
            storyPointsMin: null,
            storyPointsMax: null,
            assignees: [],
            labels: []
          },
          actions: {
            requireApproval: true,
            approvers: {
              roles: ['Team Lead'],
              specificUsers: [],
              anyTeamMember: false
            },
            autoApprove: false,
            autoApproveAfterHours: 48,
            escalate: false,
            escalateAfterHours: 24,
            escalateTo: {
              roles: ['Project Manager'],
              specificUsers: []
            }
          }
        }
      ]
    });
  };

  const handleUpdateRule = (index, updates) => {
    const newRules = [...policy.rules];
    newRules[index] = { ...newRules[index], ...updates };
    setPolicy({ ...policy, rules: newRules });
  };

  const handleDeleteRule = (index) => {
    setPolicy({
      ...policy,
      rules: policy.rules.filter((_, i) => i !== index)
    });
  };

  const handleAddChecklistItem = (taskType) => {
    setPolicy({
      ...policy,
      checklistTemplates: {
        ...policy.checklistTemplates,
        [taskType]: [
          ...(policy.checklistTemplates[taskType] || []),
          { name: 'New checklist item', required: false }
        ]
      }
    });
  };

  const handleUpdateChecklistItem = (taskType, index, updates) => {
    const newItems = [...policy.checklistTemplates[taskType]];
    newItems[index] = { ...newItems[index], ...updates };
    setPolicy({
      ...policy,
      checklistTemplates: {
        ...policy.checklistTemplates,
        [taskType]: newItems
      }
    });
  };

  const handleDeleteChecklistItem = (taskType, index) => {
    setPolicy({
      ...policy,
      checklistTemplates: {
        ...policy.checklistTemplates,
        [taskType]: policy.checklistTemplates[taskType].filter((_, i) => i !== index)
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Approval Policy Settings</h2>
        <div className="flex items-center space-x-4">
          <label className="flex items-center cursor-pointer">
            <span className="mr-3 text-sm font-medium text-gray-700">
              {policy.enabled ? 'Enabled' : 'Disabled'}
            </span>
            <div className="relative">
              <input
                type="checkbox"
                checked={policy.enabled}
                onChange={handleToggleEnabled}
                className="sr-only"
              />
              <div className={`block w-14 h-8 rounded-full ${policy.enabled ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${policy.enabled ? 'transform translate-x-6' : ''}`}></div>
            </div>
          </label>
          <button
            onClick={handleSavePolicy}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Policy'}
          </button>
        </div>
      </div>

      {/* Templates */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Quick Templates</h3>
        <div className="flex space-x-3">
          {templates.map((template) => (
            <button
              key={template.name}
              onClick={() => handleApplyTemplate(template.name)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>

      {/* General Settings */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">General Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Require Approval for Task Types
            </label>
            <div className="flex space-x-4">
              {['STORY', 'TASK', 'BUG'].map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={policy.requireApprovalForTaskTypes.includes(type)}
                    onChange={(e) => {
                      setPolicy({
                        ...policy,
                        requireApprovalForTaskTypes: e.target.checked
                          ? [...policy.requireApprovalForTaskTypes, type]
                          : policy.requireApprovalForTaskTypes.filter((t) => t !== type)
                      });
                    }}
                    className="rounded border-gray-300 text-blue-600 mr-2"
                  />
                  <span className="text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={policy.autoApproveEnabled}
                onChange={(e) => setPolicy({ ...policy, autoApproveEnabled: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Enable Auto-Approve</span>
            </label>
            {policy.autoApproveEnabled && (
              <div className="flex items-center">
                <label className="text-sm text-gray-700 mr-2">After</label>
                <input
                  type="number"
                  value={policy.autoApproveAfterHours}
                  onChange={(e) => setPolicy({ ...policy, autoApproveAfterHours: parseInt(e.target.value) })}
                  className="w-20 px-2 py-1 border border-gray-300 rounded"
                  min="1"
                />
                <span className="ml-2 text-sm text-gray-700">hours</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={policy.escalationEnabled}
                onChange={(e) => setPolicy({ ...policy, escalationEnabled: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Enable Escalation</span>
            </label>
            {policy.escalationEnabled && (
              <div className="flex items-center">
                <label className="text-sm text-gray-700 mr-2">After</label>
                <input
                  type="number"
                  value={policy.escalationAfterHours}
                  onChange={(e) => setPolicy({ ...policy, escalationAfterHours: parseInt(e.target.value) })}
                  className="w-20 px-2 py-1 border border-gray-300 rounded"
                  min="1"
                />
                <span className="ml-2 text-sm text-gray-700">hours</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Approval Rules */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Approval Rules</h3>
          <button
            onClick={handleAddRule}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            + Add Rule
          </button>
        </div>
        <div className="space-y-4">
          {policy.rules.map((rule, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <input
                  type="text"
                  value={rule.name}
                  onChange={(e) => handleUpdateRule(index, { name: e.target.value })}
                  className="text-lg font-medium border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
                />
                <button
                  onClick={() => handleDeleteRule(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Conditions</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-gray-600">Task Types</label>
                      <div className="flex space-x-2 mt-1">
                        {['STORY', 'TASK', 'BUG'].map((type) => (
                          <label key={type} className="flex items-center text-sm">
                            <input
                              type="checkbox"
                              checked={rule.conditions.taskTypes.includes(type)}
                              onChange={(e) => {
                                const newTaskTypes = e.target.checked
                                  ? [...rule.conditions.taskTypes, type]
                                  : rule.conditions.taskTypes.filter((t) => t !== type);
                                handleUpdateRule(index, {
                                  conditions: { ...rule.conditions, taskTypes: newTaskTypes }
                                });
                              }}
                              className="rounded border-gray-300 text-blue-600 mr-1"
                            />
                            {type}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-600">Story Points Range</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <input
                          type="number"
                          placeholder="Min"
                          value={rule.conditions.storyPointsMin || ''}
                          onChange={(e) =>
                            handleUpdateRule(index, {
                              conditions: {
                                ...rule.conditions,
                                storyPointsMin: e.target.value ? parseInt(e.target.value) : null
                              }
                            })
                          }
                          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={rule.conditions.storyPointsMax || ''}
                          onChange={(e) =>
                            handleUpdateRule(index, {
                              conditions: {
                                ...rule.conditions,
                                storyPointsMax: e.target.value ? parseInt(e.target.value) : null
                              }
                            })
                          }
                          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Actions</h4>
                  <div className="space-y-2">
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={rule.actions.requireApproval}
                        onChange={(e) =>
                          handleUpdateRule(index, {
                            actions: { ...rule.actions, requireApproval: e.target.checked }
                          })
                        }
                        className="rounded border-gray-300 text-blue-600 mr-2"
                      />
                      Require Approval
                    </label>

                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={rule.actions.autoApprove}
                        onChange={(e) =>
                          handleUpdateRule(index, {
                            actions: { ...rule.actions, autoApprove: e.target.checked }
                          })
                        }
                        className="rounded border-gray-300 text-blue-600 mr-2"
                      />
                      Auto-Approve After
                      <input
                        type="number"
                        value={rule.actions.autoApproveAfterHours}
                        onChange={(e) =>
                          handleUpdateRule(index, {
                            actions: {
                              ...rule.actions,
                              autoApproveAfterHours: parseInt(e.target.value)
                            }
                          })
                        }
                        disabled={!rule.actions.autoApprove}
                        className="w-16 px-2 py-1 ml-2 text-sm border border-gray-300 rounded disabled:opacity-50"
                        min="1"
                      />
                      <span className="ml-1">hrs</span>
                    </label>

                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={rule.actions.escalate}
                        onChange={(e) =>
                          handleUpdateRule(index, {
                            actions: { ...rule.actions, escalate: e.target.checked }
                          })
                        }
                        className="rounded border-gray-300 text-blue-600 mr-2"
                      />
                      Escalate After
                      <input
                        type="number"
                        value={rule.actions.escalateAfterHours}
                        onChange={(e) =>
                          handleUpdateRule(index, {
                            actions: {
                              ...rule.actions,
                              escalateAfterHours: parseInt(e.target.value)
                            }
                          })
                        }
                        disabled={!rule.actions.escalate}
                        className="w-16 px-2 py-1 ml-2 text-sm border border-gray-300 rounded disabled:opacity-50"
                        min="1"
                      />
                      <span className="ml-1">hrs</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist Templates */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Checklist Templates</h3>
        {['STORY', 'TASK', 'BUG'].map((taskType) => (
          <div key={taskType} className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-700">{taskType}</h4>
              <button
                onClick={() => handleAddChecklistItem(taskType)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add Item
              </button>
            </div>
            <div className="space-y-2">
              {(policy.checklistTemplates[taskType] || []).map((item, index) => (
                <div key={index} className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={item.required}
                    onChange={(e) =>
                      handleUpdateChecklistItem(taskType, index, { required: e.target.checked })
                    }
                    className="rounded border-gray-300 text-blue-600"
                    title="Required"
                  />
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) =>
                      handleUpdateChecklistItem(taskType, index, { name: e.target.value })
                    }
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <button
                    onClick={() => handleDeleteChecklistItem(taskType, index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PolicySettings;
