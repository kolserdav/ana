import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Theme } from '../Theme';
import useLoad from '../hooks/useLoad';
import { Locale, UserCleanResult } from '../types/interfaces';
import { FDROID_LINK, LICENSE, Pages, REPOSITORY_LINK } from '../utils/constants';
import { isAndroid, log } from '../utils/lib';
import s from './About.module.scss';
import Hr from './ui/Hr';
import Link from './ui/Link';
import Typography from './ui/Typography';

function About({
  locale,
  title,
  description,
  theme,
  policyTitle,
  rulesTitle,
  user,
  needUpdateApp,
}: {
  locale: Locale['app']['about'];
  title: string;
  description: string;
  theme: Theme;
  policyTitle: string;
  rulesTitle: string;
  user: UserCleanResult | null;
  needUpdateApp: string;
}) {
  const [android, setAndroid] = useState<boolean>(false);
  const [packageVersion, setPackageVersion] = useState<string>();
  useLoad();

  /**
   * Set android
   */
  useEffect(() => {
    setAndroid(isAndroid());
  }, []);

  /**
   * Set package version
   */
  useEffect(() => {
    if (typeof androidCommon === 'undefined') {
      return;
    }
    if (typeof androidCommon.getPackageVersion === 'undefined') {
      log('warn', needUpdateApp, {}, true, true);
      return;
    }
    setPackageVersion(androidCommon.getPackageVersion());
  }, [needUpdateApp]);

  return (
    <section className={s.wrapper}>
      <div className={s.container}>
        <div className={s.title}>
          <Typography theme={theme} variant="h1" align="center">
            {title}
          </Typography>
        </div>
        <Hr theme={theme} />
        <Typography variant="h3" theme={theme}>
          {locale.aboutProgram}
        </Typography>
        {description && (
          <Typography theme={theme} variant="p">
            {description}
          </Typography>
        )}
        <div className={s.item}>
          <Typography variant="h5" theme={theme}>
            {`${locale.licenseTitle}:`}
          </Typography>
          <span className={s.value}>
            <a href={LICENSE.link}>{LICENSE.title}</a>
          </span>
        </div>
        <div className={s.item}>
          <Typography variant="h5" theme={theme}>
            {`${locale.repoTitle}:`}
          </Typography>
          <span className={s.value}>
            <a href={REPOSITORY_LINK}>{REPOSITORY_LINK}</a>
          </span>
        </div>
        {(android || user?.role === 'admin') && (
          <div className={s.item}>
            <Typography theme={theme} variant="h5">{`${locale.packageVersion}:`}</Typography>
            <Typography theme={theme} variant="span">
              {packageVersion}
            </Typography>
          </div>
        )}
        <div className={s.item}>
          <Typography variant="h5" theme={theme}>
            {`${locale.download}:`}
          </Typography>
          <Link href={FDROID_LINK} theme={theme}>
            <Image width={200} height={143} src="/images/GetItOnFDroid.png" alt="F-Droid" />
          </Link>
        </div>
        <Hr theme={theme} />
        <Typography variant="h3" theme={theme}>
          {locale.aboutSite}
        </Typography>
        <div className={s.link}>
          <Link href={Pages.policy} theme={theme}>
            {policyTitle}
          </Link>
        </div>
        <div className={s.link}>
          <Link href={Pages.rules} theme={theme}>
            {rulesTitle}
          </Link>
        </div>
        <div className={s.link}>
          <Link href={Pages.contacts} theme={theme}>
            {locale.contactsTitle}
          </Link>
        </div>
        <div className={s.link}>
          <Link href={Pages.donate} theme={theme}>
            {locale.donate}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default About;
