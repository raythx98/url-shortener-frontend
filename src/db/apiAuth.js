import { get, post, postBasic } from './api';
import { remove, set } from "@/helper/session";

export async function login({email, password}) {
  try {
    var response = await postBasic("auth/v1/login", {
      email: email, 
      password: password,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    throw new Error("Unable to login: " + error);
  }

  var json = await response.json();
  set(json);
  return json;
}

export async function signup({name, email, password, profile_pic}) {
  try {
    var response = await postBasic("auth/v1/register", {
      email: email, 
      password: password,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    throw new Error("Unable to register: " + error);
  }
}

export async function getCurrentUser() {
  var response = await get("users/v1");
  if (response.status === 401) {
    return null; // User not logged in
  }

  const responseJson = await response.json();
  return responseJson;
}

export async function logout() {
  try {
    var response = await post("auth/v1/logout");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    throw new Error("Unable to logout: " + error);
  }

  remove();
}
