import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'; // Added useRouter
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';

const FALLBACK_CATEGORY_STORIES: Record<string, any[]> = {
    '1345': [
        {
            id: 'agri-1',
            title: 'ମାଟିର ସ୍ୱାସ୍ଥ୍ୟ ପରୀକ୍ଷା ଓ ଉନ୍ନତ ସାର ପ୍ରୟୋଗ ପଦ୍ଧତି',
            summary: 'ଚାଷୀ ଭାଇମାନେ ମାଟି ପରୀକ୍ଷା କାର୍ଡ଼ ବ୍ୟବହାର କରି କମ୍ ଖର୍ଚ୍ଚରେ ଅଧିକ ଫସଲ ଅମଳ କରିପାରିବେ।',
            datePublished: '2026-09-08',
            coverImage: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=600',
        },
        {
            id: 'agri-2',
            title: 'ଜଳସେଚନ ପାଇଁ ସୌର ପମ୍ପ ଯୋଜନା (ସୌର ଜଳନିଧି)',
            summary: 'ରାଜ୍ୟ ସରକାରଙ୍କ ରିହାତି ମାଧ୍ୟମରେ ସୌର ଚାଳିତ ପମ୍ପ ସେଟ୍ ସ୍ଥାପନ କରିବାର ସମ୍ପୂର୍ଣ୍ଣ ପ୍ରଣାଳୀ।',
            datePublished: '2026-09-06',
            coverImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600',
        },
    ],
    '1062': [
        {
            id: 'horti-1',
            title: 'ପଲିହାଉସ୍ ମାଧ୍ୟମରେ ବେମୌସୁମୀ ପନିପରିବା ଚାଷ',
            summary: 'ଉନ୍ନତ ଜ୍ଞାନକୌଶଳରେ ଟମାଟୋ, କ୍ୟାପସିକମ୍ ଚାଷ କରି କୃଷକମାନେ ତିନିଗୁଣ ଲାଭବାନ ହେଉଛନ୍ତି।',
            datePublished: '2026-09-07',
            coverImage: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600',
        },
    ],
    '1063': [
        {
            id: 'dairy-1',
            title: 'ଉନ୍ନତ ଜାତିର ଗାଈ ପାଳନ ଓ ଦୁଗ୍ଧ ଶିଳ୍ପରେ ଆତ୍ମନିର୍ଭରତା',
            summary: 'ଦୁଗ୍ଧ ଉତ୍ପାଦନ ବୃଦ୍ଧି ପାଇଁ ସନ୍ତୁଳିତ ଖାଦ୍ୟ ଓ ରୋଗ ନିୟନ୍ତ୍ରଣ ପାଇଁ ଡାକ୍ତରୀ ପରାମର୍ଶ।',
            datePublished: '2026-09-05',
            coverImage: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=600',
        },
    ],
    '1061': [
        {
            id: 'health-1',
            title: 'ପରିଷ୍କାର ରନ୍ଧନ ଇନ୍ଧନ ଓ ମହିଳାଙ୍କ ଫୁସଫୁସ ସୁରକ୍ଷା',
            summary: 'ଧୂଆଁମୁକ୍ତ ଚୁଲି ଦ୍ୱାରା ଘରର ବାୟୁ ଶୁଦ୍ଧ ରହେ ଏବଂ ଆଖି ଓ ଶ୍ୱାସଜନିତ ରୋଗରୁ ମୁକ୍ତି ମିଳେ।',
            datePublished: '2026-09-04',
            coverImage: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=600',
        },
    ],
    '1064': [
        {
            id: 'success-1',
            title: 'ଜୈବିକ କୃଷିରେ ଯୁବ ଚାଷୀ ରମେଶଙ୍କ ଅଦ୍ଭୁତପୂର୍ବ ସଫଳତା',
            summary: 'ସହରର ଚାକିରି ଛାଡ଼ି ଗାଁରେ କୃଷି କର୍ମ କରି ଆଜି ଅନ୍ୟମାନଙ୍କ ପାଇଁ ପ୍ରେରଣା ସାଜିଛନ୍ତି।',
            datePublished: '2026-09-03',
            coverImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600',
        },
    ],
    '48591': [
        {
            id: 'scheme-1',
            title: 'ମୁଖ୍ୟମନ୍ତ୍ରୀ କୃଷି ଉଦ୍ୟୋଗ ଯୋଜନା (MKUY)',
            summary: 'କୃଷି ଭିତ୍ତିକ ଶିଳ୍ପ ସ୍ଥାପନ ପାଇଁ ୫୦ ଲକ୍ଷ ଟଙ୍କା ପର୍ଯ୍ୟନ୍ତ ସବସିଡି ସୁବିଧା ଉପଲବ୍ଧ।',
            datePublished: '2026-09-02',
            coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=600',
        },
    ],
};

const FALLBACK_DEFAULT = [
    {
        id: 'def-1',
        title: 'ନୂତନ କୃଷି ପ୍ରଯୁକ୍ତି ବିଦ୍ୟା ଓ ସରକାରୀ ସହାୟତା',
        summary: 'ଚାଷୀମାନଙ୍କ ପାଇଁ ଉଦ୍ଦିଷ୍ଟ ବିଭିନ୍ନ ଉନ୍ନୟନମୂଳକ କାର୍ଯ୍ୟକ୍ରମ ଏବଂ ସୁବିଧା ସୁଯୋଗ।',
        datePublished: '2026-09-08',
        coverImage: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=600',
    }
];

export default function CategoryNewsScreen() {
    const { id, title } = useLocalSearchParams();
    const router = useRouter(); // Initialized useRouter
    const [news, setNews] = useState<any[]>([]);
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
            const newsList = data?.news || data?.['new   ws'] || data?.new_ws || [];
            if (Array.isArray(newsList) && newsList.length > 0) {
                setNews(newsList);
            } else {
                setNews((FALLBACK_CATEGORY_STORIES[id as string] || FALLBACK_DEFAULT) as any);
            }
        } catch (error) {
            console.error('Error fetching category news:', error);
            setNews((FALLBACK_CATEGORY_STORIES[id as string] || FALLBACK_DEFAULT) as any);
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
