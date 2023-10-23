const convertToRegexPath = (path: string) => {
    const escapedPath = path.replaceAll('/', '\\/');
    return new RegExp(`^${escapedPath}\\/?`)
}

export const removeFromPath = (url: string, path: string, ) => {
    return url?.replace(convertToRegexPath(path), '') || "";
}
