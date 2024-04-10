// LoginScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TextInput } from 'react-native';
import { auth, database } from '../firebaseConfig';
import { useIdTokenAuthRequest as useGoogleIdTokenAuthRequest } from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { set, ref } from 'firebase/database';
import { useDispatch } from 'react-redux';
import { setUserAuthenticated, setUserName } from '../reduxFolder/UsersSlice';

const AuthScreen = ({ email, setEmail, password, setPassword, isLogin, setIsLogin, handleAuthentication, handleLoginGoogle }) => {
    return (
        <View style={styles.authContainer}>
            <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>

            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
            />
            <View style={styles.buttonContainer}>
                <Button title={isLogin ? 'Sign In' : 'Sign Up'} onPress={handleAuthentication} color="#3498db" />
            </View>

            <View style={styles.bottomContainer}>
                <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
                    {isLogin ? 'Need an account? Sign Up or' : 'Already have an account? Sign In or'}
                </Text>
            </View>
            <View style={styles.bottomContainer}>
                <Button title={'Sign In with google'} onPress={handleLoginGoogle} />
            </View>
        </View>
    );
}

const LoginScreen = ({ setUserId }) => {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const dispatch = useDispatch()
    const [, googleResponse, promptAsyncGoogle] = useGoogleIdTokenAuthRequest({
        selectAccount: true,
        androidClientId: "385170174146-723tj6c339qp93u1ead1ti1b85ma1vfh.apps.googleusercontent.com",
        iosClientId: "385170174146-edovjffl2dbdl0avlgm39f4c99ridkmq.apps.googleusercontent.com",
        webClientId: "385170174146-e1ejgt649mqhv8ptol55bbejkfn12mvn.apps.googleusercontent.com",
    });

    const handleLoginGoogle = async () => {
        await promptAsyncGoogle();
    };

    const loginToFirebase = async (credentials) => {
        const signInResponse = await signInWithCredential(auth, credentials);
    };

    useEffect(() => {
        if (googleResponse?.type === 'success') {
            const credentials = GoogleAuthProvider.credential(
                googleResponse.params.id_token
            );
            loginToFirebase(credentials);
        }
    }, [googleResponse]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, [auth]);

    useEffect(() => {
        if (user) {
            console.log(user)
            dispatch(setUserAuthenticated(true));
            setUserId(user.uid)

            dispatch(setUserName(user.displayName))

        }
    }, [user]);

    const createUserProfile = (userId, userData) => {
        set(ref(database, `users/${userId}`), userData)
    };

    const handleAuthentication = async () => {
        try {
            if (user) {
                // If user is already authenticated, log out
                console.log(user);
                // await signOut(auth);
            } else {
                // Sign in or sign up
                if (isLogin) {
                    // Sign in
                    try {
                        await signInWithEmailAndPassword(auth, email, password);
                        console.log('User signed in successfully!');
                    }
                    catch (error) {
                        alert(error)
                    }
                } else {
                    // Sign up
                    try {
                        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                        const user = userCredential.user;

                        const userName = user.email.split('@')[0]


                        await updateProfile(user, {
                            displayName: userName
                        });

                        await createUserProfile(user.uid, { email: user.email, username: userName });

                    }
                    catch (error) {
                        alert(error)
                        console.log(error)
                    }

                }
            }
        } catch (error) {
            console.error('Authentication error:', error.message);
        }
    };


    return (

        <ScrollView contentContainerStyle={styles.container}>
            <AuthScreen
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                isLogin={isLogin}
                setIsLogin={setIsLogin}
                handleAuthentication={handleAuthentication}
                handleLoginGoogle={handleLoginGoogle}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f0f0f0',
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 16,
        padding: 8,
        borderRadius: 4,
    },
    buttonContainer: {
        marginBottom: 16,
    },
    toggleText: {
        color: '#3498db',
        textAlign: 'center',
    },
    bottomContainer: {
        marginTop: 20,
    },
    emailText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
});
export default LoginScreen;
