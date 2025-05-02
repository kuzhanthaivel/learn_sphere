import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import learnSphere from '../assets/learnSphere.png';
import { getCertificateContract } from "../contractIntegration/Certificates";
import { toast } from 'react-toastify';

const CertificateScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [certificateData, setCertificateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificateFromBlockchain = async () => {
      try {
        const contract = await getCertificateContract();
        if (!contract) {
          throw new Error("Failed to connect to blockchain");
        }

        // Get all certificates from blockchain
        const allCertificates = await contract.getAllCertificates();
        

        // Find the specific certificate by ID
        const foundCertificate = allCertificates.find(
          cert => cert.certificateId === id
        );

        if (!foundCertificate) {
          throw new Error("Certificate not found on blockchain");
        }

          const getImageUrl = (imagePath) => {
            if (!imagePath) return null;
            
            if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
              return imagePath;
            }
            const filename = imagePath.replace(/^.*[\\\/]/, '');
            
            return `http://localhost:5001/uploads/${filename}`;
          };
        // Format the certificate data
        const formattedCertificate = {
          userName: foundCertificate.userName,
          profileImage: getImageUrl(foundCertificate.profileImage),
          courseTitle: foundCertificate.courseTitle,
          courseCategory: foundCertificate.courseCategory,
          completionDate: foundCertificate.completionDate,
          certificateId: foundCertificate.certificateId,
          user: foundCertificate.user,
          verifiedOnChain: true,
          qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
            `https://yourdomain.com/Certificate/${id}`
          )}`
        };

        setCertificateData(formattedCertificate);
      } catch (err) {
        console.error("Error fetching certificate:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCertificateFromBlockchain();
    } else {
      toast.error("No certificate ID provided");
      navigate('/');
    }
  }, [id, navigate]);

  const handleDownloadPDF = () => {
    toast.success("PDF download started");
    // Implement actual PDF generation and download here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading certificate data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-800 mt-4">Certificate Not Found</h2>
          <p className="text-gray-600 mt-2">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center flex-col gap-7">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
        <div className="border-8 border-amber-50 p-1">
          {/* Certificate Header */}
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 py-8 px-8 text-center relative">
            <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Blockchain Verified
            </div>

            <div className="mt-6">
              <svg className="w-16 h-16 mx-auto text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 font-serif mt-2">Certificate of Completion</h1>
            <p className="text-gray-600 mt-2">This certificate is proudly presented to</p>
          </div>

          {/* Certificate Body */}
          <div className="py-12 px-8 text-center relative">
            <div className="w-full flex items-center justify-center">
              <img 
                src={certificateData.profileImage}
                alt="Student"
                className="w-24 h-24 rounded-full border-4 border-white shadow-md"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2 font-serif">{certificateData.userName}</h2>
            <p className="text-lg text-gray-600 mb-6">has successfully completed</p>
            <h3 className="text-2xl font-semibold text-amber-700 mb-2">{certificateData.courseTitle}</h3>
            <div className="my-6">
              <p className="text-gray-600">in the category of</p>
              <span className="inline-block mt-2 px-4 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                {certificateData.courseCategory}
              </span>
            </div>

            <div className="border-t border-b border-amber-100 py-4 my-6">
              <p className="text-gray-700">Completed on: <span className="font-semibold text-amber-700">{certificateData.completionDate}</span></p>
              <p className="text-gray-700 mt-1">Issued to: <span className="font-mono text-xs text-gray-500">{certificateData.user}</span></p>
            </div>
          </div>

          {/* Certificate Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0 flex items-center">
                <img 
                  src={certificateData.qrCodeUrl} 
                  alt="Verification QR Code" 
                  className="w-20 h-20 border border-gray-200"
                />
                <div className="ml-4 text-left">
                  <p className="text-xs text-gray-500 mb-1">Certificate ID</p>
                  <p className="text-sm font-mono text-gray-800">{certificateData.certificateId}</p>
                  <p className="text-xs text-gray-500 mt-1">Scan to verify</p>
                </div>
              </div>

              <div className="text-center">
                <div className="mb-2 pl-4">
                  <img 
                    src={learnSphere}
                    alt="Learn Sphere"
                    className="w-28 pl-1"
                  />
                </div>
                <div className="border-t-2 border-amber-300 w-32 mx-auto mb-2"></div>
                <p className="text-xs text-gray-500">Authorized Signature</p>
                <p className="text-xs text-gray-500">Blockchain-secured credentials</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <button 
          onClick={handleDownloadPDF}
          className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md shadow transition"
        >
          Download PDF
        </button>
        <button 
          onClick={() => window.print()}
          className="px-6 py-2 bg-white hover:bg-gray-100 text-amber-600 border border-amber-600 rounded-md shadow transition"
        >
          Print Certificate
        </button>
      </div>
    </div>
  );
};

export default CertificateScreen;