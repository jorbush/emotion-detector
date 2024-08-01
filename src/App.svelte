<script lang="ts">
    import { onMount } from 'svelte';
    import * as faceapi from 'face-api.js';

    let emotion: string = 'neutral';
    let isDarkMode: boolean = true;

    onMount(async () => {
        const storedTheme = localStorage.getItem('theme');
        isDarkMode = storedTheme === 'dark';
        setTheme(isDarkMode);
    });

    function getStrongestEmotion(expressions: any): string {
        return Object.keys(expressions).reduce((a, b) =>
            expressions[a] > expressions[b] ? a : b
        );
    }

    function toggleTheme() {
        isDarkMode = !isDarkMode;
        setTheme(isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }

    function setTheme(dark: boolean) {
        if (dark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    function getAsciiface(emotion: string): string {
        switch (emotion) {
            case 'happy':
                return '(^_^)';
            case 'sad':
                return '(T_T)';
            case 'angry':
                return '(>_<)';
            case 'fearful':
                return '(o_o)';
            default:
                return '(•_•)';
        }
    }
</script>

<main
    class="flex min-h-screen flex-col items-center p-4 py-10 transition-colors duration-300 dark:bg-gray-900 dark:text-white sm:py-20"
>
    <h1 class="mb-4 pt-20 text-3xl font-bold">Emotion Detector</h1>

    <video
        id="video"
        width="320"
        height="240"
        autoplay
        muted
    ></video>

    <div class="my-4 font-mono text-4xl">
        {getAsciiface(emotion)}
    </div>
    <div class="mt-4 text-xl">
        Current emotion: {emotion}
    </div>
    <button
        on:click={toggleTheme}
        class="absolute right-4 top-4 p-2 text-2xl"
    >
        {isDarkMode ? '🌞' : '🌚'}
    </button>
</main>
