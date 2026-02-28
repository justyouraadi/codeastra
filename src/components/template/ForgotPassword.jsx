import React from 'react'
import SideimagsForm from '../molecules/SideimagsForm'

const ForgotPassword = () => {
    return (
        <div className="flex flex-col lg:flex-row h-screen w-full">
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
                    {/* Header */}
                    <header className="w-full text-center mb-6">
                        <h1 className="text-4xl font-bold text-gray-900">
                            Welcome to CodeAstra
                        </h1>
                        <p className="text-gray-600 mt-1 text-sm">
                            Create, connect, and launch with AI
                        </p>
                    </header>

                    {/* Form */}
                    <form
                        className="w-full max-w-md bg-white shadow-sm p-8 rounded-2xl border border-gray-100"
                    >

                        {/* Email Input */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                required
                            />
                        </div>

                        {/* Verify In Button */}
                        <button
                            type="submit"
                            className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-900 transition disabled:opacity-50"
                        >
                            {"Send OTP"}
                        </button>
                    </form>
                </div>
            </div>

            <div className="flex-1 hidden lg:flex">
                <SideimagsForm />
            </div>
        </div>
    )
}

export default ForgotPassword