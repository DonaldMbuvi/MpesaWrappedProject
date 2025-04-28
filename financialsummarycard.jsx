import React from 'react';
import html2canvas from 'html2canvas';

const FinancialSummaryCard = () => {
  const summaryRef = React.useRef(null);

  // Copy to clipboard function
  const copyToClipboard = () => {
    const summaryText = `Total Expenditure: $200\nTop Category: Groceries\nLast Month's Spending: $150`;
    navigator.clipboard.writeText(summaryText)
      .then(() => {
        alert("Summary copied to clipboard!");
      })
      .catch((err) => {
        alert("Failed to copy summary!");
      });
  };

  // Download as image function
  const downloadReport = () => {
    if (summaryRef.current) {
      html2canvas(summaryRef.current).then((canvas) => {
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = image;
        link.download = 'financial-summary.png';
        link.click();
      });
    }
  };

  // Share on social media functions
  const shareOnWhatsApp = () => {
    const message = `Check out my financial summary! Total Expenditure: $200, Top Category: Groceries, Last Month's Spending: $150`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const shareOnTwitter = () => {
    const message = `Check out my financial summary! Total Expenditure: $200, Top Category: Groceries, Last Month's Spending: $150`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const shareOnFacebook = () => {
    const message = `Check out my financial summary! Total Expenditure: $200, Top Category: Groceries, Last Month's Spending: $150`;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div ref={summaryRef} className="max-w-md mx-auto bg-white p-5 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Summary</h2>
      <div className="flex justify-between mb-4">
        <span className="font-medium">Total Expenditure:</span>
        <span className="font-bold text-green-600">$200</span>
      </div>
      <div className="flex justify-between mb-4">
        <span className="font-medium">Top Category:</span>
        <span className="font-bold text-blue-600">Groceries</span>
      </div>
      <div className="flex justify-between mb-4">
        <span className="font-medium">Last Month's Spending:</span>
        <span className="font-bold text-red-600">$150</span>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-4 mt-4">
        <button
          className="w-full py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
          onClick={copyToClipboard}
        >
          Copy Summary
        </button>
      </div>
      <div className="flex gap-4 mt-4">
        <button
          className="w-full py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
          onClick={downloadReport}
        >
          Download Report
        </button>
      </div>
      <div className="flex gap-4 mt-4">
        <button
          className="w-full py-2 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600"
          onClick={shareOnWhatsApp}
        >
          Share on WhatsApp
        </button>
        <button
          className="w-full py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
          onClick={shareOnTwitter}
        >
          Share on Twitter
        </button>
        <button
          className="w-full py-2 bg-blue-800 text-white font-bold rounded-lg hover:bg-blue-900"
          onClick={shareOnFacebook}
        >
          Share on Facebook
        </button>
      </div>
    </div>
  );
};

export default FinancialSummaryCard;
