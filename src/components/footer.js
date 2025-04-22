"use client";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <div
      className="greyBackground"
      style={{ height: "13vh", alignItems: "center" }}
    >
      <img width={150} src="/images/logo-runking.png"></img>
      <div className="boxTextSmall">
        <p
          className="textSmall"
          style={{ fontSize: "12px", color: "#a0a0a0", marginBottom: "10px" }}
        >
          &copy; {year} Copyright Go RunKing. All rights reserved.
        </p>
      </div>
    </div>
  );
}
