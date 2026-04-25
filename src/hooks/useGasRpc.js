import { useState, useCallback } from 'react';
import { callGAS } from '../api/gasApi';

/**
 * Custom hook for mutations (Standard actions + Custom RPC)
 */
export function useGasRpc() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (action, params) => {
    setLoading(true);
    setError(null);
    try {
      const result = await callGAS(action, params);
      if (result.status === 'success' || result.status === 'ok') {
        return { success: true, ...result };
      } else {
        const msg = result.message || '操作失敗';
        setError(msg);
        return { success: false, message: msg };
      }
    } catch (err) {
      const msg = err.message || '連線失敗';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    add: (sheetName, rowData) => execute('addRow', { sheetName, rowData }),
    update: (sheetName, rowIndex, rowData) => execute('updateRow', { sheetName, rowIndex, rowData }),
    remove: (sheetName, rowIndex) => execute('deleteRow', { sheetName, rowIndex }),
    importBatch: (sheetName, rows) => execute('batchImport', { sheetName, rows }),
    rpc: (action, params) => execute(action, params),
    loading,
    error
  };
}
