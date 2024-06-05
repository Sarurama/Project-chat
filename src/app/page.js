"use client";

import HeaderAndFooter from "./header/page";
import Providers from "./provider";
import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <Providers>
      <HeaderAndFooter>
        <main
          style={{
            width: "100%",
            height: "90vh",
            boxSizing: "border-box",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="home-div">
            <p style={{ color: "white", lineHeight: "1.5em" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut in
              enim eget diam mollis cursus in eget arcu. Sed ac est eu ligula
              auctor rutrum ut vulputate ligula. Pellentesque habitant morbi
              tristique senectus et netus et malesuada fames ac turpis egestas.
              Vestibulum volutpat fringilla cursus. Nulla semper enim eget metus
              semper, a dapibus odio luctus. Aliquam eget varius massa, vel
              sodales augue. Aenean et cursus metus. Nunc feugiat, est sit amet
              ullamcorper auctor, leo turpis volutpat ante, nec consectetur
              purus dui ut mauris. Ut in maximus lacus, ut egestas tortor.
              Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc
              facilisis mi a mi porta rutrum. Donec porta commodo tortor ac
              sodales.
            </p>
            <section
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "30%",
                maxWidth: "250px",
                alignSelf: "end",
                justifySelf: "end",
              }}
            >
              <p
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  fontSize: "0.7rem",
                  color: "#209cee",
                }}
              >
                If you have an account
                <Link
                  href="./pages/login"
                  style={{
                    fontSize: "1rem",
                    textDecoration: "none",
                    padding: "0.3em 0.5em",
                    marginTop: "0.3em",
                    border: "1px #209cee solid ",
                    color: "white",
                    borderRadius: "10px",
                  }}
                >
                  Login
                </Link>
              </p>

              <p
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  fontSize: "0.7rem",
                  color: "#209cee",
                }}
              >
                If you want to SignUp
                <Link
                  href="./pages/signup"
                  style={{
                    fontSize: "1rem",
                    textDecoration: "none",
                    padding: "0.3em 0.5em",
                    marginTop: "0.3em",
                    border: "1px #209cee solid ",
                    color: "white",
                    borderRadius: "10px",
                  }}
                >
                  SignUp
                </Link>
              </p>
            </section>
          </div>
        </main>
      </HeaderAndFooter>
    </Providers>
  );
}
