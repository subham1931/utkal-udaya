import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import HeaderProfileAvatar from '../../components/HeaderProfileAvatar';
import { Colors } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';

interface CategoryConfig {
    query: string;
    tag: string;
    defaultImage: string;
}

const CATEGORY_MAP: Record<string, CategoryConfig> = {
    // 1. Agriculture (1345)
    '1345': {
        query: 'Odisha agriculture',
        tag: 'Agriculture',
        defaultImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600',
    },
    // 2. Horticulture (1062)
    '1062': {
        query: 'Odisha horticulture',
        tag: 'Horticulture',
        defaultImage: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600',
    },
    // 3. Livestock & Dairy (1063)
    '1063': {
        query: 'Odisha dairy',
        tag: 'Dairy & Livestock',
        defaultImage: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=600',
    },
    // 4. Health & Living (1061)
    '1061': {
        query: 'Odisha health',
        tag: 'Health & Living',
        defaultImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600',
    },
    // 5. Success Stories (1064)
    '1064': {
        query: 'Odisha farmer',
        tag: 'Success Story',
        defaultImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600',
    },
    // 6. Govt Schemes (48591)
    '48591': {
        query: 'Odisha scheme',
        tag: 'Govt Scheme',
        defaultImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=600',
    },
};

const FALLBACK_CATEGORY_STORIES: Record<string, any[]> = {
    '1345': [
        {
            id: 'agri-1',
            title: 'ମାଟିର ସ୍ୱାସ୍ଥ୍ୟ ପରୀକ୍ଷା ଓ ଉନ୍ନତ ସାର ପ୍ରୟୋଗ ପଦ୍ଧତି',
            summary: 'ଚାଷୀ ଭାଇମାନେ ମାଟି ପରୀକ୍ଷା କାର୍ଡ଼ ବ୍ୟବହାର କରି କମ୍ ଖର୍ଚ୍ଚରେ ଅଧିକ ଫସଲ ଅମଳ କରିପାରିବେ।',
            datePublished: '2026-09-08',
            coverImage: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=600',
            source: 'କୃଷି ବିଭାଗ',
        },
        {
            id: 'agri-2',
            title: 'ଜଳସେଚନ ପାଇଁ ସୌର ପମ୍ପ ଯୋଜନା (ସୌର ଜଳନିଧି)',
            summary: 'ରାଜ୍ୟ ସରକାରଙ୍କ ରିହାତି ମାଧ୍ୟମରେ ସୌର ଚାଳିତ ପମ୍ପ ସେଟ୍ ସ୍ଥାପନ କରିବାର ସମ୍ପୂର୍ଣ୍ଣ ପ୍ରଣାଳୀ।',
            datePublished: '2026-09-06',
            coverImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600',
            source: 'ସୌର ଜଳନିଧି',
        },
        {
            id: 'agri-3',
            title: 'ଧାନ ଫସଲରେ ରୋଗ ପୋକ ନିୟନ୍ତ୍ରଣ ପାଇଁ ଜୈବିକ ଉପଚାର',
            summary: 'ନିମ ତେଲ ଓ ଜୈବିକ କୀଟନାଶକ ପ୍ରୟୋଗ କରି ପରିବେଶ ଅନୁକୂଳ ପଦ୍ଧତିରେ କୀଟ ଦମନ କରନ୍ତୁ।',
            datePublished: '2026-09-04',
            coverImage: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=600',
            source: 'କୃଷି ବିଜ୍ଞାନ',
        },
    ],
    '1062': [
        {
            id: 'horti-1',
            title: 'ପଲିହାଉସ୍ ମାଧ୍ୟମରେ ବେମୌସୁମୀ ପନିପରିବା ଚାଷ',
            summary: 'ଉନ୍ନତ ଜ୍ଞାନକୌଶଳରେ ଟମାଟୋ, କ୍ୟାପସିକମ୍ ଚାଷ କରି କୃଷକମାନେ ତିନିଗୁଣ ଲାଭବାନ ହେଉଛନ୍ତି।',
            datePublished: '2026-09-07',
            coverImage: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600',
            source: 'ଉଦ୍ୟାନ କୃଷି',
        },
        {
            id: 'horti-2',
            title: 'ଓଡ଼ିଶାରେ ଡ୍ରାଗନ୍ ଫ୍ରୁଟ୍ ଓ ଷ୍ଟ୍ରବେରୀ ଚାଷର ନୂଆ ଦିଗନ୍ତ',
            summary: 'ଅଳ୍ପ ଜମିରେ ଅଧିକ ଲାଭଜନକ ବିଦେଶୀ ଫଳ ଚାଷ କରି ସ୍ୱାବଲମ୍ବୀ ହେଉଛନ୍ତି ଯୁବ ଉଦ୍ୟୋଗୀ।',
            datePublished: '2026-09-05',
            coverImage: 'https://images.unsplash.com/photo-1527777060413-646793f46f41?auto=format&fit=crop&q=80&w=600',
            source: 'ଉଦ୍ୟାନ ମିଶନ',
        },
    ],
    '1063': [
        {
            id: 'dairy-1',
            title: 'ଉନ୍ନତ ଜାତିର ଗାଈ ପାଳନ ଓ ଦୁଗ୍ଧ ଶିଳ୍ପରେ ଆତ୍ମନିର୍ଭରତା',
            summary: 'ଦୁଗ୍ଧ ଉତ୍ପାଦନ ବୃଦ୍ଧି ପାଇଁ ସନ୍ତୁଳିତ ଖାଦ୍ୟ ଓ ରୋଗ ନିୟନ୍ତ୍ରଣ ପାଇଁ ଡାକ୍ତରୀ ପରାମର୍ଶ।',
            datePublished: '2026-09-05',
            coverImage: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=600',
            source: 'ଦୁଗ୍ଧ ବିକାଶ',
        },
        {
            id: 'dairy-2',
            title: 'ଓମଫେଡ୍ ପକ୍ଷରୁ ଦୁଗ୍ଧ କ୍ରୟ ମୂଲ୍ୟରେ ଲିଟର ପିଛା ବୃଦ୍ଧି',
            summary: 'ଦୁଗ୍ଧ ଚାଷୀମାନଙ୍କ ପାଇଁ ଖୁସି ଖବର, ସରକାର ଦୁଗ୍ଧ କ୍ରୟ ଦରରେ ୨ ଟଙ୍କା ବୃଦ୍ଧି ଘୋଷଣା କଲେ।',
            datePublished: '2026-09-03',
            coverImage: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&q=80&w=600',
            source: 'ଓମଫେଡ୍ ସମ୍ବାଦ',
        },
    ],
    '1061': [
        {
            id: 'health-1',
            title: 'ପରିଷ୍କାର ରନ୍ଧନ ଇନ୍ଧନ ଓ ମହିଳାଙ୍କ ଫୁସଫୁସ ସୁରକ୍ଷା',
            summary: 'ଧୂଆଁମୁକ୍ତ ଚୁଲି ଦ୍ୱାରା ଘରର ବାୟୁ ଶୁଦ୍ଧ ରହେ ଏବଂ ଆଖି ଓ ଶ୍ୱାସଜନିତ ରୋଗରୁ ମୁକ୍ତି ମିଳେ।',
            datePublished: '2026-09-04',
            coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600',
            source: 'ସ୍ୱାସ୍ଥ୍ୟ ମିଶନ',
        },
        {
            id: 'health-2',
            title: 'ସୁସ୍ଥ ଜୀବନଶୈଳୀ ପାଇଁ ଶୁଦ୍ଧ ପାନୀୟ ଜଳ ଓ ସ୍ୱଚ୍ଛତା',
            summary: 'ଗ୍ରାମାଞ୍ଚଳରେ ଜଳ ବିଶୋଧନ ଏବଂ ଉତ୍ତମ ସ୍ୱାସ୍ଥ୍ୟ ସୁରକ୍ଷା ପାଇଁ ସଚେତନତା ଅଭିଯାନ।',
            datePublished: '2026-09-02',
            coverImage: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=600',
            source: 'ସ୍ୱଚ୍ଛ ଭାରତ',
        },
    ],
    '1064': [
        {
            id: 'success-1',
            title: 'ଜୈବିକ କୃଷିରେ ଯୁବ ଚାଷୀ ରମେଶଙ୍କ ଅଦ୍ଭୁତପୂର୍ବ ସଫଳତା',
            summary: 'ସହରର ଚାକିରି ଛାଡ଼ି ଗାଁରେ କୃଷି କର୍ମ କରି ଆଜି ଅନ୍ୟମାନଙ୍କ ପାଇଁ ପ୍ରେରଣା ସାଜିଛନ୍ତି।',
            datePublished: '2026-09-03',
            coverImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600',
            source: 'ସଫଳ କୃଷକ',
        },
        {
            id: 'success-2',
            title: 'ମହିଳା ସ୍ୱୟଂ ସହାୟକ ଗୋଷ୍ଠୀଙ୍କ ସଫଳ ଛତୁ ଚାଷ ପ୍ରକଳ୍ପ',
            summary: 'ଅଳ୍ପ ପୁଞ୍ଜିରେ ଛତୁ ଉତ୍ପାଦନ କରି ମାସିକ ୩୦ ହଜାର ଟଙ୍କା ଆୟ କରୁଛନ୍ତି ଗ୍ରାମୀଣ ମହିଳା।',
            datePublished: '2026-09-01',
            coverImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600',
            source: 'ମିଶନ ଶକ୍ତି',
        },
    ],
    '48591': [
        {
            id: 'scheme-1',
            title: 'ମୁଖ୍ୟମନ୍ତ୍ରୀ କୃଷି ଉଦ୍ୟୋଗ ଯୋଜନା (MKUY)',
            summary: 'କୃଷି ଭିତ୍ତିକ ଶିଳ୍ପ ସ୍ଥାପନ ପାଇଁ ୫୦ ଲକ୍ଷ ଟଙ୍କା ପର୍ଯ୍ୟନ୍ତ ସବସିଡି ସୁବିଧା ଉପଲବ୍ଧ।',
            datePublished: '2026-09-02',
            coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=600',
            source: 'ସରକାରୀ ଯୋଜନା',
        },
        {
            id: 'scheme-2',
            title: 'କାଳିଆ ଯୋଜନା: କ୍ଷୁଦ୍ର ଓ ନାମମାତ୍ର ଚାଷୀଙ୍କ ପାଇଁ ଆର୍ଥିକ ସହାୟତା',
            summary: 'ରାଜ୍ୟ ସରକାରଙ୍କ ଦ୍ୱାରା ଯୋଗ୍ୟ ଚାଷୀ ପରିବାରଙ୍କ ବ୍ୟାଙ୍କ ଆକାଉଣ୍ଟକୁ ସିଧାସଳଖ ସହାୟତା ରାଶି।',
            datePublished: '2026-08-30',
            coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600',
            source: 'କାଳିଆ ଯୋଜନା',
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
        source: 'କୃଷି ସମ୍ବାଦ',
    }
];

export default function CategoryNewsScreen() {
    const { id, title, tag } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const colors = Colors[colorScheme ?? 'light'];

    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const catIdStr = Array.isArray(id) ? id[0] : (id ? String(id) : '1345');
    const titleStr = Array.isArray(title) ? title[0] : (title ? String(title) : '');

    // Resolve category configuration and targeted search query
    const getCategoryConfig = (): CategoryConfig => {
        if (CATEGORY_MAP[catIdStr]) {
            return CATEGORY_MAP[catIdStr];
        }

        const tLower = titleStr.toLowerCase();
        if (tLower.includes('horti') || tLower.includes('ଉଦ୍ୟାନ') || tLower.includes('fruit')) {
            return CATEGORY_MAP['1062'];
        }
        if (tLower.includes('dairy') || tLower.includes('livestock') || tLower.includes('ପ୍ରାଣୀ') || tLower.includes('ଗୋପାଳନ')) {
            return CATEGORY_MAP['1063'];
        }
        if (tLower.includes('health') || tLower.includes('living') || tLower.includes('ସ୍ୱାସ୍ଥ୍ୟ') || tLower.includes('clean')) {
            return CATEGORY_MAP['1061'];
        }
        if (tLower.includes('success') || tLower.includes('farmer') || tLower.includes('ସଫଳତା') || tLower.includes('inspire')) {
            return CATEGORY_MAP['1064'];
        }
        if (tLower.includes('scheme') || tLower.includes('subsidy') || tLower.includes('ଯୋଜନା') || tLower.includes('grant')) {
            return CATEGORY_MAP['48591'];
        }

        return CATEGORY_MAP['1345'];
    };

    const categoryConfig = getCategoryConfig();

    const handleNewsPress = (storyId: string, itemTitle: string, image: string, url: string) => {
        router.push({
            pathname: '/learn/story/[storyId]',
            params: {
                storyId: storyId || 'story-detail',
                title: itemTitle || 'News Story',
                image: image || categoryConfig.defaultImage,
                url: url || '',
            }
        });
    };

    const fetchCategoryNews = useCallback(async () => {
        try {
            setLoading(true);
            const query = categoryConfig.query;

            // Call NewsData.io with the category-specific query
            const apiUrl = `https://newsdata.io/api/1/latest?apikey=pub_133361d89e574a76b448e577121addb2&q=${encodeURIComponent(query)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data?.results && Array.isArray(data.results) && data.results.length > 0) {
                const mappedNews = data.results.map((article: any, index: number) => ({
                    id: article.article_id || `cat-${catIdStr}-${index}`,
                    title: article.title || `${titleStr || categoryConfig.tag} News`,
                    summary: article.description || article.content || '',
                    short_desc: article.description || '',
                    coverImage: article.image_url || categoryConfig.defaultImage,
                    url: article.link || '',
                    datePublished: article.pubDate || new Date().toISOString().split('T')[0],
                    date: article.pubDate || '',
                    source: article.source_name || categoryConfig.tag || 'News',
                }));

                setNews(mappedNews);
            } else {
                // Use curated category fallback if no results from API
                const fallbacks = FALLBACK_CATEGORY_STORIES[catIdStr] || FALLBACK_DEFAULT;
                setNews(fallbacks);
            }
        } catch (error) {
            console.error(`Error fetching news for category ${catIdStr} (${categoryConfig.query}):`, error);
            const fallbacks = FALLBACK_CATEGORY_STORIES[catIdStr] || FALLBACK_DEFAULT;
            setNews(fallbacks);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [catIdStr, categoryConfig.query, categoryConfig.defaultImage, categoryConfig.tag, titleStr]);

    useEffect(() => {
        fetchCategoryNews();
    }, [fetchCategoryNews]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchCategoryNews();
    };

    const renderNewsItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={{
                backgroundColor: isDark ? colors.card : '#FFFFFF',
                borderColor: isDark ? colors.cardBorder : '#F0F0F0',
                borderWidth: 1,
            }}
            className="mx-4 mb-4 rounded-[24px] overflow-hidden shadow-sm elevation-3"
            activeOpacity={0.75}
            onPress={() => handleNewsPress(item.id, item.title, item.coverImage, item.url)}
        >
            <View className="flex-row p-3">
                <View className="relative">
                    <Image
                        source={{ uri: item.coverImage || categoryConfig.defaultImage }}
                        style={{ width: 112, height: 112, borderRadius: 18 }}
                        contentFit="cover"
                        transition={300}
                    />
                    <View className="absolute top-2 left-2 bg-black/75 px-2 py-0.5 rounded-md max-w-[90px]">
                        <Text className="text-[8px] text-white font-black uppercase tracking-wider" numberOfLines={1}>
                            {item.source || categoryConfig.tag || 'News'}
                        </Text>
                    </View>
                </View>

                <View className="flex-1 ml-3.5 justify-between py-0.5">
                    <View>
                        <View className="flex-row items-center mb-1.5">
                            <Ionicons name="calendar-outline" size={12} color={isDark ? colors.textSecondary : '#888'} />
                            <Text style={{ color: isDark ? colors.textSecondary : '#888' }} className="text-[11px] font-semibold ml-1">
                                {item.datePublished ? item.datePublished.split(' ')[0] : 'Latest'}
                            </Text>
                        </View>

                        <Text
                            style={{ color: colors.text }}
                            className="text-[15px] font-bold leading-[20px] mb-1.5"
                            numberOfLines={2}
                        >
                            {item.title}
                        </Text>

                        {item.summary ? (
                            <Text
                                style={{ color: isDark ? colors.textSecondary : '#666' }}
                                className="text-[12px] font-normal leading-[17px]"
                                numberOfLines={2}
                            >
                                {item.summary.replace(/&hellip;/g, '...').replace(/<[^>]*>/g, '').trim()}
                            </Text>
                        ) : null}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <Stack.Screen
                options={{
                    title: (titleStr || categoryConfig.tag || 'Category News'),
                    headerTitleStyle: { fontWeight: '900', fontSize: 20, color: colors.text },
                    headerTintColor: '#FF4500',
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: colors.background },
                    headerBackTitle: 'Back',
                    headerBackButtonDisplayMode: 'minimal',
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => router.back()}
                            activeOpacity={0.7}
                            style={{
                                width: 38,
                                height: 38,
                                borderRadius: 19,
                                backgroundColor: isDark ? colors.card : '#F1F5F9',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 12,
                                borderWidth: 1,
                                borderColor: isDark ? colors.cardBorder : '#E2E8F0',
                            }}
                        >
                            <Ionicons name="chevron-back" size={20} color={colors.text} />
                        </TouchableOpacity>
                    ),
                    headerRight: () => <HeaderProfileAvatar size={34} style={{ marginRight: 16 }} />,
                }}
            />

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#FF4500" />
                    <Text
                        style={{ color: colors.textSecondary }}
                        className="mt-4 font-bold tracking-widest text-[11px] uppercase"
                    >
                        Loading {categoryConfig.tag} Stories...
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={news}
                    renderItem={renderNewsItem}
                    keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                    contentContainerStyle={{ paddingTop: 12, paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={["#FF4500"]}
                            tintColor="#FF4500"
                        />
                    }
                    ListEmptyComponent={
                        <View className="flex-1 justify-center items-center py-20 px-10">
                            <View
                                style={{ backgroundColor: isDark ? colors.card : '#F3F4F6' }}
                                className="w-20 h-20 rounded-full items-center justify-center mb-6"
                            >
                                <Ionicons name="newspaper-sharp" size={38} color={isDark ? '#64748B' : '#9CA3AF'} />
                            </View>
                            <Text style={{ color: colors.text }} className="text-lg font-bold text-center">
                                No stories found
                            </Text>
                            <Text style={{ color: colors.textSecondary }} className="text-sm text-center mt-2 font-medium">
                                Check back later for current updates in this category.
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}
