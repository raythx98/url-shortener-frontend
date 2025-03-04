import { get, post, postBasic, genericErrorMessage } from './api';
import { remove, set } from "@/helper/session";

export async function login({email, password}) {
  try {
    var response = await postBasic("auth/v1/login", {
      email: email, 
      password: password,
    });

    var json = await response.json();
  } catch (error) {
    console.error(error);
    throw new Error(genericErrorMessage);
  }

  if (!response.ok) {
    console.error(response);
    throw new Error(json.message || genericErrorMessage);
  }
  
  set(json);
  return json;
}

export async function signup({name, email, password, profile_pic}) {
  try {
    var response = await postBasic("auth/v1/register", {
      email: email, 
      password: password,
    });

    var json = await response.json();
  } catch (error) {
    console.error(error);
    throw new Error(genericErrorMessage);
  }

  if (!response.ok) {
    console.error(response);
    throw new Error(json.message || genericErrorMessage);
  }

  set(json);
  return json
}

export async function getCurrentUser() {
  try {
    var response = await get("users/v1");
    if (response.status === 401) {
      console.error(response);
      return null; // User not logged in
    }

    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function logout() {
  try {
    var response = await post("auth/v1/logout");
    if (!response.ok) {
      console.error(response);
      // Avoid blocking the user if logout fails
      // throw new Error(genericErrorMessage);
    }
  } catch (error) {
    console.error(error);
    // Avoid blocking the user if logout fails
    // throw new Error(genericErrorMessage);
  }

  remove();
}
