"use client";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useProjectSockets(projectId: string | undefined) {
  const router = useRouter();
  useEffect(() => {
    if (!projectId) return;
    // SignalR Connection Builder
    const connection = new HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_SERVER_URL}/hubs/projects`)
      .withAutomaticReconnect()
      .build();

    // Start Connection
    connection.start().then(() => {
      connection.invoke("JoinProjectGroup", projectId);
    });

    // Listening for real-time task status changes
    connection.on("TaskStatusUpdated", () => {
      router.refresh();
    });

    // Close Connection
    return () => {
      connection.stop();
    };
  }, [projectId, router]);
}
