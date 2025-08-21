import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#E8F2FF",
    marginRight: 16,
    width: 250,
  },
  imageWrapper: {
    position: "relative",
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  courses: {
    position: "absolute",
    bottom: 10,
    left: 10,
    color: "#fff",
    fontSize: 14,
  },
  adhdText: {
    position: "absolute",
    fontSize: 48,
    fontWeight: "bold",
    color: "rgba(186, 154, 255, 0.8)",
    textAlign: "center",
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  coach: {
    marginTop: 4,
    fontSize: 14,
    color: "#666",
  },
  coachName: {
    fontWeight: "600",
  },
  playButton: {
    marginTop: 10,
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  playText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
