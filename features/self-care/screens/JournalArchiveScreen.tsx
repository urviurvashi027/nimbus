import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import AppHeader from "@/components/layout/AppHeader";
import ThemeContext from "@/contexts/ThemeContext";
import PillFilters from "@/components/ui/PillFilters";
import { ScreenView } from "@/components/ui/theme-components/ScreenView";
import { ROUTES } from "@/constants/routes";
import { getJournalEntry } from "@/features/self-care/services/selfCareService";
import JournalEntryCard from "@/features/self-care/components/journaling/JournalEntryCard";
import {
  fallbackCardData,
  mapJournalEntry,
  type JournalCard,
  type RawJournalEntry,
} from "@/features/self-care/utils/journaling";
import {
  filterJournalArchiveEntries,
  JOURNAL_ARCHIVE_FILTERS,
  type JournalArchiveFilter,
} from "@/features/self-care/utils/journalArchive";

export const JournalArchiveScreen = () => {
  const navigation = useNavigation();
  const { newTheme: theme, svaTypography, spacing, typography } =
    useContext(ThemeContext);

  const [loading, setLoading] = useState(true);
  const [journals, setJournals] = useState<JournalCard[]>(fallbackCardData);
  const [selectedFilter, setSelectedFilter] =
    useState<JournalArchiveFilter>("pastWeek");

  const styles = useMemo(
    () => styling(theme, svaTypography, spacing, typography),
    [theme, svaTypography, spacing, typography]
  );

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const loadJournalEntries = useCallback(async () => {
    setLoading(true);
    try {
      const response: any = await getJournalEntry();
      const rawEntries: RawJournalEntry[] = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : [];

      const mapped = rawEntries
        .map(mapJournalEntry)
        .sort((a, b) => {
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bTime - aTime;
        });

      setJournals(mapped.length ? mapped : fallbackCardData);
    } catch (error) {
      console.log("Failed to load archive entries:", error);
      setJournals(fallbackCardData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJournalEntries();
  }, [loadJournalEntries]);

  const visibleJournals = useMemo(
    () => filterJournalArchiveEntries(journals, selectedFilter),
    [journals, selectedFilter]
  );

  const handleOpenJournal = (item: JournalCard) => {
    router.push({
      pathname: ROUTES.AUTH.SELF_CARE_JOURNAL_SUBMISSION,
      params: {
        journalId: item.id,
        journalTitle: item.title,
        journalSummary: item.description,
        journalTags: item.tags.join(","),
        journalThemeTag: item.tags[0] ?? "reflection",
        questionCount: String(Math.max(item.questionCount ?? 0, 3)),
        sealedAtLabel: item.dateLabel,
      },
    });
  };

  return (
    <ScreenView bgColor={theme.background} style={styles.screen}>
      <View style={styles.root}>
        <AppHeader
          title="Chronicle Archive"
          subtitle="Past seals, sorted by time."
          onBack={() => router.back()}
          rightAction={{
            icon: "journal-outline",
            accessibilityLabel: "Open journal library",
            onPress: () => router.push(ROUTES.AUTH.SELF_CARE_JOURNALING),
          }}
          containerStyle={styles.header}
        />

        <FlatList
          data={visibleJournals}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <>
              <PillFilters
                options={JOURNAL_ARCHIVE_FILTERS}
                selectedValue={selectedFilter}
                onChange={setSelectedFilter}
                scrollable
                contentContainerStyle={styles.filterRow}
                selectedPillStyle={styles.filterPillActive}
                inactivePillStyle={styles.filterPillInactive}
                selectedLabelStyle={styles.filterTextActive}
                inactiveLabelStyle={styles.filterTextInactive}
              />

              {loading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color={theme.accent} />
                  <Text style={styles.loadingText}>
                    Restoring sealed entries...
                  </Text>
                </View>
              ) : (
                <View style={styles.countRow}>
                  <Ionicons
                    name="archive-outline"
                    size={14}
                    color={theme.textSecondary}
                  />
                  <Text style={styles.countText}>
                    {visibleJournals.length} sealed
                    {visibleJournals.length === 1 ? "" : "s"} in this window
                  </Text>
                </View>
              )}
            </>
          }
          renderItem={({ item }) => (
            <JournalEntryCard
              item={item}
              onPress={() => handleOpenJournal(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons
                name="archive-outline"
                size={40}
                color={theme.textSecondary}
              />
              <Text style={styles.emptyTitle}>No sealed entries here.</Text>
              <Text style={styles.emptyText}>
                Try a different time window or seal a new journal.
              </Text>
            </View>
          }
        />
      </View>
    </ScreenView>
  );
};

const styling = (theme: any, svaTypography: any, spacing: any, typography: any) =>
  StyleSheet.create({
    screen: {
      paddingHorizontal: spacing.md,
      paddingTop:
        Platform.OS === "ios"
          ? spacing["xxl"] + spacing["xxl"] * 0.4
          : spacing.xl,
    },
    root: {
      flex: 1,
    },
    header: {
      marginBottom: spacing.md,
    },
    listContent: {
      paddingBottom: spacing.xl * 3,
    },
    filterRow: {
      paddingVertical: spacing.xs,
      paddingRight: spacing.md,
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    filterPillInactive: {
      backgroundColor: theme.surface,
      borderColor: theme.borderMuted ?? "rgba(255,255,255,0.05)",
    },
    filterPillActive: {
      backgroundColor: theme.surfaceMuted,
      borderColor: theme.borderMuted ?? "rgba(255,255,255,0.05)",
    },
    filterTextInactive: {
      fontFamily:
        svaTypography?.textStyle.authTinyLabel.fontFamily ?? "Inter_600SemiBold",
      fontSize: 11,
      letterSpacing: 1.1,
      color: theme.textSecondary,
    },
    filterTextActive: {
      color: theme.textPrimary,
    },
    loadingRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: spacing.md,
    },
    loadingText: {
      ...typography.caption,
      color: theme.textSecondary,
      fontWeight: "700",
    },
    countRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: spacing.md,
    },
    countText: {
      ...typography.caption,
      color: theme.textSecondary,
      fontWeight: "700",
      letterSpacing: 0.2,
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 80,
      paddingHorizontal: spacing.xl,
    },
    emptyTitle: {
      ...typography.h3,
      color: theme.textPrimary,
      marginTop: spacing.md,
    },
    emptyText: {
      ...typography.body,
      color: theme.textSecondary,
      marginTop: spacing.xs,
      textAlign: "center",
    },
  });

export default JournalArchiveScreen;
