// Utility functions for tracking changes across different sections

export const CHANGE_TYPES = {
  PROFILE: 'profile',
  PUBLICATIONS: 'publications',
  PATENTS: 'patents',
  PROJECT_STUDENTS: 'project_students'
};

export const CHANGE_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  DENIED: 'denied'
};

// Save changes to localStorage
export const saveChanges = (type, changes, description = '') => {
  const existingChanges = getStoredChanges();
  const changeId = Date.now().toString();

  const newChange = {
    id: changeId,
    type: type,
    description: description,
    changes: changes,
    timestamp: new Date().toISOString(),
    status: CHANGE_STATUS.DRAFT
  };

  existingChanges[changeId] = newChange;
  localStorage.setItem('pendingChanges', JSON.stringify(existingChanges));

  return changeId;
};

// Get all stored changes
export const getStoredChanges = () => {
  const stored = localStorage.getItem('pendingChanges');
  return stored ? JSON.parse(stored) : {};
};

// Get changes by type
export const getChangesByType = (type) => {
  const allChanges = getStoredChanges();
  return Object.values(allChanges).filter(change => change.type === type);
};

// Get pending changes (draft status)
export const getPendingChanges = () => {
  const allChanges = getStoredChanges();
  return Object.values(allChanges).filter(change => change.status === CHANGE_STATUS.DRAFT);
};

// Update change status
export const updateChangeStatus = (changeId, status) => {
  const existingChanges = getStoredChanges();
  if (existingChanges[changeId]) {
    existingChanges[changeId].status = status;
    localStorage.setItem('pendingChanges', JSON.stringify(existingChanges));
  }
};

// Submit all pending changes for approval
export const submitAllChanges = () => {
  const existingChanges = getStoredChanges();
  const pendingChanges = Object.values(existingChanges).filter(
    change => change.status === CHANGE_STATUS.DRAFT
  );

  // Update all pending changes to submitted status
  pendingChanges.forEach(change => {
    existingChanges[change.id].status = CHANGE_STATUS.SUBMITTED;
  });

  localStorage.setItem('pendingChanges', JSON.stringify(existingChanges));

  return pendingChanges;
};

// Clear all changes (for testing/reset)
export const clearAllChanges = () => {
  localStorage.removeItem('pendingChanges');
};

// Get change type display name
export const getChangeTypeDisplayName = (type) => {
  const names = {
    [CHANGE_TYPES.PROFILE]: 'Profile Information',
    [CHANGE_TYPES.PUBLICATIONS]: 'Publications',
    [CHANGE_TYPES.PATENTS]: 'Patents',
    [CHANGE_TYPES.PROJECT_STUDENTS]: 'Research Guidance'
  };
  return names[type] || type;
};

// Get status display info
export const getStatusDisplayInfo = (status) => {
  const statusInfo = {
    [CHANGE_STATUS.DRAFT]: {
      label: 'Draft',
      color: '#ed8936',
      bgColor: '#fef5e7',
      icon: '📝'
    },
    [CHANGE_STATUS.SUBMITTED]: {
      label: 'Submitted',
      color: '#3182ce',
      bgColor: '#ebf8ff',
      icon: '📤'
    },
    [CHANGE_STATUS.APPROVED]: {
      label: 'Approved',
      color: '#38a169',
      bgColor: '#f0fff4',
      icon: '✅'
    },
    [CHANGE_STATUS.DENIED]: {
      label: 'Denied',
      color: '#e53e3e',
      bgColor: '#fed7d7',
      icon: '❌'
    }
  };
  return statusInfo[status] || statusInfo[CHANGE_STATUS.DRAFT];
};