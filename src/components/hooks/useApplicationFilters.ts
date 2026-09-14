"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface UseApplicationFiltersProps {
  initialSearch?: string;
  initialStatus?: string;
  internshipId?: string;
  itemsPerPage?: number;
}

export function useApplicationFilters({
  initialSearch = "",
  initialStatus = "All",
  internshipId = "",
  itemsPerPage = 5,
}: UseApplicationFiltersProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchInput, setSearchInput] = useState(initialSearch);
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);

  useEffect(() => {
    setSearchInput(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    setSelectedStatus(initialStatus);
  }, [initialStatus]);

  // Query Parameters আপডেট করার মূল ফাংশন
  const updateQueryParams = useCallback(
    (newParams: { page?: number; search?: string; status?: string }) => {
      const params = new URLSearchParams(
        searchParams ? searchParams.toString() : ""
      );

      const pageToSet = newParams.page !== undefined ? newParams.page : 1;
      const searchToSet =
        newParams.search !== undefined ? newParams.search : searchInput;
      const statusToSet =
        newParams.status !== undefined ? newParams.status : selectedStatus;

      params.set("page", String(pageToSet));
      params.set("limit", String(itemsPerPage));

      if (searchToSet.trim()) {
        params.set("search", searchToSet.trim());
      } else {
        params.delete("search");
      }

      if (statusToSet && statusToSet !== "All") {
        params.set("status", statusToSet);
      } else {
        params.delete("status");
      }

      if (internshipId) {
        params.set("internshipId", internshipId);
      }

      startTransition(() => {
        router.push(`?${params.toString()}`, { scroll: false });
        router.refresh();
      });
    },
    [searchParams, searchInput, selectedStatus, itemsPerPage, internshipId, router]
  );

  // 🚀 Debounced Live Search: টাইপ করার ৪০০ms পর স্বয়ংক্রিয়ভাবে আপডেট হবে
  useEffect(() => {
    // initial state-এর সাথে মিল থাকলে প্রথম রেন্ডারে ট্র্রিগার থামাবে
    if (searchInput === initialSearch) return;

    const handler = setTimeout(() => {
      updateQueryParams({ page: 1, search: searchInput });
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput, initialSearch, updateQueryParams]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);
    updateQueryParams({ page: 1, status: newStatus });
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setSelectedStatus("All");
    startTransition(() => {
      router.push("?", { scroll: false });
      router.refresh();
    });
  };

  const handlePagination = (
    newPage: number,
    onPageChange?: (page: number) => void
  ) => {
    if (onPageChange) {
      onPageChange(newPage);
      return;
    }
    updateQueryParams({ page: newPage });
  };

  return {
    searchInput,
    setSearchInput,
    selectedStatus,
    setSelectedStatus,
    isPending,
    handleStatusChange,
    handleResetFilters,
    handlePagination,
  };
}
