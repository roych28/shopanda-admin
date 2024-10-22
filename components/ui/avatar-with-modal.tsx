import React, { useState } from 'react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

interface AvatarWithModalProps {
  imageUrl: string;
}

const AvatarWithModal: React.FC<AvatarWithModalProps> = ({ imageUrl }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex justify-center">
        <Avatar className="h-8 w-8 flex-end cursor-pointer" onClick={openModal}>
          <AvatarImage src={imageUrl} />
        </Avatar>
      </div>

      {/* Modal for displaying larger image */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out"
          onClick={closeModal} // Close modal when clicking the background
        >
          <div 
            className="relative p-4 bg-white rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out scale-100"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <img
              src={imageUrl}
              alt="Customer Profile"
              className="max-w-full h-auto"
            />
            {/* Close button */}
            <button 
              className="absolute top-2 right-2 text-black bg-gray-200 rounded-full p-2 hover:bg-gray-300"
              onClick={closeModal}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AvatarWithModal;
