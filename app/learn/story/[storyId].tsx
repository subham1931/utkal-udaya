import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { createElement } from 'react';
import { ActivityIndicator, Dimensions, Linking, Platform, ScrollView, Share, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

function paramValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] || '';
  return value || '';
}

function cleanDescription(raw: string) {
  return raw
    .replace(/&hellip;/g, '...')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/<[^>]*>/g, '')
    .trim();
}

export default function StoryDetailScreen() {
  const { storyId, title, image, url, description } = useLocalSearchParams();
  const router = useRouter();
  const isWeb = Platform.OS === 'web';

  const storyTitle = paramValue(title) || 'News Story';
  const storyImage = paramValue(image);
  const parsedUrl = paramValue(url);
  const storyDescription = cleanDescription(paramValue(description));
  const hasValidUrl = parsedUrl.startsWith('http');

  // Only hit the Krishijagran API for real remote story IDs, not local fallbacks like horti-1.
  const looksLikeRemoteId = /^[a-f0-9-]{16,}$/i.test(paramValue(storyId));
  const storyUrl = hasValidUrl
    ? parsedUrl
    : looksLikeRemoteId
      ? `https://odia.krishijagran.com/api/story/${storyId}?key=3caa03b3-c20e-46ba-8064-abbf4ebfd9b6&related=0`
      : '';

  const handleShare = async () => {
    const shareUrl = hasValidUrl ? parsedUrl : storyUrl;
    if (!shareUrl && !storyTitle) return;

    try {
      if (isWeb && typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: storyTitle,
          text: storyDescription || storyTitle,
          url: shareUrl || undefined,
        });
        return;
      }
      await Share.share({
        message: shareUrl ? `${storyTitle}\n\nRead more at: ${shareUrl}` : storyTitle,
        url: shareUrl || undefined,
        title: storyTitle,
      });
    } catch (error) {
      console.error('Error sharing news:', error);
    }
  };

  const openStoryInBrowser = () => {
    if (!storyUrl) return;
    if (isWeb && typeof window !== 'undefined') {
      window.open(storyUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    Linking.openURL(storyUrl);
  };

  const injectedCSS = `
        (function() {
            const style = document.createElement('style');
            style.innerHTML = \`
                header, footer, nav, .sidebar, .related-posts, .comments, .ads, .breadcrumb,
                .social-share, .author-box, .tags, .pagination, .navbar, .top-bar {
                    display: none !important;
                }
                body {
                    font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
                    line-height: 1.8 !important;
                    color: #1A1A1A !important;
                    padding: 20px 15px !important;
                    margin: 0 !important;
                    background-color: #FFF !important;
                    font-size: 18px !important;
                }
                img {
                    max-width: 100% !important;
                    height: auto !important;
                    border-radius: 12px !important;
                    margin: 20px 0 !important;
                }
                h1, .post-title, .entry-title, .meta, .post-meta, .published-date, .author-name {
                    display: none !important;
                }
                p { margin-bottom: 20px !important; }
                * { word-wrap: break-word !important; }
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
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: 'rgba(0,0,0,0.35)',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
              }}
            >
              <Ionicons name="share-outline" size={19} color="#FFF" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="relative w-full h-[400px]">
          <Image
            source={{
              uri:
                storyImage ||
                'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800',
            }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
            className="absolute inset-0"
          />
          <View className="absolute bottom-0 left-0 right-0 p-6">
            <View className="bg-[#FF4500] self-start px-3 py-1 rounded-full mb-3">
              <Text className="text-white text-[10px] font-black uppercase tracking-widest">
                କୃଷି ଖବର (News)
              </Text>
            </View>
            <Text className="text-white text-[24px] font-black leading-8">{storyTitle}</Text>
          </View>
        </View>

        {storyDescription ? (
          <View style={{ paddingHorizontal: 20, paddingTop: 22, paddingBottom: 8 }}>
            <Text
              style={{
                fontSize: 17,
                lineHeight: 28,
                color: '#1F2937',
                fontWeight: '500',
              }}
            >
              {storyDescription}
            </Text>
          </View>
        ) : null}

        {storyUrl ? (
          <>
            {storyDescription ? (
              <TouchableOpacity
                onPress={openStoryInBrowser}
                activeOpacity={0.85}
                style={{
                  marginHorizontal: 20,
                  marginTop: 12,
                  marginBottom: 8,
                  backgroundColor: '#FFF7ED',
                  borderWidth: 1,
                  borderColor: '#FFEDD5',
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={{ color: '#C2410C', fontWeight: '700', fontSize: 14 }}>
                  Read full article
                </Text>
                <Ionicons name="open-outline" size={18} color="#C2410C" />
              </TouchableOpacity>
            ) : null}

            <View style={{ height: storyDescription ? 720 : 1000, width }}>
              {isWeb ? (
                <View style={{ flex: 1 }}>
                  {createElement('iframe', {
                    src: storyUrl,
                    title: storyTitle || 'Article',
                    style: {
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      backgroundColor: '#FFF',
                    },
                  })}
                  <TouchableOpacity
                    onPress={openStoryInBrowser}
                    activeOpacity={0.85}
                    style={{
                      position: 'absolute',
                      right: 16,
                      bottom: 16,
                      backgroundColor: '#FF4500',
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      borderRadius: 20,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Ionicons name="open-outline" size={16} color="#FFF" />
                    <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 12, marginLeft: 6 }}>
                      Open article
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <WebView
                  source={{ uri: storyUrl }}
                  style={{ flex: 1 }}
                  injectedJavaScript={injectedCSS}
                  startInLoadingState={true}
                  scrollEnabled={false}
                  renderLoading={() => (
                    <View className="py-10 flex-row justify-center items-center bg-white">
                      <ActivityIndicator size="large" color="#FF4500" />
                      <Text className="ml-3 text-gray-400 font-bold text-xs uppercase tracking-widest">
                        Formatting article...
                      </Text>
                    </View>
                  )}
                />
              )}
            </View>
          </>
        ) : !storyDescription ? (
          <View style={{ paddingHorizontal: 20, paddingVertical: 40, alignItems: 'center' }}>
            <Ionicons name="document-text-outline" size={36} color="#CBD5E1" />
            <Text style={{ marginTop: 12, color: '#94A3B8', fontWeight: '600', textAlign: 'center' }}>
              Article details are unavailable for this story.
            </Text>
          </View>
        ) : null}

        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
