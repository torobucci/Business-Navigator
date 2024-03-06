// LoginScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as Google from "expo-auth-session/providers/google"; // Correct import order
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential } from 'firebase/auth'
import { auth } from '../firebaseConfig';

WebBrowser.maybeCompleteAuthSession();
const LoginScreen = ({ navigation }) => {
    const [token, setToken] = useState("");
    const [userInfo, setUserInfo] = useState(null);

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: "385170174146-723tj6c339qp93u1ead1ti1b85ma1vfh.apps.googleusercontent.com",
        iosClientId: "385170174146-edovjffl2dbdl0avlgm39f4c99ridkmq.apps.googleusercontent.com",
        webClientId: "385170174146-e1ejgt649mqhv8ptol55bbejkfn12mvn.apps.googleusercontent.com",
    });

    useEffect(() => {
        if (response?.type == "success") {
            const { id_token } = response.params
            const credential = GoogleAuthProvider.credential(id_token)
            signInWithCredential(auth, credential)
        }
    }, [response]);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log(JSON.stringify(user))
                setUserInfo(JSON.stringify(user))
            }
            else {
                console.log("else")
            }
        })
        return () => unsub();
    }, [])


    return (
        <>
            {!userInfo && <View style={styles.container}>
                <Text>Login Screen</Text>
                <Button title="Email Login" />
                <Button title="Google Login" onPress={() => promptAsync()} />
                <Button title="Sign Up" />
            </View>}
            {userInfo? navigation.navigate('Home'): ''}
        </>


    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LoginScreen;
