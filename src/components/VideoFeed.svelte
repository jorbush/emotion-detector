<script lang="ts">
    import { onMount } from 'svelte';
    import * as faceapi from 'face-api.js';
    import { getStrongestEmotion, tellEmotion } from '../utils/emotions';

    export let emotion: string;
    export let isSoundOn: boolean;

    onMount(async () => {
        await loadModels();
        startVideo();
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
                            if (isSoundOn) tellEmotion(emotion);
                            lastEmotionTime = currentTime;
                        }
                    }
                }
            }, 100);
        });
    }
</script>

<video
    class="rounded-lg shadow-xl"
    id="video"
    autoplay
    muted
/>
