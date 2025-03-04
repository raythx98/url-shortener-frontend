import { getAccessToken, getRefreshToken, set } from "@/helper/session";

const apiUrl = import.meta.env.VITE_API_URL;
const basicAuthToken = btoa(`${import.meta.env.VITE_BASIC_AUTH_USERNAME}:${import.meta.env.VITE_BASIC_AUTH_PASSWORD}`);

export const genericErrorMessage = "Something went wrong, please try again later";

async function execute(endpoint, method = 'GET', body = null) {
    const url = `${apiUrl}${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    var response = await fetch(url, options);
    if (response.status === 401 && getRefreshToken()) {
      try {
        const newTokens = await refresh(); // refresh tokens
        set(newTokens); // update localStorage
        options.headers.Authorization = `Bearer ${newTokens.access_token}`; // use new access token
        response = await fetch(url, options); // retry request
        if (!response.ok) {
          throw new Error(genericErrorMessage);
        }
      } catch (error) {
        localStorage.clear(); // clear tokens
        window.location.href = '/auth'; // redirect to login
        throw new Error('Unauthorized. Please log in again. ' + error);
      }
    }

    return response
}

async function executeBasic(endpoint, method = 'GET', body = null) {
  const url = `${apiUrl}${endpoint}`;
  const options = {
      method,
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${basicAuthToken}`
      }
  };

  if (body) {
      options.body = JSON.stringify(body);
  }

  return await fetch(url, options);
}

async function refresh() {
  const url = `${apiUrl}auth/v1/refresh`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getRefreshToken()}`
    }
  };

  var response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(genericErrorMessage);
  }

  return response.json();
}

export async function postBasic(endpoint, body) {
  return await executeBasic(endpoint, 'POST', body);
}

export async function post(endpoint, body) {
  return await execute(endpoint, 'POST', body);
}

export async function del(endpoint, body) {
  return await execute(endpoint, 'DELETE', body);
}

export async function get(endpoint) {
  return await execute(endpoint);
}