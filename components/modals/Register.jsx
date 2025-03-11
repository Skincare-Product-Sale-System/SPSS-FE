"use client";
import React from "react";
import Link from "next/link";
import request from "@/utlis/axios";
export default function Register() {
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
                console.log(e.target[0].value);
                request.post("/User/sign-up", {
                  username: e.target[0].value,
                  fullname: e.target[1].value,
                  email: e.target[2].value,
                  age: e.target[3].value,
                  gender: e.target[4].value,
                  password: e.target[5].value,
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
                  Full name
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
                  Age *
                </label>
              </div>
              <div className="tf-product-bundle-variant position-relative">
                <select className="tf-select">
                  <option>Male</option>
                  <option>Female</option>
                </select>
                {/* <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="email"
                  autoComplete="abc@xyz.com"
                  required
                  name=""
                /> */}
                {/* <label className="tf-field-label" htmlFor="">
                  Gender *
                </label> */}
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
