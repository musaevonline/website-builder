import { useReducer } from 'react';

export const useForceRender = () => {
  const [, forceRender] = useReducer((s) => s + 1, 0);

  return forceRender;
};
