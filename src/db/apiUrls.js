import {UAParser} from "ua-parser-js";
import { get, del, postBasic } from "./api";
import supabase, {supabaseUrl} from "./supabase";

export async function getUrls() {
  try {
    var response = await get("urls/v1");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    throw new Error("Unable to load URLs: " + error);
  }

  var json = await response.json()
  return json;
}

export async function getUrl({id}) {
  try {
    var response = await get(`urls/v1/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    throw new Error("Short Url not found: " + error);
  }

  const json = await response.json();
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
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    throw new Error("Full Url not found: " + error);
  }

  const json = await response.json();

  // Redirect to the original URL
  window.location.href = json.full_url;
}

export async function createUrl({title, fullUrl, customUrl, user_id}, qrcode) {
  const image_key = Math.random().toString(36).substr(2, 6);
  const fileName = `qr-${image_key}`;

  const {error: storageError} = await supabase.storage
    .from("qrs")
    .upload(fileName, qrcode);

  if (storageError) throw new Error(storageError.message);

  const qr = `${supabaseUrl}/storage/v1/object/public/qrs/${fileName}`;

  try {
    var response = await postBasic(`urls/v1`, {
      title: title,
      full_url: fullUrl,
      custom_url: customUrl,
      qr: qr,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    throw new Error("Unable to create URL " + error);
  }
  const json = await response.json();
  json.qr = qr;
  json.title = title;
  return json
}

export async function deleteUrl(id) {
  try {
    var response = await del(`urls/v1/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    throw new Error("Unable to delete URL " + error);
  }
}
