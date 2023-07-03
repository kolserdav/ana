import { Theme } from '../Theme';
import useLoad from '../hooks/useLoad';
import { Locale } from '../types/interfaces';
import { LICENSE, Pages, REPOSITORY_LINK } from '../utils/constants';
import s from './About.module.scss';
import Link from './ui/Link';
import Typography from './ui/Typography';

function About({
  locale,
  title,
  description,
  theme,
  policyTitle,
  rulesTitle,
}: {
  locale: Locale['app']['about'];
  title: string;
  description: string;
  theme: Theme;
  policyTitle: string;
  rulesTitle: string;
}) {
  useLoad();
  return (
    <section className={s.wrapper}>
      <div className={s.container}>
        <div className={s.title}>
          <Typography theme={theme} variant="h1" align="center">
            {title}
          </Typography>
        </div>
        {description && (
          <Typography theme={theme} variant="p">
            {description}
          </Typography>
        )}
        <Typography variant="h3" theme={theme}>
          {locale.aboutProgram}
        </Typography>
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
      </div>
    </section>
  );
}

export default About;
