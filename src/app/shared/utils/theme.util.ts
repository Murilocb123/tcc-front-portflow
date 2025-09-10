export function getTheme(): string {
    const colorScheme = getComputedStyle(document.documentElement)
        .getPropertyValue('color-scheme')
        .trim();
    return colorScheme === 'dark' ? 'dark' : 'light';
}
