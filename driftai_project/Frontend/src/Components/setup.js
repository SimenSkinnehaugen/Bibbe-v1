import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';

const Setup = () => {
  const [sessionToken, setSessionToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.setupTripletex(sessionToken);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Koble til Tripletex
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Vi trenger tilgang til dine regnskapsdata for å lage analyser
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="sessionToken" className="block text-sm font-medium text-gray-700">
                Tripletex Session Token
              </label>
              <div className="mt-1">
                <textarea
                  id="sessionToken"
                  name="sessionToken"
                  rows={4}
                  required
                  value={sessionToken}
                  onChange={(e) => setSessionToken(e.target.value)}
                  placeholder="Lim inn din session token her..."
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Finn session token under Tripletex API-innstillinger
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Slik finner du session token:
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Logg inn på Tripletex</li>
                      <li>Gå til Min side → API</li>
                      <li>Opprett en ny session token</li>
                      <li>Kopier token og lim inn her</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !sessionToken.trim()}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Kobler til...' : 'Koble til Tripletex'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full text-center text-sm text-gray-600 hover:text-gray-500"
            >
              Hopp over for nå
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setup;
