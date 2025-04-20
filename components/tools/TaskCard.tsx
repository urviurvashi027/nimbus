// components/TaskCard.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type TaskCardType = {
  icon: any;
  title: string;
  time: string;
  repeatInfo: any;
  color: any;
  selected: any;
  onToggle: any;
};

const TaskCard: React.FC<TaskCardType> = ({
  icon,
  title,
  time,
  repeatInfo,
  color,
  selected,
  onToggle,
}) => {
  return (
    <TouchableOpacity
      onPress={onToggle}
      style={[
        styles.container,
        { backgroundColor: color, borderWidth: selected ? 2 : 0 },
      ]}
    >
      <View style={styles.row}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.time}>{time}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.repeat}>{repeatInfo}</Text>
        </View>
        <TouchableOpacity>
          <MaterialIcons name="edit" size={20} color="rgba(0,0,0,0.4)" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  icon: {
    fontSize: 30,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  time: {
    fontSize: 12,
    color: "#444",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 4,
  },
  repeat: {
    fontSize: 12,
    color: "#444",
  },
});

export default TaskCard;
