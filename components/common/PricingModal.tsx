import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
} from "react-native";

// import s from "../../assets/images/ball.png"

interface ReusableModalProps {
  visible: boolean;
  onClose: () => void;
  onSeizePress: () => void;
}

const PricingModal: React.FC<ReusableModalProps> = ({
  visible,
  onClose,
  onSeizePress,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={{ fontSize: 18 }}>✕</Text>
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.headerText}>
              MORE SELF-CARE, MORE HAPPINESS, MORE POWER
            </Text>

            <Image
              source={require("../../assets/images/ball.png")} // add your disco ball image here
              style={styles.discoBall}
            />

            <Text style={styles.title}>NEWCOMER DISCOUNT</Text>
            <Text style={styles.discount}>50% OFF</Text>
            <Text style={styles.price}>Only ₹149.9/Month</Text>
            <Text style={styles.totalPrice}>
              Total ₹1799.00/year{" "}
              <Text style={styles.strike}>₹3599.00/year</Text>
            </Text>

            <TouchableOpacity style={styles.button} onPress={onSeizePress}>
              <Text style={styles.buttonText}>Seize Now →</Text>
            </TouchableOpacity>

            <View style={styles.links}>
              <Text
                style={styles.linkText}
                onPress={() => Linking.openURL("#")}
              >
                Terms of Service
              </Text>
              <Text> and </Text>
              <Text
                style={styles.linkText}
                onPress={() => Linking.openURL("#")}
              >
                Privacy Policy
              </Text>
            </View>

            <TouchableOpacity onPress={() => Linking.openURL("#")}>
              <Text style={styles.restore}>Restore</Text>
            </TouchableOpacity>

            <Image
              source={require("../../assets/images/gift.png")} // add your gift box image here
              style={styles.gift}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    backgroundColor: "#F9E7F0",
    borderRadius: 25,
    padding: 20,
    paddingTop: 40,
    alignItems: "center",
    position: "relative",
  },
  scrollContent: {
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    right: 20,
    top: 20,
  },
  headerText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  discoBall: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginVertical: 8,
  },
  discount: {
    fontSize: 36,
    fontWeight: "bold",
  },
  price: {
    fontSize: 16,
    color: "#d30061",
    marginTop: 4,
  },
  totalPrice: {
    fontSize: 14,
    color: "#555",
    marginVertical: 10,
  },
  strike: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  button: {
    backgroundColor: "#000",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginVertical: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  links: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 5,
  },
  linkText: {
    textDecorationLine: "underline",
    color: "#333",
  },
  restore: {
    textDecorationLine: "underline",
    color: "#666",
    marginBottom: 10,
  },
  gift: {
    width: 100,
    height: 40,
    resizeMode: "contain",
  },
});

export default PricingModal;
