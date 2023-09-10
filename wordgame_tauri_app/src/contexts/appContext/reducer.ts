import type { IAppContextState, UserInAppContext } from "./context";
import { ACTION_SET_USER, ACTION_SET_SOUND } from "./actions";

/**
 * All of the possible actions that can be dispatched
 * to the reducer, paired with their corresponding
 * payloads.
 */
export type AppContextDispatchActions =
  | {
      type: typeof ACTION_SET_USER;
      payload: UserInAppContext;
    }
  | {
      type: typeof ACTION_SET_SOUND;
      payload: boolean;
    };

/**
 * The reducer used in the AppContext
 */
export const appContextReducer = (
  state: IAppContextState,
  action: AppContextDispatchActions
): IAppContextState => {
  switch (action.type) {
    case ACTION_SET_USER:
      return {
        ...state,
        user: { ...action.payload },
      };
    case ACTION_SET_SOUND:
      return {
        ...state,
        settings: {
          ...state.settings,
          soundEnabled: action.payload,
        },
      };
    default:
      return state;
  }
};
