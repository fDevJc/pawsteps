'use client'

import React, { useEffect, useState } from 'react';
import { getAIHealthBriefing } from '@/app/lib/supabase/server-actions';

interface AIBriefingProps {
  familyId: string;
}

export default function AIBriefing({ familyId }: AIBriefingProps) {
  const [aiBriefing, setAiBriefing] = useState<string>("AI 건강 브리핑을 가져오는 중...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBriefing() {
      try {
        setLoading(true);
        setError(null);
        // Only fetch if familyId is valid
        if (familyId) {
          const briefing = await getAIHealthBriefing();
          setAiBriefing(briefing);
        } else {
          setAiBriefing("가족 정보가 없어 AI 브리핑을 생성할 수 없습니다.");
        }
      } catch (err) {
        console.error("Failed to fetch AI briefing:", err);
        setError("AI 브리핑을 가져오는 데 실패했습니다.");
        setAiBriefing("AI 브리핑을 가져오는 데 실패했습니다. 다시 시도해주세요.");
      } finally {
        setLoading(false);
      }
    }

    fetchBriefing();
  }, [familyId]); // Refetch if familyId changes

  return (
    <section className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-2">AI Health Briefing</h2>
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">AI 브리핑을 가져오는 중...</p>
      ) : error ? (
        <p className="text-red-500 dark:text-red-400">{error}</p>
      ) : (
        <p className="text-gray-700 dark:text-gray-300">
          {aiBriefing}
        </p>
      )}
    </section>
  );
}
