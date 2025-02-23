const toTitleCase = (text: string) => text.replace(/\b\w/g, (char) => char.toUpperCase());

export default toTitleCase;