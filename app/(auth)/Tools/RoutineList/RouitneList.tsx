import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import TaskCard from "@/components/tools/TaskCard";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";

const tasks = [
  {
    id: 1,
    icon: "🧒",
    title: "Discuss the tasks with your child",
    time: "Anytime",
    repeatInfo: "Repeats every weekday",
    color: "#FAD1E6",
  },
  {
    id: 2,
    icon: "🌟",
    title: "Say positive affirmation",
    time: "Anytime",
    repeatInfo: "Repeats every weekday",
    color: "#D1E9FA",
  },
  {
    id: 3,
    icon: "⏱️",
    title: "Beat the buzzer",
    time: "Anytime",
    repeatInfo: "Repeats every weekday",
    color: "#BEE3F8",
  },
  {
    id: 4,
    icon: "⏳",
    title: "Sample task title",
    time: "Anytime",
    repeatInfo: "Repeats every weekday",
    color: "#FBE3A1",
  },
];

const EditRoutineScreen = () => {
  const [selectedIds, setSelectedIds] = useState([3]);
  const { id, type } = useLocalSearchParams();

  const toggleSelection = (id: any) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (id) {
      const typeId = Array.isArray(id) ? id[0] : id; // ✅ Ensure id is a string
      //    getDetails(typeId, type);
    }
  }, [id]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Routine</Text>
        <View style={{ width: 24 }} />
      </View>
      <Text style={styles.subtitle}>
        Edit it to create your personalized routine.
      </Text>

      <ScrollView>
        <Text style={styles.sectionTitle}>Weekly Tasks</Text>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            icon={task.icon}
            title={task.title}
            time={task.time}
            repeatInfo={task.repeatInfo}
            color={task.color}
            selected={selectedIds.includes(task.id)}
            onToggle={() => toggleSelection(task.id)}
          />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    marginHorizontal: 16,
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
  },
  sectionTitle: {
    marginHorizontal: 16,
    marginTop: 12,
    fontWeight: "600",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#7D3EF2",
    margin: 16,
    padding: 14,
    borderRadius: 24,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default EditRoutineScreen;
