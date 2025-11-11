import React, { useContext, useEffect } from "react";
import { Stack, useNavigation, useRouter } from "expo-router";
import CoachScreen from "@/components/coach/CoachScreen";
import { fetchCoachData } from "@/services/coachService";
import { ActivityIndicator, View, Text } from "react-native";
import ThemeContext from "@/context/ThemeContext";

export default function CoachRoute() {
  const router = useRouter();
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  const navigation = useNavigation();
  const { newTheme } = useContext(ThemeContext);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  React.useEffect(() => {
    let mounted = true;
    fetchCoachData().then((d) => {
      if (mounted) {
        setData(d);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      {/* <Stack.Screen options={{ headerShown: false }} /> */}
      {loading ? (
        <View
          style={{
            flex: 1,
            backgroundColor: newTheme.background,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color={newTheme.accent} />
          <Text style={{ color: newTheme.textSecondary, marginTop: 12 }}>
            Loading achievements…
          </Text>
        </View>
      ) : (
        <CoachScreen
          data={data}
          onBack={() => router.back()}
          onTopic={(t) =>
            // router.push({ pathname: "/topic", params: { id: t.id } })
            console.log(t, "topic pressed")
          }
          onAdvice={
            (a) => console.log(a, "advice pressed")
            // router.push({ pathname: "/advice", params: { id: a.id } })
          }
          onAsk={
            () => console.log("ask pressed")
            // router.push("/ask")
          }
        />
      )}
    </>
  );
}
