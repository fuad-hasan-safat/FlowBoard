import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "../lib/socket";

export const useNotificationRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();

    socket.on("notification:new", () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"]
      });
    });

    return () => {
      socket.off("notification:new");
    };
  }, [queryClient]);
};