import React from 'react';
import {
   View,
   Text,
   StyleSheet,
   TouchableOpacity,
   StatusBar,
   Image,
   FlatList,
   Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useAuth } from '../contexts/AuthContext';
import { Colors, Spacing, BorderRadius, FontSizes } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Post {
   _id: string;
   _creationTime: number;
   userId: string;
   content: string;
   imageUrl?: string;
   likes: number;
   comments: number;
   createdAt: number;
}

export default function ProfileScreen() {
   const { user, logout } = useAuth();
   const userPosts = useQuery(api.posts.getUserPosts, user ? { userId: user.userId as any } : 'skip');
   const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

   const handleLogout = () => {
      Alert.alert(
         'Logout',
         'Are you sure you want to logout?',
         [
            { text: 'Cancel', style: 'cancel' },
            {
               text: 'Logout',
               style: 'destructive',
               onPress: async () => {
                  try {
                     await logout();
                  } catch (error) {
                     Alert.alert('Error', 'Failed to logout');
                  }
               },
            },
         ]
      );
   };

   const renderGridItem = ({ item }: { item: Post }) => (
      <TouchableOpacity style={styles.gridItem}>
         {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.gridImage} />
         ) : (
            <View style={styles.gridPlaceholder}>
               <Ionicons name="image-outline" size={32} color={Colors.textPlaceholder} />
            </View>
         )}
      </TouchableOpacity>
   );

   const renderListItem = ({ item }: { item: Post }) => (
      <View style={styles.listItem}>
         {item.imageUrl && (
            <Image source={{ uri: item.imageUrl }} style={styles.listImage} />
         )}
         <Text style={styles.listContentText}>{item.content}</Text>
         <View style={styles.listStats}>
            <View style={styles.statItem}>
               <Ionicons name="heart-outline" size={16} color={Colors.textSecondary} />
               <Text style={styles.statText}>{item.likes}</Text>
            </View>
            <View style={styles.statItem}>
               <Ionicons name="chatbubble-outline" size={16} color={Colors.textSecondary} />
               <Text style={styles.statText}>{item.comments}</Text>
            </View>
         </View>
      </View>
   );

   return (
      <SafeAreaView style={styles.safeArea}>
         <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

         <View style={styles.container}>
            <View style={styles.header}>
               <View style={styles.logoContainer}>
                  <Ionicons name="camera-outline" size={24} color={Colors.primary} />
                  <Text style={styles.logoText}>Framez</Text>
               </View>
            </View>

            <FlatList
               data={userPosts || []}
               renderItem={viewMode === 'grid' ? renderGridItem : renderListItem}
               keyExtractor={(item) => item._id}
               numColumns={viewMode === 'grid' ? 2 : 1}
               key={viewMode}
               contentContainerStyle={styles.postsListContent}
               showsVerticalScrollIndicator={false}
               ListHeaderComponent={
                  <>
                     <View style={styles.profileSection}>
                        <View style={styles.avatarContainer}>
                           <View style={styles.avatar}>
                              {user?.avatar ? (
                                 <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
                              ) : (
                                 <Ionicons name="person" size={48} color={Colors.white} />
                              )}
                           </View>
                           <View style={styles.onlineIndicator} />
                        </View>

                        <Text style={styles.userName}>{user?.name || 'User'}</Text>
                        <Text style={styles.userEmail}>{user?.email || ''}</Text>

                        <View style={styles.actionButtons}>
                           <TouchableOpacity style={styles.editButton}>
                              <Ionicons name="create-outline" size={20} color={Colors.white} />
                              <Text style={styles.editButtonText}>Edit Profile</Text>
                           </TouchableOpacity>

                           <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                              <Text style={styles.logoutButtonText}>Logout</Text>
                           </TouchableOpacity>
                        </View>
                     </View>

                     <View style={styles.viewModeContainer}>
                        <TouchableOpacity
                           style={[styles.viewModeButton, viewMode === 'grid' && styles.viewModeButtonActive]}
                           onPress={() => setViewMode('grid')}
                        >
                           <Ionicons
                              name="grid"
                              size={24}
                              color={viewMode === 'grid' ? Colors.white : Colors.textSecondary}
                           />
                        </TouchableOpacity>
                        <TouchableOpacity
                           style={[styles.viewModeButton, viewMode === 'list' && styles.viewModeButtonActive]}
                           onPress={() => setViewMode('list')}
                        >
                           <Ionicons
                              name="list"
                              size={24}
                              color={viewMode === 'list' ? Colors.white : Colors.textSecondary}
                           />
                        </TouchableOpacity>
                     </View>
                  </>
               }
               ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                     <Ionicons name="images-outline" size={64} color={Colors.textPlaceholder} />
                     <Text style={styles.emptyText}>No posts yet</Text>
                     <Text style={styles.emptySubtext}>Start sharing your moments!</Text>
                  </View>
               }
            />
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
      backgroundColor: Colors.white,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
   },
   logoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   logoText: {
      fontSize: FontSizes.xl,
      fontWeight: "700" as any,
      color: Colors.textPrimary,
      marginLeft: Spacing.sm,
   },
   postsListContent: {
      paddingBottom: Spacing.lg,
      flexGrow: 1,
   },
   profileSection: {
      alignItems: 'center',
      paddingVertical: Spacing.xl,
      backgroundColor: Colors.white,
   },
   avatarContainer: {
      position: 'relative',
      marginBottom: Spacing.md,
   },
   avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: Colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
   },
   avatarImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
   },
   onlineIndicator: {
      position: 'absolute',
      bottom: 5,
      right: 5,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: Colors.success,
      borderWidth: 3,
      borderColor: Colors.white,
   },
   userName: {
      fontSize: FontSizes.xxl,
      fontWeight: "700" as any,
      color: Colors.textPrimary,
      marginBottom: Spacing.xs,
   },
   userEmail: {
      fontSize: FontSizes.md,
      color: Colors.textSecondary,
      marginBottom: Spacing.lg,
   },
   actionButtons: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: Spacing.md,
   },
   editButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.primary,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.lg,
      marginRight: Spacing.md,
   },
   editButtonText: {
      color: Colors.white,
      fontSize: FontSizes.md,
      fontWeight: "600" as any,
      marginLeft: 8,
   },
   logoutButton: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
   },
   logoutButtonText: {
      color: Colors.textPrimary,
      fontSize: FontSizes.md,
      fontWeight: "600" as any,
   },
   viewModeContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingVertical: Spacing.md,
      backgroundColor: Colors.white,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
   },
   viewModeButton: {
      padding: Spacing.sm,
      borderRadius: BorderRadius.md,
      backgroundColor: Colors.secondary,
      marginHorizontal: Spacing.xs,
   },
   viewModeButtonActive: {
      backgroundColor: Colors.primary,
   },
   gridItem: {
      flex: 1,
      margin: 2,
      aspectRatio: 1,
   },
   gridImage: {
      width: '100%',
      height: '100%',
      backgroundColor: Colors.secondary,
   },
   gridPlaceholder: {
      width: '100%',
      height: '100%',
      backgroundColor: Colors.secondary,
      justifyContent: 'center',
      alignItems: 'center',
   },
   listItem: {
      backgroundColor: Colors.white,
      marginHorizontal: Spacing.md,
      marginVertical: Spacing.sm,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      borderWidth: 1,
      borderColor: Colors.border,
   },
   listImage: {
      width: '100%',
      height: 200,
      borderRadius: BorderRadius.lg,
      marginBottom: Spacing.md,
      backgroundColor: Colors.secondary,
   },
   listContentText: {
      fontSize: FontSizes.md,
      color: Colors.textPrimary,
      marginBottom: Spacing.sm,
   },
   listStats: {
      flexDirection: 'row',
   },
   statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: Spacing.md,
   },
   statText: {
      fontSize: FontSizes.sm,
      color: Colors.textSecondary,
      marginLeft: 4,
   },
   emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: Spacing.xxl * 2,
   },
   emptyText: {
      fontSize: FontSizes.lg,
      fontWeight: "600" as any,
      color: Colors.textSecondary,
      marginTop: Spacing.md,
   },
   emptySubtext: {
      fontSize: FontSizes.md,
      color: Colors.textPlaceholder,
      marginTop: Spacing.xs,
   },
});
