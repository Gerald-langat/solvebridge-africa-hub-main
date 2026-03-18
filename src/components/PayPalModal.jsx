import { PayPalButtons } from "@paypal/react-paypal-js";

export default function PayPalModal({ onSuccess }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[400px]">
        <h2 className="text-lg font-bold mb-4">Complete Payment ($25)</h2>

        <PayPalButtons
          style={{ layout: "vertical" }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: { value: "25.00" },
                },
              ],
            });
          }}
          onApprove={(data, actions) => {
            return actions.order.capture().then((details) => {
              onSuccess(details); // 🔥 Trigger after payment
            });
          }}
        />
      </div>
    </div>
  );
}
