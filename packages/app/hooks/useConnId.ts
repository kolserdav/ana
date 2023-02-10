import { useState } from 'react';

function useConnId() {
  const [connId, setConnId] = useState<string>('');

  return { connId, setConnId };
}

export default useConnId;
