import { Alert, AlertProps, Snackbar, SnackbarProps } from '@mui/material';
import {
  Dispatch,
  FC,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

type UIContextType = {
  defineToast: Dispatch<SetStateAction<ToastProps>>;
};

export type ToastProps = Pick<
  SnackbarProps,
  'autoHideDuration' | 'open' | 'message'
> &
  Pick<AlertProps, 'severity' | 'title'> & {
    onClose?: () => void;
  };

const UIContext = createContext<UIContextType | undefined>(undefined);

const UIProvider: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [toastProps, setToastProps] = useState<ToastProps>({
    open: false,
    message: '',
    title: '',
  });

  const handleClose = useCallback(() => {
    toastProps.onClose?.();
    setToastProps((prev) => ({ ...prev, open: false }));
  }, [toastProps]);

  const value: UIContextType = {
    defineToast: setToastProps,
  };
  return (
    <UIContext.Provider value={value}>
      {children}
      <Snackbar
        open={toastProps.open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'top',
        }}
      >
        <Alert
          severity={toastProps.severity ?? 'success'}
          title={toastProps.title}
        >
          {toastProps.message}
        </Alert>
      </Snackbar>
    </UIContext.Provider>
  );
};

const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

export { UIProvider, useUI };