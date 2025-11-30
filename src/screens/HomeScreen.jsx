import { StyleSheet, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import System from '../components/system';
import Device from '../components/device';
import Header from '../components/Header';
import GradientBackground from '../components/GradientBackground';
import { spacing } from '../theme/colors';

export default function HomeScreen () {
    const insets = useSafeAreaInsets();

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
                    title="Tableau de Bord" 
                    subtitle="Vue d'ensemble du système"
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