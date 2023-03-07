import React, { useEffect, useState } from 'react';
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

  return { inputText, text, rows, setText };
};

export const useButtonMessages = ({
  text,
  setText,
  setLoad,
  projectId,
  load,
}: {
  projectId: string;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
  load: boolean;
}) => {
  const onClickPostMessageButton = async () => {
    if (load) {
      return;
    }
    setLoad(true);
    const postRes = await request.postProjectMessage({ projectId, content: text });
    setLoad(false);
    if (postRes.type === MessageType.SET_ERROR) {
      log(postRes.data.status, postRes.data.message, { postRes }, true);
      return;
    }
    setText('');
  };

  return { onClickPostMessageButton };
};

export const useProjectMessages = ({ projectId }: { projectId: string }) => {
  const [messages, setMessages] = useState<
    SendMessageArgs<MessageType.SET_PROJECT_MESSAGE_FIND_MANY>['data']
  >({ items: [] });
  /**
   * Get post messages
   */
  useEffect(() => {
    (async () => {
      const _messages = await request.projectMessageFindMany({ projectId });
      if (_messages.type === MessageType.SET_ERROR) {
        log(_messages.data.status, _messages.data.message, { _messages }, true);
        return;
      }
      setMessages(_messages.data);
    })();
  }, [projectId]);

  return { messages };
};
