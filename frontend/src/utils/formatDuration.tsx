export const formatDuration = (nanoseconds: number) => {
    const milliseconds = Math.floor((nanoseconds / 1e6) % 1000);
    const microseconds = Math.floor((nanoseconds / 1e3) % 1000);
    const seconds = Math.floor((nanoseconds / 1e9) % 60);
    const minutes = Math.floor((nanoseconds / (1e9 * 60)) % 60);
    const hours = Math.floor((nanoseconds / (1e9 * 60 * 60)) % 24);

    return [
        hours > 0 ? `${hours}h` : null,
        minutes > 0 ? `${minutes}m` : null,
        `${seconds}s`,
        `${milliseconds}ms`,
        `${microseconds}µs`
    ].filter(Boolean).join(" ");
};