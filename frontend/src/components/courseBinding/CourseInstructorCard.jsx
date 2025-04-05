import Tabs from './Tabs';
import PaymentSummary from './PaymentSummary';
import Image from "../../assets/CoverImage2.png"
export default function CourseInstructorCard() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <img
        src={Image}
        alt="Instructor"
        className="w-full rounded-md mb-4"
      />
      <Tabs />
      <PaymentSummary />
    </div>
  );
}
