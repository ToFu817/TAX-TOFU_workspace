import { useState, useEffect, useCallback } from 'react';
import { getData } from '../api/gasApi';

/**
 * Custom hook for fetching data from GAS
 * @param {string} sheetName - 工作表名稱
 * @param {Object} filters - 篩選條件
 * @param {boolean} autoFetch - 是否自動載入
 */
export function useGasQuery(sheetName, filters = {}, autoFetch = true) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(async (overrideFilters) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getData(sheetName, overrideFilters || filters);
      if (result.status === 'success') {
        setData(result.data || []);
      } else {
        setError(result.message || '載入失敗');
      }
    } catch (err) {
      setError(err.message || '連線失敗');
    } finally {
      setLoading(false);
    }
  }, [sheetName, JSON.stringify(filters)]);

  useEffect(() => {
    if (autoFetch) fetch();
  }, [fetch, autoFetch]);

  const refetch = useCallback((overrideFilters) => fetch(overrideFilters), [fetch]);

  return { data, setData, loading, error, refetch };
}
