import { GetStaticPropsContext } from 'next';
import AppBar from '../components/AppBar';
import { AppProps, PageFull } from '../types';
import { Locale, LocaleValue } from '../types/interfaces';
import { prepagePage } from '../utils/lib';
import Request from '../utils/request';
import s from '../styles/Page.module.scss';
import Head from '../components/Head';
import Settings from '../components/Settings';

const request = new Request();

interface SettingsPageProps extends AppProps {
  localeSettings: Locale['app']['settings'];
  localeAppBar: Locale['app']['appBar'];
  localeCommon: Locale['app']['common'];
  localeLogin: Locale['app']['login'];
  page: PageFull;
}

export default function SettingsPage({
  app: { user, theme, urlDefault, _url, isAndroid, notificationEnabled, setNotificationEnabled },
  localeSettings,
  localeAppBar,
  localeCommon,
  localeLogin,
  page,
}: SettingsPageProps) {
  return (
    <>
      <Head title={page.title} description={page.description} keywords={page.keywords} noIndex />
      <AppBar user={user} theme={theme} locale={localeAppBar} full />
      <main className={s.wrapper} style={{ backgroundColor: theme.paper }}>
        <Settings
          voiceNotFound={localeCommon.voiceNotFound}
          user={user}
          locale={localeSettings}
          theme={theme}
          playSound={localeCommon.playSound}
          localeLogin={localeLogin}
          eliminateRemarks={localeCommon.eliminateRemarks}
          fieldMustBeNotEmpty={localeCommon.fieldMustBeNotEmpty}
          cancel={localeCommon.cancel}
          _delete={localeCommon.delete}
          sendMail={localeCommon.sendMail}
          emailIsSend={localeCommon.emailIsSend}
          urlDefault={urlDefault}
          url={_url}
          isAndroid={isAndroid}
          wrongUrlFormat={localeCommon.wrongUrlFormat}
          openTools={localeCommon.openTools}
          notificationEnabled={notificationEnabled}
          setNotificationEnabled={setNotificationEnabled}
        />
      </main>
    </>
  );
}

export async function getStaticProps({
  locale,
}: GetStaticPropsContext): Promise<{ props: Omit<SettingsPageProps, 'app'> }> {
  const localeAppBar = await request.getLocale({ field: 'appBar', locale });
  const localeCommon = await request.getLocale({ field: 'common', locale });
  const localeLogin = await request.getLocale({ field: 'login', locale });
  const localeSettings = await request.getLocale({ field: 'settings', locale });
  const page = await request.pageFindMany({
    where: {
      AND: [
        {
          name: 'settings',
        },
        {
          lang: locale as LocaleValue,
        },
      ],
    },
  });
  return {
    props: {
      page: prepagePage(page.data),
      localeAppBar: localeAppBar.data,
      localeSettings: localeSettings.data,
      localeCommon: localeCommon.data,
      localeLogin: localeLogin.data,
    },
  };
}
