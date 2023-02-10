import useLoad from '../hooks/useLoad';

function Home() {
  const { load, setLoad } = useLoad();

  return <div>Home</div>;
}

export default Home;
