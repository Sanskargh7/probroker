// src/components/Dashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Cookies from "js-cookie";
import SearchInput from "./SearchInput";
import FeaturedOn from "./FeaturedOn";
import axios from "axios";
import { gsap } from "gsap";
import PremiumMessage from "./premium_massage";

const Dashboard = () => {
  const navigate = useNavigate();
  const [propertyCounts, setPropertyCounts] = useState({});

  localStorage.removeItem("filters");

  const handlePropertyClick = (type, status, listedBy) => {
    const isLoggedIn = Cookies.get("userId");
    const isPremium = Cookies.get("isPremium");
    if (isPremium === "1") {
      navigate("/residential-rental", { state: { type, status, listedBy } });
    } else if (isLoggedIn && isPremium === "0") {
      alert("Please Buy Premium");
    } else {
      navigate("/signup");
    }
  };
  useEffect(() => {
    // Fetch the property counts when the component mounts
    axios
      .get(
        `${process.env.REACT_APP_API_IP}/cjidnvij/ceksfbuebijn/user/counts/fjkbfhwb/fkjbwdiwhbdjwkfjwbj`
      )
      .then((response) => {
        setPropertyCounts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching property counts:", error);
      });
  }, []);

  useEffect(() => {
    const buttons = document.querySelectorAll(".dashboard-property-summary, .property-summary1");

    buttons.forEach((button) => {
      button.addEventListener("mouseenter", () => {
        gsap.to(button, { scale: 1.1, duration: 0.3 });
      });

      button.addEventListener("mouseleave", () => {
        gsap.to(button, { scale: 1, duration: 0.3 });
      });
    });

    // Cleanup function to remove event listeners
    return () => {
      buttons.forEach((button) => {
        button.removeEventListener("mouseenter", () => {
          gsap.to(button, { scale: 1.1, duration: 0.3 });
        });

        button.removeEventListener("mouseleave", () => {
          gsap.to(button, { scale: 1, duration: 0.3 });
        });
      });
    };
  }, []);

  return (
    <div className="dashboard-container" style={{ background: "#FAF7FF" }}>
      <PremiumMessage />
      <div className="dashboard-heading">
        <h1> The ultimate property solution for brokers</h1>
        <p>
        #1 B2B platform connecting brokers with direct <br />owner properties in Ahmedabad
        </p>
      </div>
      <SearchInput placeholder="Search Property..." buttonText="Search" />
      {/* <div>
        <p className="dashobard-title">Today's Properties</p>
      </div>
      <div className="today-property">
        <div
          className="property-item1 box-1"
          onClick={() =>
            handlePropertyClick("Residential Rent", "today", "Owner")
          }
        >
          <div className="property-info">
            <span className="number">
              {propertyCounts.todayResidentialRental || 0}
            </span>
            <span className="property-text">Residential Rent</span>
          </div>
        </div>
        <div
          className="property-item1 box-2"
          onClick={() =>
            handlePropertyClick("Residential Sell", "today", "Owner")
          }
        >
          <div className="property-info">
            <span className="number">
              {propertyCounts.todayResidentialSell || 0}
            </span>
            <span className="property-text">Residential Sell</span>
          </div>
        </div>
        <div
          className="property-item1 box-3"
          onClick={() =>
            handlePropertyClick("Commercial Rent", "today", "Owner")
          }
        >
          <div className="property-info">
            <span className="number">
              {propertyCounts.todayCommercialRent || 0}
            </span>
            <span className="property-text">Commercial Rent</span>
          </div>
        </div>
        <div
          className="property-item1 box-4"
          onClick={() =>
            handlePropertyClick("Commercial Sell", "today", "Owner")
          }
        >
          <div className="property-info">
            <span className="number">
              {propertyCounts.todayCommercialSell || 0}
            </span>
            <span className="property-text">Commercial Sell</span>
          </div>
        </div>
      </div> */}
      <div className="active-properties-section">
        {" "}
        <p className="dashobard-title ">Active Properties </p>
      </div>
      <div className="active-property cursor-pointer">
        <div
          className="property-summary1"
          onClick={() => handlePropertyClick("", "active", "Owner")}
        >
          <div className="center-total-image">
            <img src="./image/5.png" alt="Property Icon" />
          </div>
          <div className="property-info1">
            <div className="property-info">
              <span className="number1">
                #{propertyCounts.totalActiveProperties || 0}
              </span>
              <span className="property-text1">Total Property</span>
            </div>
          </div>
        </div>
        <div>
          <div
            className="dashboard-property-summary"
            onClick={() =>
              handlePropertyClick("Residential Rent", "active", "Owner")
            }
          >
            <img src="./image/residental-rent.png" alt="Property Icon" />
            <div className="property-info">
              <span className="number">
                #{propertyCounts.activeResidentialRental || 0}
              </span>
              <span className="property-text">Residential Rent</span>
            </div>
          </div>
          <div
            className="dashboard-property-summary mt-3"
            onClick={() =>
              handlePropertyClick("Commercial Rent", "active", "Owner")
            }
          >
            <img src="./image/3.png" alt="Property Icon" />
            <div className="property-info">
              <span className="number">
                #{propertyCounts.activeCommercialRent || 0}
              </span>
              <span className="property-text">Commercial Rent</span>
            </div>
          </div>
        </div>
        <div>
          <div
            className="dashboard-property-summary"
            onClick={() =>
              handlePropertyClick("Residential Sell", "active", "Owner")
            }
          >
            <img src="./image/2.png" alt="Property Icon" />
            <div className="property-info">
              <span className="number">
                #{propertyCounts.activeResidentialSell || 0}
              </span>
              <span className="property-text">Residential Sell</span>
            </div>
          </div>
          <div
            className="dashboard-property-summary mt-3"
            onClick={() =>
              handlePropertyClick("Commercial Sell", "active", "Owner")
            }
          >
            <img src="./image/4.png" alt="Property Icon" />
            <div className="property-info">
              <span className="number">
                #{propertyCounts.activeCommercialSell || 0}
              </span>
              <span className="property-text">Commercial Sell</span>
            </div>
          </div>
        </div>
      </div>
{/* 
      <FeaturedOn /> */}
      <p className="video-section-title ">How to use PRObroker ?</p>
     <div className="video-section pb-6">
       {/*   <div className="video-section2 hidden md:block">
          <iframe
            src="https://www.youtube.com/embed/VbFJcpt-ejI?si=iZ39GNRdSdAXeqHF"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div> */}
        <div className="video-section2">
          <iframe
            src="https://www.youtube.com/embed/VbFJcpt-ejI?si=iZ39GNRdSdAXeqHF"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
        {/* <div className="video-section2 hidden md:block">
          <iframe
            src="https://www.youtube.com/embed/VbFJcpt-ejI?si=iZ39GNRdSdAXeqHF"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div> */}
      </div>
      {/* <SuggestionButton /> */}
    </div>
  );
};

export default Dashboard;
