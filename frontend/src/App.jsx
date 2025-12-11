import { useState } from "react";
import {
  Copy,
  Link2,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { shortifyUrl, lookupUrl } from "./api";

export default function App() {
  const [longUrl, setLongUrl] = useState("");
  const [shortData, setShortData] = useState(null);
  const [shortError, setShortError] = useState("");
  const [isShortening, setIsShortening] = useState(false);
  const [copied, setCopied] = useState(false);

  const [lookupHash, setLookupHash] = useState("");
  const [lookupData, setLookupData] = useState(null);
  const [lookupError, setLookupError] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleShorten = async () => {
    setShortError("");
    setShortData(null);
    setCopied(false);

    const trimmedUrl = longUrl.trim();

    if (!trimmedUrl) {
      setShortError("Please enter a URL");
      return;
    }

    if (!validateUrl(trimmedUrl)) {
      setShortError("Please enter a valid URL (include http:// or https://)");
      return;
    }

    setIsShortening(true);

    try {
      const data = await shortifyUrl(trimmedUrl);

      if (!data || data.error || !data.shortUrl) {
        setShortError("Unable to shorten URL. Please try again.");
        return;
      }

      setShortData(data);
      setLongUrl("");
    } catch (error) {
      setShortError("Network error. Please check your connection.");
    } finally {
      setIsShortening(false);
    }
  };

  async function handleLookup(e) {
    e.preventDefault();
    setLookupError("");
    setLookupData(null);

    let raw = lookupHash.trim();

    // If the user pasted a full URL, extract only the hash
    if (raw.includes("/shortify/")) {
      raw = raw.split("/shortify/")[1];
    }

    // Remove query params or trailing slashes if any
    raw = raw.split("?")[0].replace("/", "");

    if (!raw) {
      setLookupError("Please enter a valid short URL or hash.");
      return;
    }

    const data = await lookupUrl(raw);

    if (!data || data.error || !data.origUrl) {
      setLookupError("Short URL not found.");
      return;
    }

    setLookupData(data);
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShortenKeyPress = (e) => {
    if (e.key === "Enter" && !isShortening) {
      handleShorten();
    }
  };

  const handleLookupKeyPress = (e) => {
    if (e.key === "Enter" && !isLookingUp) {
      handleLookup();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Link2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Shortify
          </h1>
          <p className="text-gray-600 text-lg">
            Transform long URLs into short, shareable links
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Shortener Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
              <div className="flex items-center gap-3 text-white">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Link2 className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-semibold">Shorten URL</h2>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter your long URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/very/long/url..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                    onKeyPress={handleShortenKeyPress}
                    disabled={isShortening}
                  />
                </div>

                <button
                  onClick={handleShorten}
                  disabled={isShortening}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isShortening ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Shortening...
                    </>
                  ) : (
                    <>
                      <Link2 className="w-5 h-5" />
                      Shorten URL
                    </>
                  )}
                </button>
              </div>

              {/* Success Result */}
              {shortData && (
                <div className="mt-6 bg-gradient-to-br from-blue-50 to-blue-100/50 p-5 rounded-xl border border-blue-200">
                  <div className="flex items-start gap-3 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Your shortened URL
                      </p>
                      <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-blue-200">
                        <a
                          href={shortData.shortUrl}
                          className="text-blue-600 font-medium hover:text-blue-700 truncate flex-1"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {shortData.shortUrl}
                        </a>
                        <button
                          onClick={() => copyToClipboard(shortData.shortUrl)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                          title="Copy to clipboard"
                        >
                          {copied ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 bg-white/50 p-3 rounded-lg">
                    <span className="font-medium">Original:</span>{" "}
                    <span className="break-all">{shortData.longUrl}</span>
                  </div>
                </div>
              )}

              {/* Error */}
              {shortError && (
                <div className="mt-4 bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{shortError}</p>
                </div>
              )}
            </div>
          </div>

          {/* Lookup Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6">
              <div className="flex items-center gap-3 text-white">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Search className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-semibold">Lookup URL</h2>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter short URL or hash
                  </label>
                  <input
                    type="text"
                    placeholder="https://short.ly/abc123 or abc123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                    value={lookupHash}
                    onChange={(e) => setLookupHash(e.target.value)}
                    onKeyPress={handleLookupKeyPress}
                    disabled={isLookingUp}
                  />
                </div>

                <button
                  onClick={handleLookup}
                  disabled={isLookingUp}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl font-medium hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLookingUp ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Looking up...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Lookup URL
                    </>
                  )}
                </button>
              </div>

              {/* Lookup Result */}
              {lookupData && (
                <div className="mt-6 bg-gradient-to-br from-green-50 to-green-100/50 p-5 rounded-xl border border-green-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Original URL found
                      </p>
                      <div className="bg-white p-3 rounded-lg border border-green-200">
                        <a
                          href={lookupData.origUrl}
                          className="text-green-600 font-medium hover:text-green-700 break-all flex items-center gap-2 group"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="flex-1">{lookupData.origUrl}</span>
                          <ExternalLink className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error */}
              {lookupError && (
                <div className="mt-4 bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{lookupError}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="max-w-4xl mx-auto mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Fast, secure, and reliable URL shortening service
          </p>
        </div>
      </div>
    </div>
  );
}
