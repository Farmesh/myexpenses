import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import api from '../config/axios';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    occupation: user?.occupation || '',
    address: user?.address || ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        occupation: user.occupation || '',
        address: user.address || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/api/profile', formData);
      setUser(data);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Update Profile Error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container py-4 py-md-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card border-0 shadow-lg">
            <div className="card-body p-4 p-md-5">
              <h2 className="text-center mb-4 fw-bold">Profile Settings</h2>
              
              <div className="text-center mb-4">
                <img
                  src={user?.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`}
                  alt="Profile"
                  className="rounded-circle profile-photo mb-3"
                  style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                />
              </div>

              <form onSubmit={handleSubmit} className="profile-form">
                <div className="row g-4">
                  <div className="col-12 col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="nameInput"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        name="name"
                      />
                      <label htmlFor="nameInput">Name</label>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="form-floating">
                      <input
                        type="email"
                        className="form-control"
                        id="emailInput"
                        placeholder="Email"
                        value={formData.email}
                        disabled
                        name="email"
                      />
                      <label htmlFor="emailInput">Email</label>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="form-floating">
                      <input
                        type="tel"
                        className="form-control"
                        id="phoneInput"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleChange}
                        name="phone"
                      />
                      <label htmlFor="phoneInput">Phone</label>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="occupationInput"
                        placeholder="Occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                        name="occupation"
                      />
                      <label htmlFor="occupationInput">Occupation</label>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-floating">
                      <textarea
                        className="form-control"
                        id="bioInput"
                        placeholder="Bio"
                        value={formData.bio}
                        onChange={handleChange}
                        name="bio"
                        style={{ height: '100px' }}
                      />
                      <label htmlFor="bioInput">Bio</label>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="addressInput"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleChange}
                        name="address"
                      />
                      <label htmlFor="addressInput">Address</label>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="form-floating">
                      <input
                        type="password"
                        className="form-control"
                        id="passwordInput"
                        placeholder="New Password"
                        value={formData.password}
                        onChange={handleChange}
                        name="password"
                      />
                      <label htmlFor="passwordInput">New Password</label>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="form-floating">
                      <input
                        type="password"
                        className="form-control"
                        id="confirmPasswordInput"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        name="confirmPassword"
                      />
                      <label htmlFor="confirmPasswordInput">Confirm Password</label>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <button
                    type="submit"
                    className="btn btn-primary px-5"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : null}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 