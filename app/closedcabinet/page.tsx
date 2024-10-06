'use client';

import { useCallback, useEffect, useState } from 'react';
import { Box, Table } from '@radix-ui/themes';
import { PinBottomIcon } from '@radix-ui/react-icons';
import DragAndDropTarget from '@/components/draganddroptarget';

interface FileData {
	id: number;
	url: string;
	name: string;
	type: string;
	size: string;
	dateUploaded: string;
}

export default function ClosedCabinet() {
	const [searchTerm, setSearchTerm] = useState('');
	const [sortColumn, setSortColumn] = useState<keyof FileData>('name');
	const [sortAscending, setSortAscending] = useState(true);
	const [closedCabinet, setClosedCabinet] = useState<FileData[]>([]);

	// Open IndexedDB and create a 'files' object store
	const initDB = () => {
		const request = indexedDB.open('cabinetDB', 1);

		request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
			const db = (event.target as IDBOpenDBRequest).result;
			db.createObjectStore('files', { keyPath: 'id', autoIncrement: true });
		};

		return request;
	};

	// Add a file to IndexedDB
	const addFileToDB = (file: FileData) => {
		const request = initDB();

		request.onsuccess = (event: Event) => {
			const db = (event.target as IDBOpenDBRequest).result;
			const transaction = db.transaction(['files'], 'readwrite');
			const store = transaction.objectStore('files');
			store.add(file);

			transaction.oncomplete = () => {
				console.log('File added to IndexedDB:', file);
			};
		};

		request.onerror = (event: Event) => {
			console.error('Failed to add file to IndexedDB:', (event.target as IDBOpenDBRequest).error);
		};
	};

	// Fetch all files from IndexedDB
	const fetchFilesFromDB = useCallback(() => {
		const request = initDB();

		request.onsuccess = (event: Event) => {
			const db = (event.target as IDBOpenDBRequest).result;
			const transaction = db.transaction(['files'], 'readonly');
			const store = transaction.objectStore('files');
			const getAllRequest = store.getAll();

			getAllRequest.onsuccess = () => {
				setClosedCabinet(getAllRequest.result);
			};

			getAllRequest.onerror = () => {
				console.error('Failed to fetch files from IndexedDB.');
			};
		};

		request.onerror = (event: Event) => {
			console.error('Failed to open database:', (event.target as IDBOpenDBRequest).error);
		};
	}, []);


	// Handle dropped files, convert them into FileData, and update closedCabinet + IndexedDB
	const handleDropFiles = (files: FileList) => {
		const newFiles: FileData[] = Array.from(files).map((file) => ({
			id: Date.now() + Math.random(), // Unique ID
			url: URL.createObjectURL(file), // Generate a URL for file
			name: file.name,
			type: file.type || 'Unknown',
			size: `${(file.size / 1024).toFixed(2)}KB`,
			dateUploaded: new Date().toLocaleDateString(),
		}));

		newFiles.forEach((file) => addFileToDB(file)); // Add each file to IndexedDB
		setClosedCabinet((prevFiles) => [...prevFiles, ...newFiles]); // Update state
		console.log('Files added to closedCabinet and IndexedDB:', newFiles);
	};

	// Custom function to return the file URL as an anchor with download attribute
	const generateDownloadLink = (file: FileData) => {
		return {
			url: file.url,
			anchor: `<a href="${file.url}" download="${file.name}">Download ${file.name}</a>`,
		};
	};

	const handleDownload = (file: FileData) => {
		const link = generateDownloadLink(file);
		const a = document.createElement('a');
		a.href = link.url;
		a.download = file.name;
		a.click();
	};

	// Handle search
	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	// Handle sorting
	const handleSort = (column: keyof FileData) => {
		if (sortColumn === column) {
			setSortAscending(!sortAscending);
		} else {
			setSortColumn(column);
			setSortAscending(true);
		}
	};

	// Filter and sort files based on search term and sort options
	const filteredFiles = closedCabinet
		.filter((file) =>
			file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			file.type.toLowerCase().includes(searchTerm.toLowerCase())
		)
		.sort((a, b) => {
			const valueA = a[sortColumn];
			const valueB = b[sortColumn];

			// Check if the values are strings, and use localeCompare for strings
			if (typeof valueA === 'string' && typeof valueB === 'string') {
				const compare = valueA.localeCompare(valueB, undefined, {
					numeric: true,
					sensitivity: 'base',
				});
				return sortAscending ? compare : -compare;
			}

			// For numbers or other non-string types, compare them directly
			if (typeof valueA === 'number' && typeof valueB === 'number') {
				return sortAscending ? valueA - valueB : valueB - valueA;
			}

			return 0; // Fallback in case neither are strings or numbers
		});;

	// Fetch files from IndexedDB when the component is mounted
	useEffect(() => {
		fetchFilesFromDB();
	}, [fetchFilesFromDB]);

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
						<Table.ColumnHeaderCell onClick={() => handleSort('name')}>
							File Name
						</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell onClick={() => handleSort('type')}>
							File Type
						</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell onClick={() => handleSort('size')}>
							File Size
						</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell onClick={() => handleSort('dateUploaded')}>
							Date Uploaded
						</Table.ColumnHeaderCell>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{filteredFiles.map((file) => (
						<Table.Row key={file.id}>
							<Table.RowHeaderCell>{file.name}</Table.RowHeaderCell>
							<Table.Cell>{file.type}</Table.Cell>
							<Table.Cell>{file.size}</Table.Cell>
							<Table.Cell>{file.dateUploaded}</Table.Cell>
							<Table.Cell>
								<button
									className="bg-gray-500 p-3"
									onClick={() => handleDownload(file)}
								>
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
