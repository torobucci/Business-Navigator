import { useEffect, useState } from "react";
import { View, Button, Image } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '385170174146-9hc2v29vk0l4am6gaiei62igodlh11be.apps.googleusercontent.com',
    iosClientId: '385170174146-9hc2v29vk0l4am6gaiei62igodlh11be.apps.googleusercontent.com',
    webClientId: '385170174146-m562ap4mr63but3oj6l4m6s0rgfefqf5.apps.googleusercontent.com',
  });

  useEffect(() => {
    handleEffect();
  }, [response, token]);

  async function handleEffect() {
    const user = await getLocalUser();
    console.log("user", user);
    if (!user) {
      if (response?.type === "success") {
        setToken(response.authentication.accessToken);
        getUserInfo(response.authentication.accessToken);
      }
    } else {
      setUserInfo(user);
      console.log("loaded locally");
    }
  }

  const getLocalUser = async () => {
    const data = await AsyncStorage.getItem("@user");
    if (!data) return null;
    return JSON.parse(data);
  };

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {
      // Add your own error handler here
    }
  };

  return (
    <View className="flex-1 bg-white items-center justify-center">
      {!userInfo ? (
        <Button
          title="Sign in with Google"
          disabled={!request}
          onPress={() => {
            promptAsync();
          }}
        />
      ) : (
        <View className="border-1 rounded-15 p-15">
          {userInfo?.picture && (
            <Image source={{ uri: userInfo?.picture }} className="w-100 h-100 rounded-50" />
          )}
          <Text className="text-20 font-bold">Email: {userInfo.email}</Text>
          <Text className="text-20 font-bold">
            Verified: {userInfo.verified_email ? "yes" : "no"}
          </Text>
          <Text className="text-20 font-bold">Name: {userInfo.name}</Text>
        </View>
      )}
      <Button
        title="remove local store"
        onPress={async () => await AsyncStorage.removeItem("@user")}
      />
    </View>
  );
}
