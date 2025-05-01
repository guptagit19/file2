// hooks/useKeyboardOffsetHeight.js
import {useState, useEffect} from 'react';
import {Keyboard} from 'react-native';

const useKeyboardOffsetHeight = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const onShow = e => {
      // e.endCoordinates.height is the height of the keyboard
      setKeyboardHeight(e.endCoordinates.height);
      console.log('keyboard did show, height =', e.endCoordinates.height);
    };
    const onHide = () => {
      setKeyboardHeight(0);
      console.log('keyboard did hide');
    };

    const showSub = Keyboard.addListener('keyboardDidShow', onShow);
    const hideSub = Keyboard.addListener('keyboardDidHide', onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return keyboardHeight;
};

export default useKeyboardOffsetHeight;
