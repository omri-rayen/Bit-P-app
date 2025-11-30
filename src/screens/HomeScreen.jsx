import { StyleSheet, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import System from '../components/system';
import Device from '../components/device';
import Header from '../components/Header';
import GradientBackground from '../components/GradientBackground';
import { useLanguage } from '../i18n/LanguageContext';
import { spacing } from '../theme/colors';

export default function HomeScreen () {
    const insets = useSafeAreaInsets();
    const { t } = useLanguage();

    return (
        <GradientBackground>
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.contentContainer,
                    { paddingBottom: insets.bottom + spacing.xl }
                ]}
                showsVerticalScrollIndicator={false}
            >
                <Header 
                    title={t('home.title')} 
                    subtitle={t('home.subtitle')}
                />
                <View style={styles.cardsContainer}>
                    <System />
                    <Device />
                </View>
            </ScrollView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
    },
    cardsContainer: {
        paddingHorizontal: spacing.lg,
    },
});