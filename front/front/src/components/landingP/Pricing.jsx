import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const pricingPlans = [
  {
    id: 1,
    name: "Starter",
    description: "Perfect for students",
    price: "Free",
    priceDescription: "Forever",
    features: [
      "1 Resume",
      "Basic Templates",
      "PDF Export",
      "Basic ATS Checker",
      "Community Support",
    ],
    highlighted: false,
  },
  {
    id: 2,
    name: "Professional",
    description: "For job seekers",
    price: "200ETB",
    priceDescription: "/month",
    features: [
      "Unlimited Resumes",
      "All Templates",
      "AI-Powered Writing",
      "Advanced ATS Checker",
      "Cover Letter Generator",
      "PDF Export",
      "Priority Support",
      "Analytics Dashboard",
    ],
    highlighted: true,
  },
  {
    id: 3,
    name: "Elite",
    description: "For power users",
    price: "500ETB",
    priceDescription: "/month",
    features: [
      "Everything in Professional",
      "Portfolio Generator",
      "LinkedIn Optimization",
      "Interview Questions AI",
      "Resume Analytics",
      "Custom Domain",
      "1-on-1 Coaching",
      "Lifetime Updates",
    ],
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your resume needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative rounded-xl transition ${
                plan.highlighted
                  ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-2xl scale-105"
                  : "bg-white border-2 border-gray-200 hover:border-indigo-300"
              }`}
            >


              <div className="p-8">
                {/* Plan Header */}
                <h3
                  className={`text-2xl font-bold mb-2 ${plan.highlighted ? "text-white" : "text-gray-900"}`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`mb-6 ${plan.highlighted ? "text-indigo-100" : "text-gray-600"}`}
                >
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-8">
                  <span
                    className={`text-4xl font-bold ${plan.highlighted ? "text-white" : "text-gray-900"}`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={
                      plan.highlighted ? "text-indigo-100" : "text-gray-600"
                    }
                  >
                    {plan.priceDescription}
                  </span>
                </div>

                {/* CTA Button */}
                <button
                  className={`w-full py-3 rounded-lg font-semibold mb-8 transition transform hover:scale-105 ${
                    plan.highlighted
                      ? "bg-white text-indigo-600 hover:shadow-lg"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  Get Started
                </button>

                {/* Features */}
                <div className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check
                        className={`w-5 h-5 flex-shrink-0 ${plan.highlighted ? "text-yellow-300" : "text-green-500"}`}
                      />
                      <span
                        className={
                          plan.highlighted ? "text-indigo-50" : "text-gray-700"
                        }
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-gray-600 mb-4">
            Have questions about our pricing?
          </p>
          <a
            href="#faq"
            className="text-indigo-600 font-semibold hover:text-indigo-700"
          >
            Check our FAQ →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
