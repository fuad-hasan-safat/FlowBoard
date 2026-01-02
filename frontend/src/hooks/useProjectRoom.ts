// hooks/useProjectRoom.ts
import { useEffect } from "react";
import { getSocket } from "../lib/socket";

export const useProjectRoom = (
  orgId?: string | null,
  projectId?: string | null
) => {
  useEffect(() => {
    if (!orgId || !projectId) return;

    const socket = getSocket();
    const room = `org:${orgId}:project:${projectId}`;

    console.log("CLIENT JOIN ROOM:", room);
    socket.emit("joinRoom", room);

    return () => {
      socket.emit("leaveRoom", room);
    };
  }, [orgId, projectId]);
};
