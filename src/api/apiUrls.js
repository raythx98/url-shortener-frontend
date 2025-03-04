import {UAParser} from "ua-parser-js";
import { get, post, del, postBasic, genericErrorMessage } from "./api";
import supabase, {supabaseUrl} from "./supabase";
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

  const location = await fetch("https://ipapi.co/json");
  const {city, country_name: country} = await location.json();

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

export async function createUrl({title, fullUrl, customUrl, user_id}, qrcode) {
  const image_key = Math.random().toString(36).substr(2, 6);
  const fileName = `qr-${image_key}`;

  try {
    const {error: storageError} = await supabase.storage
      .from("qrs")
      .upload(fileName, qrcode);
    if (storageError) {
      console.error(storageError);
      throw new Error(storageError);
    }
  } catch (error) {
    console.error(error);
    throw new Error(genericErrorMessage);
  }

  const qr = `${supabaseUrl}/storage/v1/object/public/qrs/${fileName}`;

  try {
    if (getAccessToken() === null || getAccessToken() === "") {
      var response = await postBasic(`urls/v1`, {
        title: title,
        full_url: fullUrl,
        custom_url: customUrl,
        qr: qr,
      });
    } else {
      var response = await post(`urls/v1`, {
        title: title,
        full_url: fullUrl,
        custom_url: customUrl,
        qr: qr,
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
  
  json.qr = qr;
  json.title = title;
  return json
}

export async function deleteUrl(id) {
  try {
    var response = await del(`urls/v1/${id}`);
    var json = await response.json();
  } catch (error) {
    console.error(error);
    throw new Error(genericErrorMessage);
  }

  if (!response.ok) {
    console.error(response);
    throw new Error(json.message || genericErrorMessage);
  }
}
