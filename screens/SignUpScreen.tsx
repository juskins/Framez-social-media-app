import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useAuth } from '../contexts/AuthContext';
import { Colors, Spacing, BorderRadius, FontSizes } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

type AuthStackParamList = {
  Welcome: undefined;
  SignUp: undefined;
  Login: undefined;
};

type SignUpScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;
};

export default function SignUpScreen({ navigation }: SignUpScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const signUpMutation = useMutation(api.auth.signUp);
  const { login } = useAuth();

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const result = await signUpMutation({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      });

      await login({
        userId: result.userId,
        name: result.name,
        email: result.email,
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
     <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
        <View style={styles.container}>
           <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.header}>
                 <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                 >
                    <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
                 </TouchableOpacity>
                 <Text style={styles.headerTitle}>Sign Up</Text>
                 <View style={styles.backButton} />
              </View>

              <View style={styles.form}>
                 <View style={styles.inputGroup}>
                    <Text style={styles.label}>Name</Text>
                    <View style={styles.inputContainer}>
                       <Ionicons name="person-outline" size={20} color={Colors.textSecondary} />
                       <TextInput
                          style={styles.input}
                          placeholder="Enter your name"
                          placeholderTextColor={Colors.textPlaceholder}
                          value={name}
                          onChangeText={setName}
                          autoCapitalize="words"
                       />
                    </View>
                 </View>

                 <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <View style={styles.inputContainer}>
                       <Ionicons name="mail-outline" size={20} color={Colors.textSecondary} />
                       <TextInput
                          style={styles.input}
                          placeholder="Enter your email"
                          placeholderTextColor={Colors.textPlaceholder}
                          value={email}
                          onChangeText={setEmail}
                          keyboardType="email-address"
                          autoCapitalize="none"
                       />
                    </View>
                 </View>

                 <View style={styles.inputGroup}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputContainer}>
                       <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} />
                       <TextInput
                          style={styles.input}
                          placeholder="Create a password"
                          placeholderTextColor={Colors.textPlaceholder}
                          value={password}
                          onChangeText={setPassword}
                          secureTextEntry
                       />
                    </View>
                 </View>

                 <TouchableOpacity
                    style={[styles.signUpButton, loading && styles.signUpButtonDisabled]}
                    onPress={handleSignUp}
                    disabled={loading}
                 >
                    {loading ? (
                       <ActivityIndicator color={Colors.white} />
                    ) : (
                       <Text style={styles.signUpButtonText}>Sign Up</Text>
                    )}
                 </TouchableOpacity>
              </View>


           </ScrollView>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
   safeArea: {
      flex: 1,
      backgroundColor: Colors.secondary,
   },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: Spacing.xs,
    width: 40,
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "600" as any,
    color: Colors.textPrimary,
  },
  form: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: "500" as any,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    marginLeft: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  signUpButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  signUpButtonText: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: "600" as any,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  footerText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  visilyText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: "600" as any,
  },
});
