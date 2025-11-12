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

type LoginScreenProps = {
   navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [stayLoggedIn, setStayLoggedIn] = useState(false);
   const [loading, setLoading] = useState(false);

   const loginMutation = useMutation(api.auth.login);
   const { login } = useAuth();

   const handleLogin = async () => {
      if (!email.trim() || !password.trim()) {
         Alert.alert('Error', 'Please fill in all fields');
         return;
      }

      setLoading(true);
      try {
         const result = await loginMutation({
            email: email.trim().toLowerCase(),
            password: password,
         });

         await login({
            userId: result.userId,
            name: result.name,
            email: result.email,
            avatar: result.avatar,
         });
      } catch (error: any) {
         Alert.alert('Error', error.message || 'Failed to log in');
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
                  <Text style={styles.headerTitle}>Log In</Text>
                  <View style={styles.backButton} />
               </View>

               <View style={styles.content}>
                  <Text style={styles.title}>Log In</Text>

                  <View style={styles.form}>
                     <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color={Colors.textSecondary} />
                        <TextInput
                           style={styles.input}
                           placeholder="Email"
                           placeholderTextColor={Colors.textPlaceholder}
                           value={email}
                           onChangeText={setEmail}
                           keyboardType="email-address"
                           autoCapitalize="none"
                        />
                     </View>

                     <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} />
                        <TextInput
                           style={styles.input}
                           placeholder="Password"
                           placeholderTextColor={Colors.textPlaceholder}
                           value={password}
                           onChangeText={setPassword}
                           secureTextEntry
                        />
                     </View>

                     <View style={styles.optionsContainer}>
                        <TouchableOpacity
                           style={styles.checkboxContainer}
                           onPress={() => setStayLoggedIn(!stayLoggedIn)}
                        >
                           <View style={[styles.checkbox, stayLoggedIn && styles.checkboxChecked]}>
                              {stayLoggedIn && (
                                 <Ionicons name="checkmark" size={16} color={Colors.white} />
                              )}
                           </View>
                           <Text style={styles.checkboxLabel}>Stay Logged In</Text>
                        </TouchableOpacity>

                        <TouchableOpacity>
                           <Text style={styles.forgotPassword}>Forgot Password?</Text>
                        </TouchableOpacity>
                     </View>

                     <TouchableOpacity
                        style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                     >
                        {loading ? (
                           <ActivityIndicator color={Colors.white} />
                        ) : (
                           <Text style={styles.loginButtonText}>Log In</Text>
                        )}
                     </TouchableOpacity>
                  </View>
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
   content: {
      flex: 1,
      paddingHorizontal: Spacing.xl,
      paddingTop: Spacing.xxl,
   },
   title: {
      fontSize: FontSizes.xxxl,
      fontWeight: "700" as any,
      color: Colors.textPrimary,
      marginBottom: Spacing.xl,
      textAlign: 'center',
   },
   form: {
      marginTop: Spacing.lg,
   },
   inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.secondary,
      borderRadius: BorderRadius.lg,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      marginBottom: Spacing.md,
   },
   input: {
      flex: 1,
      fontSize: FontSizes.md,
      color: Colors.textPrimary,
      marginLeft: Spacing.sm,
      paddingVertical: Spacing.sm,
   },
   optionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.lg,
   },
   checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: Colors.textSecondary,
      marginRight: Spacing.sm,
      justifyContent: 'center',
      alignItems: 'center',
   },
   checkboxChecked: {
      backgroundColor: Colors.primary,
      borderColor: Colors.primary,
   },
   checkboxLabel: {
      fontSize: FontSizes.sm,
      color: Colors.textPrimary,
   },
   forgotPassword: {
      fontSize: FontSizes.sm,
      color: Colors.primary,
      fontWeight: "600" as any,
   },
   loginButton: {
      backgroundColor: Colors.primary,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
      marginTop: Spacing.md,
   },
   loginButtonDisabled: {
      opacity: 0.6,
   },
   loginButtonText: {
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
