import type { ComponentType, Dispatch, ReactNode } from "react";
import { createContext, useContext, useMemo, useReducer } from "react";
import type { AppContextDispatchActions } from "./reducer";
import { appContextReducer } from "./reducer";

export interface UserInAppContext {
  userName: string;
  friendId: string;
  memberSince: string;
  numberOfBoardsCompleted: number;
  numberOfWordsPlaced: number;
  numberOfLettersPlaced: number;
  trophyIdsObtained: string[];
}

/**
 * The type of the "state" stored within
 * the AppContext
 */
export interface IAppContextState {
  user: UserInAppContext;
  settings: {
    soundEnabled: boolean;
  };
}

/**
 * The initial state of the AppContext
 */
const initialContextState: IAppContextState = {
  user: {
    userName: "captainlonate",
    friendId: "captainlonate#1017",
    memberSince: "Jul 2022",
    numberOfBoardsCompleted: 1137,
    numberOfWordsPlaced: 1623,
    numberOfLettersPlaced: 8745,
    trophyIdsObtained: ["words-500", "dont-cheat", "week-days"],
  },
  settings: {
    soundEnabled: true,
  },
};

/**
 * The App Context
 */
const AppContext = createContext(
  {} as {
    state: IAppContextState;
    dispatch: Dispatch<AppContextDispatchActions>;
  }
);

/**
 *
 */
export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appContextReducer, {
    ...initialContextState,
  });

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

/**
 *
 */
export const useAppContext = () => useContext(AppContext);
