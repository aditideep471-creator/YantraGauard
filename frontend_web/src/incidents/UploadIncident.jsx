import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { uploadIncident } from "../api/incidents";
import Page from "../components/Page";
import Card from "../components/Card";
import styles from "./UploadIncident.module.css";

function UploadIncident() {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");

  const [location, setLocation] = useState({ lat: null, lng: null });

  // ⭐ NEW STATE (manual location)
  const [manualLocation, setManualLocation] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fileRef = useRef();
  const navigate = useNavigate();

  /* ================= LOCATION ================= */
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        console.log("Location denied");
      }
    );
  }, []);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!image) {
      setError("Please upload an image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("image", image);
      formData.append("description", description || "");

      // ⭐ SEND MANUAL LOCATION
      formData.append("location", manualLocation || "");

      if (location.lat && location.lng) {
        formData.append("latitude", String(location.lat));
        formData.append("longitude", String(location.lng));
      }

      await uploadIncident(formData);

      setImage(null);
      setDescription("");
      setManualLocation("");

      if (fileRef.current) fileRef.current.value = "";

      navigate("/incidents");

    } catch (err) {
      console.log(err);
      setError("Failed to upload incident. Try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <Page title="Report an Incident">
      <div className={styles.wrapper}>
        <Card>
          <p className={styles.subtitle}>
            Capture a photo of the incident and submit it for review.
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>

            {/* IMAGE */}
            <label className={styles.label}>
              Incident image
              <input
                ref={fileRef}
                className={styles.file}
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                required
              />
            </label>

            {/* DESCRIPTION */}
            <textarea
              className={styles.textarea}
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* ⭐ MANUAL LOCATION FIELD */}
            <input
              className={styles.input}
              type="text"
              placeholder="Enter location manually (e.g. Section A - Machine 3)"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
            />

            {/* GPS LOCATION */}
            {location.lat && location.lng && (
              <p className={styles.location}>
                📍 GPS location captured
              </p>
            )}

            {error && <p className={styles.error}>{error}</p>}

            <button
              className={styles.button}
              type="submit"
              disabled={loading}
            >
              {loading ? "Uploading…" : "Submit Incident"}
            </button>

          </form>
        </Card>
      </div>
    </Page>
  );
}

export default UploadIncident;