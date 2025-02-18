import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

import { getHabitDetailsById } from "@/services/habitService";

const HabitDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Get habit ID from route params

  const [habit, setHabit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getHabitDetails = async (id: string) => {
    setLoading(true);
    try {
      const result = await getHabitDetailsById(id);
      if (result?.success) {
        console.log("successfully got the response", result.data);
      }
    } catch (error: any) {
      console.log(error, "API Error Response");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(id, typeof id);
    if (id) {
      const habitId = Array.isArray(id) ? id[0] : id; // ✅ Ensure id is a string
      getHabitDetails(habitId);
    }
  }, [id]);

  return (
    <View>
      <Text>details</Text>
    </View>
  );
};

export default HabitDetails;
