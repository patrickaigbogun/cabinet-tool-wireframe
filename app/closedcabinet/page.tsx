'use client';

import { useCallback, useEffect, useState } from 'react';
import { Box, Table } from '@radix-ui/themes';
import DragAndDropTarget from '@/components/draganddroptarget';
import { FileArrowDown, FileMagnifyingGlass, FileX, SortAscending, SortDescending, Clipboard } from '@phosphor-icons/react/dist/ssr';

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
	}, []); // Ensure this function doesn't recreate on every render

	// Check if the remaining storage is less than 500MB before adding files
	const checkStorageLimit = async () => {
		if (!navigator.storage) return false;

		const estimate: StorageEstimate = await navigator.storage.estimate();

		// Provide default values in case estimate.usage or estimate.quota are undefined
		const usage = estimate.usage ?? 0;
		const quota = estimate.quota ?? 0

		const usedStorageMB = usage ? Math.floor(usage / 1024 / 1024) : 0;
		const availableStorageMB = quota ? Math.floor((quota - usage) / 1024 / 1024) : 0;

		console.log(`Used storage: ${usedStorageMB} MB, Available storage: ${availableStorageMB} MB`);

		// Prevent adding files if the used storage is 500MB or more
		return usedStorageMB < 500;
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

	// Handle dropped files, convert them into FileData, and update closedCabinet + IndexedDB
	const handleDropFiles = async (files: FileList) => {
		const canAddFiles = await checkStorageLimit();
		if (!canAddFiles) {
			console.error('Cannot add more files. Storage limit exceeded (500MB).');
			return;
		}

		const newFiles: FileData[] = Array.from(files).map((file) => ({
			id: Date.now() + Math.random(),
			url: URL.createObjectURL(file),
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

	const [tooltipId, setTooltipId] = useState<number | null>(null); // State to track the tooltip

	async function handleCopyLink(file: FileData, index: number) {
		const link = generateDownloadLink(file);
		try {
			await navigator.clipboard.writeText(link.anchor);
			// Show the tooltip for the clicked button
			setTooltipId(index);
			// Hide the tooltip after 2 seconds
			setTimeout(() => {
				setTooltipId(null);
			}, 2000);
		} catch (error) {
			console.log(error);
		}
	}


	const handleDownload = (file: FileData) => {
		const link = generateDownloadLink(file);
		const a = document.createElement('a');
		a.href = link.url;
		a.download = file.name;
		a.click();
	};

	const handleDelete = (file: FileData) => {
		const request = initDB();

		request.onsuccess = (event: Event) => {
			const db = (event.target as IDBOpenDBRequest).result;
			const transaction = db.transaction(['files'], 'readwrite');
			const store = transaction.objectStore('files');
			const deleteRequest = store.delete(file.id);

			deleteRequest.onsuccess = () => {
				console.log(`File with id ${file.id} deleted from IndexedDB`);
				setClosedCabinet((prevFiles) => prevFiles.filter((f) => f.id !== file.id));
			};

			deleteRequest.onerror = (event: Event) => {
				console.error(`Failed to delete file with id ${file.id}:`, (event.target as IDBRequest).error);
			};
		};

		request.onerror = (event: Event) => {
			console.error('Failed to open database for deletion:', (event.target as IDBOpenDBRequest).error);
		};
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

			if (typeof valueA === 'string' && typeof valueB === 'string') {
				const compare = valueA.localeCompare(valueB, undefined, { numeric: true, sensitivity: 'base' });
				return sortAscending ? compare : -compare;
			}

			if (typeof valueA === 'number' && typeof valueB === 'number') {
				return sortAscending ? valueA - valueB : valueB - valueA;
			}

			return 0;
		});

	// Fetch files from IndexedDB when the component is mounted
	useEffect(() => {
		fetchFilesFromDB();
	}, [fetchFilesFromDB]);

	return (
		<Box className="p-4 space-y-7 font-bold">
			<div className="container mx-auto">
				<DragAndDropTarget onDropFiles={handleDropFiles} />
			</div>
			<div className='w-full flex flex-row justify-center md:justify-start' >
				<div className='flex flex-row gap-x-2 items-center border-[3px] border-[#48295D] w-full md:w-[30%] p-2 rounded-full' >
					<input
						placeholder="Search files..."
						type='search'
						value={searchTerm}
						onChange={handleSearch}
						className=" focus:border-black focus:ring-black rounded-full p-2 focus:outline-none w-full"
					/>
					<span className='flex flex-row justify-end' >
						<FileMagnifyingGlass size={28} weight='bold' />
					</span>
				</div>
			</div>

			<Table.Root className='border rounded-xl p-2 overflow-x-scroll' >
				<Table.Header>
					<Table.Row className='items-center'>
						<Table.ColumnHeaderCell>
							<button className='items-center flex flex-row p-2' >
								<span  >
									S/N
								</span>
							</button>
						</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell>
							<button
								onClick={() => handleSort('name')}
								className='border-[1.5px] p-2 rounded-lg flex flex-row items-center justify-between w-fit mx-auto whitespace-nowrap'
							>
								<span>
									File Name
								</span>
								{sortAscending ? <SortDescending size={24} weight="bold" /> : <SortAscending size={24} weight="bold" />}
							</button>
						</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell>
							<button
								onClick={() => handleSort('type')}
								className='border-[1.5px] p-2 rounded-lg flex flex-row items-center justify-between w-fit mx-auto whitespace-nowrap'
							>
								<span>File Type</span>
								<span>
									{sortAscending ? <SortDescending size={24} weight="bold" /> : <SortAscending size={24} weight="bold" />}
								</span>
							</button>
						</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell>
							<button
								onClick={() => handleSort('size')}
								className='border-[1.5px] p-2 rounded-lg flex flex-row items-center justify-between w-fit mx-auto whitespace-nowrap'
							>
								<span>
									File Size
								</span>
								{sortAscending ? <SortDescending size={24} weight="bold" /> : <SortAscending size={24} weight="bold" />}
							</button>
						</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell>
							<button
								onClick={() => handleSort('dateUploaded')}
								className='border-[1.5px] p-2 rounded-lg flex flex-row items-center justify-between w-fit mx-auto whitespace-nowrap'
							>
								<span>Date Uploaded</span>
								{sortAscending ? <SortDescending size={24} weight="bold" /> : <SortAscending size={24} weight="bold" />}
							</button>
						</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell>
							<button
								className='border-[1.5px] p-2 rounded-lg flex flex-row items-center justify-between w-fit mx-auto whitespace-nowrap'
							>
								<span>
									Actions
								</span>
							</button>
						</Table.ColumnHeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{filteredFiles.map((file, index) => (
						<Table.Row key={file.id}>
							<Table.Cell >{index + 1}</Table.Cell>
							<Table.Cell >{file.name}</Table.Cell>
							<Table.Cell>{file.type}</Table.Cell>
							<Table.Cell>{file.size}</Table.Cell>
							<Table.Cell>{file.dateUploaded}</Table.Cell>
							<Table.Cell className=' flex flex-row items-center gap-x-3'>
								<button className='border-[1.5px] border-[#54178d] rounded-full p-1' onClick={() => handleDownload(file)}><FileArrowDown size={28} /></button>
								<button className='border-[1.5px] border-[#48295d] rounded-full p-1' onClick={() => handleDelete(file)}><FileX size={28} /></button>
								<button className='border-[1.5px] border-[#48295d] rounded-full p-1' onClick={() => handleCopyLink(file, index)}><Clipboard size={28} /></button>
								{tooltipId === index && ( // Show tooltip only for the clicked button
									<div className="tooltip">Link copied!</div>
								)}
							</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table.Root>
		</Box>
	);
}
