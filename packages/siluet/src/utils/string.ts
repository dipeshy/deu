
export function toKebabCase(str: string) {
    const first = str.substr(0, 1).toLowerCase();
    const rest = str.substr(1).replace(/[A-Z]/g, (match) => {
        return "-" + match.toLowerCase();
    });
    return first + rest;
}
