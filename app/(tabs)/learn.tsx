import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useRef, useEffect } from 'react';

const { width } = Dimensions.get('window');

const LEARN_CAROUSEL = [
    {
        id: '1',
        title: 'ସାରାଦେଶର କୃଷିକ୍ଷେତ୍ରର ସ୍ଥିତିର ସମୀକ୍ଷା',
        image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800',
    },
    {
        id: '2',
        title: 'ଉନ୍ନତ କୃଷି ପ୍ରଣାଳୀ ଓ ସଫଳତା',
        image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800',
    }
];

const COURSES = [
    {
        title: 'କୃଷି ବିଶ୍ୱକୋଷ',
        desc: 'Agriculture Encyclopedia',
        icon: 'leaf-outline',
        color: '#2E7D32',
        bg: '#E8F5E9'
    },
    {
        title: 'ଉଦ୍ୟାନ କୃଷି',
        desc: 'Horticulture',
        icon: 'flower-outline',
        color: '#FF8C00',
        bg: '#FFF3E0'
    },
    {
        title: 'ମତ୍ସ୍ୟ ଏବଂ ପଶୁପାଳନ',
        desc: 'Fisheries & Animal Husbandry',
        icon: 'fish-outline',
        color: '#0277BD',
        bg: '#E1F5FE'
    },
    {
        title: 'ସ୍ୱାସ୍ଥ୍ୟ ଏବଂ ଜୀବନଶୈଳୀ',
        desc: 'Health & Lifestyle',
        icon: 'heart-outline',
        color: '#D81B60',
        bg: '#FCE4EC'
    },
    {
        title: 'ସଫଳ କାହାଣୀ',
        desc: 'Success Stories',
        icon: 'star-outline',
        color: '#FFD700',
        bg: '#FFFDE7'
    },
    {
        title: 'ସରକାରୀ ଯୋଜନା',
        desc: 'Govt. Schemes',
        icon: 'document-text-outline',
        color: '#4CAF50',
        bg: '#E8F5E9'
    },
];

