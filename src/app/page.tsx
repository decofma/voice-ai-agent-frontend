// frontend/app/page.tsx
'use client'; 
import React, { useState } from 'react';
import AgentConfigForm from '../components/AgentConfigForm';
import CallTriggerForm from '../components/CallTriggerForm';
import CallResultsTable from '../components/CallResultsTable';
// Importa os estilos do CSS Module
import styles from './Dashboard.module.css';

const AdminDashboard: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUpdate = () => {
    setRefreshKey(prev => prev + 1); 
  };

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.headerTitle}>
        🤖 AI Voice Agent Control Panel
      </h1>
      <p className={styles.headerSubtitle}>
        Configure, test, and review your AI agent's calls.
      </p>
      
      <div className={styles.grid}>
        
        <div className={styles.panel}>
          <AgentConfigForm onUpdate={handleUpdate} />
        </div>
        
        <div className={styles.panel}>
          <CallTriggerForm refreshKey={refreshKey} onUpdate={handleUpdate} />
        </div>
      </div>
      
      <div className={styles.panel}>
        <CallResultsTable refreshKey={refreshKey} />
      </div>
    </div>
  );
};

export default AdminDashboard;