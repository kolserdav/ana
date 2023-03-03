import { useEffect } from 'react';
import Request from '../utils/request';

const request = new Request();

// eslint-disable-next-line import/prefer-default-export
export const useLoadProjects = ({ isProjects }: { isProjects: boolean }) => {
  /**
   * Load projects
   */
  useEffect(() => {
    if (!isProjects) {
      return;
    }
    (async () => {
      const projects = await request.projectFindMany();
      console.log(projects);
    })();
  }, [isProjects]);
};
