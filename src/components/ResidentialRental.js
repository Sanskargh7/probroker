import React, { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./ResidentialRental.css";
import Cookies from "js-cookie"; // Import js-cookie if not already imported
import SimpleModal from "./SimpleModal";
import Loader from "./Loader"; // Import a loader component
import PropertyCard from "./PropertyCard";
import "react-datepicker/dist/react-datepicker.css"; // Importing DatePicker styles
import { debounce } from "lodash"; // Make sure lodash is installed or implement your own debounce function
import List from "./List"; // Ensure this import is present

import { Minimize2, Maximize2 } from "lucide-react";




const ResidentialRental = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageChanging, setIsPageChanging] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedListedBy, setSelectedListedBy] = useState("");
  const [selectedListedOn, setSelectedListedOn] = useState(null); // Date state
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyTypes, setPropertyTypes] = useState([]); // State for property types
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Add state for mobile detection

  const location = useLocation();
  const navigate = useNavigate();

  const { type: stateType, status, filters } = location.state || {};
  const [type, setType] = useState(stateType || "All");

  const isPremium = Cookies.get("isPremium");

  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    content: null,
  });


  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const [isListView, setIsListView] = useState(() => {
    const savedView = localStorage.getItem('propertyListView');
    return window.innerWidth >= 768 && savedView === 'list';
  });

  // Fetch property types from the server or define them here
  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_IP}/property/types`);
        setPropertyTypes(response.data.types);
      } catch (error) {
        console.error("Error fetching property types:", error);
        // Fallback to predefined types if fetching fails
        setPropertyTypes(["All", "Residential Rent", "Commercial Rent", "Residential Sell", "Commercial Sell"]);
      }
    };

    fetchPropertyTypes();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setIsMobile(isMobile);
      if (isMobile) {
        setIsListView(false); // Force grid view on mobile
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Split by comma and trim each premise name, filter out empty strings
      const premises = searchQuery
        .split(',')
        .map(premise => premise.trim())
        .filter(premise => premise.length > 0);
      
      // Call your API with the array of premise names
      fetchProperties(0, premises);
    } else {
      // If search query is empty, fetch all properties with current filters
      fetchProperties(0);
    }
  };

  const fetchProperties = async (page = 0, premises = [], selectedType = type) => {
    setIsLoading(true);
    try {
      const userId = Cookies.get("userId");
      
      // Create the base payload
      const payload = {
        userId: userId || "",
        status: selectedStatus || "",
        search: premises.length > 0 ? premises.join("|") : "",
        listedOn: selectedListedOn ? formatDate(selectedListedOn) : "",
        type: selectedType === "All" ? "" : selectedType // Use the passed type parameter
      };

      // Add any additional filters if they exist
      if (filters) {
        Object.keys(filters).forEach(key => {
          if (key !== 'type') { // Skip the type from filters as we handle it separately
            payload[key] = filters[key];
          }
        });
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_IP}/cjidnvij/ceksfbuebijn/user/v2/properties/filter/jkdbxcb/wdjkwbshuvcw/fhwjvshudcknsb?page=${page}&size=25`,
        payload
      )

      const newProperties = response.data.data.properties;
      setProperties(newProperties);
      setTotalPages(response.data.data.totalPages);
      setCurrentPage(page);
      setTotalItems(response.data.data.totalItems);
      console.log("This is Page paloyed" ,payload)
