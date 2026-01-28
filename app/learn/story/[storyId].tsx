import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Dimensions, ScrollView, Share, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

export default function StoryDetailScreen() {
    const { storyId, title, image, url } = useLocalSearchParams();
    const router = useRouter();

    const storyUrl = `https://odia.krishijagran.com/api/story/${storyId}?key=3caa03b3-c20e-46ba-8064-abbf4ebfd9b6&related=0`;

    const handleShare = async () => {
        try {
            await Share.share({
                message: `${title}\n\nRead more at: ${url}`,
                url: url as string,
                title: title as string,
            });
        } catch (error) {
            console.error('Error sharing news:', error);
        }
    };

    // Injected CSS to make the web content look like native app content
    const injectedCSS = `
        (function() {
            const style = document.createElement('style');
            style.innerHTML = \`
                /* Hide typical website clutter */
                header, footer, nav, .sidebar, .related-posts, .comments, .ads, .breadcrumb, 
                .social-share, .author-box, .tags, .pagination, .navbar, .top-bar {
                    display: none !important;
                }
                
                /* Reset body styles */
                body {
                    font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
                    line-height: 1.8 !important;
                    color: #1A1A1A !important;
                    padding: 20px 15px !important;
                    margin: 0 !important;
                    background-color: #FFF !important;
                    font-size: 18px !important;
                }

                /* Image styling */
                img {
                    max-width: 100% !important;
                    height: auto !important;
                    border-radius: 12px !important;
                    margin: 20px 0 !important;
                }

                /* Hide original title and metadata if we show it natively */
                h1, .post-title, .entry-title, .meta, .post-meta, .published-date, .author-name {
                    display: none !important;
                }

                p {
                    margin-bottom: 20px !important;
                }

                /* Typography adjustments for Odia content */
                * {
                    word-wrap: break-word !important;
                }
            \`;
            document.head.appendChild(style);
        })();
    `;

    return (
        <View className="flex-1 bg-white">
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTitle: '',
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="ml-4 w-10 h-10 rounded-full bg-black/30 items-center justify-center backdrop-blur-md"
                        >
                            <Ionicons name="chevron-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={handleShare}
                            className="mr-4 w-10 h-10 rounded-full bg-black/30 items-center justify-center backdrop-blur-md"
                        >
                            <Ionicons name="share-outline" size={20} color="#FFF" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                {/* Hero Section */}
                <View className="relative w-full h-[400px]">
                    <Image
                        source={{ uri: image as string || 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800' }}
                        style={{ width: '100%', height: '100%' }}
                        contentFit="cover"
                    />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
                        className="absolute inset-0"
                    />
                    <View className="absolute bottom-0 left-0 right-0 p-6">
                        <View className="bg-[#FF4500] self-start px-3 py-1 rounded-full mb-3">
                            <Text className="text-white text-[10px] font-black uppercase tracking-widest">କୃଷି ଖବର (News)</Text>
                        </View>
                        <Text className="text-white text-[24px] font-black leading-8">
                            {title}
                        </Text>
                    </View>
                </View>

                {/* Article Content */}
                <View style={{ height: 1000, width: width }}>
                    <WebView
                        source={{ uri: storyUrl }}
                        style={{ flex: 1 }}
                        injectedJavaScript={injectedCSS}
                        startInLoadingState={true}
                        scrollEnabled={false} // Let the outer ScrollView handle scrolling
                        renderLoading={() => (
                            <View className="py-10 flex-row justify-center items-center bg-white">
                                <ActivityIndicator size="large" color="#FF4500" />
                                <Text className="ml-3 text-gray-400 font-bold text-xs uppercase tracking-widest">
                                    Formatting article...
                                </Text>
                            </View>
                        )}
                    />
                </View>

                {/* Bottom Padding */}
                <View className="h-20" />
            </ScrollView>
        </View>
    );
}
