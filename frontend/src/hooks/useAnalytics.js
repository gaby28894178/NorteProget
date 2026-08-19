import { useEffect, useState, useCallback } from "react";

import { getAnalyticsMetrics } from "../api/analyticsApi";
import {
  requestGoogleAuth,
  clearGoogleAuth,
} from "../utils/googleAuth";

export const useAnalytics = () => {
  const [data, setData] = useState(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [source, setSource] = useState("demo");

  const load = useCallback(async (nextDays, forcedToken) => {
    setLoading(true);
    setError(null);

    try {
      const metrics = await getAnalyticsMetrics({
        days: nextDays,
        token: forcedToken,
      });

      setData(metrics);
      setSource(metrics.source);
    } catch (err) {
      console.error("Error al cargar métricas:", err);
      setError("No se pudieron cargar las métricas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    getAnalyticsMetrics({ days })
      .then((metrics) => {
        if (!active) return;
        setData(metrics);
        setSource(metrics.source);
      })
      .catch((err) => {
        if (!active) return;
        console.error("Error al cargar métricas:", err);
        setError("No se pudieron cargar las métricas.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [days]);

  const connectGoogle = async () => {
    setConnecting(true);
    setError(null);

    await requestGoogleAuth({
      onSuccess: (token) => {
        setConnecting(false);
        load(days, token);
      },
      onError: (err) => {
        setConnecting(false);
        setError(err?.message || "No se pudo conectar Google Analytics.");
      },
    });
  };

  const disconnectGoogle = async () => {
    clearGoogleAuth();
    setConnecting(false);
    await load(days);
  };

  const changeDays = (nextDays) => {
    if (nextDays !== days) setDays(nextDays);
  };

  return {
    data,
    days,
    loading,
    error,
    source,
    connecting,
    changeDays,
    connectGoogle,
    disconnectGoogle,
    refresh: () => load(days),
  };
};