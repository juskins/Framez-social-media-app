import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useAuth } from '../contexts/AuthContext';
import { Colors, Spacing, BorderRadius, FontSizes } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreatePostScreen() {
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const navigation = useNavigation();
  const createPostMutation = useMutation(api.posts.createPost);
  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImageUri(null);
  };

  const handlePost = async () => {
    if (!content.trim() && !imageUri) {
      Alert.alert('Error', 'Please add some content or an image');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to create a post');
      return;
    }

    setLoading(true);
    try {
      let imageStorageId = undefined;
      let imageUrl = imageUri || undefined;

      // If there's an image, upload it to Convex storage
      if (imageUri) {
        try {
          const uploadUrl = await generateUploadUrl();
          
          // Fetch the image as a blob
          const response = await fetch(imageUri);
          const blob = await response.blob();
          
          // Upload to Convex
          const result = await fetch(uploadUrl, {
            method: 'POST',
            headers: { 'Content-Type': blob.type },
            body: blob,
          });
          
          const { storageId } = await result.json();
          imageStorageId = storageId;
        } catch (error) {
          console.error('Image upload error:', error);
          // Continue with post creation even if image upload fails
        }
      }

      await createPostMutation({
        userId: user.userId as any,
        content: content.trim(),
        imageUrl,
        imageStorageId,
      });

      Alert.alert('Success', 'Post created successfully!');
      setContent('');
      setImageUri(null);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
   //  <KeyboardAvoidingView
   //    style={styles.container}
   //    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
   //  >
      
   //   </KeyboardAvoidingView>
     
     <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      
        <View style={styles.container}>
           <View style={styles.header}>
              <TouchableOpacity
                 style={styles.backButton}
                 onPress={() => navigation.goBack()}
              >
                 <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Create Post</Text>
              <View style={styles.backButton} />
           </View>

           <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              <View style={styles.textInputContainer}>
                 <TextInput
                    style={styles.textInput}
                    placeholder="What's on your mind? Share your thoughts and experiences with the community."
                    placeholderTextColor={Colors.textPlaceholder}
                    value={content}
                    onChangeText={setContent}
                    multiline
                    textAlignVertical="top"
                 />
              </View>

              {imageUri && (
                 <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                    <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
                       <Ionicons name="close-circle" size={32} color={Colors.error} />
                    </TouchableOpacity>
                 </View>
              )}

              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                 <Ionicons name="image-outline" size={24} color={Colors.primary} />
                 <Text style={styles.uploadButtonText}>Upload Image</Text>
              </TouchableOpacity>

              <TouchableOpacity
                 style={[styles.postButton, loading && styles.postButtonDisabled]}
                 onPress={handlePost}
                 disabled={loading}
              >
                 {loading ? (
                    <ActivityIndicator color={Colors.white} />
                 ) : (
                    <Text style={styles.postButtonText}>Post</Text>
                 )}
              </TouchableOpacity>


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
  },
  textInputContainer: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  textInput: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  uploadButtonText: {
    fontSize: FontSizes.md,
    color: Colors.primary,
    fontWeight: "600" as any,
    marginLeft: Spacing.sm,
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  imagePreview: {
    width: '100%',
    height: 250,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.secondary,
  },
  removeImageButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: 16,
  },
  postButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  postButtonDisabled: {
    opacity: 0.6,
  },
  postButtonText: {
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
