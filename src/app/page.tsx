'use client';

import React, { useState, useEffect } from 'react';
import { 
  INITIAL_WORKERS, INITIAL_OPERATIONS, INITIAL_TRANSACTIONS, 
  INITIAL_COMPLAINTS, INITIAL_VEHICLES, Worker, ZoneOperation, 
  FinancialTransaction, CitizenComplaint, Vehicle 
} from '@/data/mockData';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WebsiteView } from '@/components/WebsiteView';
import { PlatformDashboard } from '@/components/PlatformDashboard';
import { CitizenComplaintModal } from '@/components/CitizenComplaintModal';
import { AIAssistantModal } from '@/components/AIAssistantModal';

export default function Home() {
  const [currentView, setCurrentView] = useState<'website' | 'platform'>('website');
  const [isCitizenModalOpen, setIsCitizenModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // App Data States
  const [workers, setWorkers] = useState<Worker[]>(INITIAL_WORKERS);
  const [operations, setOperations] = useState<ZoneOperation[]>(INITIAL_OPERATIONS);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(INITIAL_TRANSACTIONS);
  const [complaints, setComplaints] = useState<CitizenComplaint[]>(INITIAL_COMPLAINTS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);

  // Offline / PWA Management
  const [isOffline, setIsOffline] = useState(false);
  const [pendingSyncQueue, setPendingSyncQueue] = useState<any[]>([]);

  // Listen to browser network changes
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      handleManualSync();
    };
    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setIsOffline(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Synchronize pending offline queue
  const handleManualSync = () => {
    if (pendingSyncQueue.length > 0) {
      console.log('Sincronizando itens offline com o servidor...');
      setPendingSyncQueue([]);
    }
  };

  // Operation validation by supervisor / management
  const handleValidateOperation = (opId: string) => {
    setOperations(prev => prev.map(op => {
      if (op.id === opId) {
        return {
          ...op,
          status: 'concluido',
          tonnageMeasured: op.tonnageEstimated + 0.2, // Simula pesagem oficial da lixeira
          validatedBy: 'Edir Jorge Muluta Pacelli (Gerente / CEO)',
          completionDate: new Date().toLocaleDateString('pt-AO') + ' ' + new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })
        };
      }
      return op;
    }));
  };

  // Add new financial transaction
  const handleAddTransaction = (newTx: FinancialTransaction) => {
    setTransactions(prev => [newTx, ...prev]);
    if (isOffline) {
      setPendingSyncQueue(prev => [...prev, { type: 'transaction', data: newTx }]);
    }
  };

  // Citizen Complaint Submission
  const handleSubmitComplaint = (complaintData: Omit<CitizenComplaint, 'id' | 'protocol' | 'createdAt' | 'status'>) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newComplaint: CitizenComplaint = {
      ...complaintData,
      id: `OC-${Date.now()}`,
      protocol: `OK-CND-2026-${randomNum}`,
      createdAt: new Date().toLocaleDateString('pt-AO') + ' ' + new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' }),
      status: 'recebida'
    };

    setComplaints(prev => [newComplaint, ...prev]);
    if (isOffline) {
      setPendingSyncQueue(prev => [...prev, { type: 'complaint', data: newComplaint }]);
    }
  };

  // Update complaint status (triage, resolution)
  const handleUpdateComplaintStatus = (id: string, status: CitizenComplaint['status'], team?: string) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status,
          assignedTeam: team || c.assignedTeam,
          resolvedAt: status === 'resolvida' || status === 'validada_encerrada' ? new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' }) : c.resolvedAt
        };
      }
      return c;
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* Universal Header */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenCitizenModal={() => setIsCitizenModalOpen(true)}
        onOpenAIModal={() => setIsAIModalOpen(true)}
        isOffline={isOffline}
        pendingSyncCount={pendingSyncQueue.length}
        onManualSync={handleManualSync}
      />

      {/* Main Content Area */}
      {currentView === 'website' ? (
        <WebsiteView
          onGoToPlatform={() => setCurrentView('platform')}
          onOpenCitizenModal={() => setIsCitizenModalOpen(true)}
        />
      ) : (
        <PlatformDashboard
          workers={workers}
          operations={operations}
          transactions={transactions}
          complaints={complaints}
          vehicles={vehicles}
          onValidateOperation={handleValidateOperation}
          onAddTransaction={handleAddTransaction}
          onUpdateComplaintStatus={handleUpdateComplaintStatus}
          onOpenAIModal={() => setIsAIModalOpen(true)}
          isOffline={isOffline}
          pendingSyncCount={pendingSyncQueue.length}
          onManualSync={handleManualSync}
        />
      )}

      {/* Citizen Complaint Modal (QR Code, SMS, Web Form) */}
      <CitizenComplaintModal
        isOpen={isCitizenModalOpen}
        onClose={() => setIsCitizenModalOpen(false)}
        complaints={complaints}
        onSubmitComplaint={handleSubmitComplaint}
      />

      {/* AI Assistant Modal (Portuguese Natural Language Operations) */}
      <AIAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        workers={workers}
        operations={operations}
        transactions={transactions}
        onAddTransaction={handleAddTransaction}
      />

      {/* Universal Footer */}
      <Footer />

    </div>
  );
}
