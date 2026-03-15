import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function SearchSection({ onSearch }) {
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const cities = [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Tenkasi",
    "Tirunelveli",
    "Salem",
    "Trichy",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSearch) {
      onSearch({
        location,
        startDate,
        endDate,
      });
    }
  };

  return (
    <div className="bg-black py-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto bg-gray-900 p-6 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-4 items-center"
      >

      

        <input
          list="cities"
          type="text"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="h-12 w-full px-4 rounded bg-black text-white border border-green-400 outline-none"
        />

        <datalist id="cities">
          {cities.map((city) => (
            <option key={city} value={city} />
          ))}
        </datalist>


        <div className="w-full">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            placeholderText="Start Date"
            dateFormat="yyyy-MM-dd"
            popperPlacement="bottom"
            className="h-12 w-full px-4 rounded bg-black text-white border border-green-400 outline-none"
          />
        </div>


        <div className="w-full">
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            placeholderText="End Date"
            minDate={startDate}
            dateFormat="yyyy-MM-dd"
            popperPlacement="bottom"
            className="h-12 w-full px-4 rounded bg-black text-white border border-green-400 outline-none"
          />
        </div>


        <button
          type="submit"
          className="h-12 w-full bg-green-400 text-black font-bold rounded hover:bg-green-300 transition"
        >
          Search
        </button>

      </form>
    </div>
  );
}

export default SearchSection;