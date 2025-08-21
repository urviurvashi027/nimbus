// utils/getImage.ts

export const imageMap = {
  anxietyRelease: require("../assets/images/mentalTest/eqTest.png"),
  childhoodTrauma: require("../assets/images/mentalTest/childhoodTrauma.png"),
  // traumaRelease: require("../"),
  //   innerChildHealing: require("../assets/images/meditation/innerChildHealing.png"),
  // Add all your static images here
} as const;

export type ImageKey = keyof typeof imageMap;

export function getImage(imageName: ImageKey) {
  return imageMap[imageName];
}
