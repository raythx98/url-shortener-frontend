export function set(tokens) {
    // Store tokens in local storage
    localStorage.setItem('AccessToken', tokens.access_token);
    localStorage.setItem('RefreshToken', tokens.refresh_token);
}

export function remove() {
    localStorage.removeItem('AccessToken');
    localStorage.removeItem('RefreshToken');
}

export function getRefreshToken() {
    return localStorage.getItem('RefreshToken');
}

export function getAccessToken() {
    return localStorage.getItem('AccessToken');
}