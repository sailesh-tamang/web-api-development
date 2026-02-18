"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useAuth from "../../../lib/useAuth";
import AdminLayout from "../../../component/admin/AdminLayout";
import Link from "next/link";
import styles from "../../../component/admin/UserDetail.module.css";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  createdAt?: string;
}

export default function UserDetailPage() {
  const { ready } = useAuth({ requireAdmin: true, requireLogin: true });
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    
    const fetchUser = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${base}/api/auth/${userId}`);
        const data = await res.json();

        if (data.ok) {
          setUser(data.user);
        } else {
          alert("User not found");
          router.push("/admin/users");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        alert("Error loading user");
        router.push("/admin/users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [ready, userId, router]);

  if (!ready || isLoading) {
    return (
      <AdminLayout currentPage="Users">
        <div className={styles.loadingContainer}>
          Loading user details...
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout currentPage="Users">
        <div className={styles.container}>
          <div className={styles.notFoundContainer}>
            <p>User not found</p>
            <Link href="/admin/users">← Back to Users</Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const createdDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-";

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${base}/api/auth/${userId}`, {
        method: "DELETE"
      });

      if (res.ok) {
        alert("User deleted successfully");
        router.push("/admin/users");
      } else {
        alert("Failed to delete user");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Error deleting user");
    }
  };

  return (
    <AdminLayout currentPage="Users">
      <div className={styles.container}>
        <Link href="/admin/users" className={styles.backButton}>
          ← Back to Users
        </Link>

        <div className={styles.card}>
          <h2 className={styles.title}>User Details</h2>

          {user.image && (
            <div className={styles.imageSection}>
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/uploads/${user.image}`}
                alt={user.name}
                className={styles.profileImage}
              />
            </div>
          )}

          <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>Full Name</span>
            <div className={styles.fieldValue}>{user.name}</div>
          </div>

          <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>Email Address</span>
            <div className={styles.fieldValue}>{user.email}</div>
          </div>

          <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>User Role</span>
            <span className={`${styles.roleValue} ${styles[user.role]}`}>
              {user.role}
            </span>
          </div>

          <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>Account Created</span>
            <div className={styles.fieldValue}>{createdDate}</div>
          </div>

          <div className={styles.actionSection}>
            <Link href={`/admin/users/${userId}/edit`} className={`${styles.button} ${styles.editButton}`}>
              ✎ Edit User
            </Link>
            <button onClick={handleDelete} className={`${styles.button} ${styles.deleteButton}`}>
              🗑 Delete User
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
