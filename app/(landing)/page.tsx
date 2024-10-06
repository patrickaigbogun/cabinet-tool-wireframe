

function LandingPage() {
    return (
      <section className="space-y-12 p-8">
        {/* Hero Section */}
        <section className="text-center bg-gray-800 p-10 rounded-lg shadow-md">
          <h2 className="text-4xl font-bold mb-4">
            Simplify Your File Storage & Sharing
          </h2>
          <p className="text-lg mb-6">
            Cabinet Tool offers a free, easy, and secure way to upload, store, and
            share your files from your personalized dashboard.
          </p>
          <button className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition">
            Get Started for Free
          </button>
        </section>
  
        {/* Features Section */}
        <section className="text-center p-10">
          <h2 className="text-3xl font-semibold mb-4">
            Key Features Designed for You
          </h2>
          <p className="text-lg mb-6">
            Upload your files effortlessly, access them anytime, and share links
            in just a few clicks. Your file management has never been this
            seamless.
          </p>
          <ul className="list-disc list-inside space-y-2 text-left mx-auto max-w-3xl">
            <li>Unlimited file uploads</li>
            <li>Secure file storage on your dashboard</li>
            <li>Easy file sharing via downloadable links</li>
            <li>Access from anywhere, anytime</li>
          </ul>
        </section>
  
        {/* Onboarding Section */}
        <section className="text-center bg-gray-800 p-10 rounded-lg">
          <h2 className="text-3xl font-semibold mb-4">
            Get Started in Seconds
          </h2>
          <p className="text-lg mb-6">
            Join now, upload your first file, and see how easy it is to manage
            your documents. No hassle, just action.
          </p>
          <button className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition">
            Start Uploading Now
          </button>
        </section>
  
        {/* Final CTA Section */}
        <section className="text-center p-10">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Take Control of Your Files?
          </h2>
          <p className="text-lg mb-6">
            Cabinet Tool gives you everything you need to store and share your
            files for free. Sign up today and simplify your workflow.
          </p>
          <button className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition">
            Join Cabinet Tool Now
          </button>
        </section>
      </section>
    );
  }
  
  export default LandingPage;
  