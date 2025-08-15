import { UserCircle } from "lucide-react";

export default function ProfileTab({ user }: { user: any }) {
  return (
    <div className="w-full flex flex-col items-center gap-6 mt-2">
      <div className="flex flex-row items-center gap-4 mb-4">
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="Profilbild"
            className="w-16 h-16 rounded-full object-cover border-2 border-[#ff3c3c] bg-[#23232a]"
          />
        ) : (
          <UserCircle className="w-16 h-16 text-gray-500" />
        )}
        <div className="flex flex-col gap-1">
          <div className="font-bold text-xl text-white break-all">{user?.displayName || user?.email?.split("@")[0] || "User"}</div>
          <div className="text-base text-gray-400 break-all">{user?.email}</div>
        </div>
      </div>
      <table className="w-full text-left text-base">
        <tbody>
          <tr>
            <td className="py-2 pr-4 font-semibold text-white w-1/3">UID:</td>
            <td className="py-2 pl-2 font-mono text-xs bg-[#18181b] px-2 py-1 rounded border border-[#444]">{user?.uid}</td>
          </tr>
          <tr>
            <td className="py-2 pr-4 font-semibold text-white">Mitglied seit:</td>
            <td className="py-2 pl-2 text-gray-300">
              {user?.metadata?.creationTime
                ? new Date(user.metadata.creationTime).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })
                : "-"}
            </td>
          </tr>
        </tbody>
      </table>
      <span className="text-xs text-gray-500 mt-4">Weitere Account-Funktionen folgen...</span>
    </div>
  );
}
