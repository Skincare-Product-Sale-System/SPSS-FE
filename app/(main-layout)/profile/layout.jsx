"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileLayout({ children }) {
  const pathname = usePathname();
  const tabs = [
    {
      name: "Profile Information",
      href: "/profile/info",
    },
    {
      name: "My Orders",
      href: "/profile/orders",
    },
    {
      name: "Addresses",
      href: "/profile/addresses",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-4">
            {tabs.map((tab) => (
              <>
                <Link
                  href={tab.href}
                  className={`relative py-3 px-6 font-medium text-sm focus:outline-none ${
                    pathname === tab.href
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.name}
                  <div
                    className={`${
                      pathname == tab.href ? "w-full" : "w-0"
                    } absolute bottom-0 left-0 h-1 bg-blue-500 rounded-full mt-2`}
                  ></div>
                </Link>
              </>
            ))}
          </nav>
        </div>

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
}
