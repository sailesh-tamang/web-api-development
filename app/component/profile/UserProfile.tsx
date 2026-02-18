"use client";
import React, { useEffect, useState } from "react";
import styles from "./UserProfile.module.css";

export default function UserProfile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    height: "",
    weight: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string>("");

  // Fetch user data on mount
  useEffect(() => {
    setIsHydrated(true);
    
    const getApiBase = () => {
      if (typeof process !== "undefined" && process.env && process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
      }
      if (typeof window !== "undefined") {
        const proto = window.location.protocol;
        const host = window.location.hostname;
        return `${proto}//${host}:5000`;
      }
      return "";
    };

    const buildImageUrl = (image?: string | null) => {
      if (!image) return null;
      if (image.startsWith("http") || image.startsWith("/")) return image;
      const base = getApiBase();
      return `${base}/uploads/${image}`;
    };

    const fetchUserData = async () => {
      try {
        const stored = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        // If token is available and we have a user id, fetch fresh data from server
        if (token && stored) {
          const parsedStored = JSON.parse(stored);
          const userId = parsedStored._id || parsedStored.id;
          if (userId) {
            try {
              const res = await fetch(`/api/auth/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
              if (res.ok) {
                const data = await res.json();
                  const user = data.user || data;
                  console.log("User data from API:", user);
                  setFormData({ 
                    name: user.name || "", 
                    email: user.email || "",
                    age: user.age || "",
                    height: user.height || "",
                    weight: user.weight || ""
                  });
                  if (user.image) setCurrentImage(buildImageUrl(user.image));
                  // keep localStorage in sync (store raw user object from server)
                  localStorage.setItem("user", JSON.stringify(user));
                return;
              }
            } catch (err) {
              console.warn("Failed to fetch user from API, falling back to localStorage", err);
            }
          }
        }

        // Fallback to localStorage
        if (stored) {
          const user = JSON.parse(stored);
          console.log("User data from localStorage:", user);
          setFormData({ 
            name: user.name || "", 
            email: user.email || "",
            age: user.age || "",
            height: user.height || "",
            weight: user.weight || ""
          });
          if (user.image) setCurrentImage(buildImageUrl(user.image));
        } else {
          setError("No user data found. Please log in again.");
        }
      } catch (err) {
        setError("Failed to load profile data");
        console.error("Error loading profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = (field: string, value: string) => {
    setEditingField(field);
    setEditValue(value);
  };

  const handleSaveField = async (field: string) => {
    if (editValue.trim() === "") {
      alert("Field cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const stored = localStorage.getItem("user");
      const userId = stored ? JSON.parse(stored)._id || JSON.parse(stored).id : null;
      if (!userId) {
        throw new Error("User ID not found");
      }

      const fd = new FormData();
      fd.append(field, editValue);

      const response = await fetch(`/api/auth/${userId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      // Update state
      setFormData((prev) => ({
        ...prev,
        [field]: editValue,
      }));

      // Update localStorage
      if (stored) {
        const updatedUser = { ...JSON.parse(stored), [field]: editValue };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      setSuccess("Profile updated successfully!");
      setEditingField(null);

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error updating profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async () => {
    if (!image && !imagePreview) return;

    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const stored = localStorage.getItem("user");
      const userId = stored ? JSON.parse(stored)._id || JSON.parse(stored).id : null;
      if (!userId) {
        throw new Error("User ID not found");
      }

      const fd = new FormData();
      if (image) fd.append("image", image);

      const response = await fetch(`/api/auth/${userId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (!response.ok) {
        throw new Error("Failed to update profile image");
      }

      const responseData = await response.json();
      
      // Update localStorage with new image path from server
      if (stored) {
        const filename = responseData.user?.image || responseData.image;
        const updatedUser = { ...JSON.parse(stored), image: filename };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setCurrentImage(buildImageUrl(filename));
      }

      setSuccess("Profile image updated successfully!");
      setImage(null);
      setImagePreview(null);

      setTimeout(() => setSuccess(""), 3000);
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error updating image:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const calculateBMI = () => {
    const height = parseFloat(formData.height);
    const weight = parseFloat(formData.weight);

    // Check if both height and weight are valid numbers
    if (!height || !weight || height <= 0 || weight <= 0) {
      setError("Please fill in both height and weight in your profile to calculate BMI.");
      setTimeout(() => setError(""), 4000);
      return;
    }

    // BMI = weight (kg) / (height (m))^2
    // Convert height from feet to meters (1 foot = 0.3048 meters)
    const heightInMeters = height * 0.3048;
    const calculatedBMI = weight / (heightInMeters * heightInMeters);
    
    setBmi(calculatedBMI);

    // Determine BMI category
    let category = "";
    if (calculatedBMI < 18.5) {
      category = "Underweight";
    } else if (calculatedBMI >= 18.5 && calculatedBMI < 25) {
      category = "Normal weight";
    } else if (calculatedBMI >= 25 && calculatedBMI < 30) {
      category = "Overweight";
    } else {
      category = "Obese";
    }
    
    setBmiCategory(category);
    setSuccess(`BMI calculated successfully: ${calculatedBMI.toFixed(1)}`);
    setTimeout(() => setSuccess(""), 4000);
  };

  const getBMIColor = () => {
    if (!bmi) return "";
    if (bmi < 18.5) return "#3b82f6"; // blue for underweight
    if (bmi >= 18.5 && bmi < 25) return "#22c55e"; // green for normal
    if (bmi >= 25 && bmi < 30) return "#f59e0b"; // orange for overweight
    return "#ef4444"; // red for obese
  };

  if (!isHydrated) {
    return (
      <div className={styles.loadingContainer}>
        <p>Initializing...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <h2 className={styles.title}>My Profile</h2>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && <div className={styles.successMessage}>{success}</div>}

        {/* Image Section */}
        <div className={styles.imageSection}>
          <div className={styles.profileImageContainer}>
            {imagePreview ? (
              <img src={imagePreview} alt="New Profile" className={styles.profileImage} />
            ) : currentImage ? (
              <img src={currentImage} alt="Profile" className={styles.profileImage} />
            ) : (
              <div className={styles.imagePlaceholder}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            )}
            <label htmlFor="profileImage" className={styles.imageUploadLabel}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"></path>
              </svg>
            </label>
            <input
              type="file"
              id="profileImage"
              onChange={handleImageChange}
              className={styles.fileInput}
              accept="image/*"
            />
          </div>

          {imagePreview && (
            <div className={styles.imageButtonGroup}>
              <button
                type="button"
                className={styles.saveImageBtn}
                onClick={handleImageUpload}
                disabled={isSaving}
              >
                {isSaving ? "Uploading..." : "Upload Image"}
              </button>
              <button
                type="button"
                className={styles.cancelImageBtn}
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
                disabled={isSaving}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Profile Info Section */}
        <div className={styles.profileInfoSection}>
          {editingField === null ? (
            <>
              <div className={styles.infoItem}>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Full Name</span>
                  <span className={styles.infoValue}>{formData.name || "-"}</span>
                </div>
                <button
                  className={styles.editIconBtn}
                  onClick={() => handleEditClick("name", formData.name)}
                  title="Edit name"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Email</span>
                  <span className={styles.infoValue}>{formData.email || "-"}</span>
                </div>
                <button
                  className={styles.editIconBtn}
                  onClick={() => handleEditClick("email", formData.email)}
                  title="Edit email"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Age</span>
                  <span className={styles.infoValue}>{formData.age ? `${formData.age} years` : "-"}</span>
                </div>
                <button
                  className={styles.editIconBtn}
                  onClick={() => handleEditClick("age", formData.age)}
                  title="Edit age"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Height</span>
                  <span className={styles.infoValue}>{formData.height ? `${formData.height} ft` : "-"}</span>
                </div>
                <button
                  className={styles.editIconBtn}
                  onClick={() => handleEditClick("height", formData.height)}
                  title="Edit height"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Weight</span>
                  <span className={styles.infoValue}>{formData.weight ? `${formData.weight} kg` : "-"}</span>
                </div>
                <button
                  className={styles.editIconBtn}
                  onClick={() => handleEditClick("weight", formData.weight)}
                  title="Edit weight"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className={styles.editForm}>
              <div className={styles.editFormGroup}>
                <label className={styles.editLabel}>
                  {editingField === "name" && "Full Name"}
                  {editingField === "email" && "Email"}
                  {editingField === "age" && "Age (years)"}
                  {editingField === "height" && "Height (ft)"}
                  {editingField === "weight" && "Weight (kg)"}
                </label>
                <input
                  type={editingField === "email" ? "email" : editingField === "name" ? "text" : "number"}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className={styles.editInput}
                  placeholder={
                    editingField === "name" ? "Enter your name" :
                    editingField === "email" ? "Enter your email" :
                    editingField === "age" ? "Enter your age" :
                    editingField === "height" ? "Enter your height in ft" :
                    "Enter your weight in kg"
                  }
                  min={editingField !== "name" && editingField !== "email" ? "0" : undefined}
                  step={editingField === "height" || editingField === "weight" ? "0.1" : "1"}
                />
              </div>
              <div className={styles.editButtonGroup}>
                <button
                  className={styles.saveBtn}
                  onClick={() => handleSaveField(editingField)}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setEditingField(null)}
                  disabled={isSaving}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* BMI Calculator Section */}
        <div className={styles.bmiSection}>
          <div className={styles.bmiHeader}>
            <h3 className={styles.bmiTitle}>Body Mass Index (BMI)</h3>
            <button
              className={styles.calculateBmiBtn}
              onClick={calculateBMI}
              disabled={!formData.height || !formData.weight}
            >
              Calculate BMI
            </button>
          </div>
          
          {bmi !== null && (
            <div className={styles.bmiResult}>
              <div className={styles.bmiValue} style={{ color: getBMIColor() }}>
                <span className={styles.bmiNumber}>{bmi.toFixed(1)}</span>
                <span className={styles.bmiUnit}>kg/m²</span>
              </div>
              <div className={styles.bmiCategory} style={{ borderColor: getBMIColor() }}>
                {bmiCategory}
              </div>
              <div className={styles.bmiScale}>
                <div className={styles.bmiScaleItem}>
                  <span style={{ color: "#3b82f6" }}>●</span> Underweight (&lt;18.5)
                </div>
                <div className={styles.bmiScaleItem}>
                  <span style={{ color: "#22c55e" }}>●</span> Normal (18.5-24.9)
                </div>
                <div className={styles.bmiScaleItem}>
                  <span style={{ color: "#f59e0b" }}>●</span> Overweight (25-29.9)
                </div>
                <div className={styles.bmiScaleItem}>
                  <span style={{ color: "#ef4444" }}>●</span> Obese (≥30)
                </div>
              </div>
            </div>
          )}
          
          {!formData.height || !formData.weight ? (
            <p className={styles.bmiHint}>
              💡 Add your height and weight to your profile to calculate BMI
            </p>
          ) : null}
        </div>

        {/* Delete Account */}
        <div className={styles.deleteSection}>
          <button className={styles.deleteBtn}>Delete Account</button>
        </div>
      </div>
    </div>
  );
}
function buildImageUrl(filename: any): React.SetStateAction<string | null> {
    //throw new Error("Successfully updated user image");
    return null;
}