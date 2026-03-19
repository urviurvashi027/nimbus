import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";
import { AntDesign } from "@expo/vector-icons"; // For plus icon

const SubtaskInput = () => {
  const [subtasks, setSubtasks] = useState<string[]>([""]); // Start with one input field

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, ""]); // Add a new empty input field
  };

  const handleSubtaskChange = (text: string, index: number) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index] = text; // Update the specific subtask
    setSubtasks(updatedSubtasks);
  };

  return (
    <View style={styles.container}>
      <FlatList
        scrollEnabled={false}
        data={subtasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder={`Subtask ${index + 1}`}
              value={item}
              onChangeText={(text) => handleSubtaskChange(text, index)}
            />
            {index === subtasks.length - 1 && ( // Show plus icon only for last input
              <TouchableOpacity
                onPress={handleAddSubtask}
                style={styles.plusButton}
              >
                <AntDesign name="pluscircleo" size={24} color="blue" />
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  plusButton: {
    marginLeft: 10,
  },
});

export default SubtaskInput;
