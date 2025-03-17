import {UAParser} from "ua-parser-js";
import { get, post, del, postBasic, genericErrorMessage } from "./api";
import { getAccessToken } from "@/helper/session";

export async function getUrls() {
  try {
    var response = await get("urls/v1");

    var json = await response.json()
  } catch (error) {
    console.error(error);
    throw new Error(genericErrorMessage);
  }

  if (!response.ok) {
    console.error(response);
    throw new Error(json.message || genericErrorMessage);
  }
  return json;
}

export async function getUrl({id}) {
  try {
    var response = await get(`urls/v1/${id}`);
    
    var json = await response.json();
  } catch (error) {
    console.error(error);
    throw new Error(genericErrorMessage);
  }
  
  if (!response.ok) {
    console.error(response);
    throw new Error(json.message || genericErrorMessage);
  }
  return json;
}

const parser = new UAParser();

export async function redirect(id) {

  const res = parser.getResult();
  const device = res.type || "desktop"; // Default to desktop if type is not detected

  var city = "Unknown";
  var country = "Unknown";

  try {
    const location = await fetch("https://ipapi.co/json");
    if (location.ok) {
      const locationData = await location.json();
      city = locationData.city || "Unknown";
      country = locationData.country_name || "Unknown";
    }
  } catch (error) {
    console.error(error);
  }

  try {
    var response = await postBasic(`urls/v1/redirect/${id}`, {
      city: city,
      country: country,
      device: device,
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
  
  // Redirect to the original URL
  window.location.href = json.full_url;
}

export async function createUrl({title, fullUrl, customUrl, user_id}) {
  try {
    if (getAccessToken() === null || getAccessToken() === "") {
      var response = await postBasic(`urls/v1`, {
        title: title,
        full_url: fullUrl,
        custom_url: customUrl,
      });
    } else {
      var response = await post(`urls/v1`, {
        title: title,
        full_url: fullUrl,
        custom_url: customUrl,
      });
    }
    var json = await response.json();
  } catch (error) {
    console.error(error);
    throw new Error(genericErrorMessage);
  }

  if (!response.ok) {
    console.error(response);
    throw new Error(json.message || genericErrorMessage);
  }
  
  json.title = title;
  return json
}

export async function deleteUrl(id) {
  try {
    var response = await del(`urls/v1/${id}`);
  } catch (error) {
    console.error(error);
    throw new Error(genericErrorMessage);
  }

  if (!response.ok) {
    console.error(response);
    try {
      var json = await response.json();
    } catch (error) {
      console.error(error);
    }
    throw new Error(json?.message || genericErrorMessage);
  }
}
