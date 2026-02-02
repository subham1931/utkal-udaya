
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CATEGORIES_DATA = [
    { id: '1345', title: 'କୃଷି (Agri)' },
    { id: '1062', title: 'ଉଦ୍ୟାନ (Horti)' },
    { id: '1063', title: 'ପଶୁପାଳନ (Fish)' },
    { id: '1061', title: 'ସ୍ୱାସ୍ଥ୍ୟ (Health)' },
    { id: '1064', title: 'ସଫଳତା (Success)' },
    { id: '48591', title: 'ଯୋଜନା (Scheme)' },
];

export default function NotificationsScreen() {
    const router = useRouter();
    // const { t } = useLanguage();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchNotifications = async () => {
        try {
            // Fetch top news from each category
            const newsPromises = CATEGORIES_DATA.map(async (cat) => {
                try {
                    const response = await fetch(`https://meensou.com/myclimate/app/beneficiary/learn/getcategory_json.php?cat=${cat.id}`);
                    const data = await response.json();
                    const list = data.news || data['new   ws'] || data.new_ws || [];

                    if (list.length > 0) {
                        // Get the first item (top news)
                        const item = list[0];
                        return {
                            id: item.id || Math.random().toString(), // fallback ID
                            type: 'news',
                            title: item.title,
                            subtitle: item.short_desc || 'New update available',
                            image: item.coverImage,
                            category: cat.title,
                            date: item.date || new Date().toISOString(), // You might need to parse/format this
                            url: item.url,
                            read: false
                        };
                    }
                    return null;
                } catch (err) {
                    console.log("Error fetching category", cat.id, err);
                    return null;
                }
            });

            const results = await Promise.all(newsPromises);
            const filtered = results.filter(n => n !== null);
            setNotifications(filtered);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchNotifications();
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
                if (item.type === 'news') {
                    router.push({
                        pathname: '/learn/story/[storyId]',
                        params: {
                            storyId: item.id,
                            title: item.title,
                            image: item.image,
                            url: item.url
                        }
                    });
                }
            }}
            className={`mx-4 mb-3 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm elevation-2 flex-row ${!item.read ? 'bg-orange-50/50' : ''}`}
        >
            <View className="mr-3 relative">
                <Image
                    source={item.image ? { uri: item.image } : null}
                    style={{ width: 50, height: 50, borderRadius: 12, backgroundColor: '#f0f0f0' }}
                    contentFit="cover"
                />
                <View className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                    <View className="bg-[#FF4500] w-4 h-4 rounded-full justify-center items-center">
                        <Ionicons name="newspaper" size={8} color="white" />
                    </View>
                </View>
            </View>

            <View className="flex-1 justify-center">
                <View className="flex-row justify-between items-start mb-1">
                    <Text className="text-[10px] mobile:text-xs font-bold text-[#FF4500] uppercase tracking-wider">
                        {item.category}
                    </Text>
                    <Text className="text-[10px] text-gray-400">
                        Today
                        {/* Replace with actual relative time if available */}
                    </Text>
                </View>
                <Text className="text-sm font-semibold text-gray-800 leading-tight" numberOfLines={2}>
                    {item.title}
                </Text>
            </View>

            {!item.read && (
                <View className="justify-center pl-2">
                    <View className="w-2 h-2 rounded-full bg-[#FF4500]" />
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#F0F7FF] edges={['top']}">
            <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shadow-sm mb-2">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 rounded-full bg-gray-50 justify-center items-center"
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-gray-800">Notifications</Text>
                <TouchableOpacity className="w-10 h-10 justify-center items-center opacity-0">
                    <Ionicons name="settings-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#FF4500" />
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF4500']} />
                    }
                    ListEmptyComponent={
                        <View className="flex-1 justify-center items-center mt-20 px-8">
                            <View className="w-20 h-20 bg-gray-100 rounded-full justify-center items-center mb-4">
                                <Ionicons name="notifications-off-outline" size={40} color="#AAA" />
                            </View>
                            <Text className="text-gray-500 text-center font-medium">
                                No new notifications at the moment.
                            </Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}
