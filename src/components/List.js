import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaMapMarked,
  FaBed,
  FaShareAlt,
  FaRegBookmark,
  FaBookmark,
  FaMapMarker,
} from "react-icons/fa";
import { GoHome } from "react-icons/go";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { IoDocumentTextOutline } from "react-icons/io5";
import { LuUserSquare2 } from "react-icons/lu";
import {
  MdOutlineCalendarMonth,
  MdOutlinePhone,
  MdNoteAlt,
} from "react-icons/md";
import { RxDimensions } from "react-icons/rx";
import { TbLamp } from "react-icons/tb";
import Cookies from "js-cookie"; // Import js-cookie if not already imported
import Dropdown from "./CustomDropdown";
import { toast } from "react-toastify";
import PropertyCard from "./PropertyCard"; // Ensure this import is present
import './List.css'; // Import the CSS file for styling

import {
  Building2,
  Share2,
  Phone,
  Search,
  Filter,
  Heart,
  Eye,
  Building,
  MapPin,
  Square,
  Pin,
  ChevronRight,
  GripVertical,
  Calendar,
  LayoutGrid,

  ChevronLeft,
  ChevronDown,
  Maximize2,
  Minimize2
} from 'lucide-react';




function List({ properties, fetchProperties }) {

  const [pinnedColumns, setPinnedColumns] = useState([]);
  const [contactInfoMap, setContactInfoMap] = useState({});
  const [loadingMap, setLoadingMap] = useState({});
  const [savedPropertiesMap, setSavedPropertiesMap] = useState({});
  const [editingMap, setEditingMap] = useState({});
  const [remarksMap, setRemarksMap] = useState({});
  const [propertyTypes, setPropertyTypes] = useState([]); // State for property types
  const [statusMap, setStatusMap] = useState({});

  // Add status options
  const statusOptions = ["Active", "Not Answer", "Sell out", "Data Mismatch", "Broker", "Duplicate"];
  // Check if the new status is one of the specified statuses


  // Initialize remarks from properties
  useEffect(() => {
    const initialRemarks = {};
    properties.forEach(property => {
      initialRemarks[property.id] = property.remark || "";
    });
    setRemarksMap(initialRemarks);
  }, [properties]);

  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_IP}/cjidnvij/ceksfbuebijn/property/types`);
        setPropertyTypes(response.data.types);
      } catch (error) {
        console.error("Error fetching property types:", error);
        // Fallback to predefined types if fetching fails
        setPropertyTypes(["All", "Residential Rent", "Commercial Rent", "Residential Sell", "Commercial Sell"]);
      }
    };

    fetchPropertyTypes();
  }, []);

  const handleSaveRemark = async (propertyId) => {
    try {
      const payload = {
        userId: userId,
        propId: propertyId,
        remark: remarksMap[propertyId],
      };

      const response = await fetch(
        `${process.env.REACT_APP_API_IP}/cjidnvij/ceksfbuebijn/user/jcebduvhd/vehbvyubheud/property-remark`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update remark.");
      }

      const result = await response.json();

      if (result.success) {
        toast.success("Remark updated successfully!");
        // Exit edit mode for this specific property
        setEditingMap(prev => ({
          ...prev,
          [propertyId]: false
        }));
      } else {
        toast.error(result.message || "Failed to update remark. Please try again.");
      }
    } catch (error) {
      console.error("Error saving remark:", error);
      toast.error(error.message || "An error occurred while saving the remark.");
    }
  };


  // in premises name click and redirect on googole map 

  function openInGoogleMaps(address) {
    if (!address) return;
  
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  }

  const handleCancelEdit = (propertyId) => {
    // Exit edit mode for this specific property
    setEditingMap(prev => ({
      ...prev,
      [propertyId]: false
    }));
    // Reset remark to original value for this property
    setRemarksMap(prev => ({
      ...prev,
      [propertyId]: properties.find(p => p.id === propertyId)?.remark || ""
    }));
  };



  // Initialize saved states from properties
  useEffect(() => {
    const initialSavedStates = {};
    properties.forEach(property => {
      initialSavedStates[property.id] = property.isSaved || false;
    });
    setSavedPropertiesMap(initialSavedStates);
  }, [properties]);

  // Initialize status map from properties
  useEffect(() => {
    const initialStatuses = {};
    properties.forEach(property => {
      initialStatuses[property.id] = property.status || "Active";
    });
    setStatusMap(initialStatuses);
  }, [properties]);

  // Move these utility functions outside of handleGetContact
  const copyToClipboard = (text) => {
    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = text;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextArea);
  };

  const userId = Cookies.get("userId");
  const handleSaveClick = async (propertyId) => {
    // Optimistically update the state
    setSavedPropertiesMap(prev => ({
      ...prev,
      [propertyId]: !prev[propertyId]
    }));

    const data = JSON.stringify({
      userId: userId,
      propId: propertyId,
    });

    let config = {
      method: "post",
      url: `${process.env.REACT_APP_API_IP}/cjidnvij/ceksfbuebijn/user/save-property/ijddskjidns/cudhsbcuev`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      if (!response.data.success) {
        // If the API call fails, revert the state
        setSavedPropertiesMap(prev => ({
          ...prev,
          [propertyId]: !prev[propertyId]
        }));
      } else {

      }
    } catch (error) {
      console.error(error);
      // Revert the state in case of error
      setSavedPropertiesMap(prev => ({
        ...prev,
        [propertyId]: !prev[propertyId]
      }));
      toast.error("Error saving property");
    }
  };

  const showToast = (message) => {
    const toast = document.createElement("div");
    toast.innerText = message;
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.backgroundColor = "#333";
    toast.style.color = "#fff";
    toast.style.padding = "10px 20px";
    toast.style.borderRadius = "5px";
    toast.style.zIndex = "1000";
    document.body.appendChild(toast);

    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  };

  // Move handleShareClick outside of handleGetContact
  const handleShareClick = (property) => {
    const brokerName = Cookies.get("name");
    const brokerNumber = Cookies.get("number");

    // Create the share message
    const shareText = `
      ${property?.type === "Residential Rent" ||
        property?.type === "Residential Sell"
        ? `Bedroom: ${property?.bhk || "NA"}`
        : ""
      }
      ${property?.type === "Residential Rent" ||
        property?.type === "Commercial Rent"
        ? `Rent: ${property?.rent || "NA"}`
        : `Price: ${property?.rent || "NA"}`
      }
      Furnished Type: ${property?.furnishedType || "NA"}
      Square Ft: ${property?.squareFt || "NA"} SqFt
      Address: ${property?.area || "NA"}, ${property?.city || "NA"}
      Type: ${property?.unitType || "NA"}
      Name: ${brokerName || "NA"}
      Number: ${brokerNumber || "NA"}
    `
      .trim()
      .replace(/\n\s*\n/g, "\n")
      .replace(/\n+/g, "\n"); // Formatting

    // Check if the user is on mobile or desktop
    const isMobileDevice = /Mobi|Android/i.test(navigator.userAgent);

    if (isMobileDevice) {
      // Mobile device: Open WhatsApp with the pre-filled message
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
        shareText
      )}`;
      window.open(whatsappUrl, "_blank");
    } else {
      // Desktop: Copy to clipboard
      copyToClipboard(shareText);
      // Show toast notification
      showToast("Content copied to clipboard!");
    }
  };

  const handleGetContact = async (propertyId) => {
    setLoadingMap(prev => ({ ...prev, [propertyId]: true }));

    const data = JSON.stringify({
      userId: Cookies.get("userId"),
      propId: propertyId,
    });

    const config = {
      method: "post",
      url: `${process.env.REACT_APP_API_IP}/cjidnvij/ceksfbuebijn/user/v2/contacted/kcndjiwnjn/jdnjsnja/cxlbijbijsb`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      if (response.data.success) {
        setContactInfoMap(prev => ({
          ...prev,
          [propertyId]: response.data.data
        }));

      } else {
        toast.error("Failed to retrieve contact information");
      }
    } catch (error) {
      console.error("Error fetching contact info:", error);
      toast.error("Error retrieving contact information");
    } finally {
      setLoadingMap(prev => ({ ...prev, [propertyId]: false }));
    }
  };

  const toggleColumnPin = (column) => {
    setPinnedColumns(prev => {
      if (prev.includes(column)) {
        return prev.filter(col => col !== column);
      } else {
        return [...prev, column];
      }
    });
  };

  const getFurnishingColor = (furnishedType) => {
    if (!furnishedType || typeof furnishedType !== 'string') {
      return 'bg-gradient-to-r from-slate-500/10 to-gray-500/10 text-slate-700 border-slate-200';
    }
    switch (furnishedType.toLowerCase()) {
      case 'furnished':
        return "bg-gradient-to-r from-sky-500/10 to-blue-500/10 text-sky-700 border-sky-200";
      case 'semi-furnished':
        return 'bg-gradient-to-r from-amber-500/10 to-yellow-500/10 text-amber-700 border-amber-200';
      default:
        return 'bg-gradient-to-r from-slate-500/10 to-gray-500/10 text-slate-700 border-slate-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-700 border-green-200";
      case "Rent out":
        return "bg-gradient-to-r from-orange-500/10 to-amber-500/10 text-orange-700 border-orange-200";
      case "Sell Out":
        return "bg-gradient-to-r from-orange-500/10 to-amber-500/10 text-orange-700 border-orange-200";;
      case "Data Mismatch":
        return "bg-gradient-to-r from-slate-500/10 to-gray-500/10 text-slate-700 border-slate-200";
      case "Not Answer":
        return "bg-gradient-to-r from-orange-500/10 to-amber-500/10 text-orange-700 border-orange-200";
      case "Broker":
        return "bg-gradient-to-r from-sky-500/10 to-blue-500/10 text-sky-700 border-sky-200";
      case "Duplicate":
        return "bg-gradient-to-r from-sky-500/10 to-blue-500/10 text-sky-700 border-sky-200"; // New color for Duplicate status
      default:
        return "";
    }
  };


  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }// Accept properties as a prop

  // Handle status change
  const handleStatusChange = async (propertyId, newStatus) => {
    // Optimistically update the UI
    setStatusMap(prev => ({
      ...prev,
      [propertyId]: newStatus
    }));

    try {
      const data = {
        userId: userId,
        newStatus: newStatus
      };
      // Check if the new status is one of the specified statuses
      if (["Broker", "Rent out", "Sell out", "Duplicate"].includes(newStatus)) {
        // Instead of reloading, call fetchProperties
        setTimeout(() => {
          if (typeof fetchProperties === 'function') {
            fetchProperties();
          }
        }, 100);
      }


      const response = await axios.post(
        `${process.env.REACT_APP_API_IP}/cjidnvij/ceksfbuebijn/user/ckbwubuw/cjiwbucb/${propertyId}/status/cajbyqwvfydgqv`,
        data,
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      if (!response.data.success) {
        // Revert on failure
        setStatusMap(prev => ({
          ...prev,
          [propertyId]: statusMap[propertyId]
        }));
        toast.error("Failed to update status");
      } else {
        toast.success("Status updated successfully");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      // Revert on error
      setStatusMap(prev => ({
        ...prev,
        [propertyId]: statusMap[propertyId]
      }));
      toast.error("Error updating status");
    }
  };

  return (
    <div className="h-[calc(89vh-80px)]  relative">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 h-full flex flex-col">
        <div className="overflow-auto  flex-1">
          <table className="w-full bg-white  border-collapse">
            <thead className="sticky top-0 bg-slate-800 z-[999] ">
              <tr className="[&>*]:border-b-2 [&>*]:border-slate-200 h-[10px]">
                <th className="px-1 py-0.5 text-center min-w-[100px] bg-slate-50 relative">
                  <div className="absolute left-0 inset-y-0 w-1 bg-slate-200/50"></div>
                  <span className="font-sans font-bold  text-white">Date</span>
                </th>
                <th className="px-1 py-0.5 text-center min-w-[80px] bg-slate-50 relative">
                  <div className="absolute left-0 inset-y-0 w-px bg-slate-200/50"></div>
                  <span className="font-sans font-bold  text-white">Type</span>
                </th>
                <th className="px-1 py-0.5 text-center min-w-[180px] relative">
                  <div className="absolute left-0 inset-y-0 w-px bg-slate-200/50"></div>
                  <span className="font-sans font-bold  text-white">Premise Name</span>
                </th>
                <th className="px-1 py-0.5 text-center min-w-[120px] bg-slate-50 relative">
                  <div className="absolute left-0 inset-y-0 w-px bg-slate-200/50"></div>
                  <span className="font-sans font-bold  text-white">Subtype</span>
                </th>
                <th className="px-1 py-0.5 text-center min-w-[150px] bg-slate-50 relative">
                  <div className="absolute left-0 inset-y-0 w-px bg-slate-200/50"></div>
                  <span className="font-sans font-bold  text-white">Area</span>
                </th>
                <th className="px-1 py-0.5 text-center min-w-[100px] bg-slate-50 relative">
                  <div className="absolute left-0 inset-y-0 w-px bg-slate-200/50"></div>
                  <div className="flex items-center justify-center gap-1">
                    <span className="font-sans font-bold  text-white">Sqft</span>
                  </div>
                </th>
                <th className="px-1 py-0.5 text-center min-w-[120px] bg-slate-50 relative">
                  <div className="absolute left-0 inset-y-0 w-px bg-slate-200/50"></div>
                  <span className="font-sans font-bold  text-white">Price</span>
                </th>

                <th className="px-1 py-0.5 text-center min-w-[140px] bg-slate-50 relative">
                  <div className="absolute left-0 inset-y-0 w-px bg-slate-200/50"></div>
                  <span className="font-sans font-bold  text-white">Furnishing</span>
                </th>
                <th className="px-1 py-0.5 text-center min-w-[100px] bg-slate-50 relative">
                  <div className="absolute left-0 inset-y-0 w-px py- bg-slate-200/50"></div>
                  <span className="font-sans font-bold  text-white">Status</span>
                </th>
                <th className="px-1 py-0.5 text-center min-w-[480px] bg-slate-50 relative">
                  <div className="absolute left-0 inset-y-0 w-px bg-slate-200/50"></div>
                  <span className="font-sans font-bold  text-white">Address</span>
                </th>
                <th className="px-1 py-0.5 text-center min-w-[490px] bg-slate-50 relative">
                  <div className="absolute left-0 inset-y-0 w-px bg-slate-200/50"></div>
                  <span className="font-sans font-bold  text-white">Description</span>
                </th>
                <th className={`${pinnedColumns.includes('contact') ? 'sticky right-0 ' : ''} px-2 py-0.5 text-center min-w-[180px] bg-slate-50/95 backdrop-blur-sm relative`}>
                  <div className="absolute left-0 inset-y-0 w-px bg-slate-200/50"></div>
                  <div className="flex gap-3 ">
                    <span className="font-sans font-bold  text-white">Contact Owner</span>
                    <button
                      onClick={() => toggleColumnPin('contact')}
                      className={`p-1 rounded-full hover:bg-slate-200/50 ${pinnedColumns.includes('contact') ? 'text-white' : 'text-slate-400'}`}
                    >
                      <Pin className="w-4 h-4" />
                    </button>
                  </div>
                </th>
                <th className={`${pinnedColumns.includes('actions') ? 'sticky right-0 ' : ''}px-1 flex text-center min-w-[100px] bg-slate-100/95 backdrop-blur-sm relative`}>
                  <div className="absolute flex left-0 inset-y-0 w-px bg-slate-200/50"></div>
                  <span className="font-sans font-bold pl-2 text-white">Actions</span>
                  <button
                    onClick={() => toggleColumnPin('actions')}
                    className={`pr-2 rounded-full hover:bg-slate-200/50 ${pinnedColumns.includes('actions') ? 'text-white' : 'text-slate-400'}`}
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-1 py-0.5 text-left min-w-[400px] bg-slate-50 relative">
                  <div className="absolute left-0 inset-y-0 w-px bg-slate-200/50"></div>
                  <span className="font-sans font-bold  text-white">Remarks</span>
                </th>
              </tr>
            </thead>

            <tbody className=" ">
              {properties.map((property, index) => (
                <tr
                  key={index}
                  className={`
                      hover:bg-slate-50/50 backdrop-blur-sm group relative
                      ${index % 2 === 0 ? 'bg-slate-50/10' : 'bg-white'}
                      border-l-4  hover:border-l-blue-400 transition-colors duration-200
                    `}
                >
                  <td className="px-3 py-2.5 text-[14px] text-slate-600 whitespace-nowrap group-hover:bg-white/50 relative">
                    <div className="absolute left-0 inset-y-0 w-1 bg-slate-100/50 group-hover:bg-slate-200/50 transition-colors"></div>
                    <div className="flex font-sans font-semibold items-center gap-1">

                      {formatDate(property.listedDate)}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap group-hover:bg-white/50 relative">
                    <div className="absolute left-0 inset-y-0 w-px bg-slate-100/50 group-hover:bg-slate-200/50 transition-colors"></div>
                    <span className={`inline-flex items-center px-2 py-[5px] rounded-2xl text-[14px] font-m border    font-sans font-semibold  bg-gradient-to-r from-blue-500/10 to-blue-500/10 text-blue-700 border-rose-200';`}>
                      {property.type}

                    </span>
                  </td>
                  <td className="px-3 py-2.5  group-hover:bg-white/50 relative">
                    <div className="absolute left-0 inset-y-0 w-px bg-slate-100/50 group-hover:bg-slate-200/50 transition-colors"></div>
                    <span className="font-sans text-[14px] font-semibold text-slate-800 cursor-pointer" onClick={() => openInGoogleMaps(`${property?.title || ''} ${property?.area || ''} `)}>{property.title}</span>
                  </td>
                  <td className="px-3 py-1 text-center group-hover:bg-white/50 relative">
                    <div className="absolute left-0 inset-y-0 w-px bg-slate-100/50 group-hover:bg-slate-200/50 transition-colors"></div>
                    {property.type === "Commercial Rent" || property.type === "Commercial Sell" ? (
                      <span className="font-sans text-[14px] font-semibold text-slate-700">{property.unitType}</span>
                    ) : (
                      <div className="flex flex-col">
                        <span className="font-sans text-[14px] font-semibold text-slate-700">{property.bhk}</span>
                        <span className="font-sans text-[14px] font-semibold text-slate-700">{property.unitType}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2.5 group-hover:bg-white/50 relative">
                    <div className="absolute left-0 inset-y-0 w-px bg-slate-100/50 group-hover:bg-slate-200/50 transition-colors"></div>
                    <div className="flex items-center font-sans font-semibold gap-1 text-[14px] text-slate-700">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {property.area}
                    </div>
                  </td>

                  <td className="px-3 py-2.5 text-center whitespace-nowrap group-hover:bg-white/50 relative">
                    <div className="absolute left-0 inset-y-0 w-px bg-slate-100/50 group-hover:bg-slate-200/50 transition-colors"></div>
                    <span className="font-sans text-[14px] font-semibold text-slate-700">{property.squareFt} sqft</span>
                  </td>


                  <td className="px-3 py-2.5 text-[14px] font-bold text-blue-500 text-center whitespace-nowrap group-hover:bg-white/50 relative">
                    <div className="absolute  left-0 inset-y-0 w-px bg-slate-100/50 group-hover:bg-slate-200/50 transition-colors font-sans font-semibold"></div>
                    {"Rs.   " + property.rent}
                  </td>

                  <td className="px-3 py-2.5 text-center whitespace-nowrap group-hover:bg-white/50 relative">
                    <div className="absolute left-0 inset-y-0 w-px bg-slate-100/50 group-hover:bg-slate-200/50 transition-colors"></div>
                    <span className={` items-center font-sans font-semibold px-10 py-1.5 rounded-2xl text-[14px]  border ${getFurnishingColor(property.furnishedType)}`}>
                      {property.furnishedType}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap group-hover:bg-white/50 relative">
                    <div className="absolute  font-sans font-semibold left-0 inset-y-0 w-px bg-slate-100/50 group-hover:bg-slate-200/50 transition-colors"></div>
                    <select
                      value={statusMap[property.id] || "Active"}
                      onChange={(e) => handleStatusChange(property.id, e.target.value)}
                      className={`px-2 py-[5px] font-sans font-semibold text-center rounded-2xl text-[14px]  border cursor-pointer
                        ${getStatusColor(statusMap[property.id] || "Active")}
                        hover:bg-opacity-80  duration-200`}
                    >
                      {(
                        property.type === "Residential Rent" || property.type === "Commercial Rent"
                          ? statusOptions
                            .filter(option => option !== "Sell Out")
                            .concat("Rent out")
                          : statusOptions
                      ).map((option) => (
                        <option className="bg-white text-black" key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2.5 group-hover:bg-white/50 relative">
                    <div className="absolute left-0 inset-y-0 w-px bg-slate-100/50 group-hover:bg-slate-200/50 transition-colors"></div>
                    <div className="font-sans font-semibold text-[14px] text-slate-600 max-w-[450px]">
                      {property.address}
                    </div>
                  </td>

                  <td className="px-3 py-2.5 group-hover:bg-white/50 relative">
                    <div className="absolute left-0 inset-y-0 w-px bg-slate-100/50 group-hover:bg-slate-200/50 transition-colors"></div>
                    <div className="text-[14px] font-sans font-semibold text-slate-600 max-w-[490px]">
                      {property.description}
                    </div>
                  </td>

                  <td className={`${pinnedColumns.includes('contact') ? 'sticky right-0' : ''} px-3 py-2.5 whitespace-nowrap bg-slate-50/95 backdrop-blur-sm  group-hover:bg-white/50 relative`}>
                    <div className="absolute left-0 inset-y-0  w-px bg-slate-100/50 group-hover:bg-slate-200/50 transition-colors"></div>
                    {!contactInfoMap[property.id] ? (
                      <button
                        onClick={() => handleGetContact(property.id)}
                        className="bg-[#EFE9FF] text-[#503691] border border-[#503691] font-bold  px-4 py-2 rounded-full text-[14px]   flex items-center gap-1"
                        disabled={loadingMap[property.id]}
                      >
                        <Phone className="w-3 h-3 font-bold" />
                        <p className="">{loadingMap[property.id] ? "Loading..." : "Get Contact"}</p>
                      </button>
                    ) : (
                      <div className="flex items-center justify-evenly py-1 gap-3 px-2 rounded-lg bg-white text-slate-700">
                        {/* Contact Name and Number */}
                        <p className="text-[14px]  font-medium">
                          {contactInfoMap[property.id]?.name || "NA"} - {contactInfoMap[property.id]?.number || "NA"}
                        </p>

                        {/* Icons for Phone and WhatsApp */}
                        <div className="flex ">

                          <a
                            href={`https://wa.me/${contactInfoMap[property.id]?.number?.startsWith("+91")
                              ? contactInfoMap[property.id].number.replace("+91", "").trim()
                              : contactInfoMap[property.id]?.number || ""
                              }`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:scale-110  gap-5 transition-transform"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 448 512"
                              className="h-6 w-6"
                              fill="#25D366"
                            >
                              <path d="M92.1 254.6c0 24.9 7 49.2 20.2 70.1l3.1 5-13.3 48.6L152 365.2l4.8 2.9c20.2 12 43.4 18.4 67.1 18.4h.1c72.6 0 133.3-59.1 133.3-131.8c0-35.2-15.2-68.3-40.1-93.2c-25-25-58-38.7-93.2-38.7c-72.7 0-131.8 59.1-131.9 131.8zM274.8 330c-12.6 1.9-22.4 .9-47.5-9.9c-36.8-15.9-61.8-51.5-66.9-58.7c-.4-.6-.7-.9-.8-1.1c-2-2.6-16.2-21.5-16.2-41c0-18.4 9-27.9 13.2-32.3c.3-.3 .5-.5 .7-.8c3.6-4 7.9-5 10.6-5c2.6 0 5.3 0 7.6 .1c.3 0 .5 0 .8 0c2.3 0 5.2 0 8.1 6.8c1.2 2.9 3 7.3 4.9 11.8c3.3 8 6.7 16.3 7.3 17.6c1 2 1.7 4.3 .3 6.9c-3.4 6.8-6.9 10.4-9.3 13c-3.1 3.2-4.5 4.7-2.3 8.6c15.3 26.3 30.6 35.4 53.9 47.1c4 2 6.3 1.7 8.6-1c2.3-2.6 9.9-11.6 12.5-15.5c2.6-4 5.3-3.3 8.9-2s23.1 10.9 27.1 12.9c.8 .4 1.5 .7 2.1 1c2.8 1.4 4.7 2.3 5.5 3.6c.9 1.9 .9 9.9-2.4 19.1c-3.3 9.3-19.1 17.7-26.7 18.8zM448 96c0-35.3-28.7-64-64-64H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96zM148.1 393.9L64 416l22.5-82.2c-13.9-24-21.2-51.3-21.2-79.3C65.4 167.1 136.5 96 223.9 96c42.4 0 82.2 16.5 112.2 46.5c29.9 30 47.9 69.8 47.9 112.2c0 87.4-72.7 158.5-160.1 158.5c-26.6 0-52.7-6.7-75.8-19.3z" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className={`${pinnedColumns.includes('actions') ? 'sticky right-0' : ''} px-3 py-2.5 whitespace-nowrap bg-slate-100/95 backdrop-blur-sm group-hover:bg-white/50 relative`}>
                    <div className="absolute left-0 inset-y-0 w-px bg-slate-100/50 group-hover:bg-slate-200/50 transition-colors"></div>
                    <div className="flex items-center gap-1.5">
                      <button
                        className="p-1.5 hover:bg-slate-200/50 rounded-lg bg-slate-100/80"
                        onClick={() => handleShareClick(property)}
                      >
                        <FaShareAlt className="w-3 h-3 text-slate-600" />
                      </button>
                      <div
                        className={`flex flex-row items-center gap-2 h-fit ${savedPropertiesMap[property.id]
                          ? " text-[#503691]"
                          : ""
                          }  px-3 py-1.5  cursor-pointer`}
                        onClick={() => handleSaveClick(property.id)}
                      >
                        {savedPropertiesMap[property.id] ? (
                          <FaBookmark className="h-4 w-4" />
                        ) : (
                          <FaRegBookmark className="h-4 w-4" />
                        )}
                      </div>

                    </div>
                    {/* {savedPropertiesMap[property.id] ? "Unsave" : "Save"} */}

                    {/* this is remark */}
                  </td>
                  <td className="px-3 py-2.5 max-w-full group-hover:bg-white/50 relative">
                    <div className="absolute left-0 inset-y-0 w-px bg-slate-100/50 group-hover:bg-slate-200/50 transition-colors"></div>
                    <div className="text-[14px] text-slate-600 gap-2 ">
                      {editingMap[property.id] ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={remarksMap[property.id] || ""}
                            onChange={(e) =>
                              setRemarksMap((prev) => ({
                                ...prev,
                                [property.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSaveRemark(property.id);
                              }
                            }}
                            className="border p-2 rounded w-full"
                          />
                          <AiOutlineCheck
                            className="text-green-500 cursor-pointer"
                            onClick={() => handleSaveRemark(property.id)}
                          />
                          <AiOutlineClose
                            className="text-red-500 cursor-pointer"
                            onClick={() => handleCancelEdit(property.id)}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2 max-w-[400px]">
                          <p className="line-clamp-2 break-words text-sm">
                            {remarksMap[property.id] || "Add a remark"}
                          </p>
                          <button
                            className="text-blue-500 hover:underline"
                            onClick={() =>
                              setEditingMap((prev) => ({
                                ...prev,
                                [property.id]: true,
                              }))
                            }
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default List;

