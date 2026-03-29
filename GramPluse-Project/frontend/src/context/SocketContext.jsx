import { createContext, useContext, useEffect } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import { notifyInfo } from '../components/NotificationToast';

const SocketContext = createContext();

const socket = io(import.meta.env.VITE_API_URL, {
  withCredentials: true, // if your server uses cookies
});


export function SocketProvider({ children }) {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      socket.emit('joinVillage', user.village);

      socket.on('issueCreated', (issue) => {
        notifyInfo(`नवीन समस्या: ${issue.title}`);
      });

      socket.on('issueUpdated', (data) => {
        notifyInfo(`समस्या update: ${data.title}`);
      });
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);