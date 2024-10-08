// @actions/auth.tsx






// Helper function to validate JWT (for demonstration purposes, adjust for real validation)
export function validateToken(token: string) {
	try {
		const decoded = JSON.parse(atob(token));
		// Perform any additional validation on decoded token if needed
		return decoded?.email ? true : false;
	} catch (error) {
		console.log("Invalid token ", error );
		return false;
	}
}



// Helper function to encode the message (password)
function getMessageEncoding(message: string) {
	const enc = new TextEncoder();
	return enc.encode(message);
}

// Encrypt the password using AES-GCM
async function encryptMessage(password: string) {
	const encoded = getMessageEncoding(password);
	const iv = window.crypto.getRandomValues(new Uint8Array(12));
	const key = await window.crypto.subtle.generateKey(
		{ name: "AES-GCM", length: 256 },
		true,
		["encrypt", "decrypt"]
	);

	const encrypted = await window.crypto.subtle.encrypt(
		{ name: "AES-GCM", iv: iv },
		key,
		encoded
	);

	return { encrypted, iv, key };
}

// Decrypt the password using AES-GCM
async function decryptMessage(encryptedData: ArrayBuffer, iv: Uint8Array, key: CryptoKey) {
	const decrypted = await window.crypto.subtle.decrypt(
		{ name: "AES-GCM", iv: iv },
		key,
		encryptedData
	);

	const dec = new TextDecoder();
	return dec.decode(decrypted);
}

// Signup function to store user credentials in localStorage and generate JWT
export async function Signup({ username, email, password }: { username: string; email: string; password: string }) {
	// Check if user already exists in localStorage
	const existingUser = JSON.parse(localStorage.getItem(email) || 'null');

	if (existingUser) {
		console.log("User already exists.");
		alert("Welcome Back. Logging you in.");
		window.location.replace('../closedcabinet');
	} else {
		// Encrypt the user's password
		const { encrypted, iv, key } = await encryptMessage(password);

		// Store the key in a JSON-friendly format
		const exportedKey = await window.crypto.subtle.exportKey("jwk", key);

		// Prepare the new user object
		const newUser = {
			username,
			email,
			password: encrypted,  // encrypted password
			iv: Array.from(iv),   // convert Uint8Array to array for storage
			key: exportedKey       // encryption key in JWK format
		};

		// Store user in localStorage
		localStorage.setItem(email, JSON.stringify(newUser));

		console.log("User signed up and stored in localStorage");
		// Generate a JWT (for demonstration purposes, use a real method in production)
		const token = btoa(JSON.stringify({ username, email }));
		localStorage.setItem("authToken", token); // Store JWT in localStorage

		alert("Signup successful! Taking you to your Cabinet.");
		window.location.replace('../closedcabinet');
	}
}

// Login function to check if the user exists in localStorage and validate JWT
export async function Login({ email, password }: { email: string; password: string }): Promise<boolean> {
	const user = JSON.parse(localStorage.getItem(email) || 'null');

	if (user) {
		const encryptedPassword = user.password;
		const iv = new Uint8Array(user.iv);
		const keyData = user.key;

		// Import the key from JWK format
		const key = await window.crypto.subtle.importKey(
			"jwk",
			keyData,
			{ name: "AES-GCM", length: 256 },
			true,
			["encrypt", "decrypt"]
		);

		// Decrypt the stored password
		const decryptedPassword = await decryptMessage(encryptedPassword, iv, key);

		if (decryptedPassword === password) {
			console.log("User logged in successfully");
			// Generate a JWT (for demonstration purposes, use a real method in production)
			const token = btoa(JSON.stringify({ email }));
			localStorage.setItem("authToken", token); // Store JWT in localStorage

			alert("Login successful!");
			window.location.replace('../closedcabinet');
			return true; // Indicate successful login
		} else {
			console.log("Incorrect password");
			alert("Incorrect password. Please try again.");
			return false; // Indicate login failed
		}
	} else {
		console.log("User not found");
		alert("User not found. Please sign up.");
		return false; // Indicate login failed
	}
}
