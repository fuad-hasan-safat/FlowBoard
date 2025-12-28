import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchNotificationsApi } from "../api/notificationApi";
import { useSocket } from "../hooks/useSocket";

export default function NotificationBell() {
  const qc = useQueryClient();
  const socket = useSocket();

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotificationsApi
  });

  const unreadCount =
    notifications?.filter((n : any) => !n.read).length ?? 0;

useEffect(() => {
  if (!socket) return;

  const handler = () => {
    qc.invalidateQueries({ queryKey: ["notifications"] });
  };

  socket.on("notification:new", handler);

  return () => {
    socket.off("notification:new", handler);
  };
}, [socket, qc]);


  return (
    <div className="relative">
      <button className="text-slate-300">🔔</button>

      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1.5 rounded-full">
          {unreadCount}
        </span>
      )}
    </div>
  );
}
