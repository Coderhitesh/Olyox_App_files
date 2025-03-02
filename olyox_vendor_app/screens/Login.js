import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { initializeSocket } from '../context/SocketService';

export function Login() {
    const [restaurant_BHID, setRestaurant_BHID] = useState('BH464998');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [resendDisabled, setResendDisabled] = useState(false);
    const navigation = useNavigation()
    // const data = await initializeSocket({
    //     userType: "tiffin_partner",
    //     userId: data.user._id,
    // });
    const sendOTP = async () => {
        if (!restaurant_BHID) {
            Alert.alert('Error', 'Please enter your Restaurant BHID');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://192.168.1.3:3000/api/v1/tiffin/tiffin_login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ restaurant_BHID }),
            });

            const data = await response.json();

            if (data.success) {
                Alert.alert('Success', 'OTP sent to your registered phone');
                setStep(2);
            } else {
                Alert.alert('Error', data.message || 'Failed to send OTP');
            }
        } catch (error) {
            Alert.alert('Error', 'Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle Resend OTP
    const resendOTP = async () => {
        if (!restaurant_BHID) {
            Alert.alert('Error', 'Please enter your Restaurant BHID');
            return;
        }

        setResendDisabled(true); // Disable button for 30 seconds
        setTimeout(() => setResendDisabled(false), 30000); // Re-enable after 30s

        try {
            const response = await fetch('http://192.168.1.3:3000/api/v1/tiffin/resend-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ restaurant_BHID }),
            });

            const data = await response.json();

            if (data.success) {
                Alert.alert('Success', 'OTP resent successfully');
            } else {
                Alert.alert('Error', data.message || 'Failed to resend OTP');
            }
        } catch (error) {
            Alert.alert('Error', 'Network error. Please try again.');
        }
    };

    // Handle OTP verification
    const verifyOTP = async () => {
        if (!otp) {
            Alert.alert('Error', 'Please enter the OTP');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://192.168.1.3:3000/api/v1/tiffin/verify_otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ restaurant_BHID, otp }),
            });

            const data = await response.json();
            console.log(data)
            if (data.success) {
                await AsyncStorage.setItem('userToken', data.token);
                await AsyncStorage.setItem('tiffin_data', JSON.stringify(data.user));
                // const data = await initializeSocket({
                //     userType: "tiffin_partner",
                //     userId: data.user._id,
                // });

                console.log(data)
                navigation.replace('Home');
            } else {
                Alert.alert('Error', data.message || 'Invalid OTP');
            }
        } catch (error) {
            Alert.alert('Error', 'Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Icon name="restaurant-menu" size={80} color={COLORS.error} />
                <Text style={styles.logoText}>Tiffin Service</Text>
            </View>

            <View style={styles.inputContainer}>
                {step === 1 && (
                    <View style={styles.inputWrapper}>
                        <Icon name="business" size={24} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Restaurant BHID"
                            value={restaurant_BHID}
                            onChangeText={setRestaurant_BHID}
                            autoCapitalize="none"
                        />
                    </View>
                )}

                {step === 2 && (
                    <>
                        <View style={styles.inputWrapper}>
                            <Icon name="lock" size={24} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter OTP"
                                value={otp}
                                onChangeText={setOtp}
                                keyboardType="numeric"
                                maxLength={4}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.resendButton, resendDisabled && styles.resendButtonDisabled]}
                            onPress={resendOTP}
                            disabled={resendDisabled}
                        >
                            <Text style={styles.resendButtonText}>
                                {resendDisabled ? 'Wait 30s to Resend' : 'Resend OTP'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => setStep(1)}
                        >
                            <Text style={styles.backButtonText}>Go Back</Text>
                        </TouchableOpacity>
                    </>
                )}

                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={step === 1 ? sendOTP : verifyOTP}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Text style={styles.loginButtonText}>{step === 1 ? 'Send OTP' : 'Verify OTP'}</Text>
                            <Icon name="arrow-forward" size={24} color="#fff" style={styles.loginIcon} />
                        </>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        backgroundColor: '#ed3131',
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        marginTop: 10,
                        borderRadius: 8,
                        alignItems: 'center'
                    }}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('Regisiter')}
                >
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>New Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 40,
    },
    logoText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.error,
        marginTop: 10,
    },
    inputContainer: {
        width: '100%',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        color: '#333',
        fontSize: 16,
    },
    loginButton: {
        backgroundColor: COLORS.error,
        borderRadius: 10,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginIcon: {
        marginLeft: 10,
    },
    resendButton: {
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    resendButtonText: {
        color: COLORS.error,
        fontSize: 16,
        fontWeight: 'bold',
    },
    resendButtonDisabled: {
        opacity: 0.5,
    },
    backButton: {
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    backButtonText: {
        color: COLORS.error,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

