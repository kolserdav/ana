import { useEffect, useState } from 'react';
import { MessageType, SendMessageArgs } from '../types/interfaces';
import { log } from '../utils/lib';
import Request from '../utils/request';

const request = new Request();

// eslint-disable-next-line import/prefer-default-export
export const useGiveProject = ({
  project: _project,
  user,
}: {
  project: SendMessageArgs<MessageType.SET_PROJECT_FIND_FIRST>['data'];
  user: SendMessageArgs<MessageType.SET_USER_FIND_FIRST>['data'];
}) => {
  const [project, setProject] =
    useState<SendMessageArgs<MessageType.SET_PROJECT_FIND_FIRST>['data']>();
  /**
   * Give project
   */
  useEffect(() => {
    if (_project.employerId && _project.workerId) {
      return;
    }
    if (_project.employerId === user.id || _project.workerId === user.id) {
      return;
    }
    (async () => {
      const proj = await request.projectGive({ id: _project.id });
      if (proj.type === MessageType.SET_ERROR) {
        log(proj.data.status, proj.data.message, { proj }, true);
        return;
      }
      setProject(proj.data);
    })();
  }, [_project, user]);

  return { project };
};
