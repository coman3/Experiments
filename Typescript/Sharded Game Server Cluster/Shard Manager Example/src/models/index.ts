export * from "./tile";
export * from "./vector";

export function safeReplacer(key: string, value: any) {
    if (key === "parent") return undefined;
    else if (key === "tiles") return undefined;
    else if (key === "_type") return undefined;

    return value;
}