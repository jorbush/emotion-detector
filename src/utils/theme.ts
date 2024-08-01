export function setTheme(dark: boolean) {
    if (dark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

export function initTheme(): boolean {
    const storedTheme = localStorage.getItem('theme');
    const isDark = storedTheme === 'dark';
    setTheme(isDark);
    return isDark;
}
