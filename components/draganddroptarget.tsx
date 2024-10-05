import { Slot } from '@radix-ui/themes';
import clsx from 'clsx';

interface DragAndDropTargetProps {
	className?: string;
	children?: React.ReactNode;
}

const DragAndDropTarget: React.FC<DragAndDropTargetProps> = ({ className, children }) => {
	return (
		<Slot
			className={clsx(
				'flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-4',
				className
			)}
		>
			{children || (
				<div className="text-sm">
					Drag and drop files here or click to upload
				</div>
			)}
		</Slot>
	);
};

export default DragAndDropTarget;
