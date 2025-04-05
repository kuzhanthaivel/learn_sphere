export default function PaymentSummary() {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md flex flex-col items-center">
        <p className="text-sm mb-4 text-center font-bold">Unlock the full course and gain lifetime access to all materials.</p>
        <div className="text-sm">
          <p className="my-4">Course Amount: <span className="font-semibold ">$XX</span></p>
          <p className="my-4">Discount Applied: <span className="font-semibold ">$X</span></p>
          <hr className="my-4" />
          <p className="my-4 text-lg font-bold">Total Payment: <span className="font-bold text-green-600">${'XXX'}</span></p>
        </div>
        <button className="flex justify-center items-center mt-5 bg-green-500 text-white p-3 rounded hover:bg-green-600 transition-all duration-200">
          Make Payment
        </button>
      </div>
    );
  }
  