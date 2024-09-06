import React, { useState, useEffect, useRef } from 'react';

const ScrollBreakPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const scrollTimer = useRef(null);
  const idleTimeout = useRef(null);

  // Function to show the popup
  const handleShowPopup = () => {
    setShowPopup(true);
  };

  // Start the 20-minute timer
  const startTimer = () => {
    // Clear any previous timers
    clearTimeout(scrollTimer.current);
    clearTimeout(idleTimeout.current);

    // Set a timer for 20 minutes (1200 seconds)
    scrollTimer.current = setTimeout(() => {
        console.log("working")
      handleShowPopup();
    }, 1200000); // 20 minutes in milliseconds

    // Reset idle timeout if there's no scroll for 1 minute
    idleTimeout.current = setTimeout(() => {
      resetTimer(); // Reset the timer if no scroll for 1 minute
    }, 60000); // 1 minute in milliseconds
  };

  // Reset the timer if the user is idle for too long
  const resetTimer = () => {
    clearTimeout(scrollTimer.current);
    clearTimeout(idleTimeout.current);
  };

  // Track scroll event
  useEffect(() => {
    const handleScroll = () => {
      // Reset idle timer and start the 20-minute timer if scrolling
      startTimer();
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up scroll event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
      resetTimer();
    };
  }, []);

  return (
    <div>
      {/* Popup that appears after 20 minutes of scrolling */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Take a Break</h2>
            <p>You've been scrolling for 20 minutes. It's time to take a break!</p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrollBreakPopup;
