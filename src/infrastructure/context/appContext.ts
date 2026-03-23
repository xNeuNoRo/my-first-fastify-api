import { RequestContext } from "@xneunoro/neucore";

export interface AppContextStore {
  requestId: string;
}

export const appContext = new RequestContext<AppContextStore>();
