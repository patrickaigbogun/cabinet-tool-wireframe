'use client';

import { ChangeEvent, useState } from 'react';
import { Box, Table } from '@radix-ui/themes';
import { PinBottomIcon } from '@radix-ui/react-icons';
import DragAndDropTarget from '@/components/draganddroptarget'; // Adjust the path if needed

interface FileData {
	url: string;
	name: string;
	type: string;
	size: string;
	dateUploaded: string;
}

export default function FileTable() {
	const [searchTerm, setSearchTerm] = useState('');
	const [sortColumn, setSortColumn] = useState<keyof FileData>('name');
	const [sortAscending, setSortAscending] = useState(true);
	const [closedCabinet, setClosedCabinet] = useState<FileData[]>([]); // ClosedCabinet as data source

	const filteredFiles = closedCabinet
		.filter(file =>
			file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			file.type.toLowerCase().includes(searchTerm.toLowerCase())
		)
		.sort((a, b) => {
			const compare = a[sortColumn].localeCompare(b[sortColumn]);
			return sortAscending ? compare : -compare;
		});

	const handleSort = (column: keyof FileData) => {
		if (sortColumn === column) {
			setSortAscending(!sortAscending);
		} else {
			setSortColumn(column);
			setSortAscending(true);
		}
	};

	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	// Handle dropped files, convert them into FileData, and update closedCabinet
	const handleDropFiles = (files: FileList) => {
		const newFiles: FileData[] = Array.from(files).map(file => ({
			url: URL.createObjectURL(file), // Generate a URL for file
			name: file.name,
			type: file.type || 'Unknown',
			size: `${(file.size / 1024).toFixed(2)}KB`,
			dateUploaded: new Date().toLocaleDateString(),
		}));

		setClosedCabinet(prevFiles => [...prevFiles, ...newFiles]);
		console.log('Files added to closedCabinet:', newFiles);
	};

	// Custom function to return the file URL as an anchor with download attribute
	const generateDownloadLink = (file: FileData) => {
		return {
			url: file.url,
			anchor: `<a href="${file.url}" download="${file.name}">Download ${file.name}</a>`
		};
	};

	const handleDownload = (file: FileData) => {
		const link = generateDownloadLink(file);
		const a = document.createElement('a');
		a.href = link.url;
		a.download = file.name;
		a.click();
	};

	return (
		<Box className="p-4">
			<div className="container mx-auto mt-10">
				<DragAndDropTarget onDropFiles={handleDropFiles} />
			</div>

			<input
				placeholder="Search files..."
				value={searchTerm}
				onChange={handleSearch}
				className="mb-4"
			/>

			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeaderCell onClick={() => handleSort('name')}>File Name</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell onClick={() => handleSort('type')}>File Type</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell onClick={() => handleSort('size')}>File Size</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell onClick={() => handleSort('dateUploaded')}>Date Uploaded</Table.ColumnHeaderCell>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{filteredFiles.map((file) => (
						<Table.Row key={file.url}>
							<Table.RowHeaderCell>{file.name}</Table.RowHeaderCell>
							<Table.Cell>{file.type}</Table.Cell>
							<Table.Cell>{file.size}</Table.Cell>
							<Table.Cell>{file.dateUploaded}</Table.Cell>
							<Table.Cell>
								<button className='bg-gray-500 p-3' onClick={() => handleDownload(file)}>
									<PinBottomIcon />
								</button>
							</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table.Root>
		</Box>
	);
}
