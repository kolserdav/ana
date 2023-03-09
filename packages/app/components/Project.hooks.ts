import { File } from '@prisma/client';
import React, { useEffect, useMemo, useState } from 'react';
import storeProjectMessage from '../store/projectMessage';
import { MessageType, SendMessageArgs } from '../types/interfaces';
import { TEXTAREA_MAX_ROWS, TEXTAREA_ROWS_DEFAULT } from '../utils/constants';
import { log } from '../utils/lib';
import Request from '../utils/request';
import { removeFilesFromInput } from './CreateProject.lib';
import { gettextAreaRows } from './Project.lib';

const request = new Request();

let projectGived = false;

// eslint-disable-next-line import/prefer-default-export
export const useGiveProject = ({
  project: _project,
  user,
}: {
  project: SendMessageArgs<MessageType.SET_PROJECT_FIND_FIRST>['data'];
  user: SendMessageArgs<MessageType.SET_USER_FIND_FIRST>['data'] | null;
}) => {
  const [project, setProject] =
    useState<SendMessageArgs<MessageType.SET_PROJECT_FIND_FIRST>['data']>();
  /**
   * Give project
   */
  useEffect(() => {
    if (!user) {
      return;
    }
    if (_project.employerId && _project.workerId) {
      return;
    }
    if (_project.employerId === user.id || _project.workerId === user.id) {
      return;
    }
    if (projectGived) {
      return;
    }
    projectGived = true;
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
  addNewMessage,
}: {
  projectId: string;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
  load: boolean;
  // eslint-disable-next-line no-unused-vars
  addNewMessage: (message: SendMessageArgs<MessageType.SET_POST_PROJECT_MESSAGE>['data']) => void;
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
    addNewMessage(postRes.data);
    setText('');
  };

  /**
   * Listen store project message
   */
  useEffect(() => {
    const cleanSubs = storeProjectMessage.subscribe(() => {
      const { projectMessage } = storeProjectMessage.getState();
      if (!projectMessage) {
        return;
      }
      addNewMessage(projectMessage.data);
    });
    return () => {
      cleanSubs();
    };
  }, [addNewMessage]);

  return { onClickPostMessageButton };
};

export const useProjectMessages = ({
  project,
  files,
  user,
  setFiles,
  setLoad,
  inputFilesRef,
}: {
  project: SendMessageArgs<MessageType.SET_PROJECT_FIND_FIRST>['data'];
  user: SendMessageArgs<MessageType.SET_USER_FIND_FIRST>['data'] | null;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
  inputFilesRef: React.RefObject<HTMLInputElement>;
}) => {
  const [messages, setMessages] = useState<
    SendMessageArgs<MessageType.SET_PROJECT_MESSAGE_FIND_MANY>['data']
  >({ items: [] });

  const addNewMessage = useMemo(
    () => (message: SendMessageArgs<MessageType.SET_POST_PROJECT_MESSAGE>['data']) => {
      const _mess = { ...messages };
      _mess.items.push(message);
      setMessages(_mess);
    },
    [messages, setMessages]
  );

  /**
   * Get post messages
   */
  useEffect(() => {
    if (!user) {
      return;
    }
    if (project.employerId !== user.id && project.workerId !== user.id) {
      return;
    }
    (async () => {
      const _messages = await request.projectMessageFindMany({ projectId: project.id });
      if (_messages.type === MessageType.SET_ERROR) {
        log(_messages.data.status, _messages.data.message, { _messages }, true);
        return;
      }
      setMessages(_messages.data);
    })();
  }, [project, user]);

  /**
   * Send message file
   */
  useEffect(() => {
    (async () => {
      for (let i = 0; files[i]; i++) {
        const file = files[i];
        setLoad(true);
        // eslint-disable-next-line no-await-in-loop
        const postRes = await request.postProjectMessage({
          projectId: project.id,
          content: file.filename,
          fileId: file.id,
        });
        setLoad(false);
        if (postRes.type === MessageType.SET_ERROR) {
          log(postRes.data.status, postRes.data.message, { postRes }, true);
          return;
        }
        addNewMessage(postRes.data);
      }
      if (files.length !== 0) {
        setFiles([]);
        const { current } = inputFilesRef;
        if (!current) {
          return;
        }
        removeFilesFromInput(current);
      }
    })();
  }, [files, setLoad, addNewMessage, setFiles, inputFilesRef, project]);

  return { messages, addNewMessage };
};
