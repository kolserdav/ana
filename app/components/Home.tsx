import useLoad from '@/hooks/useLoad';
import s from './Home.module.scss';

function Home() {
  const { load, setLoad } = useLoad();

  return <div className={s.wrapper}>Home</div>;
}

export default Home;
