import type { Metadata } from "next";
import TapChallenge from "@/components/TapChallenge";

export const metadata: Metadata = {
  title: "10-Second Tap Challenge",
  description: "Tap the gyro as many times as you can in ten seconds and climb today's Greek Mansion leaderboard.",
};

export default function GamePage() {
  return <section className="marble min-h-screen"><TapChallenge/></section>;
}
