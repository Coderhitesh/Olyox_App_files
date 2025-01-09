import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../constants/colors';

export function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleUpdatePassword = () => {
        console.log('Password update requested');
    };

    const renderPasswordInput = (label, value, setValue, showPassword, setShowPassword, icon) => (
        <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
                <Icon name={icon} size={20} color="#6366f1" />
                <Text style={styles.label}>{label}</Text>
            </View>
            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    secureTextEntry={!showPassword}
                    value={value}
                    onChangeText={setValue}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    placeholderTextColor="#9ca3af"
                />
                <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                >
                    <Icon
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={24}
                        color="#6366f1"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Icon name="shield-lock" size={40} color="#6366f1" />
                <Text style={styles.title}>Change Password</Text>
                <Text style={styles.subtitle}>
                    Ensure your account is using a long, strong password to stay secure
                </Text>
            </View>

            <View style={styles.formContainer}>
                {renderPasswordInput(
                    'Current Password',
                    currentPassword,
                    setCurrentPassword,
                    showCurrentPassword,
                    setShowCurrentPassword,
                    'lock-outline'
                )}

                {renderPasswordInput(
                    'New Password',
                    newPassword,
                    setNewPassword,
                    showNewPassword,
                    setShowNewPassword,
                    'lock-plus-outline'
                )}

                {renderPasswordInput(
                    'Confirm Password',
                    confirmPassword,
                    setConfirmPassword,
                    showConfirmPassword,
                    setShowConfirmPassword,
                    'lock-check-outline'
                )}

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleUpdatePassword}
                    activeOpacity={0.8}
                >
                    <Icon name="shield-check" size={24} color="#fff" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Update Password</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.securityTipsContainer}>
                <Text style={styles.tipsTitle}>Password Requirements:</Text>
                <View style={styles.tipItem}>
                    <Icon name="check-circle" size={16} color="#6366f1" />
                    <Text style={styles.tipText}>Minimum 8 characters long</Text>
                </View>
                <View style={styles.tipItem}>
                    <Icon name="check-circle" size={16} color="#6366f1" />
                    <Text style={styles.tipText}>Include uppercase & lowercase letters</Text>
                </View>
                <View style={styles.tipItem}>
                    <Icon name="check-circle" size={16} color="#6366f1" />
                    <Text style={styles.tipText}>Include at least one number</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1f2937',
        marginTop: 16,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    formContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    inputContainer: {
        marginBottom: 20,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        color: '#4b5563',
        fontWeight: '600',
        marginLeft: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        overflow: 'hidden',
    },
    input: {
        flex: 1,
        fontSize: 16,
        padding: 16,
        color: '#1f2937',
    },
    eyeIcon: {
        padding: 12,
    },
    button: {
        // backgroundColor: '#6366f1',
        backgroundColor: COLORS.error,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        marginTop: 12,
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    securityTipsContainer: {
        marginTop: 32,
        padding: 16,
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    tipsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 12,
    },
    tipItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    tipText: {
        marginLeft: 8,
        color: '#4b5563',
        fontSize: 14,
    },
});
