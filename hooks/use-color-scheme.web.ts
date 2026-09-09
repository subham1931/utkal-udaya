import { useContext } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

export function useColorScheme(): 'light' | 'dark' {
    const themeCtx = useContext(ThemeContext);
    if (themeCtx) {
        return themeCtx.theme;
    }
    const sys = useRNColorScheme();
    return sys === 'dark' ? 'dark' : 'light';
}