export default function LearnScreen() {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const nextIndex = (activeIndex + 1) % LEARN_CAROUSEL.length;
            if (flatListRef.current) {
                flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [activeIndex]);

    const renderCarouselItem = ({ item }: any) => (
        <View style={styles.carouselItem}>
            <View style={styles.cardContainer}>
                <Image source={item.image} style={styles.carouselImage} contentFit="cover" />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.carouselOverlay}
                >
                    <Text style={styles.carouselTitle}>{item.title}</Text>
                </LinearGradient>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Modern Hero Header */}
                <LinearGradient colors={['#FF8C00', '#FF4500']} style={styles.heroHeader}>
                    <Text style={styles.heroTitle}>ଶିକ୍ଷା କେନ୍ଦ୍ର</Text>
                    <Text style={styles.heroSubtitle}>ନୂତନ କୃଷି ଜ୍ଞାନକୌଶଳ ଶିଖନ୍ତୁ</Text>
                </LinearGradient>

                {/* Informational Carousel */}
                <View style={styles.carouselWrapper}>
                    <FlatList
                        ref={flatListRef}
                        data={LEARN_CAROUSEL}
                        renderItem={renderCarouselItem}
                        horizontal
                        pagingEnabled
                        snapToInterval={width - 40}
                        decelerationRate="fast"
                        showsHorizontalScrollIndicator={false}
                        onScroll={(e) => {
                            const x = e.nativeEvent.contentOffset.x;
                            setActiveIndex(Math.round(x / (width - 40)));
                        }}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ paddingHorizontal: 20 }}
                    />
                    <View style={styles.pagination}>
                        {LEARN_CAROUSEL.map((_, i) => (
                            <View key={i} style={[styles.dot, activeIndex === i && styles.activeDot]} />
                        ))}
                    </View>
                </View>

                {/* Learning Progress & Daily Tip */}
                <View style={styles.content}>
                    <View style={styles.progressCard}>
                        <View style={styles.progressHeader}>
                            <Text style={styles.progressTitle}>ଆପଣଙ୍କ ଅଗ୍ରଗତି (Course Progress)</Text>
                            <Text style={styles.progressPercent}>୪୫%</Text>
                        </View>
                        <View style={styles.progressBarBg}>
                            <LinearGradient
                                colors={['#FF8C00', '#FF4500']}
                                style={[styles.progressBarFill, { width: '45%' }]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            />
                        </View>
                        <Text style={styles.progressInfo}>୩/୬ ପାଠ୍ୟକ୍ରମ ସମାପ୍ତ</Text>
                    </View>

                    <TouchableOpacity style={styles.tipCard} activeOpacity={0.9}>
                        <LinearGradient colors={['#E1F5FE', '#B3E5FC']} style={styles.tipGradient}>
                            <View style={styles.tipIconBox}>
                                <Ionicons name="sunny" size={24} color="#0277BD" />
                            </View>
                            <View style={styles.tipContent}>
                                <Text style={styles.tipTitle}>ଦିନର କୃଷି ପରାମର୍ଶ</Text>
                                <Text style={styles.tipText}>ଖରାଦିନେ ଗଛ ମୂଳେ ହାଲୁକା ପାଣି ଦିଅନ୍ତୁ ଏବଂ ମଲଚିଂ ବ୍ୟବହାର କରନ୍ତୁ ।</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#0277BD" />
                        </LinearGradient>
                    </TouchableOpacity>

                    <Text style={styles.sectionTitle}>ଆମର ପାଠ୍ୟକ୍ରମ</Text>
                    <View style={styles.grid}>
                        {COURSES.map((course, index) => (
                            <TouchableOpacity key={index} style={styles.courseCard} activeOpacity={0.7}>
                                <View style={[styles.iconBox, { backgroundColor: course.bg }]}>
                                    <Ionicons name={course.icon as any} size={32} color={course.color} />
                                </View>
                                <Text style={styles.courseTitle}>{course.title}</Text>
                                <Text style={styles.courseDesc}>{course.desc}</Text>
                                <View style={[styles.arrowBox, { backgroundColor: course.color }]}>
                                    <Ionicons name="arrow-forward" size={16} color="#FFF" />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.bottomSpace} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    heroHeader: {
        padding: 24,
        paddingBottom: 60,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
        letterSpacing: 0.5,
    },
    heroSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        marginTop: 5,
    },
    carouselWrapper: {
        marginTop: -40,
        height: 240,
    },
    carouselItem: {
        width: width - 40,
        height: 200,
        paddingHorizontal: 8,
    },
    cardContainer: {
        flex: 1,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: '#FFF',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    carouselImage: {
        width: '100%',
        height: '100%',
    },
    carouselOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        padding: 15,
    },
    carouselTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
        lineHeight: 24,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#DDD',
        marginHorizontal: 3,
    },
    activeDot: {
        backgroundColor: '#FF8C00',
        width: 16,
    },
    content: {
        padding: 20,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    courseCard: {
        width: '48%',
        backgroundColor: '#FFF',
        borderRadius: 25,
        padding: 20,
        marginBottom: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    iconBox: {
        width: 70,
        height: 70,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    courseTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A1A1A',
        textAlign: 'center',
        marginBottom: 4,
        height: 44, // Ensures text takes up 2 lines
    },
    courseDesc: {
        fontSize: 11,
        color: '#888',
        textAlign: 'center',
        marginBottom: 10,
    },
    progressCard: {
        backgroundColor: '#FFF',
        borderRadius: 25,
        padding: 20,
        marginBottom: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    progressTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#444',
    },
    progressPercent: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FF4500',
    },
    progressBarBg: {
        height: 8,
        backgroundColor: '#F0F0F0',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 10,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressInfo: {
        fontSize: 11,
        color: '#888',
        fontWeight: '500',
    },
    tipCard: {
        marginBottom: 25,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 3,
    },
    tipGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    tipIconBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    tipContent: {
        flex: 1,
    },
    tipTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0277BD',
        marginBottom: 2,
    },
    tipText: {
        fontSize: 12,
        color: '#555',
        lineHeight: 18,
    },
    arrowBox: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
    },
    bottomSpace: {
        height: 40,
    },
});
