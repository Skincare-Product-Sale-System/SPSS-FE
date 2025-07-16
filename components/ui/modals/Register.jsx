"use client";
import React, { useState } from "react";
import Link from "next/link";
import request from "@/utils/axios";
import toast from "react-hot-toast";
import { openLoginModal } from "@/utils/openLoginModal";
import { useRouter } from "next/navigation";

export default function Register({ isStandalone = false }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    surName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    surName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    // Accept formats like: 0912345678 or +84912345678
    const phoneRegex = /^(\+84|0)\d{9,10}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password) => {
    // At least 8 characters, containing at least one letter and one number one special character one capitalized letter
    // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate in real-time
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "username":
        if (!value) {
          error = "Tên tài khoản là bắt buộc";
        } else if (value.length < 3) {
          error = "Tên tài khoản phải có ít nhất 3 ký tự";
        }
        break;

      case "surName":
        if (!value) {
          error = "Họ là bắt buộc";
        }
        break;

      case "lastName":
        if (!value) {
          error = "Tên là bắt buộc";
        }
        break;

      case "emailAddress":
        if (!value) {
          error = "Email là bắt buộc";
        } else if (!validateEmail(value)) {
          error = "Email không hợp lệ";
        }
        break;

      case "phoneNumber":
        if (!value) {
          error = "Số điện thoại là bắt buộc";
        } else if (!validatePhone(value)) {
          error =
            "Số điện thoại không hợp lệ. Ví dụ: 0912345678 hoặc +84912345678";
        }
        break;

      case "password":
        if (!value) {
          error = "Mật khẩu là bắt buộc";
        } else if (value.length < 8) {
          error = "Mật khẩu phải có ít nhất 8 ký tự";
        } else if (!validatePassword(value)) {
          error =
            "Mật khẩu phải chứa ít nhất một chữ cái, một số, một chữ cái viết hoa và một ký tự đặc biệt";
        } else if (
          formData.confirmPassword &&
          value !== formData.confirmPassword
        ) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: "Mật khẩu không khớp",
          }));
        } else if (
          formData.confirmPassword &&
          value === formData.confirmPassword
        ) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: "",
          }));
        }
        break;

      case "confirmPassword":
        if (!value) {
          error = "Vui lòng xác nhận mật khẩu";
        } else if (value !== formData.password) {
          error = "Mật khẩu không khớp";
        }
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return !error;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    Object.keys(formData).forEach((key) => {
      if (key !== "confirmPassword") {
        // Don't include confirmPassword in API submission
        const fieldValid = validateField(key, formData[key]);
        if (!fieldValid) isValid = false;
      } else {
        // Special validation for confirmPassword
        if (formData.password !== formData.confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: "Mật khẩu không khớp",
          }));
          isValid = false;
        }
      }
    });

    if (!isValid) return;

    // Prepare data for API
    const submitData = {
      username: formData.username,
      surName: formData.surName,
      lastName: formData.lastName,
      emailAddress: formData.emailAddress,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
    };

    request
      .post("/authentications/register", submitData)
      .then((res) => {
        if (res.status == 200) {
          toast.success("Đăng ký thành công");

          // Add a small delay before redirecting to ensure the toast is visible
          setTimeout(() => {
            // Redirect to login page after successful registration
            if (isStandalone) {
              router.push('/login');
            } else {
              openLoginModal();
            }
          }, 1500);
        }
      })
      .catch((e) => {
        toast.error(e.response?.data?.message || "Đăng ký thất bại");
      });
  };

  // Render the form content that will be used in both modal and standalone versions
  const renderFormContent = () => (
    <form onSubmit={handleSubmit} acceptCharset="utf-8">
      <div className="style-1 tf-field mb-3">
        <input
          className={`tf-field-input tf-input ${errors.username ? 'border-danger' : ''}`}
          placeholder=" "
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <label className="tf-field-label" htmlFor="">
          Tên tài khoản *
        </label>
        {errors.username && (
          <div className="text-danger mt-1 small">{errors.username}</div>
        )}
      </div>
      <div className="style-1 tf-field mb-3">
        <input
          className={`tf-field-input tf-input ${errors.surName ? 'border-danger' : ''}`}
          placeholder=" "
          type="text"
          name="surName"
          value={formData.surName}
          onChange={handleChange}
          required
        />
        <label className="tf-field-label" htmlFor="">
          Họ *
        </label>
        {errors.surName && (
          <div className="text-danger mt-1 small">{errors.surName}</div>
        )}
      </div>
      <div className="style-1 tf-field mb-3">
        <input
          className={`tf-field-input tf-input ${errors.lastName ? 'border-danger' : ''}`}
          placeholder=" "
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <label className="tf-field-label" htmlFor="">
          Tên *
        </label>
        {errors.lastName && (
          <div className="text-danger mt-1 small">{errors.lastName}</div>
        )}
      </div>
      <div className="style-1 tf-field mb-3">
        <input
          className={`tf-field-input tf-input ${errors.emailAddress ? 'border-danger' : ''}`}
          placeholder=" "
          type="email"
          name="emailAddress"
          value={formData.emailAddress}
          onChange={handleChange}
          required
        />
        <label className="tf-field-label" htmlFor="">
          Email *
        </label>
        {errors.emailAddress && (
          <div className="text-danger mt-1 small">{errors.emailAddress}</div>
        )}
      </div>
      <div className="style-1 tf-field mb-3">
        <input
          className={`tf-field-input tf-input ${errors.phoneNumber ? 'border-danger' : ''}`}
          placeholder=" "
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
        <label className="tf-field-label" htmlFor="">
          Số điện thoại *
        </label>
        {errors.phoneNumber && (
          <div className="text-danger mt-1 small">{errors.phoneNumber}</div>
        )}
      </div>
      <div className="style-1 tf-field mb-3">
        <input
          className={`tf-field-input tf-input ${errors.password ? 'border-danger' : ''}`}
          placeholder=" "
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <label className="tf-field-label" htmlFor="">
          Mật khẩu *
        </label>
        {errors.password && (
          <div className="text-danger mt-1 small">{errors.password}</div>
        )}
      </div>
      <div className="style-1 tf-field mb-4">
        <input
          className={`tf-field-input tf-input ${errors.confirmPassword ? 'border-danger' : ''}`}
          placeholder=" "
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <label className="tf-field-label" htmlFor="">
          Xác nhận mật khẩu *
        </label>
        {errors.confirmPassword && (
          <div className="text-danger mt-1 small">{errors.confirmPassword}</div>
        )}
      </div>
      <div className="bottom">
        <div className="w-100 mb-3">
          <button
            type="submit"
            className="btn-fill justify-content-center w-100 animate-hover-btn radius-3 tf-btn"
            style={{ padding: '12px 0', fontSize: '16px' }}
          >
            <span>Đăng ký</span>
          </button>
        </div>
        <div className="w-100 text-center">
          {isStandalone ? (
            <Link
              href="/login"
              className="btn-link fw-6 link text-primary"
            >
              Đã có tài khoản? Đăng nhập
              <i className="icon icon-arrow1-top-left ms-2" />
            </Link>
          ) : (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                openLoginModal();
              }}
              className="btn-link fw-6 link text-primary"
            >
              Đã có tài khoản? Đăng nhập
              <i className="icon icon-arrow1-top-left ms-2" />
            </a>
          )}
        </div>
      </div>
    </form>
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
      id="register"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <div className="demo-title">Đăng ký</div>
            <span className="icon-close icon-close-popup" data-bs-dismiss="modal" />
          </div>
          <div className="tf-login-form">
            {renderFormContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
