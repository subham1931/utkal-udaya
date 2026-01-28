import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'; // Added useRouter
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';

export default function CategoryNewsScreen() {
    const { id, title } = useLocalSearchParams();
    const router = useRouter(); // Initialized useRouter
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const handleNewsPress = (storyId: string, title: string, image: string, url: string) => {
        if (storyId) {
            router.push({
                pathname: '/learn/story/[storyId]',
                params: { storyId, title, image, url }
            });
        }
    };

    const fetchCategoryNews = useCallback(async () => {
        try {
            const response = await fetch(`https://meensou.com/myclimate/app/beneficiary/learn/getcategory_json.php?cat=${id}`);
            const data = await response.json();

            // Handle variations in key name (news vs new   ws)
            const newsList = data.news || data['new   ws'] || data.new_ws || [];
            setNews(newsList);
        } catch (error) {
            console.error('Error fetching category news:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [id]);

    useEffect(() => {
        fetchCategoryNews();
    }, [fetchCategoryNews]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchCategoryNews();
    };

    const renderNewsItem = ({ item }: any) => (
        <TouchableOpacity
            className="bg-white mx-4 mb-5 rounded-[28px] overflow-hidden shadow-sm elevation-4 border border-[#F0F0F0]"
            activeOpacity={0.7}
            onPress={() => handleNewsPress(item.id, item.title, item.coverImage, item.url)}
        >
            <View className="flex-row p-2.5">
                <View className="relative">
                    <Image
                        source={{ uri: item.coverImage || 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=400' }}
                        style={{ width: 125, height: 125, borderRadius: 20 }}
                        contentFit="cover"
                        transition={300}
                    />
                    <View className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 rounded-md">
                        <Text className="text-[8px] text-white font-black uppercase tracking-widest">News</Text>
                    </View>
                </View>

                <View className="flex-1 ml-4 py-1.5 justify-between">
                    <View>
                        <View className="flex-row items-center mb-1.5">
                            <Ionicons name="calendar-outline" size={12} color="#999" />
                            <Text className="text-[10px] text-[#999] font-bold ml-1">
                                {item.datePublished?.split(' ')[0]}
                            </Text>
                        </View>

                        <Text className="text-[16px] font-black text-[#1A1A1A] leading-[22px] mb-2" numberOfLines={2}>
                            {item.title}
                        </Text>

                        <Text className="text-[11px] text-gray-400 font-medium leading-[16px]" numberOfLines={3}>
                            {item.summary?.replace(/&hellip;/g, '...')?.replace(/<[^>]*>/g, '')}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-[#F8F9FA]">
            <Stack.Screen
                options={{
                    title: title as string || 'News',
                    headerTitleStyle: { fontWeight: '900', fontSize: 24, color: '#1A1A1A' },
                    headerTintColor: '#FF4500',
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: '#F8F9FA' },
                }}
            />

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#FF4500" />
                    <Text className="text-gray-400 mt-4 font-bold tracking-widest text-[10px] uppercase">Loading Stories...</Text>
                </View>
            ) : (
                <FlatList
                    data={news}
                    renderItem={renderNewsItem}
                    keyExtractor={(item, index) => (item as any).id?.toString() || index.toString()}
                    contentContainerStyle={{ paddingTop: 0, paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#FF4500"]} tintColor="#FF4500" />
                    }
                    ListEmptyComponent={
                        <View className="flex-1 justify-center items-center py-20 px-10">
                            <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-6">
                                <Ionicons name="newspaper-sharp" size={40} color="#CCC" />
                            </View>
                            <Text className="text-[#1A1A1A] text-lg font-bold text-center">No news stories found</Text>
                            <Text className="text-gray-400 text-sm text-center mt-2 font-medium">Please check back later for current updates in this category.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}
