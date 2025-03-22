"use client";
import useAuthStore from "@/context/authStore";
import request from "@/utils/axios";
import React, { useRef } from "react";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

export default function Login() {
  const closeRef = useRef(null);
  const { setLoggedIn } = useAuthStore();
  const router = useRouter();

  return (
    <div
      className="form-sign-in modal modal-part-content modalCentered fade"
      id="login"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <div className="demo-title">Log in</div>
            <span
              ref={closeRef}
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="tf-login-form">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                request
                  .post("/authentications/login", {
                    usernameOrEmail: e.target.email.value,
                    password: e.target.password.value,
                  })
                  .then((res) => {
                    if (res.data.accessToken) {
                      // Decode JWT token to get user info including role
                      const tokenData = jwtDecode(res.data.accessToken);
                      console.log("Token data:", tokenData); // Ghi log để kiểm tra cấu trúc
                      
                      // Tìm role trong payload, có thể nằm ở nhiều vị trí khác nhau
                      let userRole;
                      if (tokenData.role) {
                        userRole = tokenData.role;
                      } else if (tokenData.Role) {
                        userRole = tokenData.Role;
                      } else if (tokenData.claims && tokenData.claims.role) {
                        userRole = tokenData.claims.role;
                      } else {
                        // Fallback nếu không tìm thấy role
                        console.log("Role not found in token, setting as 'Customer'");
                        userRole = "Customer";
                      }
                      
                      console.log("Extracted user role:", userRole);
                      
                      // Store the role in localStorage
                      localStorage.setItem("userRole", userRole);
                      
                      // Call setLoggedIn to update the auth store with all user details
                      setLoggedIn(res.data.accessToken);
                      toast.success("Login successfully");
                      localStorage.setItem("accessToken", res.data.accessToken);
                      localStorage.setItem(
                        "refreshToken",
                        res.data.refreshToken
                      );
                      
                      // Reload the page to apply the new authentication state
                      if (userRole === 'Staff') {
                        // Force reload đến trang staff home
                        window.location.href = '/staff';
                      } else {
                        // Reload trang hiện tại
                        window.location.reload();
                      }
                    }
                  })
                  .catch((err) => {
                    toast.error(err.message);
                    toast.error("Wrong password or account not found");
                  });
              }}
              className=""
              acceptCharset="utf-8"
            >
              <div className="style-1 tf-field">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  name="email"
                  required
                  autoComplete="abc@xyz.com"
                />
                <label className="tf-field-label" htmlFor="">
                  Email *
                </label>
              </div>
              <div className="style-1 tf-field">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                />
                <label className="tf-field-label" htmlFor="">
                  Password *
                </label>
              </div>
              <div>
                <a
                  href="#forgotPassword"
                  data-bs-toggle="modal"
                  className="btn-link link"
                >
                  Forgot your password?
                </a>
              </div>
              <div className="bottom">
                <div className="w-100">
                  <button
                    type="submit"
                    className="btn-fill justify-content-center w-100 animate-hover-btn radius-3 tf-btn"
                  >
                    <span>Log in</span>
                  </button>
                </div>
                <div className="w-100">
                  <a
                    href="#register"
                    data-bs-toggle="modal"
                    className="btn-link w-100 fw-6 link"
                  >
                    New customer? Create your account
                    <i className="icon icon-arrow1-top-left" />
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
