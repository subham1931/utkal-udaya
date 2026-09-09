
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../context/ThemeContext';

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
    const { isDark, colors } = useAppTheme();

    // const { t } = useLanguage();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchNotifications = async () => {
        try {
            /*
            // --- OLD API (Commented out) ---
            const newsPromises = CATEGORIES_DATA.map(async (cat) => {
                try {
                    const response = await fetch(`https://meensou.com/myclimate/app/beneficiary/learn/getcategory_json.php?cat=${cat.id}`);
                    const data = await response.json();
                    const list = data.news || data['new   ws'] || data.new_ws || [];

                    if (list.length > 0) {
                        const item = list[0];
                        return {
                            id: item.id || Math.random().toString(),
                            type: 'news',
                            title: item.title,
                            subtitle: item.short_desc || 'New update available',
                            image: item.coverImage,
                            category: cat.title,
                            date: item.date || new Date().toISOString(),
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
            */

            // --- NEW API: NewsData.io ---
            const response = await fetch('https://newsdata.io/api/1/latest?apikey=pub_133361d89e574a76b448e577121addb2&q=Odisha%20agriculture');
            const data = await response.json();

            if (data?.results && Array.isArray(data.results) && data.results.length > 0) {
                const mappedNotifications = data.results.map((article: any, index: number) => ({
                    id: article.article_id || `notif-${index}`,
                    type: 'news',
                    title: article.title || 'Odisha Agriculture Update',
                    subtitle: article.description || 'New agriculture news update',
                    image: article.image_url || 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=400',
                    category: (article.category && article.category[0]) ? article.category[0].toUpperCase() : 'ODISHA AGRI',
                    date: article.pubDate || new Date().toISOString(),
                    url: article.link || '',
                    read: index > 1, // mark first two as new/unread
                }));
                setNotifications(mappedNotifications);
            }
        } catch (error) {
            console.error('Error fetching notifications from NewsData.io:', error);
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
            style={{
                marginHorizontal: 16,
                marginBottom: 12,
                padding: 16,
                borderRadius: 16,
                backgroundColor: !item.read 
                    ? (isDark ? 'rgba(255, 69, 0, 0.12)' : '#FFF7ED')
                    : colors.card,
                borderWidth: 1,
                borderColor: isDark ? colors.cardBorder : '#F1F5F9',
                flexDirection: 'row',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDark ? 0.3 : 0.05,
                shadowRadius: 4,
                elevation: 2,
            }}
        >
            <View className="mr-3 relative">
                <Image
                    source={item.image ? { uri: item.image } : null}
                    style={{ width: 50, height: 50, borderRadius: 12, backgroundColor: isDark ? '#1E293B' : '#f0f0f0' }}
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
                    <Text style={{ fontSize: 10, color: colors.textSecondary }}>
                        Today
                    </Text>
                </View>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, lineHeight: 19 }} numberOfLines={2}>
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
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    backgroundColor: colors.card,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.divider,
                    marginBottom: 8,
                }}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: isDark ? '#334155' : '#F1F5F9',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>Notifications</Text>
                <View style={{ width: 40, height: 40 }} />
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
                            <View style={{ width: 80, height: 80, backgroundColor: isDark ? '#1E293B' : '#F1F5F9', borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                                <Ionicons name="notifications-off-outline" size={40} color={colors.textSecondary} />
                            </View>
                            <Text style={{ color: colors.textSecondary, textAlign: 'center', fontWeight: '500' }}>
                                No new notifications at the moment.
                            </Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}
