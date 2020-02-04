import { User } from "./user.model";
import { authActions, SET_USER } from "./auth.actions";

export interface AuthState {
  user: User;
}

const estadoInicial: AuthState = {
  user: null

}

export function authReducer(state = estadoInicial, action: authActions): AuthState {

  switch (action.type) {
    case SET_USER:
      return {
        user: {
          ...action.user
        }
      };
    default:
      return state;
  }
}
