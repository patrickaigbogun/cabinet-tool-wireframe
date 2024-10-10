'use client';

import { useCallback, useEffect, useState } from 'react';
import { Box, Table } from '@radix-ui/themes';
import DragAndDropTarget from '@/components/draganddroptarget';
import { FileArrowDown, FileMagnifyingGlass, FileX, SortAscending, SortDescending } from '@phosphor-icons/react/dist/ssr';

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

	const handleDelete = (file: FileData) => {
		if (localStorage.getItem(file.id.toString())) {
			// Remove the item from local storage
			localStorage.removeItem(file.id.toString());
			console.log('Item removed from local storage.');
		}
	}

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
		<Box className="p-4 space-y-7 font-bold">
			<div className="container mx-auto">
				<DragAndDropTarget onDropFiles={handleDropFiles} />
			</div>
			<div className='flex flex-row items-center border-[3px] border-[#48295D] p-0 w-fit rounded-full' >
				<input
					placeholder="Search files..."
					type='search'
					value={searchTerm}
					onChange={handleSearch}
					className=" focus:border-black focus:ring-black rounded-full p-2"
				/>
				<FileMagnifyingGlass size={28} className="mr-6" />
			</div>

			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeaderCell >
							<button onClick={() => handleSort('name')} className='border-[1.5px] p-2 rounded-lg'>
								File Name
								{sortAscending? <SortAscending size={24} weight="fill" /> : <SortDescending size={24} weight="fill" />}
							</button>
						</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell >
							<button onClick={() => handleSort('name')} className='border-[1.5px] p-2 rounded-lg' >
								File Type
							</button>
						</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell>
							<button onClick={() => handleSort('name')} className='border-[1.5px] p-2 rounded-lg'>
								File Size
							</button>
						</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell >
							<button onClick={() => handleSort('name')} className='border-[1.5px] p-2 rounded-lg'>
								Date Uploaded
							</button>
						</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell >
							<button onClick={() => handleSort('name')} className='border-[1.5px] p-2 rounded-lg'>
								Download
							</button>
						</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell >
							<button onClick={() => handleSort('name')} className='border-[1.5px] p-2 rounded-lg'>
								Delete
							</button>
						</Table.ColumnHeaderCell>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{filteredFiles.map((file) => (
						<Table.Row key={file.id}>
							<Table.Cell>{file.name}</Table.Cell>
							<Table.Cell>{file.type}</Table.Cell>
							<Table.Cell>{file.size}</Table.Cell>
							<Table.Cell>{file.dateUploaded}</Table.Cell>
							<Table.Cell>
								<button
									className="border-[#48295D]  border rounded-full p-3"
									onClick={() => handleDownload(file)}
								>
									<FileArrowDown size={24} weight="fill" />
								</button>
							</Table.Cell>
							<Table.Cell>
								<button
									className=" border-[#54178d]  border rounded-full p-3"
									onClick={() => handleDelete(file)}
								>
									<FileX size={24} weight="fill" />
								</button>
							</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table.Root>
		</Box>
	);
}
