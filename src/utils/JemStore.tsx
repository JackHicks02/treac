import {
  Context,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const contexts: {
  [key: string]: {
    context: Context<MutableRefObject<Dispatch<SetStateAction<any>>[]>>;
    detachedContext: Context<MutableRefObject<MutableRefObject<any>[]>>;
    default: any;
  };
} = {} as {
  [key: string]: {
    context: Context<MutableRefObject<Dispatch<SetStateAction<any>>[]>>;
    detachedContext: Context<MutableRefObject<MutableRefObject<any>[]>>;
    default: any;
  };
};

function addContext(key: string, defaultValue: any) {
  contexts[key] = {
    context: createContext<
      React.MutableRefObject<React.Dispatch<React.SetStateAction<any>>[]>
    >(
      {} as React.MutableRefObject<React.Dispatch<React.SetStateAction<any>>[]>
    ),
    detachedContext: createContext<
      React.MutableRefObject<React.MutableRefObject<any>[]>
    >({} as React.MutableRefObject<React.MutableRefObject<any>[]>),
    default: defaultValue,
  };
}

function getContext(key: string) {
  return contexts[key];
}

class Jem<T> {
  private key: string;
  private storeRef: MutableRefObject<Dispatch<T>[]>;
  private detachedStoreRef: MutableRefObject<MutableRefObject<T>[]>;
  private state: T | null;
  private valueRef: MutableRefObject<T> | null;

  constructor(
    key: string,
    storeRef: MutableRefObject<Dispatch<T>[]>,
    detachedStoreRef: MutableRefObject<MutableRefObject<T>[]>,
    state: T | null = null,
    valueRef: MutableRefObject<T> | null = null
  ) {
    this.key = key;
    this.storeRef = storeRef;
    this.detachedStoreRef = detachedStoreRef;
    this.state = state ?? null;
    this.valueRef = valueRef ?? null;
  }

  getKey() {
    return this.key;
  }
  getStoreRef() {
    return this.storeRef;
  }
  getDetachedStoreRef() {
    return this.detachedStoreRef;
  }
  getValue(): T {
    if (this.state != null) {
      return this.state;
    } else if (this.valueRef != null) {
      return this.valueRef.current;
    } else {
      //throw new Error("Use: useJem<T> or useJemListener<T> to create Jems")
      console.warn(
        "Warning, you are using null items in a jem, this is allowed but can be unsafe"
      );
      return null!;
    }
  }
}

export function useJem<T>(key: string): Jem<T> {
  const storage = useContext(getContext(key).detachedContext);
  const defaultValue = getContext(key).default;

  const state = useRef<T>(defaultValue);

  useEffect(() => {
    if (!storage.current) {
      storage.current = [];
    }
    storage.current.push(state);
    return () => {
      storage.current = storage.current.filter((pointer) => pointer !== state);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const jem = new Jem(
    key,
    useContext(getContext(key).context),
    useContext(getContext(key).detachedContext),
    null,
    state
  );
  return jem;
}
export function useJemListener<T>(key: string): Jem<T> {
  const storage = useContext(getContext(key).context);
  const defaultValue = getContext(key).default;

  const [state, setState] = useState<T>(defaultValue);

  const updateState = (newValue: T) => {
    setState(newValue);
  };

  useEffect(() => {
    if (storage.current == null) {
      storage.current = [];
    }
    storage.current.push(updateState);
    return () => {
      storage.current = storage.current.filter((func) => func !== updateState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //console.log(key + ", " + useContext(getContext(key).context) + ", " + useContext(getContext(key).detachedContext) + ", " + state + ", " + null)
  const jem = new Jem(
    key,
    useContext(getContext(key).context),
    useContext(getContext(key).detachedContext),
    state,
    null
  );
  return jem;
}

export function updateJem<T>(jem: Jem<T>, to: T) {
  contexts[jem.getKey()].default = to;

  const detachedStorage = jem.getDetachedStoreRef().current ?? [];
  detachedStorage.forEach((pointer) => (pointer.current = to));

  const storage = jem.getStoreRef().current ?? [];
  storage.forEach((setter) => setter(to));
}

interface JemContextProps {
  contextKey: string;
  defaultValue: any;
  children: React.ReactNode;
}
export const JemContextProvider: React.FC<JemContextProps> = ({
  contextKey,
  children,
  defaultValue,
}) => {
  if (!Object.keys(contexts).includes(contextKey)) {
    addContext(contextKey, defaultValue);
  }
  //contexts[contextKey] = { ...contexts[contextKey], default: defaultValue }
  const listenerRef = useContext(getContext(contextKey).context);
  const Provider = getContext(contextKey).context.Provider;

  return <Provider value={listenerRef}>{children}</Provider>;
};
