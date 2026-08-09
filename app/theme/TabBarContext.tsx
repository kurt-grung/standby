import { createContext, useContext } from 'react';

type TabBarContextValue = {
  setHidden: (hidden: boolean) => void;
};

export const TabBarContext = createContext<TabBarContextValue>({
  setHidden: () => {},
});

export function useTabBar() {
  return useContext(TabBarContext);
}
