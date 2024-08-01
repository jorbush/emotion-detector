<script lang="ts">
    import VideoFeed from './components/VideoFeed.svelte';
    import EmotionDisplay from './components/EmotionDisplay.svelte';
    import ThemeToggle from './components/ThemeToggle.svelte';
    import SoundToggle from './components/SoundToggle.svelte';
    import { onMount } from 'svelte';
    import { initTheme } from './utils/theme';

    let emotion: string = 'neutral';
    let isDarkMode: boolean = true;
    let isSoundOn: boolean = true;

    onMount(() => {
        isDarkMode = initTheme();
    });
</script>

<main
    class="flex min-h-screen flex-col items-center justify-center p-4 transition-colors duration-300 dark:bg-gray-900 dark:text-white sm:py-20 gap-5"
>
    <h1 class="mb-10 text-4xl font-bold">Emotion Detector</h1>
    <SoundToggle bind:isSoundOn />
    <VideoFeed
        bind:emotion
        {isSoundOn}
    />
    <EmotionDisplay {emotion} />
    <ThemeToggle bind:isDarkMode />
</main>
