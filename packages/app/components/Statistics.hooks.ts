import { useEffect, useState } from 'react';
import { DateFilter, GetStatisticsResult, UserCleanResult } from '../types/interfaces';
import Request from '../utils/request';
import { log } from '../utils/lib';

const request = new Request();

// eslint-disable-next-line import/prefer-default-export
export const useStatistics = ({
  user,
  setLoad,
  gt,
  dateFilter,
}: {
  user: UserCleanResult | null;
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
  gt: string | undefined;
  dateFilter: DateFilter | undefined;
}) => {
  const [statistics, setStatistics] = useState<GetStatisticsResult>();

  /**
   * Get statistics
   */
  useEffect(() => {
    if (!user || !gt || !dateFilter) {
      return;
    }
    (async () => {
      setLoad(true);
      const stats = await request.getStatistics({ userId: user.id, gt, dateFilter });
      setLoad(false);
      if (stats.status !== 'info' || !stats.data) {
        log(stats.status, stats.message, stats, true, true);
        return;
      }
      setStatistics(stats.data);
    })();
  }, [user, setLoad, gt, dateFilter]);

  return { statistics };
};
