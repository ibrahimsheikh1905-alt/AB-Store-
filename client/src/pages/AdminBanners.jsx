import { useEffect, useState } from 'react';
import { bannersAPI } from '../utils/api';

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [title, setTitle] = useState('Men');
  const [category, setCategory] = useState('men');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await bannersAPI.getAll();
      setBanners(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!image.trim()) {
      setError('Cloudinary image URL is required');
      return;
    }

    try {
      setSubmitting(true);
      await bannersAPI.create({
        title,
        category,
        image: image.trim()
      });
      setSuccess('Banner created successfully');
      setImage('');
      await fetchBanners();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create banner');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setError('');
      setSuccess('');
      await bannersAPI.delete(id);
      setSuccess('Banner deleted successfully');
      await fetchBanners();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete banner');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Hero Banners</h1>

      <form onSubmit={handleCreate} className="bg-white rounded-lg shadow p-6 mb-8 space-y-4">
        {error && (
          <div className="p-3 rounded bg-red-100 text-red-700 border border-red-300">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 rounded bg-green-100 text-green-700 border border-green-300">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Title</label>
            <select
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="men">men</option>
              <option value="women">women</option>
              <option value="kids">kids</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Cloudinary URL</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://res.cloudinary.com/..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Create Banner'}
        </button>
      </form>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Existing Banners</h2>
        {loading ? (
          <div className="text-gray-600">Loading banners...</div>
        ) : banners.length === 0 ? (
          <div className="text-gray-600">No banners found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((banner) => (
              <div key={banner._id} className="border rounded-lg overflow-hidden">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <p className="font-semibold text-gray-800">{banner.title}</p>
                  <p className="text-sm text-gray-600 capitalize mb-3">{banner.category}</p>
                  <button
                    type="button"
                    onClick={() => handleDelete(banner._id)}
                    className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBanners;
