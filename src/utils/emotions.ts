import type { FaceExpressions } from 'face-api.js';

export function getStrongestEmotion(expressions: FaceExpressions): string {
    return Object.keys(expressions).reduce((a, b) =>
        expressions[a as keyof FaceExpressions] >
        expressions[b as keyof FaceExpressions]
            ? a
            : b
    );
}

export function getAsciiface(emotion: string): string {
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

export async function tellEmotion(emotion: string) {
    try {
        const utterance = new SpeechSynthesisUtterance(`You look ${emotion}`);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    } catch (error) {
        console.error('Error in text-to-speech:', error);
    }
}
