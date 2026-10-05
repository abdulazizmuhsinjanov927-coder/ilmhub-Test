import { useEffect, useRef } from 'react';
import { AntiCheatEvent } from '../types';
import { StorageService } from './storage';

interface UseAntiCheatProps {
  attemptId: string | null;
  isActive: boolean;
  onViolation?: (event: AntiCheatEvent) => void;
}

export function useAntiCheat({ attemptId, isActive, onViolation }: UseAntiCheatProps) {
  const lastEventTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isActive || !attemptId) return;

    const recordViolation = (eventType: AntiCheatEvent['eventType'], details: string) => {
      const now = Date.now();
      // Debounce events within 1.5 seconds to avoid double-triggering
      if (now - lastEventTimeRef.current < 1500) return;
      lastEventTimeRef.current = now;

      const event = StorageService.recordAntiCheatEvent(attemptId, eventType, details);
      if (event && onViolation) {
        onViolation(event);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        recordViolation('tab_switch', 'Foydalanuvchi boshqa brauzer tabiga o\'tdi yoki brauzerni minimallashtirdi');
      }
    };

    const handleBlur = () => {
      recordViolation('window_blur', 'Brauzer oynasidan fokus yo\'qoldi');
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        recordViolation('fullscreen_exit', 'To\'liq ekran rejimidan chiqildi');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [attemptId, isActive, onViolation]);
}
