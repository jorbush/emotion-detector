<script lang="ts">
    import { setTheme } from '../utils/theme';

    export let isDarkMode: boolean;

    function toggleTheme() {
        isDarkMode = !isDarkMode;
        setTheme(isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }
</script>

<button
    on:click={toggleTheme}
    class="absolute right-4 top-4 p-2 text-2xl"
>
    {isDarkMode ? '🌞' : '🌚'}
</button>
