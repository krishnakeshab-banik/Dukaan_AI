import { useApp } from '../context/AppContext';
import { assignVariant, getVariant } from '../utils/variantSystem';
import { useMemo } from 'react';

export const useVariant = () => {
  const { config } = useApp();
  const variant = useMemo(() => {
    if (!config) return getVariant(0);
    if (config.variantIndex !== undefined) {
      return getVariant(config.variantIndex % 10);
    }
    return getVariant(assignVariant(config));
  }, [config]);
  return variant;
};
