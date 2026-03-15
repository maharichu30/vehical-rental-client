import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [durationType, setDurationType] = useState("hour");
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bookedDates, setBookedDates] = useState([]);

  useEffect(() => {
    fetchCar();
    fetchBookedDates();
  }, [id]);

  useEffect(() => {
    if (!car || !startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      setTotalPrice(0);
      return;
    }

    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let price = 0;

    const pricePerHour = Number(car.pricePerHour || 0);
    const pricePerDay = Number(car.pricePerDay || 0);
    const pricePerWeek = Number(car.pricePerWeek || 0);

    if (durationType === "hour") {
      const hours = diffDays * 24;
      price = hours * pricePerHour;
    }

    if (durationType === "day") {
      price = diffDays * pricePerDay;
    }

    if (durationType === "week") {
      const weeks = Math.ceil(diffDays / 7);
      price = weeks * pricePerWeek;
    }

    setTotalPrice(price);
  }, [startDate, endDate, car, durationType]);

  const fetchCar = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/cars/${id}`);
      setCar(res.data);
    } catch (error) {
      console.log("Car fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookedDates = async () => {
    try {
      const res = await API.get(`/bookings/car/${id}`);
      setBookedDates(res.data);
    } catch (error) {
      console.log("Booked dates error:", error);
    }
  };

  // check if selected date overlaps with booked range
  const isDateBooked = (date) => {
    const selected = new Date(date);

    return bookedDates.some((booking) => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);

      return selected >= start && selected <= end;
    });
  };

  const handleStartDateChange = (date) => {
    if (isDateBooked(date)) {
      alert("This date is already booked");
      return;
    }

    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    if (isDateBooked(date)) {
      alert("This date is already booked");
      return;
    }

    setEndDate(date);
  };

  const handleProceedPayment = async () => {
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!token) {
      navigate("/login");
      return;
    }

    if (!startDate || !endDate) {
      alert("Please select start and end date");
      return;
    }

    if (!totalPrice || totalPrice <= 0) {
      alert("Invalid price calculation");
      return;
    }

    try {
      const res = await API.post(
        "/payment/create-order",
        { amount: totalPrice },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded");
        return;
      }

      const options = {
        key: "rzp_test_SLc1iUyRWlt4Yx",
        amount: res.data.amount,
        currency: res.data.currency,
        name: "DriveNow",
        description: `Booking payment for ${car.name}`,
        order_id: res.data.id,

        handler: async function (response) {
          try {
            await API.post(
              "/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                carId: car._id,
                startDate,
                endDate,
                totalPrice,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            alert("Payment successful & booking confirmed");
            navigate("/");
          } catch (error) {
            console.log("Verify payment error:", error);
            alert("Payment verification failed");
          }
        },

        prefill: {
          name: storedUser?.name || "",
          email: storedUser?.email || "",
        },

        theme: {
          color: "#22c55e",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.log("Create order error:", error);
      alert("Payment popup failed");
    }
  };

  if (loading) {
    return (
      <div className="bg-black text-green-400 min-h-screen flex items-center justify-center">
        Loading booking page...
      </div>
    );
  }

  if (!car) {
    return (
      <div className="bg-black text-red-400 min-h-screen flex items-center justify-center">
        Car not found
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-gray-900 rounded-xl p-6 shadow-lg">

        <h1 className="text-3xl font-bold text-green-400 mb-6">
          Book {car.name}
        </h1>

        <img
          src={car.image || "https://dummyimage.com/600x400/000/fff"}
          alt={car.name}
          className="w-full h-72 object-cover rounded-lg mb-6"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <p><b>Brand:</b> {car.brand}</p>
            <p><b>Model:</b> {car.model}</p>
            <p><b>Fuel:</b> {car.fuelType}</p>
            <p><b>Transmission:</b> {car.transmission}</p>
            <p><b>Seats:</b> {car.seats}</p>
            <p><b>Location:</b> {car.location}</p>

            <label className="block mt-4 font-bold">Booking Type</label>

            <select
              value={durationType}
              onChange={(e) => setDurationType(e.target.value)}
              className="w-full p-3 mt-2 bg-black border border-green-400"
            >
              <option value="hour">Hourly</option>
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
            </select>
          </div>

          <div>

            <label className="block mb-2 font-bold">Start Date</label>

            <input
              type="date"
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="w-full p-3 mb-4 bg-black border border-green-400"
            />

            <label className="block mb-2 font-bold">End Date</label>

            <input
              type="date"
              value={endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              className="w-full p-3 mb-4 bg-black border border-green-400"
            />

            <div className="bg-black p-4 border border-green-400 rounded mb-4">
              <p className="text-lg font-bold">Total Price</p>
              <p className="text-2xl text-green-400 font-bold">₹{totalPrice}</p>
            </div>

            <button
              onClick={handleProceedPayment}
              className="w-full bg-green-400 text-black py-3 rounded font-bold"
            >
              Proceed to Payment
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Booking;