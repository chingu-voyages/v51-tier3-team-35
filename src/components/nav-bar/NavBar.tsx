"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RxAvatar } from "react-icons/rx";
import displayNotifications from "../notifcations/Notifications";
import { useEffect, useRef, useState } from "react";
import { fetchNotifications } from "../../app/services/userService";
export default function NavBar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const timerIdRef = useRef<any>(null);

  const [notifications, setNotifications]= useState([]);
  const [isPollingEnabled, setIsPollingEnabled] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const pollingCallBack = async () => {
      try {
        if(session?.user?._id){
        const data = await fetchNotifications(session?.user._id);
      
        setNotifications(data.notifications);
        console.log("notifications are: ", notifications)}

      } catch (error: any) {
        console.error("polling stopped due to error:", error.message);
        setIsPollingEnabled(false);
      }
    };

    const startPolling = () => {
      timerIdRef.current = setInterval(pollingCallBack, 10000);
    };

    const stopPolling = () => {
      clearInterval(timerIdRef.current);
    };

    if (isPollingEnabled) {
      startPolling();
    } else {
      stopPolling();
    }
    return () => {
      stopPolling();
    };
  }, [session])

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-base-100 shadow-md flex justify-between w-full p-4">
      <div className="flex justify-between w-full">
        <div className="self-center">
          <Link href="/home" className="text-2xl font-bold">
            TravelIt ✈️
          </Link>
        </div>
        {status === "authenticated" && (
          <div className="flex space-x-4">
            <div className="relative">
          <button onClick={toggleDropdown} className="btn btn-ghost btn-circle">
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405C18.523 14.535 18 13.305 18 12V8a6 6 0 00-9.33-4.72A4 4 0 006 8v4c0 1.305-.523 2.535-1.595 3.595L3 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9"
                />
              </svg>
              {notifications.length > 0 && (
                <span className="badge badge-xs badge-primary indicator-item">
                  {notifications.length}
                </span>
              )}
            </div>
          </button>
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-50">
              <div className="p-4">
                <h2 className="text-lg font-semibold">Notifications</h2>
                <ul className="mt-2">
                  {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                      <li key={index} className="p-2 hover:bg-gray-100 rounded-lg">
                        <p>{notification}</p>
                      </li>
                    ))
                  ) : (
                    <li className="p-2 text-gray-500">No notifications</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
            
            <Link href="/adventure/new" className="btn btn-primary">
              New Adventure
            </Link>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost rounded-btn"
              >
                <RxAvatar size="32px" />
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content bg-base-100 rounded-box z-[1] mt-4 w-52 p-2 shadow"
              >
                <li>
                  <Link href={`/users/${session?.user?._id}`}>My Profile</Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      signOut();
                      router.replace("/signin");
                    }}
                  >
                    Log out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
