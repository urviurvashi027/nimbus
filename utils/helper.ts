import * as Device from "expo-device";
import * as Application from "expo-application";
import { Platform } from "react-native";

// Function to find an object by name and return its id
export function findIdBName(
  items: any,
  property: string,
  idKey: string,
  targetName: string
): number | undefined {
  // Use Array.prototype.find to locate the object
  const foundItem = items.find((item: any) => item[property] === targetName);

  // Return the id if the object is found, otherwise return undefined
  return foundItem ? foundItem[idKey] : undefined;
}

export const addObjectAtEnd = (data: any) => {
  // Get the last object in the array
  const lastObject = data[data.length - 1];

  // Extract the last id and increment it by 1
  const newId = lastObject ? lastObject.id + 1 : 1; // Handle empty array case

  // Create the new object to add
  const newObject = {
    id: newId,
    name: "Add New",
  };

  // Add the new object to the end of the array
  const modifiedArray = [...data, newObject];

  return modifiedArray;
};

export async function getDeviceDetails() {
  // OS
  const osName = Device.osName || (Platform.OS === "ios" ? "iOS" : "Android"); // friendly fallback
  const osVersion = Device.osVersion ?? Platform.Version;
  const os = `${osName} ${osVersion}`;

  // Model / manufacturer
  // On iOS this may return something like "iPhone" or full model depending on platform
  const deviceModel = Device.modelName || Device.deviceName || "Unknown device";

  // App version / build
  const appVersion = Application.nativeApplicationVersion; // e.g. "1.2.0"
  const buildNumber = Application.nativeBuildVersion; // e.g. "42"

  return {
    os,
    device: deviceModel,
    appVersion: appVersion ? `${appVersion} (${buildNumber})` : null,
  };
}
