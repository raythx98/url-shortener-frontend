export function formatLink(url) {
    const protocolPattern = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//;
    if (!protocolPattern.test(url)) {
      return `https://${url}`;
    }
    return url;
}