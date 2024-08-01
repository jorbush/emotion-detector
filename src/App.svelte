<script lang="ts">
    import { onMount } from 'svelte';
    import * as faceapi from 'face-api.js';

    let emotion: string = 'neutral';
    let isDarkMode: boolean = true;

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
