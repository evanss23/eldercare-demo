"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCamera, FaMusic, FaUpload, FaTimes, FaCheck, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

export default function MemoryUploader() {
  const [selectedType, setSelectedType] = useState<'photo' | 'music' | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [musicDetails, setMusicDetails] = useState({ title: "", artist: "", url: "" });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmit = async () => {
    setIsUploading(true);
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsUploading(false);
    setUploadSuccess(true);
    
    // Reset after success
    setTimeout(() => {
      setUploadSuccess(false);
      setSelectedType(null);
      setUploadedFile(null);
      setCaption("");
      setMusicDetails({ title: "", artist: "", url: "" });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/caregiver">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <FaArrowLeft className="text-gray-600" size={20} />
              </motion.button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Upload Memories</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {!selectedType && !uploadSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Share a Memory</h2>
                <p className="text-gray-600">Upload photos or music to brighten Grammy's day</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedType('photo')}
                  className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-200"
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                      <FaCamera className="text-white" size={40} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Upload Photo</h3>
                    <p className="text-gray-600 text-center">Share family photos and special moments</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedType('music')}
                  className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-200"
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                      <FaMusic className="text-white" size={40} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Add Music</h3>
                    <p className="text-gray-600 text-center">Add favorite songs and melodies</p>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}

          {selectedType === 'photo' && !uploadSuccess && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Upload Photo</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedType(null)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <FaTimes className="text-gray-600" size={20} />
                </motion.button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Photo
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-purple-300 rounded-xl cursor-pointer hover:border-purple-400 transition-colors bg-purple-50"
                    >
                      {uploadedFile ? (
                        <div className="text-center">
                          <FaCheck className="text-purple-600 mx-auto mb-2" size={40} />
                          <p className="text-purple-600 font-medium">{uploadedFile.name}</p>
                          <p className="text-sm text-gray-600 mt-1">Click to change</p>
                        </div>
                      ) : (
                        <>
                          <FaUpload className="text-purple-400 mb-4" size={40} />
                          <p className="text-purple-600 font-medium">Click to upload photo</p>
                          <p className="text-sm text-gray-600 mt-1">or drag and drop</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add a Caption
                  </label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                    placeholder="Tell Grammy about this photo..."
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={!uploadedFile || isUploading}
                  className={`w-full py-3 rounded-lg text-white font-semibold transition-colors ${
                    !uploadedFile || isUploading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                  }`}
                >
                  {isUploading ? 'Uploading...' : 'Upload Photo'}
                </motion.button>
              </div>
            </motion.div>
          )}

          {selectedType === 'music' && !uploadSuccess && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Add Music</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedType(null)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <FaTimes className="text-gray-600" size={20} />
                </motion.button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Song Title
                  </label>
                  <input
                    type="text"
                    value={musicDetails.title}
                    onChange={(e) => setMusicDetails({ ...musicDetails, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter song title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Artist
                  </label>
                  <input
                    type="text"
                    value={musicDetails.artist}
                    onChange={(e) => setMusicDetails({ ...musicDetails, artist: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter artist name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Music Link (Spotify, YouTube, etc.)
                  </label>
                  <input
                    type="url"
                    value={musicDetails.url}
                    onChange={(e) => setMusicDetails({ ...musicDetails, url: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why is this song special?
                  </label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="This was your wedding song..."
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={!musicDetails.title || !musicDetails.artist || isUploading}
                  className={`w-full py-3 rounded-lg text-white font-semibold transition-colors ${
                    !musicDetails.title || !musicDetails.artist || isUploading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                  }`}
                >
                  {isUploading ? 'Adding...' : 'Add Music'}
                </motion.button>
              </div>
            </motion.div>
          )}

          {uploadSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <FaCheck className="text-green-600" size={60} />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Upload Successful!</h3>
              <p className="text-gray-600">Grammy will love this memory</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Uploads Preview */}
        {!selectedType && !uploadSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Memories</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}