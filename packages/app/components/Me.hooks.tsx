import { useEffect, useState } from 'react';
import { MessageType, SendMessageArgs } from '../types/interfaces';
import { log } from '../utils/lib';
import Request from '../utils/request';

const request = new Request();

// eslint-disable-next-line import/prefer-default-export
export const useLoadProjects = ({ isProjects }: { isProjects: boolean }) => {
  const [projects, setProjects] = useState<
    SendMessageArgs<MessageType.SET_PROJECT_FIND_MANY>['data']
  >({ items: [] });
  /**
   * Load projects
   */
  useEffect(() => {
    if (!isProjects) {
      return;
    }
    (async () => {
      const _projects = await request.projectFindMany();
      if (_projects.type === MessageType.SET_ERROR) {
        log(_projects.data.status, _projects.data.message, { _projects }, true);
        return;
      }
      setProjects(_projects.data);
    })();
  }, [isProjects]);

  return { projects };
};
