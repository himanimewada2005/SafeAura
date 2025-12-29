import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
// Leaflet marker icons fix
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Link } from "react-router-dom";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Profile = () => {
  const readUrl = "http://localhost:8000/api/sos/read";
  const updateUrl = "http://localhost:8000/api/sos/update";
  const createUrl = "http://localhost:8000/api/sos/create";

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // States for relatives
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editedRelative, setEditedRelative] = useState({ name: "", phone: "" });
  const [addingNew, setAddingNew] = useState(false);
  const [newRelative, setNewRelative] = useState({ name: "", phone: "" });

  // States for user phone
  const [editingPhone, setEditingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState("");

  // States for location
  const [editingLocation, setEditingLocation] = useState(false);
  const [newLocation, setNewLocation] = useState({ lat: "", lng: "" });

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const res = await axios.get(readUrl, { headers: { Authorization: `Bearer ${token}` } });
        setProfile(res.data);
        setNewPhone(res.data?.account?.phone || "");
        setNewLocation(res.data?.account?.location || { lat: "", lng: "" });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  // Create Profile
  const handleCreateProfile = async () => {
    try {
      const defaultData = {
        phone: user?.phone || "",
        relatives: [{ name: "Relative 1", phone: "9999999999" }],
        location: { lat: 0, lng: 0 },
      };
      const res = await axios.post(createUrl, defaultData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ----- Relatives Handlers -----
  const handleEditRelative = (index) => {
    setEditingIndex(index);
    setEditedRelative({ ...profile.account.relatives[index] });
  };

  const handleSaveRelative = async () => {
    if (!editedRelative.name.trim() || !editedRelative.phone.trim()) {
      alert("Name and Phone cannot be empty");
      return;
    }
    try {
      const newRelatives = [...profile.account.relatives];
      newRelatives[editingIndex] = editedRelative;
      await axios.put(updateUrl, { relatives: newRelatives }, { headers: { Authorization: `Bearer ${token}` } });
      setProfile({ ...profile, account: { ...profile.account, relatives: newRelatives } });
      setEditingIndex(-1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRelative = async (index) => {
    if (profile.account.relatives.length === 1) return;
    try {
      const newRelatives = profile.account.relatives.filter((_, i) => i !== index);
      await axios.put(updateUrl, { relatives: newRelatives }, { headers: { Authorization: `Bearer ${token}` } });
      setProfile({ ...profile, account: { ...profile.account, relatives: newRelatives } });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddRelative = async () => {
    if (!newRelative.name.trim() || !newRelative.phone.trim()) {
      alert("Name and Phone cannot be empty");
      return;
    }
    if (profile.account.relatives.length >= 5) {
      alert("Maximum 5 relatives allowed");
      return;
    }
    try {
      const updatedRelatives = [...profile.account.relatives, newRelative];
      await axios.put(updateUrl, { relatives: updatedRelatives }, { headers: { Authorization: `Bearer ${token}` } });
      setProfile({ ...profile, account: { ...profile.account, relatives: updatedRelatives } });
      setNewRelative({ name: "", phone: "" });
      setAddingNew(false);
    } catch (err) {
      console.error(err);
    }
  };

  // ----- Phone Handlers -----
  const handleSavePhone = async () => {
    if (!newPhone.trim()) {
      alert("Phone cannot be empty");
      return;
    }
    try {
      await axios.put(updateUrl, { phone: newPhone }, { headers: { Authorization: `Bearer ${token}` } });
      setProfile({ ...profile, account: { ...profile.account, phone: newPhone } });
      setEditingPhone(false);
    } catch (err) {
      console.error(err);
    }
  };

  // ----- Location Handlers -----
  const handleSaveLocation = async () => {
    if (!newLocation.lat || !newLocation.lng) {
      alert("Latitude and Longitude cannot be empty");
      return;
    }
    try {
      await axios.put(updateUrl, { location: newLocation }, { headers: { Authorization: `Bearer ${token}` } });
      setProfile({ ...profile, account: { ...profile.account, location: newLocation } });
      setEditingLocation(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-pink-100">Loading...</div>;

  // Agar profile hi nahi bani → "Create Profile" button
  if (!profile?.account) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-pink-100">
        <h2 className="text-xl font-bold text-pink-600 mb-4">No SOS Profile Found</h2>
        <Link to="/create"
          onClick={handleCreateProfile}
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg shadow-lg"
        >
          Create Profile
        </Link>
      </div>
    );
  }

  const { phone, relatives, location } = profile.account || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 p-6 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-pink-500 text-center">💖 Your SOS Profile</h2>

        {/* Name & Email */}
        <div className="p-4 bg-pink-50 rounded-lg shadow-inner">
          <h3 className="font-semibold text-pink-600 mb-1">👤 Name</h3>
          <p className="text-gray-700">{user?.name}</p>
        </div>
        <div className="p-4 bg-pink-50 rounded-lg shadow-inner">
          <h3 className="font-semibold text-pink-600 mb-1">✉ Email</h3>
          <p className="text-gray-700">{user?.email}</p>
        </div>

        {/* Phone */}
        <div className="p-4 bg-pink-50 rounded-lg shadow-inner flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-pink-600 mb-1">📞 Phone</h3>
            {editingPhone ? (
              <input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="p-1 rounded border border-pink-300"
              />
            ) : (
              <p className="text-gray-700">{phone}</p>
            )}
          </div>
          <div>
            {editingPhone ? (
              <button onClick={handleSavePhone} className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded">
                Save
              </button>
            ) : (
              <button
                onClick={() => setEditingPhone(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                title="Edit Phone"
              >
                <FaEdit />
              </button>
            )}
          </div>
        </div>

        {/* Relatives */}
        <div className="p-4 bg-pink-50 rounded-lg shadow-inner">
          <h3 className="font-semibold text-pink-600 mb-2">👨‍👩‍👧‍👦 Emergency Relatives</h3>
          {relatives.map((rel, i) => (
            <div key={i} className="flex gap-4 mb-2 p-2 rounded-lg bg-pink-100">
              <div className="flex-1 bg-pink-200 p-2 rounded-lg">
                <p className="text-gray-700 font-medium">Name</p>
                {editingIndex === i ? (
                  <input
                    type="text"
                    value={editedRelative.name}
                    onChange={(e) => setEditedRelative({ ...editedRelative, name: e.target.value })}
                    className="w-full p-1 rounded border border-pink-300"
                  />
                ) : (
                  <p className="text-gray-700">{rel.name}</p>
                )}
              </div>
              <div className="flex-1 bg-pink-200 p-2 rounded-lg">
                <p className="text-gray-700 font-medium">Phone</p>
                {editingIndex === i ? (
                  <input
                    type="text"
                    value={editedRelative.phone}
                    onChange={(e) => setEditedRelative({ ...editedRelative, phone: e.target.value })}
                    className="w-full p-1 rounded border border-pink-300"
                  />
                ) : (
                  <p className="text-gray-700">{rel.phone}</p>
                )}
              </div>
              <div className="flex flex-col justify-center gap-1">
                {editingIndex === i ? (
                  <button
                    onClick={handleSaveRelative}
                    className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded"
                  >
                    Save
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditRelative(i)}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    {relatives.length > 1 && (
                      <button
                        onClick={() => handleDeleteRelative(i)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Add New Relative */}
          {relatives.length < 5 && (
            <div>
              {!addingNew ? (
                <button
                  onClick={() => setAddingNew(true)}
                  className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded mt-2"
                >
                  <FaPlus /> Add More Relatives
                </button>
              ) : (
                <div className="flex gap-4 mb-2 p-2 rounded-lg bg-pink-100 mt-2">
                  <div className="flex-1 bg-pink-200 p-2 rounded-lg">
                    <input
                      type="text"
                      value={newRelative.name}
                      onChange={(e) => setNewRelative({ ...newRelative, name: e.target.value })}
                      className="w-full p-1 rounded border border-pink-300"
                      placeholder="Name"
                    />
                  </div>
                  <div className="flex-1 bg-pink-200 p-2 rounded-lg">
                    <input
                      type="text"
                      value={newRelative.phone}
                      onChange={(e) => setNewRelative({ ...newRelative, phone: e.target.value })}
                      className="w-full p-1 rounded border border-pink-300"
                      placeholder="Phone"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <button
                      onClick={handleAddRelative}
                      className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded flex items-center gap-1"
                    >
                      <FaPlus /> Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Location */}
        {location && (
          <div className="p-4 bg-pink-50 rounded-lg shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-pink-600">📍 Location</h3>
              {editingLocation ? (
                <button
                  onClick={handleSaveLocation}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => setEditingLocation(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                  title="Edit Location"
                >
                  <FaEdit />
                </button>
              )}
            </div>

            {editingLocation && (
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (pos) => setNewLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                        () => alert("Unable to fetch location")
                      );
                    } else {
                      alert("Geolocation not supported");
                    }
                  }}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded"
                >
                  📍 Use Current Location
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="bg-pink-200 p-2 rounded-lg">
                <p className="text-gray-700 font-medium">Latitude</p>
                <p className="text-gray-700">{newLocation.lat || location.lat}</p>
              </div>
              <div className="bg-pink-200 p-2 rounded-lg">
                <p className="text-gray-700 font-medium">Longitude</p>
                <p className="text-gray-700">{newLocation.lng || location.lng}</p>
              </div>
            </div>

            <MapContainer
              center={[newLocation.lat || location.lat, newLocation.lng || location.lng]}
              zoom={13}
              scrollWheelZoom={false}
              className="w-full h-64 rounded-lg"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
              />
              <Marker position={[newLocation.lat || location.lat, newLocation.lng || location.lng]}>
                <Popup>Your Current Location</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
