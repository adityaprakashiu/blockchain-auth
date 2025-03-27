import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaTimes, FaWindowMinimize } from "react-icons/fa";

const Window = ({ title, children, onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <motion.div
      drag
      className={`absolute bg-white shadow-xl rounded-lg border border-gray-300 ${
        isMinimized ? "hidden" : "block"
      }`}
      style={{ width: "500px", height: "400px", top: "20%", left: "30%" }}
    >
      <div className="flex justify-between items-center bg-gray-700 text-white p-2">
        <span>{title}</span>
        <div className="flex gap-2">
          <FaWindowMinimize onClick={() => setIsMinimized(true)} />
          <FaTimes onClick={onClose} />
        </div>
      </div>
      <div className="p-4 overflow-auto">{children}</div>
    </motion.div>
  );
};

export default Window;
