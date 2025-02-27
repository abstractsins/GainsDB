export const toTitleCase = (text: string|undefined) => {
    if (text !== undefined) {
        return text.replace(/\b\w/g, (char) => char.toUpperCase())
    } else {
        return '';
    }
}
