"use client";
import useAuthStore from "@/context/authStore";
import request from "@/utils/axios";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { openRegisterModal } from "@/utils/openRegisterModal";
import Link from "next/link";

export default function Login({ isStandalone = false }) {
  const closeRef = useRef(null);
  const { setLoggedIn } = useAuthStore();
  const router = useRouter();
  const [errors, setErrors] = useState({
    usernameOrEmail: '',
    password: ''
  });
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  });

  // Function to close the modal
  const closeModal = () => {
    if (!isStandalone && typeof window !== 'undefined') {
      try {
        const bootstrap = require("bootstrap");
        const modalElement = document.getElementById("login");
        if (modalElement) {
          const modalInstance = bootstrap.Modal.getInstance(modalElement);
          if (modalInstance) {
            modalInstance.hide();
          }
        }
      } catch (error) {
        console.error("Error closing modal:", error);
      }
    }
  };

  const validateUsernameOrEmail = (value) => {
    // Check if it's a valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // If it's not an email, make sure it's at least 3 characters for username
    return emailRegex.test(value) || value.length >= 3;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation
    if (name === 'usernameOrEmail') {
      if (!value) {
        setErrors(prev => ({ ...prev, usernameOrEmail: 'Tên đăng nhập hoặc email là bắt buộc' }));
      } else if (value.length < 3) {
        setErrors(prev => ({ ...prev, usernameOrEmail: 'Tên đăng nhập hoặc email phải có ít nhất 3 ký tự' }));
      } else if (!validateUsernameOrEmail(value)) {
        setErrors(prev => ({ ...prev, usernameOrEmail: 'Tên đăng nhập hoặc email không hợp lệ' }));
      } else {
        setErrors(prev => ({ ...prev, usernameOrEmail: '' }));
      }
    } else if (name === 'password') {
      if (!value) {
        setErrors(prev => ({ ...prev, password: 'Mật khẩu là bắt buộc' }));
      } else if (value.length < 6) {
        setErrors(prev => ({ ...prev, password: 'Mật khẩu phải có ít nhất 6 ký tự' }));
      } else {
        setErrors(prev => ({ ...prev, password: '' }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Final validation before submission
    let isValid = true;
    const newErrors = { usernameOrEmail: '', password: '' };

    if (!formData.usernameOrEmail) {
      newErrors.usernameOrEmail = 'Tên đăng nhập hoặc email là bắt buộc';
      isValid = false;
    } else if (formData.usernameOrEmail.length < 3) {
      newErrors.usernameOrEmail = 'Tên đăng nhập hoặc email phải có ít nhất 3 ký tự';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
      isValid = false;
    }
    // else if (formData.password.length < 6) {
    //   newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    //   isValid = false;
    // }

    setErrors(newErrors);

    if (!isValid) {
      return;
    }

    request
      .post("/authentications/login", {
        usernameOrEmail: formData.usernameOrEmail,
        password: formData.password,
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
          toast.success("Đăng nhập thành công");
          localStorage.setItem("accessToken", res.data.accessToken);
          localStorage.setItem(
            "refreshToken",
            res.data.refreshToken
          );

          // Close the modal if in modal mode
          if (!isStandalone) {
            closeModal();
          }

          // Redirect based on user role using Next.js router
          setTimeout(() => {
            if (userRole === 'Staff') {
              router.push('/staff');
            } else {
              router.push('/');
            }
          }, 500);
        }
      })
      .catch((err) => {
        toast.error(err.message);
        toast.error("Sai mật khẩu hoặc tài khoản không tồn tại");
      });
  };

  // Render the form content that will be used in both modal and standalone versions
  const renderFormContent = () => (
    <div className="tf-login-form">
      <form
        onSubmit={handleSubmit}
        className=""
        acceptCharset="utf-8"
      >
        <div className="style-1 tf-field mb-4">
          <input
            className={`tf-field-input tf-input ${errors.usernameOrEmail ? 'border-danger' : ''}`}
            placeholder=" "
            type="text"
            name="usernameOrEmail"
            value={formData.usernameOrEmail}
            onChange={handleChange}
            required
            autoComplete="username"
          />
          <label className="tf-field-label" htmlFor="">
            Tên đăng nhập hoặc Email *
          </label>
          {errors.usernameOrEmail && (
            <div className="text-danger mt-1 small">{errors.usernameOrEmail}</div>
          )}
        </div>
        <div className="style-1 tf-field mb-4">
          <input
            className={`tf-field-input tf-input ${errors.password ? 'border-danger' : ''}`}
            placeholder=" "
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
          <label className="tf-field-label" htmlFor="">
            Mật khẩu *
          </label>
          {errors.password && (
            <div className="text-danger mt-1 small">{errors.password}</div>
          )}
        </div>
        <div className="mb-4">
          <a
            href="#forgotPassword"
            data-bs-toggle="modal"
            className="btn-link link text-primary"
          >
            Quên mật khẩu?
          </a>
        </div>
        <div className="bottom">
          <div className="w-100 mb-3">
            <button
              type="submit"
              className="btn-fill justify-content-center w-100 animate-hover-btn radius-3 tf-btn"
              style={{ padding: '12px 0', fontSize: '16px' }}
            >
              <span>Đăng nhập</span>
            </button>
          </div>
          <div className="w-100 text-center">
            {isStandalone ? (
              <Link
                href="/register"
                className="btn-link fw-6 link text-primary"
              >
                Khách hàng mới? Tạo tài khoản của bạn
                <i className="icon icon-arrow1-top-left ms-2" />
              </Link>
            ) : (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  openRegisterModal();
                }}
                className="btn-link fw-6 link text-primary"
              >
                Khách hàng mới? Tạo tài khoản của bạn
                <i className="icon icon-arrow1-top-left ms-2" />
              </a>
            )}
          </div>
        </div>
      </form>
    </div>
  );

  // If used as a standalone page (not in a modal)
  if (isStandalone) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card shadow border-0 rounded-3">
              <div className="card-body p-4 p-md-5">
                {renderFormContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If used as a modal
  return (
    <div
      className="form-sign-in modal modal-part-content modalCentered fade"
      id="login"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <div className="demo-title">Đăng nhập</div>
            <span
              ref={closeRef}
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          {renderFormContent()}
        </div>
      </div>
    </div>
  );
}
