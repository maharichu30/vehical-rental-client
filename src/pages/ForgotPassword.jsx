import { useState } from "react"
import { Link } from "react-router-dom"
import { FaEnvelope } from "react-icons/fa"
import API from "../services/api"

function ForgotPassword() {

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {

    e.preventDefault()
    setLoading(true)

    try {

      const res = await API.post("/auth/forgot-password", { email })

      alert(res.data.message)

    } catch (error) {

      console.log(error)

      alert(error.response?.data?.message || "Something went wrong")

    }

    setLoading(false)

  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden px-4">

      {/* Background Image */}

      <img
        src="https://images.unsplash.com/photo-1503376780353-7e6692767b70"
        className="absolute w-full h-full object-cover opacity-25"
      />

      {/* Card */}

      <div className="relative w-full max-w-md bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl">

        <h2 className="text-3xl font-bold text-center text-green-400 mb-2">
          Forgot Password
        </h2>

        <p className="text-gray-400 text-center mb-6 text-sm">
          Enter your email and we will send a password reset link
        </p>


        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email Input */}

          <div className="flex items-center bg-black border border-gray-700 rounded-lg px-3 focus-within:border-green-400">

            <FaEnvelope className="text-gray-400 mr-2"/>

            <input
              type="email"
              required
              placeholder="example@email.com"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full p-3 bg-transparent outline-none text-white"
            />

          </div>


          {/* Submit Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-400 hover:bg-green-500 text-black font-semibold py-3 rounded-lg transition duration-300 shadow-lg flex items-center justify-center"
          >

            {loading ? (
              <span className="animate-pulse">Sending...</span>
            ) : (
              "Send Reset Link"
            )}

          </button>

        </form>


        {/* Login Link */}

        <p className="text-center text-gray-500 text-sm mt-6">

          Remember your password?

          <Link
            to="/login"
            className="text-green-400 ml-1 hover:underline"
          >
            Login
          </Link>

        </p>

      </div>

    </div>

  )

}

export default ForgotPassword