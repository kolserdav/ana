import { useEffect, useState } from 'react';
import { MessageType, SendMessageArgs } from '../types/interfaces';
import { TEXTAREA_MAX_ROWS, TEXTAREA_ROWS_DEFAULT } from '../utils/constants';
import { log } from '../utils/lib';
import Request from '../utils/request';
import { gettextAreaRows } from './Project.lib';

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

export const useTextArea = () => {
  const [text, setText] = useState<string>('');
  const [rows, setRows] = useState<number>(TEXTAREA_ROWS_DEFAULT);

  const inputText = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const {
      target: { value },
    }: { target: HTMLTextAreaElement } = e as any;
    const _rows = gettextAreaRows(value);
    if (_rows > TEXTAREA_MAX_ROWS) {
      setRows(TEXTAREA_MAX_ROWS);
    } else {
      setRows(_rows);
    }
    setText(value);
  };

  return { inputText, text, rows };
};
