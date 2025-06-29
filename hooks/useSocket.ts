import { apiConfig } from "@/config/apiConfig";
import { useIsFocused } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import Storage from "./Storage";

interface SocketHookParams {
  flag: string;
  userId: string;
  setChatId?: (id: string) => void;
  manageGetMessagePage: { currentPage: number };
  setMessage?: React.Dispatch<React.SetStateAction<any[]>>;
  setStatus?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useSocket = ({
  userId,
  flag,
  manageGetMessagePage,
  setChatId,
  setMessage,
  setStatus,
}: SocketHookParams) => {
  const isFocused = useIsFocused();
  const token = Storage.getItem("token");
  const socketRef = useRef<Socket | null>(null);

  const [count, setcount] = useState(0);
  const [userList, setUserList] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const initializeSocketListeners = useCallback(
    (newSocket: Socket) => {
      if (flag === "list") {
        newSocket.on("receiver-user-list", (res: any) => {
          console.log("res:",JSON.stringify(res))
          const data = res?.data;
          if (data) {
            setUserList(data || []);
          }
        });
      }

      newSocket.on("status", (status: any) => {
        setStatus && setStatus(status?.status);
      });

      if (flag === "chat") {
        newSocket.on("get-message", (data: any) => {
          if (data?.data) {
            setChatId && setChatId(data?.chatId || "");

            setMessage &&
              setMessage((prev) => {
                const messageMap = new Map(prev?.map((msg: any) => [msg?.id, msg]));
                data?.data?.array?.forEach((msg: any) => messageMap.set(msg?.id, msg));
                return Array.from(messageMap.values());
              });
          }
        });
        newSocket.on("receive-message", (data) => {
          if (data) {
            setChatId && setChatId(data?.data?.chatId || "");
            setMessage && setMessage((prev) => [data?.data, ...prev]);
          }
        });
      }

      newSocket.on("dissconnected", (e) => {
        console.log("socket dissconnected",e?.message)
        setIsConnected(false);
      });

      newSocket.on("connect_error", (e) => {
        console.log("socket error:",e?.message)
        setIsConnected(false);
      });
    },
    [setStatus, setIsConnected, setMessage, setcount]
  );

  const fetchMessages = useCallback(
    async (page: number) => {
      socketRef.current?.emit("get-message", {
        token,
        userId: userId,
        limit: 20,
        page: page || manageGetMessagePage.currentPage,
      });
    },
    [userId, token, manageGetMessagePage.currentPage, isConnected]
  );

  useEffect(() => {
    if (flag === "chat") {
      fetchMessages(manageGetMessagePage.currentPage);
    }
  }, [manageGetMessagePage.currentPage, fetchMessages]);

  const connect = useCallback(async () => {
    console.log("here--->",socketRef)
    if (socketRef.current) return;

    try {
      const newSocket = io(apiConfig.BASE_URL, {
        timeout: 10000,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        transports: ["websocket"],
        auth: { token },
      });

      newSocket.on("connect", () => {

        console.log("socket connection successfull", newSocket.id)
        socketRef.current = newSocket;
        setIsConnected(true);

        if (flag === "list") {
          newSocket.emit("user-list", { token });
        }

        newSocket.emit("status", { token });

        initializeSocketListeners(newSocket);
      });
    } catch (error) {
      setIsConnected(false);
    }
  }, [flag, token, initializeSocketListeners, setIsConnected]);

  useEffect(() => {
    if (isFocused) {
      connect();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
    };
  }, [isFocused, connect]);

  return { count, connect, userList, socket: socketRef.current, isConnected, fetchMessages };
};
