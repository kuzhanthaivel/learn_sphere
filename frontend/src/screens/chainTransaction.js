import Navbar from "../components/Header";
import Footer from "../components/footer";
import { MdArrowBackIos } from "react-icons/md";

export default function ChainTransaction() {
  // Sample data for the table
  const data = Array.from({ length: 7 }, (_, i) => ({
    id: i + 1,
    courseName: "Bold text column",
    courseType: "Regular text column",
    transactionType: "Regular text column",
    tokenOrMoney: "Regular text column",
    transactionIdServer: "Regular text column",
    transactionIdChain: "Regular text column",
    transactionDate: "Regular text column",
  }));

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 px-8 py-6 ">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-[#20B486] font-semibold text-xl mb-6">
            <button className="border border-gray-200 py-2 pl-3 pr-1  rounded-xl cursor-pointer text-black text-center "><MdArrowBackIos /></button>
            <span>Your Transactions</span>
          </div>

          <div className="overflow-x-auto rounded-lg border ">
            <table className="w-full text-left border-collapse ">
              <thead className="bg-gray-100">
                <tr className="text-sm text-gray-600">
                  <th className="p-3 font-semibold">S.No</th>
                  <th className="p-3 font-semibold">Course Name</th>
                  <th className="p-3 font-semibold">Course Type</th>
                  <th className="p-3 font-semibold">Transaction Type</th>
                  <th className="p-3 font-semibold">Token or Moneys</th>
                  <th className="p-3 font-semibold">Transaction Id in Server</th>
                  <th className="p-3 font-semibold">Transaction Id in Chain</th>
                  <th className="p-3 font-semibold">Transaction Date</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id} className="border-b text-sm">
                    <td className="p-3 font-semibold">{row.id}</td>
                    <td className="p-3">{row.courseName}</td>
                    <td className="p-3">{row.courseType}</td>
                    <td className="p-3">{row.transactionType}</td>
                    <td className="p-3">{row.tokenOrMoney}</td>
                    <td className="p-3">{row.transactionIdServer}</td>
                    <td className="p-3">{row.transactionIdChain}</td>
                    <td className="p-3">{row.transactionDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
