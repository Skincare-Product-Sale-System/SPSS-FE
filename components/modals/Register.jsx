"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import request from "@/utlis/axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

export default function Register() {
  // useEffect(() => {}, []);

  return (
    <div
      className="modal modalCentered fade form-sign-in modal-part-content"
      id="register"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <div className="demo-title">Register</div>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="tf-login-form">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (e.target[5].value !== e.target[6].value) {
                  toast.error("Passwords do not match");
                  return;
                }
                const formData = {
                  username: e.target[0].value,
                  surName: e.target[1].value,
                  lastName: e.target[2].value,
                  emailAddress: e.target[3].value,
                  phoneNumber: e.target[4].value,
                  password: e.target[5].value,
                };

                // Open Login Modal
                // loginModal.show();

                request
                  .post("/authentications/register", formData)
                  .then((res) => {
                    if (res.status == 200) {
                      toast.success("Registration successful");
                      location.reload();
                    }
                  })
                  .catch((e) => {
                    toast.error(e.response?.data?.message);
                  });
              }}
            >
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  required
                  name=""
                />
                <label className="tf-field-label" htmlFor="">
                  Username
                </label>
              </div>
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  required
                  name=""
                />
                <label className="tf-field-label" htmlFor="">
                  Sur name
                </label>
              </div>
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  required
                  name=""
                />
                <label className="tf-field-label" htmlFor="">
                  Last name
                </label>
              </div>
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="email"
                  autoComplete="abc@xyz.com"
                  required
                  name=""
                />
                <label className="tf-field-label" htmlFor="">
                  Email *
                </label>
              </div>

              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="number"
                  required
                  name=""
                />
                <label className="tf-field-label" htmlFor="">
                  Phone *
                </label>
              </div>
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="password"
                  required
                  name=""
                  autoComplete="current-password"
                />
                <label className="tf-field-label" htmlFor="">
                  Password *
                </label>
              </div>
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="password"
                  required
                  name=""
                  autoComplete="current-password"
                />
                <label className="tf-field-label" htmlFor="">
                  Confirm Password *
                </label>
              </div>
              <div className="bottom">
                <div className="w-100">
                  <button
                    // href={`/register`}
                    className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                  >
                    <span>Register</span>
                  </button>
                </div>
                <div className="w-100">
                  <a
                    id="login"
                    href="#login"
                    data-bs-toggle="modal"
                    className="btn-link fw-6 w-100 link"
                  >
                    Already have an account? Log in here
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
