'use client';


import { useState, useCallback } from 'react';
import { Slot } from '@radix-ui/themes';
import clsx from 'clsx';

interface DragAndDropTargetProps {
  className?: string;
  children?: React.ReactNode;
  onDropFiles?: (files: FileList) => void;
}

const DragAndDropTarget: React.FC<DragAndDropTargetProps> = ({ className, children, onDropFiles }) => {
  const [isDragging, setIsDragging] = useState(false);

  const storeInClosedCabinet = (files: FileList) => {
    const closedCabinet = JSON.parse(localStorage.getItem('closedCabinet') || '[]');
    const updatedCabinet = [...closedCabinet, ...Array.from(files)];
    localStorage.setItem('closedCabinet', JSON.stringify(updatedCabinet));
    console.log('Updated closedCabinet:', updatedCabinet);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    console.log('Dropped files:', files);
    storeInClosedCabinet(files);
    if (onDropFiles) {
      onDropFiles(files);
    }
  };

  const handleClick = useCallback(() => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.onchange = (e) => {
      const target = e.target as HTMLInputElement;
	  try {
		if (target.files) {
			console.log('Selected files:', target.files);
			storeInClosedCabinet(target.files);
			if (onDropFiles) {
			  onDropFiles(target.files);
			}
		  }
		
	  } catch (error) {
		console.log(error)
	  }
    
    };
    fileInput.click();
  }, [onDropFiles]);

  return (
    <Slot
      id="drop-target"
      className={clsx(
        'flex items-center justify-center border-2 border-dashed rounded-lg p-4',
        isDragging ? 'border-blue-400' : 'border-gray-400',
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      {children || (
        <div className=" p-28 text-sm">
          Drag and drop files here or click to upload
        </div>
      )}
    </Slot>
  );
};

export default DragAndDropTarget;
