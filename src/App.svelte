<script lang="ts">
    import { onMount } from 'svelte';
    import * as faceapi from 'face-api.js';

    let emotion: string = 'neutral';
    let isDarkMode: boolean = true;
    let isSoundOn: boolean = true;

    onMount(async () => {
        await loadModels();
        startVideo();

        const storedTheme = localStorage.getItem('theme');
        isDarkMode = storedTheme === 'dark';
        setTheme(isDarkMode);
    });

    async function loadModels() {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceExpressionNet.loadFromUri('/models');
    }

    function startVideo() {
        const video = document.getElementById('video') as HTMLVideoElement;
        let lastEmotionTime = 0;
        const cooldownPeriod = 4000;

        navigator.mediaDevices
            .getUserMedia({ video: {} })
            .then((stream) => {
                video.srcObject = stream;
            })
            .catch((err) => console.error(err));

        video.addEventListener('play', () => {
            setInterval(async () => {
                const detections = await faceapi
                    .detectSingleFace(
                        video,
                        new faceapi.TinyFaceDetectorOptions()
                    )
                    .withFaceExpressions();
                if (detections) {
                    const newEmotion = getStrongestEmotion(
                        detections.expressions
                    );
                    if (newEmotion !== emotion) {
                        emotion = newEmotion;
                        const currentTime = Date.now();
                        if (currentTime - lastEmotionTime > cooldownPeriod) {
                            tellEmotion(emotion);
                            lastEmotionTime = currentTime;
                        }
                    }
                }
            }, 100);
        });
    }

    function getStrongestEmotion(expressions: faceapi.FaceExpressions): string {
        return Object.keys(expressions).reduce((a, b) =>
            expressions[a as keyof faceapi.FaceExpressions] >
            expressions[b as keyof faceapi.FaceExpressions]
                ? a
                : b
        );
    }

    async function tellEmotion(emotion: string) {
        if (!isSoundOn) return;
        try {
            const utterance = new SpeechSynthesisUtterance(
                `You look ${emotion}`
            );
            utterance.lang = 'en-US';
            window.speechSynthesis.speak(utterance);
        } catch (error) {
            console.error('Error in text-to-speech:', error);
        }
    }

    function toggleTheme() {
        isDarkMode = !isDarkMode;
        setTheme(isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }

    function toggleSound() {
        isSoundOn = !isSoundOn;
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
            case 'disgusted':
                return '(x_x)';
            case 'surprised':
                return '(O_O)';
            default:
                return '(•_•)';
        }
    }
</script>

<main
    class="flex min-h-screen flex-col items-center justify-center p-4 transition-colors duration-300 dark:bg-gray-900 dark:text-white sm:py-20 gap-5"
>
    <h1 class="mb-10 text-4xl font-bold">Emotion Detector</h1>
    <button
        on:click={toggleSound}
        class="absolute left-4 top-4 p-2 text-2xl"
        aria-label={isSoundOn ? 'Mute sound' : 'Unmute sound'}
    >
        {#if isSoundOn}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path
                    d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"
                ></path>
            </svg>
        {:else}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line
                    x1="23"
                    y1="9"
                    x2="17"
                    y2="15"
                ></line>
                <line
                    x1="17"
                    y1="9"
                    x2="23"
                    y2="15"
                ></line>
            </svg>
        {/if}
    </button>
    <video
        class="rounded-lg shadow-xl"
        id="video"
        autoplay
        muted
    />

    <div class="pt-10 my-2 font-mono text-6xl">
        {getAsciiface(emotion)}
    </div>
    <div class="my-2 text-xl">
        Mood: {emotion}
    </div>
    <button
        on:click={toggleTheme}
        class="absolute right-4 top-4 p-2 text-2xl"
    >
        {isDarkMode ? '🌞' : '🌚'}
    </button>
</main>
