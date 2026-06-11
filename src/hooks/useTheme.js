import { useApp } from '../context/AppContext';
import { generateTheme } from '../utils/themeGenerator';

// Re-export hook so components get theme without calculating independently
export const useTheme = () => {
  const { config } = useApp();
  return config ? generateTheme(config) : generateTheme({
    primaryColor: '#2563EB',
    isDark: false,
    designStyle: 'modern',
  });
};
