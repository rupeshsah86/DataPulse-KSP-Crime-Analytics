"use client";

import { useState, useEffect, useCallback } from "react";
import { crimeService, Crime } from "@/services/crimeService";
import toast from "react-hot-toast";

export const useCrimes = () => {
  const [crimes, setCrimes] = useState<Crime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCrimes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await crimeService.getAll();
      setCrimes(data);
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to fetch crimes";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ FIXED: CREATE uses POST
  const createCrime = async (data: Partial<Crime>) => {
    try {
      const newCrime = await crimeService.create(data); // ✅ POST
      setCrimes((prev) => [newCrime, ...prev]);
      toast.success("Crime added successfully! 🎉");
      return newCrime;
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to create crime";
      toast.error(message);
      throw err;
    }
  };

  // ✅ UPDATE uses PUT
  const updateCrime = async (id: number, data: Partial<Crime>) => {
    try {
      const updated = await crimeService.update(id, data); // ✅ PUT
      setCrimes((prev) => prev.map((c) => (c.id === id ? updated : c)));
      toast.success("Crime updated successfully! ✅");
      return updated;
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to update crime";
      toast.error(message);
      throw err;
    }
  };

  const deleteCrime = async (id: number) => {
    try {
      await crimeService.delete(id);
      setCrimes((prev) => prev.filter((c) => c.id !== id));
      toast.success("Crime deleted successfully! 🗑️");
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to delete crime";
      toast.error(message);
      throw err;
    }
  };

  const searchCrimes = async (keyword: string) => {
    if (!keyword.trim()) {
      await fetchCrimes();
      return;
    }

    setLoading(true);
    try {
      const data = await crimeService.search(keyword);
      setCrimes(data);
    } catch (err: any) {
      const message = err.response?.data?.message || "Search failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrimes();
  }, [fetchCrimes]);

  return {
    crimes,
    loading,
    error,
    fetchCrimes,
    createCrime, // ✅ POST
    updateCrime, // ✅ PUT
    deleteCrime, // ✅ DELETE
    searchCrimes, // ✅ GET
  };
};
