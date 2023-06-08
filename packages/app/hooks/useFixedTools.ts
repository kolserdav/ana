import { useEffect, useState } from 'react';
import storeScroll from '../store/scroll';
import storeShowAppBar from '../store/showAppBar';

let firstYselected = 0;

const useFixedTools = ({ elementRef }: { elementRef: React.RefObject<HTMLElement> }) => {
  const [showAppBar, setShowAppBar] = useState<boolean>(storeShowAppBar.getState().showAppBar);
  const [fixed, setFixed] = useState<boolean>(false);

  /**
   * Listen show app bar
   */
  useEffect(() => {
    const cleanSubs = storeShowAppBar.subscribe(() => {
      const { showAppBar: _showAppBar } = storeShowAppBar.getState();
      setShowAppBar(_showAppBar);
    });
    return () => {
      cleanSubs();
    };
  }, []);

  /**
   * Set first y
   */
  useEffect(() => {
    const { current } = elementRef;
    if (!current) {
      return;
    }
    const { y } = current.getBoundingClientRect();
    firstYselected = y;
  }, [elementRef]);

  /**
   * Listen scroll
   */
  useEffect(() => {
    const clearSubs = storeScroll.subscribe(() => {
      const { current } = elementRef;
      if (!current) {
        return;
      }
      const { y } = current.getBoundingClientRect();
      const { scrollY } = window;
      const zero = 0;
      const _selectedFixed = y < zero;
      if (_selectedFixed && !fixed) {
        setFixed(true);
      }
      if (fixed && scrollY < firstYselected) {
        setFixed(false);
      }
    });

    return () => {
      clearSubs();
    };
  }, [elementRef, showAppBar, fixed, setFixed]);

  return { showAppBar, fixed, setFixed };
};

export default useFixedTools;
