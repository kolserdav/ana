import { Theme } from '../Theme';
import { Locale, MessageType, SendMessageArgs } from '../types/interfaces';

// eslint-disable-next-line import/prefer-default-export
export const getProjectStatus = ({
  theme,
  locale,
  project,
}: {
  theme: Theme;
  locale: Locale['app']['projectStatus'];
  project: SendMessageArgs<MessageType.SET_PROJECT_FIND_MANY>['data']['items'][any];
}): { status: string; color: string } => {
  const { stop, employerId, workerId, acceptEmployer, acceptWorker, start } = project;
  if (!employerId) {
    return {
      status: locale.waitEmployer,
      color: theme.yellow,
    };
  }
  if (!workerId) {
    return {
      status: locale.waitWorker,
      color: theme.yellow,
    };
  }
  if (!acceptEmployer || !acceptWorker) {
    return {
      status: locale.agreementOfConditions,
      color: theme.blue,
    };
  }
  if (start && !stop) {
    return {
      status: locale.inWork,
      color: theme.green,
    };
  }
  return {
    status: locale.finished,
    color: theme.white,
  };
};
