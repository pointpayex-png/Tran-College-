"use client"

import type React from "react"
import { useState } from "react"

interface PaymentProvider {
  name: string
  feePercentage: number
  phoneNumberRegex: RegExp
}

const providers: PaymentProvider[] = [
  {
    name: "ProviderA",
    feePercentage: 0.02,
    phoneNumberRegex: /^\d{10}$/,
  },
  {
    name: "ProviderB",
    feePercentage: 0.03,
    phoneNumberRegex: /^\d{9}$/,
  },
]

async function validatePhoneNumber(phoneNumber: string, provider: PaymentProvider): Promise<boolean> {
  // Simulate an asynchronous validation process
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(provider.phoneNumberRegex.test(phoneNumber))
    }, 200)
  })
}

async function formatPhoneNumber(phoneNumber: string): Promise<string> {
  // Simulate asynchronous formatting
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`+1-${phoneNumber}`)
    }, 150)
  })
}

async function calculateFees(amount: number, provider: PaymentProvider): Promise<number> {
  // Simulate asynchronous fee calculation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(amount * provider.feePercentage)
    }, 100)
  })
}

const PaymentSystem: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [amount, setAmount] = useState(0)
  const [selectedProvider, setSelectedProvider] = useState(providers[0])
  const [formattedPhone, setFormattedPhone] = useState("")
  const [fees, setFees] = useState(0)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!phoneNumber || !amount) {
      setError("Please fill in all fields.")
      return
    }

    if (!(await validatePhoneNumber(phoneNumber, selectedProvider))) {
      setError("Invalid phone number for the selected provider.")
      return
    }

    try {
      const formattedPhone = await formatPhoneNumber(phoneNumber)
      setFormattedPhone(formattedPhone)

      const fees = await calculateFees(amount, selectedProvider)
      setFees(fees)

      alert(`Payment processed!\nPhone: ${formattedPhone}\nAmount: ${amount}\nFees: ${fees}`)
    } catch (err) {
      setError("An error occurred during processing.")
      console.error(err)
    }
  }

  return (
    <div>
      <h2>Payment System</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input type="tel" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </div>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input type="number" id="amount" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        </div>
        <div>
          <label htmlFor="provider">Provider:</label>
          <select
            id="provider"
            value={selectedProvider.name}
            onChange={(e) => {
              const provider = providers.find((p) => p.name === e.target.value)
              if (provider) {
                setSelectedProvider(provider)
              }
            }}
          >
            {providers.map((provider) => (
              <option key={provider.name} value={provider.name}>
                {provider.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Pay</button>
      </form>
      {formattedPhone && <p>Formatted Phone Number: {formattedPhone}</p>}
      {fees > 0 && <p>Fees: {fees}</p>}
    </div>
  )
}

export { PaymentSystem }
export default PaymentSystem
