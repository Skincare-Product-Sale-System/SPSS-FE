"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const accountLinks = [
  { href: "/my-profile", label: "Profile" },
  { href: "/my-orders", label: "Orders" },
  { href: "/my-address", label: "Addresses" },
  { href: "/my-reviews", label: "My Reviews" },
];

export default function AccountSideBar() {
  const pathname = usePathname();
  return (
    <ul className="my-account-nav">
      {accountLinks.map((link, index) => (
        <li key={index}>
          <Link
            href={link.href}
            className={`my-account-nav-item ${
              pathname == link.href ? "active" : ""
            }`}
          >
            {link.label}
          </Link>
        </li>
      ))}
      {/* <li>
        <Link href={`/login`} className="my-account-nav-item">
          Logout
        </Link>
      </li> */}
    </ul>
  );
}
