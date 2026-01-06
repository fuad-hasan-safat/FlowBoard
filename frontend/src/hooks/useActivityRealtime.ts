import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "../lib/socket";

export const useActivityRealtime = (orgId?: string | null) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!orgId) return;

    const socket = getSocket();
    const room = `org:${orgId}`;

    socket.emit("joinRoom", room);

    const handler = (activity: any) => {
      queryClient.setQueryData(
        ["activity", orgId],
        (old: any[] | undefined) =>
          old ? [activity, ...old].slice(0, 100) : [activity]
      );
    };

    socket.on("activity:new", handler);

    return () => {
      socket.emit("leaveRoom", room);
      socket.off("activity:new", handler);
    };
  }, [orgId, queryClient]);
};
