import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Image,
  Modal,
  StyleSheet,
} from "react-native";

const activities = [
  {
    text: "Clean your comb",
    image: require("../../../../assets/images/journaling/travel.png"),
  },
  {
    text: "Drink water",
    image: require("../../../../assets/images/journaling/travel.png"),
  },
  {
    text: "Take a deep breath",
    image: require("../../../../assets/images/journaling/travel.png"),
  },
  {
    text: "Stretch your body",
    image: require("../../../../assets/images/journaling/travel.png"),
  },
  {
    text: "Write a journal",
    image: require("../../../../assets/images/journaling/travel.png"),
  },
];

const MAX_SPINS = 3;

const ThingsToDoModal = ({ isVisible, onClose }: any) => {
  const [spinning, setSpinning] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState<
    Array<{ text: string; image: any }>
  >([
    { text: "", image: null },
    { text: "", image: null },
    { text: "", image: null },
  ]);
  const [spinCount, setSpinCount] = useState(0);
  const spinValues = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    if (!isVisible) {
      resetSlotMachine();
    }
  }, [isVisible]);

  const spin = () => {
    if (spinCount >= MAX_SPINS) return;
    setSpinning(true);
    spinValues.forEach((value) => value.setValue(0));
    Animated.parallel(
      spinValues.map((value) =>
        Animated.timing(value, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      )
    ).start(() => {
      setSpinning(false);
      setSpinCount((prev) => prev + 1);
      setSelectedActivities([
        { text: "", image: null },
        { text: "", image: null },
        { text: "", image: null },
      ]);
      setTimeout(() => {
        setSelectedActivities([
          activities[Math.floor(Math.random() * activities.length)],
          activities[Math.floor(Math.random() * activities.length)],
          activities[Math.floor(Math.random() * activities.length)],
        ]);
      }, 500);
    });
  };

  const resetSlotMachine = () => {
    setSpinning(false);
    setSpinCount(0);
    setSelectedActivities([
      { text: "", image: null },
      { text: "", image: null },
      { text: "", image: null },
    ]);
    spinValues.forEach((value) => value.setValue(0));
  };

  const spinAnimation = spinValues.map((value) =>
    value.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "1080deg"],
    })
  );

  return (
    <Modal visible={isVisible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Pick a little act of</Text>
        <Text style={styles.selfLoveText}>SELF-LOVE</Text>

        <View style={styles.slotMachine}>
          {spinValues.map((spinValue, index) => (
            <Animated.View
              key={index}
              style={{ transform: [{ rotateX: spinAnimation[index] }] }}
            >
              <Text style={styles.emoji}>
                {selectedActivities[index].text || "❓"}
              </Text>
            </Animated.View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.spinButton}
          onPress={spin}
          disabled={spinning || spinCount >= MAX_SPINS}
        >
          <Text style={styles.spinText}>
            Spin Again ({spinCount + 1}/{MAX_SPINS})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.doneButton} onPress={onClose}>
          <Text style={styles.doneText}>Let's do it!</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0A0A0A",
  },
  title: {
    fontSize: 20,
    color: "white",
  },
  selfLoveText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "violet",
  },
  slotMachine: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "80%",
    backgroundColor: "#4B0082",
    padding: 20,
    borderRadius: 8,
  },
  emoji: {
    fontSize: 50,
    marginHorizontal: 10,
  },
  spinButton: {
    backgroundColor: "pink",
    padding: 15,
    borderRadius: 50,
    marginTop: 20,
  },
  spinText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  spinAgainButton: {
    backgroundColor: "orange",
    padding: 15,
    borderRadius: 50,
    marginTop: 20,
  },
  doneButton: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 50,
    marginTop: 20,
  },
  doneText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  resultContainer: {
    backgroundColor: "lightblue",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  resultImage: {
    width: 50,
    height: 50,
    marginVertical: 10,
  },
  closeButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});

export default ThingsToDoModal;
