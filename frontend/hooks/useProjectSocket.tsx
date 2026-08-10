"use client";

import { HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useProjectSockets(projectId: string | undefined) {
  const router = useRouter();

  useEffect(() => {
    if (!projectId) return;

    let isMounted = true;

    const connection = new HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_SERVER_URL}/hubs/projects`)
      .withAutomaticReconnect()
      .build();

    const startConnection = async () => {
      try {
        await connection.start();

        if (!isMounted) {
          await connection.stop();
          return;
        }

        await connection.invoke("JoinProjectGroup", projectId);

        connection.on("TaskStatusUpdated", () => {
          router.refresh();
        });
      } catch (err) {
        if (isMounted) {
          console.error("SignalR Connection Error: ", err);
        }
      }
    };

    startConnection();

    return () => {
      isMounted = false;

      if (connection.state === HubConnectionState.Connected) {
        connection.stop();
      }
    };
  }, [projectId, router]);
}