console.log("This is Page response" ,response.data.data.properties)
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
    setIsLoading(false);
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = `0${d.getDate()}`.slice(-2); // Ensures two digits
    const month = `0${d.getMonth() + 1}`.slice(-2); // Ensures two digits, and getMonth() is zero-based
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setIsPageChanging(true); // Show loader or indicator
      fetchProperties(page).then(() => {
        setCurrentPage(page); // Update the current page after data is fetched
        setIsPageChanging(false); // Hide loader or indicator
      });
    }
  };

  const handleDateChange = (date) => {
    setSelectedListedOn(date);
  };

  const handleClick = () => {
    const isLoggedIn = Cookies.get("userId");
    if (isPremium === "1") {
      navigate("/filter");
    } else if (isLoggedIn && isPremium === "0") {
      alert("Please Buy Premium");
    } else {
      navigate("/signup");
    }
  };

  useEffect(() => {
    if (!filters && !type && !selectedStatus && !selectedListedOn) return;
    fetchProperties(currentPage);
  }, [filters, type, selectedStatus, selectedListedOn]); // Remove currentPage from dependencies

  useEffect(() => {
    if (status) setSelectedStatus(status);
  }, [status]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [properties]);

  useEffect(() => {
    // Track state values for debugging
    console.log("Type changed to:", type);
    console.log("Filters:", filters);
    
    // Only call API if we have necessary data
    if (type) {
      fetchProperties(currentPage);
    }
  }, [type, filters, selectedStatus, selectedListedOn]); // Remove currentPage to avoid infinite loops

  // Add this effect to handle type changes
  useEffect(() => {
    console.log("Type changed to:", type);
    if (type && type !== "All") {
      // When type changes, update filters too
      if (filters) {
        const updatedFilters = { ...filters, type };
        // Either update the filters state or the location state as needed
      }
      
      // Could fetch properties here if needed
      // fetchProperties(0);
    }
  }, [type]); // Only run when type changes

  useEffect(() => {
    localStorage.setItem('propertyListView', isListView ? 'list' : 'grid');
  }, [isListView]);

  // Update the select onChange handler
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setType(newType);
    
    // Update location state with new type
    navigate(".", { 
      state: { 
        ...location.state,
        type: newType 
      },
      replace: true
    });
    
    // Reset page and fetch properties with new type
    setCurrentPage(0);
    setIsLoading(true);
    fetchProperties(0, [], newType);
  };

  // First, add the getDateRange function if it's not already there
  const getDateRange = () => {
    const todayDate = new Date();
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(todayDate.getDate() - 90);

    switch(type) {
      case "Residential Rent":
        return { minDate: ninetyDaysAgo, maxDate: todayDate };
      default:
        return { minDate: null, maxDate: todayDate };
    }
  };

  return (
    <div className="property-list mx-0 md:mx-2 pagination-container relative">
      {isPageChanging && <Loader />}
      {/* Date Picker */}


      <div className="property-list-container  ">

        <div className="flex items-center justify-start  flex-wrap gap-[15px] my-4 mx-3 md:my-2">
          <div className="flex items-center gap-4">
            <div className="relative">
              <DatePicker
                selected={selectedListedOn}
                onChange={handleDateChange}
                className="form-control h-10 p-2 rounded-lg w-[200px] shadow-md"
                placeholderText="Select listed date"
                isClearable={true}
                clearButtonTitle="Clear date"
                maxDate={new Date()}
                minDate={getDateRange().minDate}
                popperClassName="z-[9999]"
              />
            </div>
            <div className="block md:hidden">
              <button
                className="bg-[#503691] text-white py-3 h-10 flex items-center gap-1 px-1.5  rounded-xl"
                onClick={handleClick}
              >
                <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4L15 12V21L9 18V15.5M9 12L4 4H16" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                All Filter
              </button>
            </div>
          </div>
          {/* Property Type Dropdown */}
          <div className=" flex  md:flex-row rounded-lg ">
            
              <select
                value={type}
                onChange={handleTypeChange}
                className="rounded-l-lg p-2 h-10 shadow-md z-[999] min-w-[60px] md:w-[50px] lg:w-[170px]"
              >
                {propertyTypes.map((propertyType) => (
                  <option key={propertyType} value={propertyType}>
                    {isMobile && propertyType === "Residential Rent" ? "RR" :
                      isMobile && propertyType === "Residential Sell" ? "RS" :
                        isMobile && propertyType === "Commercial Rent" ? "CR" :
                          isMobile && propertyType === "Commercial Sell" ? "CS" :
                            propertyType}
                  </option>
                ))}
              </select>
            
            {/* Search Box */}
            <div className="relative w-full md:w-[400px] lg:w-[500px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  // If input becomes empty, trigger search immediately
                  if (!e.target.value.trim()) {
                    handleSearch();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                className="p-3 pr-40 rounded-r-lg w-full h-10 placeholder:text-gray-400 shadow-md"
                placeholder="Enter premise names"
              />
              <button
                onClick={handleSearch}
                className="absolute right-1 rounded-lg top-1 bottom-1 bg-[#503691] text-white px-4"
              >
                Search
              </button>
            </div>
          </div>

          {/* All Filter Button */}
          <div className="hidden md:block">
            <button
              className="bg-[#503691] text-white  h-10 flex items-center gap-2 px-4 rounded-lg"
              onClick={handleClick}
            >
              <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4L15 12V21L9 18V15.5M9 12L4 4H16" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All Filter
            </button>
          </div>
          <div className="hidden md:flex  items-center gap-2">
            <span className="text-sm text-slate-600"> Change View :</span>
            <div className="flex bg-white border-2 gap-2 w-[75px] h-10 border-blue-100 rounded-full py-[5px] px-2">
              <button
                className={`h-6 w-6 flex items-center justify-center rounded-full transition-all ${!isListView ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm' : 'text-blue-600'}`}
                onClick={() => setIsListView(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="34" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-grid h-4 w-4">
                  <rect width="7" height="7" x="3" y="3" rx="1"></rect>
                  <rect width="7" height="7" x="14" y="3" rx="1"></rect>
                  <rect width="7" height="7" x="14" y="14" rx="1"></rect>
                  <rect width="7" height="7" x="3" y="14" rx="1"></rect>
                </svg>
              </button>


              <button
                className={`flex h-6 w-6 items-center justify-center rounded-full transition-all ${isListView ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm' : 'text-blue-600'}`}
                onClick={() => setIsListView(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-list h-4 w-4"
                >
                  <line x1="8" x2="21" y1="6" y2="6" />
                  <line x1="8" x2="21" y1="12" y2="12" />
                  <line x1="8" x2="21" y1="18" y2="18" />
                  <line x1="3" x2="3.01" y1="6" y2="6" />
                  <line x1="3" x2="3.01" y1="12" y2="12" />
                  <line x1="3" x2="3.01" y1="18" y2="18" />
                </svg>
              </button>

            </div>
          </div>

        </div>

        {/* Total Properties */}
        <p className="text-gray-700 pb-2 text-center">
          {totalItems > 0 && `${totalItems} Properties found`}
        </p>
        {/* <button
          onClick={toggleFullscreen}
          className="p-1.5 hover:bg-slate-100 rounded-lg"
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4 text-slate-600" />
          ) : (
            <Maximize2 className="w-4 h-4 text-slate-600" />
          )}
        </button> */}
        <div>
          {isListView ? (
            <List 
              properties={properties} 
               fetchProperties={() => fetchProperties(currentPage)}
            />
          ) : (
            <div className="properties-grid">
              {properties.map((property) => (
                <div key={property.id} className="gap-4 mt-2 md:m-4">
                  <PropertyCard 
                    property={property} 
                    fetchProperties={() => fetchProperties(currentPage)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        {isLoading && properties.length === 0 ? (
          <Loader />
        ) : properties.length === 0 ? (
          <div className="no-properties">No properties found</div>
        ) : null}

        <div className="pagination">
          <button
            className={`pagination-btn ${currentPage === 0 ? "disabled" : ""}`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            className={`pagination-btn ${currentPage === totalPages - 1 ? "disabled" : ""}`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
          >
            Next
          </button>
        </div>
      </div>

      <SimpleModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
      >
        {modal.content}
      </SimpleModal>
    </div>
  );
};

export default ResidentialRental;
