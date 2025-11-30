import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Log from '../components/log';
import useLogs from '../hooks/useLogs';
import Header from '../components/Header';
import GradientBackground from '../components/GradientBackground';
import { useLanguage } from '../i18n/LanguageContext';
import { colors, typography, spacing, borderRadius, shadows } from '../theme/colors';

export default function SystemScreen() {
  const { logs, loading, error, loadMore, hasMore } = useLogs(6);
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();

  return (
    <GradientBackground>
      <View style={styles.container}>
        <Header 
          title={t('system.logsTitle')} 
          subtitle={t('system.logsSubtitle')}
          loading={loading}
        />

        <View style={styles.logsContainer}>
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={48} color={colors.status.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <FlatList
            data={logs}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <Log
                origin={item.origin}
                msg={item.msg}
                dName={item.dName}
                timestamp={item.timestamp}
              />
            )}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: insets.bottom + 80 }
            ]}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              !loading && !error ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="document-text-outline" size={48} color={colors.text.muted} />
                  <Text style={styles.emptyText}>{t('system.noLogs')}</Text>
                </View>
              ) : null
            }
          />
        </View>

        {/* Floating action button for load more */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
          {loading ? (
            <View style={styles.loadingButton}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.loadingText}>{t('common.loading')}</Text>
            </View>
          ) : hasMore ? (
            <TouchableOpacity 
              onPress={loadMore} 
              accessibilityLabel={t('system.loadMore')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={colors.gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loadMoreButton}
              >
                <Ionicons name="refresh-outline" size={18} color={colors.text.primary} />
                <Text style={styles.buttonText}>{t('system.loadMore')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.noMoreContainer}>
              <View style={styles.noMoreLine} />
              <Text style={styles.noMoreText}>{t('system.endOfLogs')}</Text>
              <View style={styles.noMoreLine} />
            </View>
          )}
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logsContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  listContent: {
    paddingTop: spacing.sm,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  errorText: {
    ...typography.body,
    color: colors.status.error,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    ...typography.body,
    color: colors.text.muted,
    marginTop: spacing.md,
  },
  footer: {
    alignItems: 'center',
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  loadingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  loadingText: {
    ...typography.caption,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    ...shadows.glow,
  },
  buttonText: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  noMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  noMoreLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.secondary,
  },
  noMoreText: {
    ...typography.caption,
    color: colors.text.muted,
    marginHorizontal: spacing.md,
  },
});