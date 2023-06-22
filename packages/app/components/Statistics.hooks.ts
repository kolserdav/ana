import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { DateFilter, GetStatisticsResult, Locale, UserCleanResult } from '../types/interfaces';
import Request from '../utils/request';
import { log } from '../utils/lib';
import { GraphData } from './ui/Graph';
import { getTimeZone, isoToDate, timestampToTime } from './Statistics.lib';
import { CONTAINER_PADDING, GRAPH_HEIGHT_COEFF, GRAPH_WIDTH_DEFAULT } from '../utils/constants';

const request = new Request();

// eslint-disable-next-line import/prefer-default-export
export const useStatistics = ({
  user,
  setLoad,
  gt,
  dateFilter,
  newTexts,
  studyTime,
  localeDateDuration,
}: {
  user: UserCleanResult | null;
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
  gt: string | undefined;
  dateFilter: DateFilter | undefined;
  newTexts: string;
  studyTime: string;
  localeDateDuration: Locale['app']['statistics']['dateDuration'];
}) => {
  const router = useRouter();
  const [statistics, setStatistics] = useState<GetStatisticsResult>();
  const [graphWidth, setGraphWidth] = useState<number>();
  const [graphCountHeight, setGraphCountHeight] = useState<number>();

  /**
   * Set graph count height
   */
  useEffect(() => {
    if (!graphWidth) {
      return;
    }

    setGraphCountHeight(graphWidth / GRAPH_HEIGHT_COEFF);
  }, [graphWidth]);

  /**
   * Chech width of page
   */
  useEffect(() => {
    if (!graphWidth) {
      setGraphWidth(GRAPH_WIDTH_DEFAULT);
      return;
    }

    const { innerWidth } = window;
    if (innerWidth < graphWidth) {
      setGraphWidth(innerWidth - CONTAINER_PADDING * 2);
    }
  }, [graphWidth]);

  /**
   * Get statistics
   */
  useEffect(() => {
    if (!user || !gt || !dateFilter) {
      return;
    }
    (async () => {
      setLoad(true);
      const stats = await request.getStatistics({
        userId: user.id,
        gt,
        dateFilter,
        timeZone: getTimeZone(),
      });
      setLoad(false);
      if (stats.status !== 'info' || !stats.data) {
        log(stats.status, stats.message, stats, true, true);
        return;
      }
      setStatistics(stats.data);
    })();
  }, [user, setLoad, gt, dateFilter]);

  const countGraphData = useMemo(
    () =>
      statistics?.groupPhrases
        ? statistics.groupPhrases.items.map((item) => {
            const res: GraphData = {};
            res.name = isoToDate({
              date: item.summary_date,
              trunkArg: statistics.truncArg,
              locale: router.locale as any,
            });
            res[newTexts] = item.count;
            return res;
          })
        : [],
    [statistics?.groupPhrases, statistics?.truncArg, router.locale, newTexts]
  );

  const onlineGraphData = useMemo(
    () =>
      statistics?.groupOnline
        ? statistics.groupOnline.items.map((item) => {
            const res: GraphData = {};
            res.name = isoToDate({
              date: item.summary_date,
              trunkArg: statistics.truncArg,
              locale: router.locale as any,
            });
            res[studyTime] = item.sum / 1000000;
            return res;
          })
        : [],
    [statistics?.groupOnline, statistics?.truncArg, router.locale, studyTime]
  );

  const onlineLabelFormatter = useCallback(
    (d: any) => {
      if (!statistics) {
        return '';
      }
      return timestampToTime({
        date: parseInt(d, 10),
        trunkArg: statistics.truncArg,
        locale: localeDateDuration,
      });
    },
    [localeDateDuration, statistics]
  );

  return {
    statistics,
    countGraphData,
    onlineGraphData,
    onlineLabelFormatter,
    graphWidth,
    graphCountHeight,
  };
};
