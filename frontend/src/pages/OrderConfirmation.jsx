import { CheckCircle } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

const OrderConfirmation = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-[#EAEDED] flex justify-center py-12">
      <div className="bg-white p-8 border border-gray-300 rounded-md max-w-2xl w-full text-center h-fit shadow-sm">
        <CheckCircle size={64} className="text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-medium mb-2">Order placed, thank you!</h1>
        <p className="text-lg text-gray-700 mb-6">
          Confirmation will be sent to your default email.
        </p>
        <div className="bg-gray-100 p-4 rounded text-left mb-6 inline-block">
          <p className="font-bold">Order Number: #AMZN-00{id}</p>
          <p className="text-sm text-gray-600 mt-1">Expected Delivery: Tomorrow</p>
        </div>
        <div>
          <Link to="/" className="text-blue-600 hover:text-orange-700 hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;