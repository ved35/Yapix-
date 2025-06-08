import { FlashMessageOptions } from '@/interface/type';
import { useCallback } from 'react';
import { showMessage as showFlashMessage } from 'react-native-flash-message';

export const useFlashMessage = () => {
  const showMessage = useCallback((options: FlashMessageOptions) => {
    showFlashMessage({
      duration: 3000,
      ...options,
    });
  }, []);

  return { showMessage };
}; 