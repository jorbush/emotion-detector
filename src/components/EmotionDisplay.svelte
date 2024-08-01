<script lang="ts">
    import { getAsciiface } from '../utils/emotions';

    export let emotion: string;
</script>

<div class="pt-10 my-2 font-mono text-6xl">
    {getAsciiface(emotion)}
</div>
<div class="my-2 text-xl">
    Mood: {emotion}
</div>
