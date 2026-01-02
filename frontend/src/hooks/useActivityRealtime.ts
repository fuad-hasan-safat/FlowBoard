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

    socket.on("activity:created", () => {
      queryClient.invalidateQueries({
        queryKey: ["activity", orgId]
      });
    });

    return () => {
      socket.emit("leaveRoom", room);
      socket.off("activity:created");
    };
  }, [orgId, queryClient]);
};
